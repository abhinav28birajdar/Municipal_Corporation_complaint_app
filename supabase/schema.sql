-- Municipal Corporation Application Database Schema
-- This schema supports all modules: Citizens, Employees, Municipal Heads, and Admins

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE user_role AS ENUM ('citizen', 'employee', 'head', 'admin');
CREATE TYPE complaint_status AS ENUM ('new', 'assigned', 'in_progress', 'completed', 'cancelled', 'reopened');
CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE work_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'verified');
CREATE TYPE program_status AS ENUM ('planned', 'active', 'completed', 'cancelled');
CREATE TYPE notification_type AS ENUM ('complaint', 'work_assignment', 'program', 'announcement', 'system');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'partial');

-- 1. USERS TABLE - Main user management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    role user_role NOT NULL DEFAULT 'citizen',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    registration_number VARCHAR(50) UNIQUE, -- For employees/officials
    address TEXT,
    area_assigned VARCHAR(255), -- For employees
    department VARCHAR(255), -- For employees/heads
    zone_id UUID, -- Reference to zones table
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    fcm_token VARCHAR(500) -- For push notifications
);

-- 2. ZONES & AREAS - Geographic divisions
CREATE TABLE zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    coordinates GEOGRAPHY(POLYGON, 4326), -- Using PostGIS for geographic data
    head_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE wards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES zones(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    coordinates GEOGRAPHY(POLYGON, 4326),
    population INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_id UUID REFERENCES wards(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    coordinates GEOGRAPHY(POLYGON, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DEPARTMENTS - Municipal departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    head_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. COMPLAINT CATEGORIES - Types of complaints
CREATE TABLE complaint_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    department_id UUID REFERENCES departments(id),
    icon VARCHAR(100),
    color VARCHAR(7), -- Hex color code
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. COMPLAINTS - Main complaints table
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_number VARCHAR(50) UNIQUE NOT NULL, -- Auto-generated
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES complaint_categories(id),
    priority complaint_priority DEFAULT 'medium',
    status complaint_status DEFAULT 'new',
    citizen_id UUID REFERENCES users(id) NOT NULL,
    assigned_to UUID REFERENCES users(id), -- Employee assigned
    assigned_by UUID REFERENCES users(id), -- Head who assigned
    location_address TEXT,
    location_coordinates GEOGRAPHY(POINT, 4326),
    area_id UUID REFERENCES areas(id),
    ward_id UUID REFERENCES wards(id),
    zone_id UUID REFERENCES zones(id),
    images JSONB, -- Array of image URLs
    estimated_completion TIMESTAMP WITH TIME ZONE,
    actual_completion TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    citizen_rating INTEGER CHECK (citizen_rating >= 1 AND citizen_rating <= 5),
    citizen_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. COMPLAINT STATUS HISTORY - Track status changes
CREATE TABLE complaint_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
    status complaint_status NOT NULL,
    changed_by UUID REFERENCES users(id),
    notes TEXT,
    images JSONB, -- Before/after images
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. WORK ASSIGNMENTS - Track work assigned to employees
CREATE TABLE work_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID REFERENCES complaints(id),
    employee_id UUID REFERENCES users(id) NOT NULL,
    assigned_by UUID REFERENCES users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status work_status DEFAULT 'assigned',
    priority complaint_priority DEFAULT 'medium',
    scheduled_date TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    estimated_hours INTEGER,
    actual_hours INTEGER,
    location_address TEXT,
    location_coordinates GEOGRAPHY(POINT, 4326),
    area_id UUID REFERENCES areas(id),
    before_images JSONB,
    after_images JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. PROGRAMS - Civic programs and campaigns
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100), -- 'tree_plantation', 'clean_drive', 'awareness', etc.
    status program_status DEFAULT 'planned',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    location_address TEXT,
    location_coordinates GEOGRAPHY(POINT, 4326),
    area_id UUID REFERENCES areas(id),
    organizer_id UUID REFERENCES users(id),
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    images JSONB,
    requirements JSONB, -- What participants need to bring
    rewards JSONB, -- Certificates, points, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PROGRAM PARTICIPANTS - Track program participation
CREATE TABLE program_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attendance_status attendance_status DEFAULT 'present',
    contribution_notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    certificate_issued BOOLEAN DEFAULT false,
    UNIQUE(program_id, user_id)
);

-- 10. EMPLOYEE ATTENDANCE - Track daily attendance
CREATE TABLE employee_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES users(id) NOT NULL,
    date DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    status attendance_status DEFAULT 'present',
    location_coordinates GEOGRAPHY(POINT, 4326),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- 11. NOTIFICATIONS - Push notifications and alerts
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    related_id UUID, -- ID of related complaint, work, program, etc.
    is_read BOOLEAN DEFAULT false,
    is_sent BOOLEAN DEFAULT false,
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    data JSONB, -- Additional notification data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. ANNOUNCEMENTS - Public announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(100), -- 'general', 'emergency', 'event', etc.
    priority complaint_priority DEFAULT 'medium',
    created_by UUID REFERENCES users(id),
    target_zones JSONB, -- Array of zone IDs
    target_roles JSONB, -- Array of user roles
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    images JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. EMERGENCY CONTACTS - Directory of emergency contacts
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    designation VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    service_type VARCHAR(100), -- 'police', 'fire', 'hospital', 'municipal'
    area_id UUID REFERENCES areas(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. DOCUMENTS - File attachments
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    related_type VARCHAR(100), -- 'complaint', 'work', 'program', 'user'
    related_id UUID,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. AUDIT LOGS - Track all important actions
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. SETTINGS - Application settings
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. ANALYTICS DATA - For reports and analytics
CREATE TABLE analytics_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(255) NOT NULL,
    metric_value NUMERIC,
    dimensions JSONB, -- Additional data like zone_id, department_id, etc.
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_zone_id ON users(zone_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_category_id ON complaints(category_id);
CREATE INDEX idx_complaints_citizen_id ON complaints(citizen_id);
CREATE INDEX idx_complaints_assigned_to ON complaints(assigned_to);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
CREATE INDEX idx_complaints_location ON complaints USING GIST(location_coordinates);
CREATE INDEX idx_work_assignments_employee_id ON work_assignments(employee_id);
CREATE INDEX idx_work_assignments_status ON work_assignments(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_programs_start_date ON programs(start_date);
CREATE INDEX idx_employee_attendance_employee_id ON employee_attendance(employee_id);
CREATE INDEX idx_employee_attendance_date ON employee_attendance(date);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_assignments_updated_at BEFORE UPDATE ON work_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON zones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_attendance ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
    FOR ALL USING (auth.uid() = id);

-- Citizens can view their complaints
CREATE POLICY "Citizens can view own complaints" ON complaints
    FOR SELECT USING (citizen_id = auth.uid());

-- Employees can view assigned work
CREATE POLICY "Employees can view assigned work" ON work_assignments
    FOR SELECT USING (employee_id = auth.uid());

-- Users can view their notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR ALL USING (user_id = auth.uid());

-- Insert default data
INSERT INTO departments (name, code, description) VALUES
('Public Works', 'PWD', 'Roads, drainage, and infrastructure'),
('Sanitation', 'SAN', 'Waste management and cleanliness'),
('Water Supply', 'WS', 'Water distribution and quality'),
('Electricity', 'ELE', 'Street lights and electrical issues'),
('Parks & Gardens', 'PNG', 'Green spaces and landscaping'),
('Health', 'HEALTH', 'Public health and hygiene'),
('Traffic', 'TRA', 'Traffic management and signals');

INSERT INTO complaint_categories (name, code, description, icon, color) VALUES
('Road Damage', 'ROAD_DMG', 'Potholes, broken roads, damaged pavements', 'road', '#EF4444'),
('Drainage Issues', 'DRAIN', 'Blocked drains, waterlogging, sewage overflow', 'droplets', '#3B82F6'),
('Waste Management', 'WASTE', 'Garbage not collected, illegal dumping', 'trash-2', '#10B981'),
('Street Lighting', 'LIGHT', 'Broken street lights, dark areas', 'lightbulb', '#F59E0B'),
('Water Supply', 'WATER', 'No water supply, poor water quality', 'droplet', '#06B6D4'),
('Public Safety', 'SAFETY', 'Safety concerns, security issues', 'shield', '#8B5CF6'),
('Noise Pollution', 'NOISE', 'Excessive noise, loud music', 'volume-2', '#F97316'),
('Animal Issues', 'ANIMAL', 'Stray animals, animal cruelty', 'heart', '#EC4899');

INSERT INTO settings (key, value, description, category, is_public) VALUES
('app_name', 'Municipal Connect', 'Application name', 'general', true),
('app_version', '1.0.0', 'Application version', 'general', true),
('complaint_auto_assign', 'true', 'Auto assign complaints to employees', 'complaints', false),
('max_complaint_images', '5', 'Maximum images per complaint', 'complaints', true),
('notification_enabled', 'true', 'Enable push notifications', 'notifications', false),
('work_hours_start', '09:00', 'Work start time', 'general', true),
('work_hours_end', '18:00', 'Work end time', 'general', true);