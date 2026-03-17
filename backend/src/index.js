require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leave');
const expenseRoutes = require('./routes/expense');
const employeeRoutes = require('./routes/employee');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件（上传的图片等）
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/upload', uploadRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 OA Server running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
});
