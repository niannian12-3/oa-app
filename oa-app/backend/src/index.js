require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'OA后端服务运行正常'
  });
});

// 测试登录接口
app.post('/api/auth/login', (req, res) => {
  const { employeeId, password } = req.body;
  
  console.log('登录请求:', { employeeId, password });
  
  if (!employeeId || !password) {
    return res.status(400).json({ 
      error: '请输入员工ID和密码' 
    });
  }
  
  // 模拟登录成功
  res.json({
    success: true,
    message: '登录成功',
    data: {
      token: 'test_jwt_token_' + Date.now(),
      user: {
        id: 1,
        employeeId: employeeId,
        name: '测试用户',
        department: '技术部',
        position: '开发工程师'
      }
    }
  });
});

// 测试打卡接口
app.post('/api/attendance/check-in', (req, res) => {
  const { latitude, longitude, address, type } = req.body;
  
  console.log('打卡请求:', { latitude, longitude, address, type });
  
  res.json({
    success: true,
    message: type === 'in' ? '上班打卡成功' : '下班打卡成功',
    data: {
      id: Date.now(),
      type: type,
      time: new Date().toISOString(),
      address: address || '测试地址',
      status: '正常'
    }
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`🚀 OA后端服务启动成功！`);
  console.log(`📍 端口: ${PORT}`);
  console.log(`📍 健康检查: http://localhost:${PORT}/health`);
  console.log(`📍 登录接口: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`📍 打卡接口: POST http://localhost:${PORT}/api/attendance/check-in`);
  console.log(`\n📱 Android应用可以连接到此后端服务`);
});