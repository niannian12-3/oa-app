# OA 办公 APP - 快速编译指南

## 方法一：使用 Android Studio（推荐）

### 步骤：

1. **下载并安装 Android Studio**
   - 官网：https://developer.android.com/studio
   - 安装时会自动安装 Android SDK

2. **打开项目**
   ```
   文件 → Open → 选择 oa-app/android 文件夹
   ```

3. **等待 Gradle 同步完成**
   - 首次打开会下载依赖，可能需要几分钟

4. **修改 API 地址**
   - 打开 `app/src/main/java/com/oa/app/Config.kt`
   - 修改 `API_BASE_URL` 为你的服务器地址
   ```kotlin
   const val API_BASE_URL = "http://你的服务器 IP:3000/api"
   ```

5. **编译 APK**
   ```
   Build → Build Bundle(s) / APK(s) → Build APK(s)
   ```

6. **获取 APK 文件**
   - 编译完成后，APK 位于：
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

7. **安装到手机**
   - 通过 USB 传输到手机
   - 或使用 ADB：`adb install app-debug.apk`

---

## 方法二：命令行编译（需要 Android SDK）

### 1. 安装 Android 命令行工具

下载：https://developer.android.com/studio#command-tools

### 2. 设置环境变量

**Windows (PowerShell):**
```powershell
$env:ANDROID_HOME = "C:\Android\Sdk"
$env:PATH = "$env:ANDROID_HOME\tools;$env:ANDROID_HOME\platform-tools;$env:PATH"
```

### 3. 安装必要的 SDK 组件

```bash
sdkmanager "platform-tools"
sdkmanager "platforms;android-34"
sdkmanager "build-tools;34.0.0"
```

### 4. 编译项目

```bash
cd oa-app/android

# Windows
gradlew.bat assembleDebug

# Linux/Mac
./gradlew assembleDebug
```

### 5. 获取 APK

```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 方法三：使用在线编译服务

如果本地环境配置困难，可以使用：

### 1. GitHub Actions
- 将项目推送到 GitHub
- 配置 GitHub Actions 自动编译
- 下载 Artifact 中的 APK

### 2. Codemagic / Bitrise
- 云端的 CI/CD 服务
- 支持 Android 自动编译
- 免费额度足够小团队使用

---

## APK 安装说明

### 在员工手机上安装：

1. **允许未知来源**
   - 设置 → 安全 → 允许未知来源应用

2. **传输 APK**
   - 通过微信/QQ 文件传输
   - 或通过公司内部服务器下载

3. **安装**
   - 点击 APK 文件安装
   - 首次安装可能需要授权

---

## 生产版本编译（发布版）

### 1. 生成签名密钥

```bash
keytool -genkey -v -keystore oa-app.keystore -alias oa-app -keyalg RSA -keysize 2048 -validity 10000
```

### 2. 配置签名

编辑 `android/app/build.gradle`，在 `android {}` 块中添加：

```gradle
signingConfigs {
    release {
        storeFile file('../oa-app.keystore')
        storePassword '你的密钥库密码'
        keyAlias 'oa-app'
        keyPassword '你的密钥密码'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 3. 编译发布版

```bash
./gradlew assembleRelease
```

发布版 APK 位于：
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 常见问题

### Q: Gradle 同步失败
A: 检查网络连接，可能需要配置代理或使用国内镜像

### Q: 编译时内存不足
A: 编辑 `gradle.properties`，增加 `org.gradle.jvmargs=-Xmx4096m`

### Q: SDK 版本不匹配
A: 确保安装了 Android 34 (API 34) 的 SDK

### Q: 无法安装 APK
A: 检查手机是否允许未知来源，或尝试 `adb install -r app-debug.apk`

---

## 当前项目状态

✅ 完整的后端 API
✅ Android 项目框架
✅ 数据模型和网络层
✅ UI 布局文件
✅ 权限配置
⏳ 需要编译生成 APK

**下一步：** 按照上述方法编译 APK，然后安装测试！
