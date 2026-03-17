# OA 办公 APP - 20 人团队版

企业办公自动化系统，支持打卡、报销、请假、水印相机、员工花名册等功能。

## 功能模块

| 模块 | 说明 |
|------|------|
| 📍 上下班打卡 | GPS 定位 + 时间记录，支持水印相机 |
| 💰 费用报销 | 三级审批流程（员工→主管→财务） |
| 🏖️ 请假管理 | 三级审批流程，联动考勤 |
| 📷 水印相机 | 拍照自动添加时间、地点、姓名水印 |
| 👥 员工花名册 | 员工信息、部门、职位、入职时间管理 |

## 技术栈

- **后端:** Node.js 20+ / Express / PostgreSQL
- **移动端:** Android (Kotlin)
- **部署:** 私有部署（公司服务器）

## 项目结构

```
oa-app/
├── backend/           # Node.js 后端
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── config/
│   └── package.json
├── android/           # Android APP
│   ├── app/
│   │   ├── src/main/java/com/oa/app/
│   │   └── src/main/res/
│   └── build.gradle
├── database/          # 数据库脚本
│   └── schema.sql
└── docs/              # 文档
    └── deployment.md
```

## 快速开始

### 1. 后端启动

```bash
cd backend
npm install
npm run dev
```

### 2. 数据库初始化

```bash
psql -U postgres -f database/schema.sql
```

### 3. Android 编译

用 Android Studio 打开 `android/` 目录，Build → Build Bundle(s) / APK(s)

## 配置

编辑 `backend/config/database.js` 配置数据库连接。

## 部署

详见 `docs/deployment.md`
