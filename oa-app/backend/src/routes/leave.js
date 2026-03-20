const express = require('express');
const db = require('../config/database');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// 提交请假申请
router.post('/apply', authMiddleware, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, days, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !days) {
      return res.status(400).json({ error: '请填写完整的请假信息' });
    }

    // 查找主管（同部门的主管角色用户）
    const supervisorResult = await db.query(
      `SELECT employee_id FROM users u 
       JOIN employees e ON u.employee_id = e.employee_id 
       WHERE u.role = 'supervisor' AND e.department = (
         SELECT department FROM employees WHERE employee_id = $1
       ) LIMIT 1`,
      [req.user.employee_id]
    );

    const supervisorId = supervisorResult.rows[0]?.employee_id;

    // 查找财务审批人
    const financeResult = await db.query(
      `SELECT employee_id FROM users WHERE role = 'finance' LIMIT 1`
    );
    const financeId = financeResult.rows[0]?.employee_id;

    const result = await db.query(
      `INSERT INTO leave_requests 
       (employee_id, leave_type, start_date, end_date, days, reason, current_approver, supervisor_id, finance_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [req.user.employee_id, leaveType, startDate, endDate, days, reason, supervisorId, supervisorId, financeId]
    );

    res.json({ message: '请假申请已提交', request: result.rows[0] });
  } catch (error) {
    console.error('Leave apply error:', error);
    res.status(500).json({ error: '提交失败' });
  }
});

// 获取我的请假记录
router.get('/my-requests', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT lr.*, e.name as employee_name 
      FROM leave_requests lr 
      JOIN employees e ON lr.employee_id = e.employee_id
      WHERE lr.employee_id = $1
    `;
    const params = [req.user.employee_id];

    if (status) {
      query += ' AND lr.status = $2';
      params.push(status);
    }

    query += ' ORDER BY lr.submitted_at DESC';

    const result = await db.query(query, params);
    res.json({ requests: result.rows });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ error: '获取记录失败' });
  }
});

// 获取待我审批的请假
router.get('/pending-approval', authMiddleware, async (req, res) => {
  try {
    if (!['supervisor', 'finance', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: '权限不足' });
    }

    const result = await db.query(
      `SELECT lr.*, e.name as employee_name, e.department, e.position
       FROM leave_requests lr
       JOIN employees e ON lr.employee_id = e.employee_id
       WHERE lr.current_approver = $1 AND lr.status IN ('pending', 'supervisor_approved')
       ORDER BY lr.submitted_at ASC`,
      [req.user.employee_id]
    );

    res.json({ requests: result.rows });
  } catch (error) {
    console.error('Get pending error:', error);
    res.status(500).json({ error: '获取待审批失败' });
  }
});

// 审批请假
router.post('/approve/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, remark } = req.body; // action: approve | reject

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: '操作类型错误' });
    }

    const request = await db.query('SELECT * FROM leave_requests WHERE id = $1', [id]);
    if (request.rows.length === 0) {
      return res.status(404).json({ error: '申请不存在' });
    }

    const lr = request.rows[0];

    // 验证当前用户是否是审批人
    if (lr.current_approver !== req.user.employee_id) {
      return res.status(403).json({ error: '无权审批此申请' });
    }

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      if (action === 'approve') {
        if (req.user.role === 'supervisor') {
          // 主管审批通过，转财务
          await client.query(
            `UPDATE leave_requests 
             SET status = 'supervisor_approved', 
                 current_approver = finance_id,
                 supervisor_approved_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [id]
          );
        } else if (['finance', 'admin'].includes(req.user.role)) {
          // 财务审批通过，完成
          await client.query(
            `UPDATE leave_requests 
             SET status = 'approved', 
                 current_approver = NULL,
                 finance_approved_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [id]
          );
        }
      } else {
        // 拒绝
        await client.query(
          `UPDATE leave_requests 
           SET status = 'rejected', 
               current_approver = NULL,
               reject_reason = $2,
               rejected_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [id, remark]
        );
      }

      // 记录审批日志
      await client.query(
        `INSERT INTO approval_logs (request_type, request_id, approver_id, action, remark)
         VALUES ('leave', $1, $2, $3, $4)`,
        [id, req.user.employee_id, action, remark]
      );

      await client.query('COMMIT');
      res.json({ message: action === 'approve' ? '审批通过' : '已拒绝' });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({ error: '审批失败' });
  }
});

module.exports = router;
