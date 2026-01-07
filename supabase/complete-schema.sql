-- Municipal Corporation Application Complete Database Schema
-- This is the comprehensive schema supporting all modules as specified
-- Includes: Citizens, Employees, Department Heads, and Admins

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================================================
-- CUSTOM TYPES
-- ============================================================================

DROP TYPE IF EXISTS user_type CASCADE;
DROP TYPE IF EXISTS complaint_status CASCADE;
DROP TYPE IF EXISTS complaint_priority CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS alert_severity CASCADE;
DROP TYPE IF EXISTS service_request_type CASCADE;
DROP TYPE IF EXISTS service_request_status CASCADE;
DROP TYPE IF EXISTS attendance_status CASCADE;
DROP TYPE IF EXISTS program_status CASCADE;

CREATE TYPE user_type AS ENUM ('citizen', 'employee', 'department_head', 'admin');
CREATE TYPE complaint_status AS ENUM ('submitted', 'acknowledged', 'in_progress', 'resolved', 'rejected', 'reopened');
CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE notification_type AS ENUM ('complaint_update', 'assignment', 'alert', 'announcement', 'reminder', 'system');
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical', 'emergency');
CREATE TYPE service_request_type AS ENUM ('water_tanker', 'garbage_pickup', 'street_cleaning', 'tree_trimming', 'other');
CREATE TYPE service_request_status AS ENUM ('pending', 'approved', 'scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'half_day', 'on_leave');
CREATE TYPE program_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

-- ============================================================================
-- 1. USERS TABLE - Main user management with all roles
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    profile_image_url TEXT,
    user_type user_type NOT NULL DEFAULT 'citizen',
    
    -- Location info
    ward_number VARCHAR(50),
    area VARCHAR(255),
    address TEXT,
    pin_code VARCHAR(10),
    
    -- Preferences
    language_preference VARCHAR(5) DEFAULT 'en', -- en, hi, mr
    notification_enabled BOOLEAN DEFAULT true,
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    verification_badge BOOLEAN DEFAULT false,
    
    -- For employees
    employee_id VARCHAR(50) UNIQUE,
    department_id UUID,
    designation VARCHAR(100),
    work_area TEXT,
    
    -- Device & timestamps
    device_token TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. DEPARTMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    head_id UUID REFERENCES users(id),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    response_sla INTEGER DEFAULT 48, -- SLA in hours
    is_active BOOLEAN DEFAULT true,
    icon VARCHAR(100),
    color VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for users.department_id
ALTER TABLE users ADD CONSTRAINT fk_user_department 
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- ============================================================================
-- 3. WARDS TABLE - Geographic divisions
-- ============================================================================

CREATE TABLE IF NOT EXISTS wards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    population INTEGER,
    area_sqkm DECIMAL(10, 2),
    coordinates GEOGRAPHY(POLYGON, 4326),
    head_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. AREAS TABLE - Sub-divisions of wards
-- ============================================================================

CREATE TABLE IF NOT EXISTS areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_id UUID REFERENCES wards(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    pin_code VARCHAR(10),
    coordinates GEOGRAPHY(POLYGON, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. COMPLAINT CATEGORIES & SUB-CATEGORIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS complaint_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    department_id UUID REFERENCES departments(id),
    icon VARCHAR(100),
    color VARCHAR(10),
    priority_default complaint_priority DEFAULT 'medium',
    sla_hours INTEGER DEFAULT 72,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaint_sub_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES complaint_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    sla_hours INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category_id, code)
);

-- ============================================================================
-- 6. COMPLAINTS TABLE - Main complaints
-- ============================================================================

CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Category
    category_id UUID REFERENCES complaint_categories(id),
    sub_category_id UUID REFERENCES complaint_sub_categories(id),
    
    -- Details
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    
    -- Location
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    landmark TEXT,
    ward_id UUID REFERENCES wards(id),
    area_id UUID REFERENCES areas(id),
    pin_code VARCHAR(10),
    
    -- Media
    images TEXT[], -- Array of image URLs
    voice_note_url TEXT,
    
    -- Status & Priority
    priority complaint_priority DEFAULT 'medium',
    status complaint_status DEFAULT 'submitted',
    
    -- Engagement
    upvote_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    
    -- Recurring
    is_recurring BOOLEAN DEFAULT false,
    parent_complaint_id UUID REFERENCES complaints(id),
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    department_id UUID REFERENCES departments(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    
    -- Dates
    scheduled_date TIMESTAMP WITH TIME ZONE,
    sla_deadline TIMESTAMP WITH TIME ZONE,
    resolution_date TIMESTAMP WITH TIME ZONE,
    
    -- Resolution
    resolution_notes TEXT,
    resolution_images TEXT[],
    
    -- Settings
    is_public BOOLEAN DEFAULT true,
    is_anonymous BOOLEAN DEFAULT false,
    
    -- Rating
    citizen_rating INTEGER CHECK (citizen_rating >= 1 AND citizen_rating <= 5),
    citizen_feedback TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 7. COMPLAINT UPDATES TABLE - Status history
-- ============================================================================

CREATE TABLE IF NOT EXISTS complaint_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    updated_by UUID NOT NULL REFERENCES users(id),
    
    old_status complaint_status,
    new_status complaint_status NOT NULL,
    
    notes TEXT,
    images TEXT[],
    
    is_internal BOOLEAN DEFAULT false, -- Internal notes not visible to citizens
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 8. EMPLOYEES TABLE - Additional employee info
-- ============================================================================

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY REFERENCES users(id),
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id),
    designation VARCHAR(100),
    work_area TEXT,
    ward_id UUID REFERENCES wards(id),
    
    -- Performance
    current_workload INTEGER DEFAULT 0,
    max_workload INTEGER DEFAULT 10,
    performance_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_complaints_resolved INTEGER DEFAULT 0,
    avg_resolution_time INTEGER, -- in hours
    
    -- Status
    is_available BOOLEAN DEFAULT true,
    attendance_status attendance_status DEFAULT 'present',
    
    -- Contact
    emergency_contact VARCHAR(20),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 9. UPVOTES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS upvotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(complaint_id, user_id)
);

