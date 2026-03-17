const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 打卡（上下班）
router.post('/check', authMiddleware, async (req, res) => {
  try {
    const { checkType, latitude, longitude, locationAddress, photoUrl, watermarkData, deviceInfo } = req.body;

    if (!checkType || !['clock_in', 'clock_out'].includes(checkType)) {
      return res.status(400).json({ error: '打卡类型错误' });
    }

    const result = await db.query(
      `INSERT INTO attendance (employee_id, check_type, latitude, longitude, location_address, photo_url, watermark_data, device_info)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        req.user.employee_id,
        checkType,
        latitude,
        longitude,
        locationAddress,
        photoUrl,
        JSON.stringify(watermarkData),
        deviceInfo,
      ]
    );

    res.json({
      message: checkType === 'clock_in' ? '上班打卡成功' : '下班打卡成功',
      record: result.rows[0],
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: '打卡失败' });
  }
});

// 获取我的打卡记录
router.get('/my-records', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM attendance WHERE employee_id = $1';
    const params = [req.user.employee_id];
    
    if (startDate && endDate) {
      query += ' AND check_time BETWEEN $2 AND $3';
      params.push(startDate, endDate);
    }
    
    query += ' ORDER BY check_time DESC';
    
    const result = await db.query(query, params);
    res.json({ records: result.rows });
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ error: '获取记录失败' });
  }
});

// 获取今日打卡状态
router.get('/today-status', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const result = await db.query(
      `SELECT * FROM attendance 
       WHERE employee_id = $1 AND DATE(check_time) = $2
       ORDER BY check_time DESC`,
      [req.user.employee_id, today]
    );

    const clockIn = result.rows.find(r => r.check_type === 'clock_in');
    const clockOut = result.rows.find(r => r.check_type === 'clock_out');

    res.json({
      date: today.toISOString().split('T')[0],
      clockIn: clockIn || null,
      clockOut: clockOut || null,
    });
  } catch (error) {
    console.error('Get today status error:', error);
    res.status(500).json({ error: '获取状态失败' });
  }
});

// 管理员：获取部门打卡统计
router.get('/department-stats', authMiddleware, async (req, res) => {
  try {
    if (!['supervisor', 'finance', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ error: '权限不足' });
    }

    const { date, department } = req.query;
    const queryDate = date || new Date().toISOString().split('T')[0];

    let sql = `
      SELECT e.employee_id, e.name, e.department, e.position,
             MAX(CASE WHEN a.check_type = 'clock_in' THEN a.check_time END) as clock_in,
             MAX(CASE WHEN a.check_type = 'clock_out' THEN a.check_time END) as clock_out
      FROM employees e
      LEFT JOIN attendance a ON e.employee_id = a.employee_id AND DATE(a.check_time) = $1
      WHERE e.status = 'active'
    `;
    
    const params = [queryDate];
    
    if (department) {
      sql += ' AND e.department = $2';
      params.push(department);
    }
    
    sql += ' GROUP BY e.employee_id, e.name, e.department, e.position ORDER BY e.department, e.name';

    const result = await db.query(sql, params);
    res.json({ date: queryDate, records: result.rows });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({ error: '获取统计失败' });
  }
});

module.exports = router;
