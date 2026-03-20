# 📱 OA 办公 APP - 获取 APK 的 3 种方法

## ⚡ 推荐：方法 1 - GitHub Actions 云端编译（最简单！）

**优点：** 无需安装任何软件，5 分钟搞定

### 步骤：

1. **上传到 GitHub**
   - 登录 https://github.com
   - 创建新仓库 `oa-app`
   - 上传整个 `oa-app` 文件夹

2. **自动编译**
   - 点击仓库 **Actions** 标签
   - 点击 **Build Android APK** → **Run workflow**
   - 等待 5-10 分钟

3. **下载 APK**
   - 编译完成后在 **Artifacts** 下载
   - 或查看 **Releases** 页面

📖 详细指南：见 `使用 GitHub 编译.md`

---

## 💻 方法 2 - Android Studio 本地编译

**优点：** 可控性强，适合后续开发

### 步骤：

1. **下载安装**
   - https://developer.android.com/studio
   - 约 1GB，安装需 10 分钟

2. **打开项目**
   - 启动 Android Studio
   - File → Open → 选择 `oa-app/android`

3. **编译 APK**
   - 等待 Gradle 同步完成
   - Build → Build Bundle(s) / APK(s) → Build APK(s)
   - 约 2-5 分钟

4. **获取 APK**
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

---

## 🔧 方法 3 - 自动脚本编译

**优点：** 全自动化，适合技术人員

### 前提：
- 已安装 Java JDK 17

### 步骤：

```powershell
cd C:\Users\Administrator\.openclaw\workspace\oa-app
powershell -ExecutionPolicy Bypass -File build-auto.ps1
```

脚本会自动：
- 下载 Android 命令行工具
- 安装 SDK 组件
- 编译生成 APK

首次运行需下载约 600MB，耗时 10-20 分钟

---

## 📥 安装到手机

### 方法 A: 微信/QQ 传输
1. 将 APK 通过微信/QQ 发送到手机
2. 点击下载并安装
3. 允许"未知来源"

### 方法 B: USB 传输
1. 手机连接电脑
2. 复制 APK 到手机
3. 在手机上安装

### 方法 C: 局域网下载
1. 将 APK 放在公司服务器
2. 员工用手机浏览器访问下载
3. 安装

---

## ⚠️ 重要提示

### 首次使用前必须配置：

1. **后端服务器**
   ```bash
   cd backend
   npm install
   # 编辑 .env 文件配置数据库
   npm run dev
   ```

2. **修改 API 地址**
   - 编辑 `android/app/src/main/java/com/oa/app/Config.kt`
   - 将 `API_BASE_URL` 改为实际服务器地址
   ```kotlin
   const val API_BASE_URL = "http://你的服务器IP:3000/api"
   ```

3. **数据库初始化**
   ```bash
   psql -U postgres -f database/schema.sql
   ```

---

## 🎯 快速选择建议

| 你的情况 | 推荐方法 |
|---------|---------|
| 不想安装软件 | 方法 1 (GitHub) ✅ |
| 想长期开发维护 | 方法 2 (Android Studio) |
| 熟悉命令行 | 方法 3 (自动脚本) |
| 急需测试 | 方法 1 (GitHub) |

---

## 📞 需要帮助？

遇到问题告诉我：
- 使用的哪种方法
- 具体错误信息
- 截图（如果有）

我会帮你解决！🚀

---

**推荐现在就用方法 1 (GitHub Actions)，最快最省心！**