-- ============================================================================
-- 10. COMMENTS TABLE - Complaint discussions
-- ============================================================================

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    images TEXT[],
    is_official BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 11. NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entity
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    reference_id UUID, -- Generic reference for other entities
    reference_type VARCHAR(50), -- 'complaint', 'announcement', 'alert', etc.
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    is_pushed BOOLEAN DEFAULT false,
    
    -- Extra data
    data JSONB,
    action_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 12. EMERGENCY ALERTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS emergency_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    alert_type VARCHAR(50) NOT NULL, -- 'weather', 'disaster', 'water', 'health', etc.
    severity alert_severity DEFAULT 'info',
    
    -- Target
    target_wards UUID[],
    target_areas UUID[],
    is_city_wide BOOLEAN DEFAULT false,
    
    -- Duration
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    created_by UUID REFERENCES users(id),
    images TEXT[],
    action_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 13. SERVICE REQUESTS TABLE - Water tanker, special services
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    
    request_type service_request_type NOT NULL,
    description TEXT,
    
    -- Location
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    landmark TEXT,
    
    -- Schedule
    requested_date DATE,
    requested_time_slot VARCHAR(50), -- 'morning', 'afternoon', 'evening'
    scheduled_date DATE,
    scheduled_time TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status service_request_status DEFAULT 'pending',
    assigned_to UUID REFERENCES users(id),
    
    -- Additional info
    quantity INTEGER DEFAULT 1, -- For water tankers, number of tankers
    urgency VARCHAR(20) DEFAULT 'normal', -- 'normal', 'urgent', 'emergency'
    
    -- Resolution
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 14. ANALYTICS TABLE - Daily aggregated data
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    
    -- Dimensions
    category_id UUID REFERENCES complaint_categories(id),
    ward_id UUID REFERENCES wards(id),
    department_id UUID REFERENCES departments(id),
    
    -- Metrics
    complaint_count INTEGER DEFAULT 0,
    resolved_count INTEGER DEFAULT 0,
    pending_count INTEGER DEFAULT 0,
    average_resolution_hours DECIMAL(10, 2),
    sla_breach_count INTEGER DEFAULT 0,
    citizen_satisfaction_avg DECIMAL(3, 2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, category_id, ward_id, department_id)
);

