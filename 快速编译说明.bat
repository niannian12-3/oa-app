@echo off
chcp 65001 >nul
echo ========================================
echo   OA 办公 APP - 快速编译指南
echo ========================================
echo.
echo 由于自动编译需要下载约 600MB 的 Android SDK，
echo 建议使用以下更简单的方法：
echo.
echo 方法 1: 使用 Android Studio (推荐)
echo ----------------------------------------
echo 1. 下载 Android Studio:
echo    https://developer.android.com/studio
echo.
echo 2. 安装后打开，选择:
echo    File ^> Open ^> 选择 oa-app\android 文件夹
echo.
echo 3. 等待 Gradle 同步完成后:
echo    Build ^> Build Bundle(s) / APK(s) ^> Build APK(s)
echo.
echo 4. APK 位置:
echo    android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 全程约 5-10 分钟，最简单可靠！
echo.
echo ========================================
echo.
echo 方法 2: 运行自动编译脚本
echo ----------------------------------------
echo 如果已安装 Java JDK 17，可以运行:
echo    powershell -ExecutionPolicy Bypass -File build-auto.ps1
echo.
echo 该脚本会自动下载安装 Android SDK 并编译。
echo 首次运行需要下载约 600MB，耗时 10-20 分钟。
echo.
echo ========================================
echo.
echo 方法 3: 在线编译
echo ----------------------------------------
echo 将 android 文件夹上传到:
echo - GitHub + GitHub Actions
echo - Codemagic.io (免费额度)
echo - Bitrise.io (免费额度)
echo.
echo ========================================
echo.
pause
