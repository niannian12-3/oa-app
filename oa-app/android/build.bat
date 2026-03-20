@echo off
echo === 开始构建OA办公APK ===
echo.

echo 1. 下载Gradle...
if not exist gradlew (
    powershell -Command "Invoke-WebRequest -Uri 'https://services.gradle.org/distributions/gradle-8.2-bin.zip' -OutFile 'gradle-8.2-bin.zip'"
    powershell -Command "Expand-Archive -Path 'gradle-8.2-bin.zip' -DestinationPath '.'"
    gradle-8.2\bin\gradle wrapper --gradle-version 8.2
)

echo 2. 构建APK...
call gradlew clean
call gradlew assembleDebug

echo.
echo === 构建完成 ===
echo APK位置: app\build\outputs\apk\debug\
echo 文件名: app-debug.apk

if exist app\build\outputs\apk\debug\app-debug.apk (
    echo ✅ APK构建成功！
    pause
) else (
    echo ❌ APK构建失败
    pause
)