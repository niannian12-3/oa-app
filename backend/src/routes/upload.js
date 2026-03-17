const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 确保上传目录存在
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const date = new Date().toISOString().split('T')[0];
    const dir = path.join(uploadDir, date);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// 文件过滤
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

// 单文件上传
router.post('/single', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未上传文件' });
    }

    const fileUrl = `/uploads/${new Date().toISOString().split('T')[0]}/${req.file.filename}`;
    
    res.json({
      message: '上传成功',
      file: {
        filename: req.file.filename,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: '上传失败' });
  }
});

// 多文件上传（用于报销凭证）
router.post('/multiple', authMiddleware, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '未上传文件' });
    }

    const date = new Date().toISOString().split('T')[0];
    const files = req.files.map(f => ({
      filename: f.filename,
      url: `/uploads/${date}/${f.filename}`,
      size: f.size,
      mimetype: f.mimetype,
    }));

    res.json({
      message: '上传成功',
      files,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: '上传失败' });
  }
});

module.exports = router;