-- ============================================================================
-- 15. FEEDBACK TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    resolution_quality INTEGER CHECK (resolution_quality >= 1 AND resolution_quality <= 5),
    response_time INTEGER CHECK (response_time >= 1 AND response_time <= 5),
    staff_behavior INTEGER CHECK (staff_behavior >= 1 AND staff_behavior <= 5),
    
    comments TEXT,
    suggestions TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(complaint_id, user_id)
);

-- ============================================================================
-- 16. RECURRING ISSUES TABLE - Hotspot tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS recurring_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    ward_id UUID REFERENCES wards(id),
    
    category_id UUID REFERENCES complaint_categories(id),
    
    occurrence_count INTEGER DEFAULT 1,
    last_reported TIMESTAMP WITH TIME ZONE,
    
    is_under_maintenance BOOLEAN DEFAULT false,
    maintenance_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 17. EMPLOYEE ATTENDANCE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS employee_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    
    check_in_location GEOGRAPHY(POINT, 4326),
    check_out_location GEOGRAPHY(POINT, 4326),
    
    status attendance_status DEFAULT 'present',
    work_hours DECIMAL(4, 2),
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- ============================================================================
-- 18. EMPLOYEE DAILY REPORTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS employee_daily_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    
    complaints_assigned INTEGER DEFAULT 0,
    complaints_resolved INTEGER DEFAULT 0,
    complaints_in_progress INTEGER DEFAULT 0,
    
    tasks_completed JSONB,
    issues_faced TEXT,
    materials_used JSONB,
    
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- ============================================================================
-- 19. ANNOUNCEMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    
    type VARCHAR(50) DEFAULT 'general', -- 'general', 'maintenance', 'event', 'notice'
    priority complaint_priority DEFAULT 'medium',
    
    -- Target audience
    target_user_types user_type[],
    target_wards UUID[],
    is_city_wide BOOLEAN DEFAULT true,
    
    -- Media
    images TEXT[],
    attachment_url TEXT,
    
    -- Schedule
    publish_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_published BOOLEAN DEFAULT true,
    is_pinned BOOLEAN DEFAULT false,
    
    -- Author
    created_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 20. PROGRAMS/EVENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    type VARCHAR(50), -- 'awareness', 'cleanup', 'plantation', 'health_camp', etc.
    status program_status DEFAULT 'upcoming',
    
    -- Location
    venue TEXT,
    location GEOGRAPHY(POINT, 4326),
    ward_id UUID REFERENCES wards(id),
    
    -- Schedule
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    
    -- Capacity
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    
    -- Organizer
    organizer_id UUID REFERENCES users(id),
    department_id UUID REFERENCES departments(id),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    
    -- Media
    images TEXT[],
    banner_image TEXT,
    
    -- Additional info
    requirements TEXT,
    rewards TEXT,
    is_public BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 21. PROGRAM REGISTRATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS program_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    
    registration_status VARCHAR(20) DEFAULT 'registered', -- 'registered', 'confirmed', 'attended', 'cancelled'
    attended BOOLEAN DEFAULT false,
    
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_comments TEXT,
    
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(program_id, user_id)
);

-- ============================================================================
-- 22. AUDIT LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    
    action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout', etc.
    resource_type VARCHAR(50) NOT NULL, -- 'complaint', 'user', 'department', etc.
    resource_id UUID,
    
    old_values JSONB,
    new_values JSONB,
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 23. SYSTEM SETTINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    value_type VARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean', 'json'
    description TEXT,
    category VARCHAR(50),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 24. SAVED LOCATIONS TABLE - User saved addresses
-- ============================================================================

CREATE TABLE IF NOT EXISTS saved_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Home', 'Office', etc.
    address TEXT NOT NULL,
    landmark TEXT,
    location GEOGRAPHY(POINT, 4326),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 25. USER ACTIVITY TABLE - For gamification
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    activity_type VARCHAR(50) NOT NULL, -- 'complaint_submitted', 'complaint_resolved', 'upvote', etc.
    points INTEGER DEFAULT 0,
    
    reference_id UUID,
    reference_type VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 26. USER BADGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    badge_type VARCHAR(50) NOT NULL, -- 'active_citizen', 'first_complaint', 'community_helper', etc.
    badge_name VARCHAR(100) NOT NULL,
    badge_description TEXT,
    badge_icon VARCHAR(100),
    
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_ward ON users(ward_number);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);

