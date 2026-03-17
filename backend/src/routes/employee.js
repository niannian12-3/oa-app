const express = require('express');
const db = require('../config/database');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// 获取员工列表（花名册）
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { department, status, search } = req.query;
    
    let query = 'SELECT * FROM employees WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (department) {
      query += ` AND department = $${paramCount}`;
      params.push(department);
      paramCount++;
    }

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (search) {
      query += ` AND (name ILIKE $${paramCount} OR employee_id ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ' ORDER BY department, name';

    const result = await db.query(query, params);
    res.json({ employees: result.rows });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ error: '获取员工列表失败' });
  }
});

// 获取员工详情
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM employees WHERE employee_id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '员工不存在' });
    }

    res.json({ employee: result.rows[0] });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: '获取员工信息失败' });
  }
});

// 添加员工（管理员）
router.post('/', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { employeeId, name, phone, email, department, position, entryDate, password } = req.body;

    if (!employeeId || !name || !password) {
      return res.status(400).json({ error: '员工号、姓名和密码必填' });
    }

    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);

    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      // 插入员工
      await client.query(
        `INSERT INTO employees (employee_id, name, phone, email, department, position, entry_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [employeeId, name, phone, email, department, position, entryDate]
      );

      // 创建用户账号
      await client.query(
        `INSERT INTO users (employee_id, password_hash, role) VALUES ($1, $2, $3)`,
        [employeeId, passwordHash, 'employee']
      );

      await client.query('COMMIT');
      res.json({ message: '员工添加成功' });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Add employee error:', error);
    res.status(500).json({ error: '添加失败' });
  }
});

// 更新员工信息（管理员）
router.put('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { name, phone, email, department, position, status } = req.body;

    await db.query(
      `UPDATE employees 
       SET name = $1, phone = $2, email = $3, department = $4, position = $5, status = $6, updated_at = CURRENT_TIMESTAMP
       WHERE employee_id = $7`,
      [name, phone, email, department, position, status, req.params.id]
    );

    res.json({ message: '员工信息更新成功' });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: '更新失败' });
  }
});

// 获取部门列表
router.get('/departments/list', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT DISTINCT department FROM employees WHERE department IS NOT NULL ORDER BY department'
    );
    res.json({ departments: result.rows.map(r => r.department) });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ error: '获取部门列表失败' });
  }
});

module.exports = router;
