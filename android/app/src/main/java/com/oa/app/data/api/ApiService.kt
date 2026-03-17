package com.oa.app.data.api

import com.oa.app.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    
    // 认证
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
    
    @GET("auth/me")
    suspend fun getCurrentUser(@Header("Authorization") token: String): Response<UserInfoResponse>
    
    @POST("auth/change-password")
    suspend fun changePassword(@Header("Authorization") token: String, @Body request: ChangePasswordRequest): Response<ApiResponse>
    
    // 打卡
    @POST("attendance/check")
    suspend fun checkIn(@Header("Authorization") token: String, @Body request: CheckRequest): Response<CheckResponse>
    
    @GET("attendance/my-records")
    suspend fun getMyAttendance(@Header("Authorization") token: String, @Query("startDate") startDate: String?, @Query("endDate") endDate: String?): Response<AttendanceRecordsResponse>
    
    @GET("attendance/today-status")
    suspend fun getTodayStatus(@Header("Authorization") token: String): Response<TodayStatusResponse>
    
    @GET("attendance/department-stats")
    suspend fun getDepartmentStats(@Header("Authorization") token: String, @Query("date") date: String?, @Query("department") department: String?): Response<DepartmentStatsResponse>
    
    // 请假
    @POST("leave/apply")
    suspend fun applyLeave(@Header("Authorization") token: String, @Body request: LeaveApplyRequest): Response<LeaveApplyResponse>
    
    @GET("leave/my-requests")
    suspend fun getMyLeaveRequests(@Header("Authorization") token: String, @Query("status") status: String?): Response<LeaveRequestsResponse>
    
    @GET("leave/pending-approval")
    suspend fun getPendingLeaveApproval(@Header("Authorization") token: String): Response<LeaveRequestsResponse>
    
    @POST("leave/approve/{id}")
    suspend fun approveLeave(@Header("Authorization") token: String, @Path("id") id: Int, @Body request: ApproveRequest): Response<ApiResponse>
    
    // 报销
    @POST("expense/apply")
    suspend fun applyExpense(@Header("Authorization") token: String, @Body request: ExpenseApplyRequest): Response<ExpenseApplyResponse>
    
    @GET("expense/my-requests")
    suspend fun getMyExpenseRequests(@Header("Authorization") token: String, @Query("status") status: String?): Response<ExpenseRequestsResponse>
    
    @GET("expense/pending-approval")
    suspend fun getPendingExpenseApproval(@Header("Authorization") token: String): Response<ExpenseRequestsResponse>
    
    @POST("expense/approve/{id}")
    suspend fun approveExpense(@Header("Authorization") token: String, @Path("id") id: Int, @Body request: ApproveRequest): Response<ApiResponse>
    
    // 员工
    @GET("employees/")
    suspend fun getEmployees(@Header("Authorization") token: String, @Query("department") department: String?, @Query("status") status: String?, @Query("search") search: String?): Response<EmployeesResponse>
    
    @GET("employees/departments/list")
    suspend fun getDepartments(@Header("Authorization") token: String): Response<DepartmentsResponse>
    
    // 上传
    @Multipart
    @POST("upload/single")
    suspend fun uploadFile(@Header("Authorization") token: String, @Part file: okhttp3.MultipartBody.Part): Response<UploadResponse>
    
    @Multipart
    @POST("upload/multiple")
    suspend fun uploadFiles(@Header("Authorization") token: String, @Part files: List<okhttp3.MultipartBody.Part>): Response<UploadResponse>
}

// 通用响应
data class ApiResponse(
    val message: String?,
    val error: String?
)