CREATE INDEX IF NOT EXISTS idx_complaints_number ON complaints(complaint_number);
CREATE INDEX IF NOT EXISTS idx_complaints_user ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_assigned ON complaints(assigned_to);
CREATE INDEX IF NOT EXISTS idx_complaints_department ON complaints(department_id);
CREATE INDEX IF NOT EXISTS idx_complaints_ward ON complaints(ward_id);
CREATE INDEX IF NOT EXISTS idx_complaints_created ON complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_location ON complaints USING GIST(location);

CREATE INDEX IF NOT EXISTS idx_complaint_updates_complaint ON complaint_updates(complaint_id);
CREATE INDEX IF NOT EXISTS idx_comments_complaint ON comments(complaint_id);
CREATE INDEX IF NOT EXISTS idx_upvotes_complaint ON upvotes(complaint_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE NOT is_read;

CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_ward ON employees(ward_id);
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON employee_attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON employee_attendance(date);

CREATE INDEX IF NOT EXISTS idx_service_requests_user ON service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);

CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_date ON programs(start_date);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_date ON audit_logs(created_at DESC);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_complaints_updated_at ON complaints;
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_departments_updated_at ON departments;
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_requests_updated_at ON service_requests;
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_emergency_alerts_updated_at ON emergency_alerts;
CREATE TRIGGER update_emergency_alerts_updated_at BEFORE UPDATE ON emergency_alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements;
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_programs_updated_at ON programs;
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_recurring_issues_updated_at ON recurring_issues;
CREATE TRIGGER update_recurring_issues_updated_at BEFORE UPDATE ON recurring_issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS FOR COMPLAINT MANAGEMENT
-- ============================================================================

-- Auto-generate complaint number
CREATE OR REPLACE FUNCTION generate_complaint_number()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix TEXT;
    month_prefix TEXT;
    seq_num INTEGER;
BEGIN
    year_prefix := TO_CHAR(NOW(), 'YY');
    month_prefix := TO_CHAR(NOW(), 'MM');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(complaint_number FROM 7) AS INTEGER)), 0) + 1
    INTO seq_num
    FROM complaints
    WHERE complaint_number LIKE 'MC' || year_prefix || month_prefix || '%';
    
    NEW.complaint_number := 'MC' || year_prefix || month_prefix || LPAD(seq_num::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS generate_complaint_number_trigger ON complaints;
CREATE TRIGGER generate_complaint_number_trigger
    BEFORE INSERT ON complaints
    FOR EACH ROW
    WHEN (NEW.complaint_number IS NULL)
    EXECUTE FUNCTION generate_complaint_number();

-- Auto-generate service request number
CREATE OR REPLACE FUNCTION generate_service_request_number()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix TEXT;
    month_prefix TEXT;
    seq_num INTEGER;
BEGIN
    year_prefix := TO_CHAR(NOW(), 'YY');
    month_prefix := TO_CHAR(NOW(), 'MM');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(request_number FROM 7) AS INTEGER)), 0) + 1
    INTO seq_num
    FROM service_requests
    WHERE request_number LIKE 'SR' || year_prefix || month_prefix || '%';
    
    NEW.request_number := 'SR' || year_prefix || month_prefix || LPAD(seq_num::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS generate_service_request_number_trigger ON service_requests;
CREATE TRIGGER generate_service_request_number_trigger
    BEFORE INSERT ON service_requests
    FOR EACH ROW
    WHEN (NEW.request_number IS NULL)
    EXECUTE FUNCTION generate_service_request_number();

-- Calculate SLA deadline on complaint creation
CREATE OR REPLACE FUNCTION set_sla_deadline()
RETURNS TRIGGER AS $$
DECLARE
    sla_hours INTEGER;
BEGIN
    SELECT COALESCE(cc.sla_hours, 72) INTO sla_hours
    FROM complaint_categories cc
    WHERE cc.id = NEW.category_id;
    
    NEW.sla_deadline := NOW() + (sla_hours || ' hours')::INTERVAL;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_sla_deadline_trigger ON complaints;
CREATE TRIGGER set_sla_deadline_trigger
    BEFORE INSERT ON complaints
    FOR EACH ROW
    WHEN (NEW.sla_deadline IS NULL)
    EXECUTE FUNCTION set_sla_deadline();

-- Update upvote count
CREATE OR REPLACE FUNCTION update_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE complaints SET upvote_count = upvote_count + 1 WHERE id = NEW.complaint_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE complaints SET upvote_count = GREATEST(upvote_count - 1, 0) WHERE id = OLD.complaint_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_upvote_count_trigger ON upvotes;
CREATE TRIGGER update_upvote_count_trigger
    AFTER INSERT OR DELETE ON upvotes
    FOR EACH ROW EXECUTE FUNCTION update_upvote_count();

-- Update comment count
CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE complaints SET comment_count = comment_count + 1 WHERE id = NEW.complaint_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE complaints SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.complaint_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_comment_count_trigger ON comments;
CREATE TRIGGER update_comment_count_trigger
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_comment_count();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS users_select_own ON users;
CREATE POLICY users_select_own ON users FOR SELECT
    USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() 
        AND u.user_type IN ('employee', 'department_head', 'admin')
    ));

