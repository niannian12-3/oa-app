package com.oa.app.data.model

// 登录请求/响应
data class LoginRequest(
    val employeeId: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val user: UserInfo
)

data class UserInfo(
    val employeeId: String,
    val name: String,
    val department: String?,
    val position: String?,
    val role: String
)

data class UserInfoResponse(
    val user: UserInfo
)

data class ChangePasswordRequest(
    val oldPassword: String,
    val newPassword: String
)

// 打卡
data class CheckRequest(
    val checkType: String,  // "clock_in" or "clock_out"
    val latitude: Double?,
    val longitude: Double?,
    val locationAddress: String?,
    val photoUrl: String?,
    val watermarkData: Map<String, Any>?,
    val deviceInfo: String?
)

data class CheckResponse(
    val message: String,
    val record: AttendanceRecord?
)

data class AttendanceRecord(
    val id: Int,
    val employeeId: String,
    val checkType: String,
    val checkTime: String,
    val latitude: Double?,
    val longitude: Double?,
    val locationAddress: String?,
    val photoUrl: String?
)

data class AttendanceRecordsResponse(
    val records: List<AttendanceRecord>
)

data class TodayStatusResponse(
    val date: String,
    val clockIn: AttendanceRecord?,
    val clockOut: AttendanceRecord?
)

data class DepartmentStatsResponse(
    val date: String,
    val records: List<DepartmentAttendanceRecord>
)

data class DepartmentAttendanceRecord(
    val employeeId: String,
    val name: String,
    val department: String,
    val position: String?,
    val clockIn: String?,
    val clockOut: String?
)

// 请假
data class LeaveApplyRequest(
    val leaveType: String,
    val startDate: String,
    val endDate: String,
    val days: Double,
    val reason: String
)

data class LeaveApplyResponse(
    val message: String,
    val request: LeaveRequest
)

data class LeaveRequest(
    val id: Int,
    val employeeId: String,
    val employeeName: String,
    val leaveType: String,
    val startDate: String,
    val endDate: String,
    val days: Double,
    val reason: String,
    val status: String,
    val submittedAt: String,
    val rejectReason: String?
)

data class LeaveRequestsResponse(
    val requests: List<LeaveRequest>
)

// 报销
data class ExpenseApplyRequest(
    val expenseType: String,
    val amount: Double,
    val description: String,
    val receiptUrls: List<String>?
)

data class ExpenseApplyResponse(
    val message: String,
    val request: ExpenseRequest
)

data class ExpenseRequest(
    val id: Int,
    val employeeId: String,
    val employeeName: String,
    val expenseType: String,
    val amount: Double,
    val description: String,
    val receiptUrls: List<String>?,
    val status: String,
    val submittedAt: String,
    val rejectReason: String?
)

data class ExpenseRequestsResponse(
    val requests: List<ExpenseRequest>
)

// 审批
data class ApproveRequest(
    val action: String,  // "approve" or "reject"
    val remark: String?
)

// 员工
data class Employee(
    val employeeId: String,
    val name: String,
    val phone: String?,
    val email: String?,
    val department: String?,
    val position: String?,
    val entryDate: String?,
    val status: String,
    val avatarUrl: String?
)

data class EmployeesResponse(
    val employees: List<Employee>
)

data class DepartmentsResponse(
    val departments: List<String>
)

// 上传
data class UploadResponse(
    val message: String,
    val file: UploadedFile?,
    val files: List<UploadedFile>?
)

data class UploadedFile(
    val filename: String,
    val url: String,
    val size: Long,
    val mimetype: String
)
