-- OA 办公 APP 数据库结构
-- PostgreSQL Schema

-- 员工表
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    department VARCHAR(50),
    position VARCHAR(50),
    entry_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户账号表（登录用）
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL REFERENCES employees(employee_id),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'employee', -- employee, supervisor, finance, admin
    device_token VARCHAR(255),
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 打卡记录表
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL REFERENCES employees(employee_id),
    check_type VARCHAR(10) NOT NULL, -- clock_in, clock_out
    check_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_address VARCHAR(255),
    photo_url VARCHAR(255),
    watermark_data JSONB,
    device_info VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 请假申请表
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL REFERENCES employees(employee_id),
    leave_type VARCHAR(30) NOT NULL, -- annual, sick, personal, maternity, etc.
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days NUMERIC(4,1) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, supervisor_approved, finance_approved, rejected, cancelled
    current_approver VARCHAR(20),
    supervisor_id VARCHAR(20) REFERENCES employees(employee_id),
    finance_id VARCHAR(20) REFERENCES employees(employee_id),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    supervisor_approved_at TIMESTAMP,
    finance_approved_at TIMESTAMP,
    rejected_at TIMESTAMP,
    reject_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 费用报销表
CREATE TABLE expense_requests (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL REFERENCES employees(employee_id),
    expense_type VARCHAR(50) NOT NULL, -- travel, meal, office, etc.
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    receipt_urls JSONB,
    status VARCHAR(20) DEFAULT 'pending', -- pending, supervisor_approved, finance_approved, paid, rejected, cancelled
    current_approver VARCHAR(20),
    supervisor_id VARCHAR(20) REFERENCES employees(employee_id),
    finance_id VARCHAR(20) REFERENCES employees(employee_id),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    supervisor_approved_at TIMESTAMP,
    finance_approved_at TIMESTAMP,
    finance_remark TEXT,
    paid_at TIMESTAMP,
    rejected_at TIMESTAMP,
    reject_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 审批记录表（审计用）
CREATE TABLE approval_logs (
    id SERIAL PRIMARY KEY,
    request_type VARCHAR(20) NOT NULL, -- leave, expense
    request_id INTEGER NOT NULL,
    approver_id VARCHAR(20) NOT NULL REFERENCES employees(employee_id),
    action VARCHAR(20) NOT NULL, -- approve, reject
    remark TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 部门表
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    supervisor_id VARCHAR(20) REFERENCES employees(employee_id),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 系统配置表
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key_name VARCHAR(50) UNIQUE NOT NULL,
    key_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_attendance_time ON attendance(check_time);
CREATE INDEX idx_leave_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_status ON leave_requests(status);
CREATE INDEX idx_expense_employee ON expense_requests(employee_id);
CREATE INDEX idx_expense_status ON expense_requests(status);
CREATE INDEX idx_users_employee ON users(employee_id);

-- 插入默认配置
INSERT INTO settings (key_name, key_value, description) VALUES
('work_start_time', '09:00', '上班时间'),
('work_end_time', '18:00', '下班时间'),
('check_in_radius', '100', '打卡有效半径（米）'),
('office_latitude', '31.2304', '办公室纬度'),
('office_longitude', '121.4737', '办公室经度');