DROP POLICY IF EXISTS users_update_own ON users;
CREATE POLICY users_update_own ON users FOR UPDATE
    USING (auth.uid() = id);

-- Complaints policies
DROP POLICY IF EXISTS complaints_select ON complaints;
CREATE POLICY complaints_select ON complaints FOR SELECT
    USING (
        is_public = true 
        OR user_id = auth.uid() 
        OR assigned_to = auth.uid()
        OR EXISTS (
            SELECT 1 FROM users u WHERE u.id = auth.uid() 
            AND u.user_type IN ('department_head', 'admin')
        )
    );

DROP POLICY IF EXISTS complaints_insert ON complaints;
CREATE POLICY complaints_insert ON complaints FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS complaints_update ON complaints;
CREATE POLICY complaints_update ON complaints FOR UPDATE
    USING (
        user_id = auth.uid() 
        OR assigned_to = auth.uid()
        OR EXISTS (
            SELECT 1 FROM users u WHERE u.id = auth.uid() 
            AND u.user_type IN ('department_head', 'admin')
        )
    );

-- Notifications policies
DROP POLICY IF EXISTS notifications_select ON notifications;
CREATE POLICY notifications_select ON notifications FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS notifications_update ON notifications;
CREATE POLICY notifications_update ON notifications FOR UPDATE
    USING (user_id = auth.uid());

-- Comments policies
DROP POLICY IF EXISTS comments_select ON comments;
CREATE POLICY comments_select ON comments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM complaints c WHERE c.id = complaint_id
        AND (c.is_public = true OR c.user_id = auth.uid() OR c.assigned_to = auth.uid())
    ));

DROP POLICY IF EXISTS comments_insert ON comments;
CREATE POLICY comments_insert ON comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Upvotes policies
DROP POLICY IF EXISTS upvotes_all ON upvotes;
CREATE POLICY upvotes_all ON upvotes FOR ALL
    USING (user_id = auth.uid());

-- Feedback policies
DROP POLICY IF EXISTS feedback_all ON feedback;
CREATE POLICY feedback_all ON feedback FOR ALL
    USING (user_id = auth.uid());

-- Service requests policies
DROP POLICY IF EXISTS service_requests_select ON service_requests;
CREATE POLICY service_requests_select ON service_requests FOR SELECT
    USING (
        user_id = auth.uid() 
        OR assigned_to = auth.uid()
        OR EXISTS (
            SELECT 1 FROM users u WHERE u.id = auth.uid() 
            AND u.user_type IN ('employee', 'department_head', 'admin')
        )
    );

DROP POLICY IF EXISTS service_requests_insert ON service_requests;
CREATE POLICY service_requests_insert ON service_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Saved locations policies
DROP POLICY IF EXISTS saved_locations_all ON saved_locations;
CREATE POLICY saved_locations_all ON saved_locations FOR ALL
    USING (user_id = auth.uid());

-- ============================================================================
-- DEFAULT DATA
-- ============================================================================

