package com.oa.app

object Config {
    const val API_BASE_URL = "http://192.168.1.100:3000/api"  // 修改为实际服务器地址
    
    const val CONNECT_TIMEOUT = 30L
    const val READ_TIMEOUT = 30L
    const val WRITE_TIMEOUT = 30L
    
    // 打卡设置
    const val CHECK_IN_RADIUS_METERS = 100
    
    // SharedPreferences Keys
    const val PREF_TOKEN = "auth_token"
    const val PREF_EMPLOYEE_ID = "employee_id"
    const val PREF_NAME = "employee_name"
}
