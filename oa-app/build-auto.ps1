# OA APP 自动编译安装脚本 (PowerShell)
# 自动下载并安装 Android 命令行工具，编译 APK

$ErrorActionPreference = "Stop"
$OAPath = "C:\Users\Administrator\.openclaw\workspace\oa-app"
$AndroidHome = "$OAPath\android-sdk"
$CommandLineToolsUrl = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OA 办公 APP - 自动编译脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 检查 Java
Write-Host "[1/6] 检查 Java 环境..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "  ✓ Java 已安装：$javaVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ 未检测到 Java，请先安装 JDK 17" -ForegroundColor Red
    Write-Host "  下载地址：https://www.oracle.com/java/technologies/downloads/#jdk17-windows" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  安装后重新运行此脚本" -ForegroundColor Cyan
    pause
    exit 1
}

# 2. 设置 Android SDK 目录
Write-Host ""
Write-Host "[2/6] 设置 Android SDK 目录..." -ForegroundColor Yellow
$env:ANDROID_HOME = $AndroidHome
$env:PATH = "$AndroidHome\cmdline-tools\latest\bin;$AndroidHome\platform-tools;$env:PATH"
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", $AndroidHome, "User")

if (!(Test-Path $AndroidHome)) {
    New-Item -ItemType Directory -Path $AndroidHome | Out-Null
    Write-Host "  ✓ 创建目录：$AndroidHome" -ForegroundColor Green
}

# 3. 下载命令行工具
Write-Host ""
Write-Host "[3/6] 下载 Android 命令行工具..." -ForegroundColor Yellow
$ToolsZip = "$OAPath\cmdline-tools.zip"

if (!(Test-Path "$AndroidHome\cmdline-tools\latest\bin\sdkmanager.bat")) {
    Write-Host "  下载中... (约 150MB，可能需要几分钟)" -ForegroundColor Cyan
    
    # 使用 PowerShell 下载
    $ProgressPreference = 'SilentlyContinue'
    try {
        Invoke-WebRequest -Uri $CommandLineToolsUrl -OutFile $ToolsZip -UseBasicParsing
        Write-Host "  ✓ 下载完成" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ 下载失败，请检查网络连接" -ForegroundColor Red
        Write-Host "  手动下载：$CommandLineToolsUrl" -ForegroundColor Yellow
        pause
        exit 1
    }
    
    # 解压
    Write-Host "  解压中..." -ForegroundColor Cyan
    Expand-Archive -Path $ToolsZip -DestinationPath "$AndroidHome\temp" -Force
    
    # 移动到正确位置
    if (Test-Path "$AndroidHome\temp\cmdline-tools") {
        New-Item -ItemType Directory -Path "$AndroidHome\cmdline-tools" -Force | Out-Null
        Move-Item -Path "$AndroidHome\temp\cmdline-tools\*" -Destination "$AndroidHome\cmdline-tools\latest" -Force
        Remove-Item -Path "$AndroidHome\temp" -Recurse -Force
        Remove-Item -Path $ToolsZip -Force
        Write-Host "  ✓ 安装完成" -ForegroundColor Green
    }
} else {
    Write-Host "  ✓ 命令行工具已存在" -ForegroundColor Green
}

# 4. 安装 SDK 组件
Write-Host ""
Write-Host "[4/6] 安装 Android SDK 组件..." -ForegroundColor Yellow
Write-Host "  首次安装需要下载约 500MB，请耐心等待..." -ForegroundColor Cyan

$Components = @(
    "platform-tools",
    "build-tools;34.0.0",
    "platforms;android-34"
)

foreach ($comp in $Components) {
    Write-Host "  安装：$comp" -ForegroundColor Cyan
    & "$AndroidHome\cmdline-tools\latest\bin\sdkmanager.bat" --licenses > $null 2>&1
    & "$AndroidHome\cmdline-tools\latest\bin\sdkmanager.bat" "$comp" --sdk_root=$AndroidHome
}

Write-Host "  ✓ SDK 组件安装完成" -ForegroundColor Green

# 5. 编译 APK
Write-Host ""
Write-Host "[5/6] 编译 Android APP..." -ForegroundColor Yellow
Set-Location "$OAPath\android"

# 创建 gradle.properties 如果不存在
if (!(Test-Path "gradle.properties")) {
    @"
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
kotlin.code.style=official
"@ | Out-File -FilePath "gradle.properties" -Encoding UTF8
}

# 使用 Gradle Wrapper 编译
Write-Host "  编译中... (首次编译需要 5-10 分钟)" -ForegroundColor Cyan

if (Test-Path "gradlew.bat") {
    & ".\gradlew.bat" assembleDebug
} else {
    # 如果没有 gradlew，尝试使用系统 gradle
    gradle assembleDebug
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ 编译成功！" -ForegroundColor Green
} else {
    Write-Host "  ✗ 编译失败，请检查错误信息" -ForegroundColor Red
    Write-Host ""
    Write-Host "  常见问题：" -ForegroundColor Yellow
    Write-Host "  1. 网络连接问题：可能需要配置代理" -ForegroundColor Yellow
    Write-Host "  2. 内存不足：编辑 gradle.properties 增加 org.gradle.jvmargs=-Xmx4096m" -ForegroundColor Yellow
    Write-Host "  3. SDK 未正确安装：删除 $AndroidHome 重新运行脚本" -ForegroundColor Yellow
    pause
    exit 1
}

# 6. 复制 APK 到方便的位置
Write-Host ""
Write-Host "[6/6] 复制 APK 文件..." -ForegroundColor Yellow

$ApkSource = "app\build\outputs\apk\debug\app-debug.apk"
$ApkDest = "$OAPath\OA 办公-v1.0.apk"

if (Test-Path $ApkSource) {
    Copy-Item -Path $ApkSource -Destination $ApkDest -Force
    Write-Host "  ✓ APK 已生成：" -ForegroundColor Green
    Write-Host "    $ApkDest" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  编译完成！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步：" -ForegroundColor Yellow
    Write-Host "1. 将 APK 文件传输到手机" -ForegroundColor White
    Write-Host "2. 在手机上安装（允许未知来源）" -ForegroundColor White
    Write-Host "3. 打开 APP，输入员工号和密码登录" -ForegroundColor White
    Write-Host ""
    Write-Host "提示：首次使用前请确保后端服务已启动" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "  ✗ 未找到 APK 文件" -ForegroundColor Red
}

Set-Location $OAPath
pause
