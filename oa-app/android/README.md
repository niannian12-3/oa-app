# OA 办公 APP - Android 端

## 项目结构

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/oa/app/
│   │   │   ├── MainActivity.kt
│   │   │   ├── ui/
│   │   │   │   ├── login/
│   │   │   │   ├── attendance/
│   │   │   │   ├── leave/
│   │   │   │   ├── expense/
│   │   │   │   └── employees/
│   │   │   ├── data/
│   │   │   │   ├── api/
│   │   │   │   ├── model/
│   │   │   │   └── repository/
│   │   │   └── util/
│   │   │       ├── AuthManager.kt
│   │   │       └── LocationHelper.kt
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   ├── values/
│   │   │   └── drawable/
│   │   └── AndroidManifest.xml
│   └── build.gradle
└── build.gradle
```

## 功能模块

### 1. 登录模块
- 员工号 + 密码登录
- JWT Token 存储
- 自动登录

### 2. 打卡模块
- GPS 定位
- 水印相机拍照
- 上下班打卡
- 今日打卡状态

### 3. 请假模块
- 提交请假申请
- 查看我的申请
- 审批（主管/财务）

### 4. 报销模块
- 提交报销申请
- 上传凭证
- 查看我的报销
- 审批（主管/财务）

### 5. 花名册模块
- 员工列表
- 员工详情
- 部门筛选

## 技术依赖

- **网络:** Retrofit 2 + OkHttp
- **图片:** Glide
- **本地存储:** DataStore / SharedPreferences
- **定位:** Google Location Services
- **相机:** CameraX

## 快速开始

1. 用 Android Studio 打开此目录
2. Sync Gradle 项目
3. 修改 `Config.kt` 中的 API 地址
4. 运行到模拟器或真机

## API 配置

编辑 `app/src/main/java/com/oa/app/Config.kt`:

```kotlin
object Config {
    const val API_BASE_URL = "https://oa.yourcompany.com/api"
    const val CONNECT_TIMEOUT = 30L
    const val READ_TIMEOUT = 30L
}
```