-- Insert default departments
INSERT INTO departments (name, code, description, icon, color, response_sla) VALUES
('Public Works', 'PWD', 'Roads, bridges, footpaths, and infrastructure', 'construction', '#EF4444', 72),
('Water Supply', 'WATER', 'Water distribution, pipelines, and quality', 'droplet', '#3B82F6', 48),
('Sanitation', 'SANITATION', 'Waste management, garbage collection, cleanliness', 'trash-2', '#10B981', 24),
('Street Lighting', 'LIGHTING', 'Street lights, electrical infrastructure', 'lightbulb', '#F59E0B', 48),
('Drainage', 'DRAINAGE', 'Storm drains, sewage, waterlogging', 'cloud-rain', '#6366F1', 36),
('Parks & Gardens', 'PARKS', 'Public parks, gardens, and green spaces', 'tree-pine', '#22C55E', 72),
('Traffic', 'TRAFFIC', 'Traffic signals, road markings, signs', 'traffic-cone', '#F97316', 48),
('Health', 'HEALTH', 'Public health, sanitation inspection', 'heart-pulse', '#EC4899', 24),
('Building & Planning', 'BUILDING', 'Building permits, unauthorized constructions', 'building', '#8B5CF6', 120),
('Property Tax', 'TAX', 'Property tax, assessment, billing', 'receipt', '#14B8A6', 168)
ON CONFLICT (code) DO NOTHING;

-- Insert default complaint categories
INSERT INTO complaint_categories (name, code, description, department_id, icon, color, priority_default, sla_hours, sort_order) VALUES
('Road Damage', 'ROAD_DAMAGE', 'Potholes, damaged roads, broken footpaths', (SELECT id FROM departments WHERE code = 'PWD'), 'route', '#EF4444', 'high', 48, 1),
('Water Supply Issues', 'WATER_SUPPLY', 'No water, low pressure, contamination', (SELECT id FROM departments WHERE code = 'WATER'), 'droplet', '#3B82F6', 'high', 24, 2),
('Garbage & Waste', 'GARBAGE', 'Garbage not collected, illegal dumping', (SELECT id FROM departments WHERE code = 'SANITATION'), 'trash-2', '#10B981', 'medium', 24, 3),
('Street Light', 'STREETLIGHT', 'Non-functional lights, damaged poles', (SELECT id FROM departments WHERE code = 'LIGHTING'), 'lightbulb-off', '#F59E0B', 'medium', 48, 4),
('Drainage & Sewage', 'DRAINAGE', 'Blocked drains, sewage overflow, waterlogging', (SELECT id FROM departments WHERE code = 'DRAINAGE'), 'waves', '#6366F1', 'high', 36, 5),
('Tree & Parks', 'TREES', 'Fallen trees, overgrown branches, park maintenance', (SELECT id FROM departments WHERE code = 'PARKS'), 'tree-deciduous', '#22C55E', 'low', 72, 6),
('Traffic Issues', 'TRAFFIC', 'Broken signals, missing signs, road markings', (SELECT id FROM departments WHERE code = 'TRAFFIC'), 'traffic-cone', '#F97316', 'medium', 48, 7),
('Public Health', 'HEALTH', 'Stagnant water, mosquito breeding, health hazards', (SELECT id FROM departments WHERE code = 'HEALTH'), 'shield-alert', '#EC4899', 'high', 24, 8),
('Unauthorized Construction', 'CONSTRUCTION', 'Illegal buildings, encroachments', (SELECT id FROM departments WHERE code = 'BUILDING'), 'building-2', '#8B5CF6', 'low', 168, 9),
('Noise Pollution', 'NOISE', 'Loud music, construction noise, disturbance', (SELECT id FROM departments WHERE code = 'HEALTH'), 'volume-x', '#64748B', 'low', 48, 10),
('Animal Issues', 'ANIMAL', 'Stray animals, animal cruelty, carcass removal', (SELECT id FROM departments WHERE code = 'HEALTH'), 'paw-print', '#F472B6', 'medium', 24, 11),
('Other', 'OTHER', 'Other municipal issues', NULL, 'help-circle', '#94A3B8', 'low', 120, 99)
ON CONFLICT (code) DO NOTHING;

