const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 登录
router.post('/login', async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({ error: '员工号和密码不能为空' });
    }

    const result = await db.query(
      'SELECT * FROM users WHERE employee_id = $1',
      [employeeId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: '员工号或密码错误' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: '员工号或密码错误' });
    }

    // 更新最后登录时间
    await db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE employee_id = $1',
      [employeeId]
    );

    // 生成 JWT
    const token = jwt.sign(
      { employeeId: user.employee_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 获取员工信息
    const empResult = await db.query(
      'SELECT * FROM employees WHERE employee_id = $1',
      [employeeId]
    );

    res.json({
      token,
      user: {
        employeeId: user.employee_id,
        name: empResult.rows[0]?.name,
        department: empResult.rows[0]?.department,
        position: empResult.rows[0]?.position,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取当前用户信息
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      user: {
        employeeId: req.user.employee_id,
        name: req.user.name,
        department: req.user.department,
        position: req.user.position,
        role: req.user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: '服务器错误' });
  }
});

// 修改密码
router.post('/change-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: '请输入旧密码和新密码' });
    }

    const result = await db.query(
      'SELECT password_hash FROM users WHERE employee_id = $1',
      [req.user.employee_id]
    );

    const isValid = await bcrypt.compare(oldPassword, result.rows[0].password_hash);
    if (!isValid) {
      return res.status(400).json({ error: '旧密码错误' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
      'UPDATE users SET password_hash = $1 WHERE employee_id = $2',
      [hashedPassword, req.user.employee_id]
    );

    res.json({ message: '密码修改成功' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;
