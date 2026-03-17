@rem OA APP 一键编译脚本 (Windows)
@echo off
echo ========================================
echo   OA 办公 APP - 一键编译脚本
echo ========================================
echo.

rem 检查 Android SDK
if "%ANDROID_HOME%"=="" (
    echo [错误] 未检测到 Android SDK
    echo.
    echo 请先安装 Android Studio 或 Android SDK
    echo 下载地址：https://developer.android.com/studio
    echo.
    pause
    exit /b 1
)

echo [信息] Android SDK: %ANDROID_HOME%
echo.

rem 检查 Gradle
where gradle >nul 2>nul
if %errorlevel% neq 0 (
    echo [信息] 使用 Gradle Wrapper...
    set GRADLE_CMD=gradlew.bat
) else (
    set GRADLE_CMD=gradle
)

cd /d "%~dp0android"

echo [信息] 开始编译 Debug 版本...
echo.

%GRADLE_CMD% assembleDebug

if %errorlevel% neq 0 (
    echo.
    echo [错误] 编译失败！
    echo 请检查错误信息
    pause
    exit /b 1
)

echo.
echo ========================================
echo   编译成功！
echo ========================================
echo.
echo APK 文件位置:
echo %~dp0android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 可以使用以下命令安装到手机:
echo adb install app\build\outputs\apk\debug\app-debug.apk
echo.
pause