-- Insert sub-categories
INSERT INTO complaint_sub_categories (category_id, name, code, description) VALUES
((SELECT id FROM complaint_categories WHERE code = 'ROAD_DAMAGE'), 'Pothole', 'POTHOLE', 'Holes in the road surface'),
((SELECT id FROM complaint_categories WHERE code = 'ROAD_DAMAGE'), 'Broken Footpath', 'FOOTPATH', 'Damaged or broken footpath'),
((SELECT id FROM complaint_categories WHERE code = 'ROAD_DAMAGE'), 'Road Cave-in', 'CAVEIN', 'Road surface collapsed'),
((SELECT id FROM complaint_categories WHERE code = 'WATER_SUPPLY'), 'No Water', 'NO_WATER', 'Complete water supply cut-off'),
((SELECT id FROM complaint_categories WHERE code = 'WATER_SUPPLY'), 'Low Pressure', 'LOW_PRESSURE', 'Insufficient water pressure'),
((SELECT id FROM complaint_categories WHERE code = 'WATER_SUPPLY'), 'Contaminated Water', 'CONTAMINATED', 'Dirty or contaminated water'),
((SELECT id FROM complaint_categories WHERE code = 'WATER_SUPPLY'), 'Pipe Leakage', 'LEAKAGE', 'Water pipe leaking'),
((SELECT id FROM complaint_categories WHERE code = 'GARBAGE'), 'Not Collected', 'NOT_COLLECTED', 'Garbage not collected on schedule'),
((SELECT id FROM complaint_categories WHERE code = 'GARBAGE'), 'Illegal Dumping', 'ILLEGAL_DUMP', 'Garbage dumped in unauthorized area'),
((SELECT id FROM complaint_categories WHERE code = 'GARBAGE'), 'Overflowing Bin', 'OVERFLOW_BIN', 'Garbage bin overflowing'),
((SELECT id FROM complaint_categories WHERE code = 'STREETLIGHT'), 'Not Working', 'NOT_WORKING', 'Street light not functioning'),
((SELECT id FROM complaint_categories WHERE code = 'STREETLIGHT'), 'Damaged Pole', 'DAMAGED_POLE', 'Light pole damaged or fallen'),
((SELECT id FROM complaint_categories WHERE code = 'STREETLIGHT'), 'Flickering', 'FLICKERING', 'Light flickering'),
((SELECT id FROM complaint_categories WHERE code = 'DRAINAGE'), 'Blocked Drain', 'BLOCKED', 'Drain is blocked'),
((SELECT id FROM complaint_categories WHERE code = 'DRAINAGE'), 'Sewage Overflow', 'SEWAGE', 'Sewage overflowing'),
((SELECT id FROM complaint_categories WHERE code = 'DRAINAGE'), 'Waterlogging', 'WATERLOG', 'Water accumulated on road')
ON CONFLICT DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (key, value, value_type, description, category, is_public) VALUES
('app_name', 'Municipal Connect', 'string', 'Application name', 'general', true),
('app_version', '1.0.0', 'string', 'Application version', 'general', true),
('default_sla_hours', '72', 'number', 'Default SLA in hours', 'complaints', false),
('max_complaint_images', '5', 'number', 'Maximum images per complaint', 'complaints', true),
('max_image_size_mb', '10', 'number', 'Maximum image size in MB', 'complaints', true),
('voice_note_max_seconds', '60', 'number', 'Maximum voice note duration', 'complaints', true),
('enable_anonymous_complaints', 'true', 'boolean', 'Allow anonymous complaints', 'complaints', false),
('enable_gamification', 'true', 'boolean', 'Enable points and badges', 'gamification', false),
('points_per_complaint', '10', 'number', 'Points for submitting complaint', 'gamification', false),
('points_per_resolved', '5', 'number', 'Points when complaint resolved', 'gamification', false),
('auto_assign_complaints', 'true', 'boolean', 'Auto-assign complaints to employees', 'workflow', false),
('notification_email', 'true', 'boolean', 'Send email notifications', 'notifications', false),
('notification_push', 'true', 'boolean', 'Send push notifications', 'notifications', false),
('maintenance_mode', 'false', 'boolean', 'App maintenance mode', 'system', false),
('support_email', 'support@municipalconnect.gov.in', 'string', 'Support email address', 'general', true),
('support_phone', '1800-123-4567', 'string', 'Support phone number', 'general', true)
ON CONFLICT (key) DO NOTHING;

-- Insert default wards (sample data)
INSERT INTO wards (name, code, description, population) VALUES
('Ward 1 - Central', 'W01', 'Central business district', 50000),
('Ward 2 - North', 'W02', 'Northern residential area', 45000),
('Ward 3 - South', 'W03', 'Southern residential area', 48000),
('Ward 4 - East', 'W04', 'Eastern industrial zone', 35000),
('Ward 5 - West', 'W05', 'Western commercial area', 42000),
('Ward 6 - Old City', 'W06', 'Historic old city area', 60000),
('Ward 7 - New Town', 'W07', 'Newly developed township', 30000),
('Ward 8 - Garden Area', 'W08', 'Green belt residential', 25000)
ON CONFLICT (code) DO NOTHING;

