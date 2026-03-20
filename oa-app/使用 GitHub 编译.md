# 使用 GitHub Actions 云端编译 APK (最简单！)

## 为什么用云端编译？

✅ 不需要安装 Android Studio  
✅ 不需要下载 600MB SDK  
✅ 不需要配置环境  
✅ 编译好的 APK 直接下载  
✅ 完全免费  

---

## 步骤 (5 分钟搞定)

### 1️⃣ 创建 GitHub 账号

如果没有，去 https://github.com 注册一个

### 2️⃣ 创建新仓库

1. 登录 GitHub
2. 点击右上角 **+** → **New repository**
3. 仓库名：`oa-app`
4. 选择 **Public** (公开)
5. 点击 **Create repository**

### 3️⃣ 上传代码

在 GitHub 仓库页面：

**方法 A: 网页上传 (最简单)**
1. 点击 **uploading an existing file**
2. 把整个 `oa-app` 文件夹拖进去
3. 等待上传完成
4. 点击 **Commit changes**

**方法 B: 用 Git 命令**
```bash
cd C:\Users\Administrator\.openclaw\workspace\oa-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/oa-app.git
git push -u origin main
```

### 4️⃣ 触发编译

上传完成后：

1. 点击仓库的 **Actions** 标签
2. 点击左侧 **Build Android APK**
3. 点击 **Run workflow** → **Run workflow**
4. 等待编译完成 (约 5-10 分钟)

### 5️⃣ 下载 APK

编译完成后：

1. 点击刚完成的编译记录
2. 在页面底部找到 **Artifacts**
3. 点击 **oa-app-debug** 下载
4. 解压后得到 `app-debug.apk`

**或者创建 Release 版本：**
1. 在 Actions 页面点击 **Run workflow**
2. 编译完成后会自动创建 Release
3. 在仓库 **Releases** 页面下载

---

## 下载后的 APK 如何安装？

### 方法 1: 微信/QQ 传输
1. 将 APK 通过微信/QQ 发送到手机
2. 在手机上点击下载的 APK
3. 允许安装未知来源应用
4. 完成安装

### 方法 2: USB 传输
1. 手机连接电脑
2. 复制 APK 到手机
3. 在手机上找到并安装

### 方法 3: 局域网下载
1. 将 APK 放在公司服务器
2. 员工用手机浏览器下载
3. 安装

---

## 后续更新

需要更新 APP 时：

1. 修改代码
2. 提交到 GitHub
3. Actions 自动编译新版本
4. 下载新 APK 分发给员工

---

## 常见问题

### Q: 编译失败怎么办？
A: 点击失败的记录查看详细错误，通常是网络问题，重试即可

### Q: 编译太慢？
A: 首次编译需要下载依赖，后续会快很多

### Q: 可以编译 release 版本吗？
A: 可以，需要配置签名密钥，目前先用 debug 版本测试

### Q: 仓库必须公开吗？
A: GitHub Actions 免费额度下，公开仓库更方便。私有仓库也可以，但需要配置

---

## 需要帮助？

遇到问题可以：
1. 查看 Actions 中的详细日志
2. 检查 `.github/workflows/build.yml` 配置
3. 告诉我具体错误信息

---

**这是最简单的方式，不需要在本地安装任何东西！** 🚀
