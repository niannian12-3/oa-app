# OA 办公 APP - 部署文档

## 系统要求

- **服务器:** Linux/Windows Server
- **Node.js:** 20+
- **PostgreSQL:** 14+
- **Android Studio:** Arctic Fox+

## 一、数据库部署

### 1. 安装 PostgreSQL

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# Windows
# 下载安装：https://www.postgresql.org/download/windows/
```

### 2. 创建数据库

```bash
sudo -u postgres psql

CREATE DATABASE oa_app;
CREATE USER oa_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE oa_app TO oa_user;
\q
```

### 3. 初始化表结构

```bash
psql -U oa_user -d oa_app -f database/schema.sql
```

## 二、后端部署

### 1. 安装依赖

```bash
cd backend
npm install --production
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改：

```bash
cp .env.example .env
```

编辑 `.env`：
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oa_app
DB_USER=oa_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_super_secret_key_change_this
OFFICE_LATITUDE=31.2304    # 修改为实际办公室纬度
OFFICE_LONGITUDE=121.4737  # 修改为实际办公室经度
```

### 3. 启动服务

#### 开发模式
```bash
npm run dev
```

#### 生产模式（推荐用 PM2）
```bash
npm install -g pm2
pm2 start src/index.js --name oa-backend
pm2 save
pm2 startup
```

### 4. 配置 Nginx（可选，用于 HTTPS）

```nginx
server {
    listen 443 ssl;
    server_name oa.yourcompany.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 三、Android APP 部署

### 1. 打开项目

用 Android Studio 打开 `android/` 目录

### 2. 配置 API 地址

编辑 `app/src/main/java/com/oa/app/Config.kt`：
```kotlin
object Config {
    const val API_BASE_URL = "https://oa.yourcompany.com/api"
}
```

### 3. 编译 APK

```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```

生成的 APK 在：`app/build/outputs/apk/debug/app-debug.apk`

### 4. 安装到员工手机

- 通过企业内网分发
- 或使用 MDM 系统推送
- 或生成二维码供员工扫码下载

## 四、初始化系统

### 1. 创建管理员账号

```sql
-- 先创建员工记录
INSERT INTO employees (employee_id, name, department, position, entry_date, status)
VALUES ('ADMIN001', '系统管理员', '管理部', '管理员', CURRENT_DATE, 'active');

-- 创建用户账号（密码：admin123，首次登录后请修改）
INSERT INTO users (employee_id, password_hash, role)
VALUES ('ADMIN001', '$2a$10$X.vZKZjQZ9ZxZxZxZxZxZeYhQZ9ZxZxZxZxZxZxZxZxZxZxZxZxZ', 'admin');
```

> 注意：上面的密码 hash 是示例，实际请用 bcrypt 生成

### 2. 创建主管和财务账号

```sql
-- 主管
INSERT INTO employees (employee_id, name, department, position, entry_date)
VALUES ('SUP001', '张主管', '技术部', '技术主管', CURRENT_DATE);

INSERT INTO users (employee_id, password_hash, role)
VALUES ('SUP001', 'bcrypt_hash_here', 'supervisor');

-- 财务
INSERT INTO employees (employee_id, name, department, position, entry_date)
VALUES ('FIN001', '李财务', '财务部', '财务专员', CURRENT_DATE);

INSERT INTO users (employee_id, password_hash, role)
VALUES ('FIN001', 'bcrypt_hash_here', 'finance');
```

## 五、日常维护

### 日志查看

```bash
# PM2 日志
pm2 logs oa-backend

# 数据库日志
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### 数据库备份

```bash
# 每天备份
pg_dump -U oa_user oa_app > /backup/oa_app_$(date +%Y%m%d).sql

# 恢复
psql -U oa_user oa_app < /backup/oa_app_20260317.sql
```

### 监控

建议配置：
- 服务器监控（CPU、内存、磁盘）
- 数据库连接数监控
- API 响应时间监控

## 六、安全建议

1. **修改默认密码** - 所有账号首次登录后强制修改
2. **启用 HTTPS** - 生产环境必须使用 HTTPS
3. **定期备份** - 每天自动备份数据库
4. **限制访问** - 防火墙只开放必要端口
5. **更新依赖** - 定期运行 `npm audit` 和更新

## 七、故障排查

### 后端无法启动
```bash
# 检查端口占用
netstat -tlnp | grep 3000

# 检查 Node 版本
node -v  # 需要 20+

# 检查环境变量
cat .env
```

### 数据库连接失败
```bash
# 测试连接
psql -U oa_user -d oa_app -h localhost

# 检查 PostgreSQL 状态
sudo systemctl status postgresql
```

### 打卡定位不准
- 检查 `.env` 中的办公室坐标是否正确
- 检查 `CHECK_IN_RADIUS` 是否合理（建议 100-500 米）

---

部署完成后，访问 `http://your-server:3000/health` 确认服务正常。