-- Insert areas for wards (sample data)
INSERT INTO areas (ward_id, name, code, pin_code) VALUES
((SELECT id FROM wards WHERE code = 'W01'), 'Main Street', 'W01-A01', '400001'),
((SELECT id FROM wards WHERE code = 'W01'), 'Market Square', 'W01-A02', '400001'),
((SELECT id FROM wards WHERE code = 'W02'), 'Green Park', 'W02-A01', '400002'),
((SELECT id FROM wards WHERE code = 'W02'), 'Lake View', 'W02-A02', '400002'),
((SELECT id FROM wards WHERE code = 'W03'), 'Hill Colony', 'W03-A01', '400003'),
((SELECT id FROM wards WHERE code = 'W03'), 'River Side', 'W03-A02', '400003'),
((SELECT id FROM wards WHERE code = 'W04'), 'Industrial Estate', 'W04-A01', '400004'),
((SELECT id FROM wards WHERE code = 'W05'), 'Mall Road', 'W05-A01', '400005')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- VIEWS FOR REPORTING
-- ============================================================================

CREATE OR REPLACE VIEW complaint_summary AS
SELECT 
    c.id,
    c.complaint_number,
    c.title,
    c.status,
    c.priority,
    c.created_at,
    c.sla_deadline,
    c.resolution_date,
    u.full_name as citizen_name,
    cc.name as category_name,
    d.name as department_name,
    e.full_name as assigned_employee,
    w.name as ward_name,
    CASE 
        WHEN c.status = 'resolved' THEN 'Completed'
        WHEN c.sla_deadline < NOW() THEN 'SLA Breached'
        WHEN c.sla_deadline < NOW() + INTERVAL '24 hours' THEN 'SLA Warning'
        ELSE 'On Track'
    END as sla_status
FROM complaints c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN complaint_categories cc ON c.category_id = cc.id
LEFT JOIN departments d ON c.department_id = d.id
LEFT JOIN users e ON c.assigned_to = e.id
LEFT JOIN wards w ON c.ward_id = w.id;

CREATE OR REPLACE VIEW department_performance AS
SELECT 
    d.id as department_id,
    d.name as department_name,
    COUNT(c.id) as total_complaints,
    COUNT(CASE WHEN c.status = 'resolved' THEN 1 END) as resolved_complaints,
    COUNT(CASE WHEN c.status NOT IN ('resolved', 'rejected') THEN 1 END) as pending_complaints,
    ROUND(AVG(EXTRACT(EPOCH FROM (c.resolution_date - c.created_at)) / 3600)::NUMERIC, 2) as avg_resolution_hours,
    COUNT(CASE WHEN c.sla_deadline < NOW() AND c.status NOT IN ('resolved', 'rejected') THEN 1 END) as sla_breached,
    ROUND(AVG(c.citizen_rating)::NUMERIC, 2) as avg_rating
FROM departments d
LEFT JOIN complaints c ON d.id = c.department_id
GROUP BY d.id, d.name;

CREATE OR REPLACE VIEW employee_performance AS
SELECT 
    u.id as employee_id,
    u.full_name as employee_name,
    u.department_id,
    d.name as department_name,
    COUNT(c.id) as total_assigned,
    COUNT(CASE WHEN c.status = 'resolved' THEN 1 END) as resolved,
    COUNT(CASE WHEN c.status = 'in_progress' THEN 1 END) as in_progress,
    ROUND(AVG(EXTRACT(EPOCH FROM (c.resolution_date - c.assigned_at)) / 3600)::NUMERIC, 2) as avg_resolution_hours,
    ROUND(AVG(c.citizen_rating)::NUMERIC, 2) as avg_rating
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN complaints c ON u.id = c.assigned_to
WHERE u.user_type = 'employee'
GROUP BY u.id, u.full_name, u.department_id, d.name;

-- Grant permissions
GRANT SELECT ON complaint_summary TO authenticated;
GRANT SELECT ON department_performance TO authenticated;
GRANT SELECT ON employee_performance TO authenticated;
