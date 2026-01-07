// ============================================================================
// Municipal Corporation Application - Complete Type Definitions
// ============================================================================

// ============================================================================
// ENUMS
// ============================================================================

export type UserType = 'citizen' | 'employee' | 'department_head' | 'admin';

export type ComplaintStatus = 
  | 'submitted' 
  | 'acknowledged' 
  | 'in_progress' 
  | 'resolved' 
  | 'rejected' 
  | 'reopened';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

export type NotificationType = 
  | 'complaint_update' 
  | 'assignment' 
  | 'alert' 
  | 'announcement' 
  | 'reminder' 
  | 'system';

export type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';

export type ServiceRequestType = 
  | 'water_tanker' 
  | 'garbage_pickup' 
  | 'street_cleaning' 
  | 'tree_trimming' 
  | 'other';

export type ServiceRequestStatus = 
  | 'pending' 
  | 'approved' 
  | 'scheduled' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'on_leave';

export type ProgramStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type Language = 'en' | 'hi' | 'mr';

// ============================================================================
// USER RELATED TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  profile_image_url?: string;
  user_type: UserType;
  
  // Location
  ward_number?: string;
  area?: string;
  address?: string;
  pin_code?: string;
  
  // Preferences
  language_preference: Language;
  notification_enabled: boolean;
  
  // Verification
  is_verified: boolean;
  is_active: boolean;
  verification_badge: boolean;
  
  // Employee fields
  employee_id?: string;
  department_id?: string;
  designation?: string;
  work_area?: string;
  
  // Device
  device_token?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  department?: Department;
  ward?: Ward;
  statistics?: UserStatistics;
  badges?: UserBadge[];
}

export interface UserStatistics {
  complaints_submitted: number;
  complaints_resolved: number;
  avg_resolution_time?: number;
  contribution_points: number;
  upvotes_given: number;
  upvotes_received: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  badge_description?: string;
  badge_icon?: string;
  awarded_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  points: number;
  reference_id?: string;
  reference_type?: string;
  created_at: string;
}

// ============================================================================
// EMPLOYEE TYPES
// ============================================================================

export interface Employee {
  id: string;
  employee_code: string;
  department_id?: string;
  designation?: string;
  work_area?: string;
  ward_id?: string;
  
  // Performance
  current_workload: number;
  max_workload: number;
  performance_rating: number;
  total_complaints_resolved: number;
  avg_resolution_time?: number;
  
  // Status
  is_available: boolean;
  attendance_status: AttendanceStatus;
  
  emergency_contact?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  user?: User;
  department?: Department;
  ward?: Ward;
}

export interface EmployeeAttendance {
  id: string;
  employee_id: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  check_in_location?: GeoPoint;
  check_out_location?: GeoPoint;
  status: AttendanceStatus;
  work_hours?: number;
  notes?: string;
  created_at: string;
}

export interface EmployeeDailyReport {
  id: string;
  employee_id: string;
  date: string;
  complaints_assigned: number;
  complaints_resolved: number;
  complaints_in_progress: number;
  tasks_completed?: Record<string, any>;
  issues_faced?: string;
  materials_used?: Record<string, any>;
  submitted_at?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

// ============================================================================
// DEPARTMENT TYPES
// ============================================================================

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  head_id?: string;
  contact_email?: string;
  contact_phone?: string;
  response_sla: number;
  is_active: boolean;
  icon?: string;
  color?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  head?: User;
  categories?: ComplaintCategory[];
  employee_count?: number;
}

// ============================================================================
// LOCATION TYPES
// ============================================================================

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Ward {
  id: string;
  name: string;
  code: string;
  description?: string;
  population?: number;
  area_sqkm?: number;
  head_id?: string;
  is_active: boolean;
  created_at: string;
  
  // Joined data
  head?: User;
  areas?: Area[];
}

export interface Area {
  id: string;
  ward_id: string;
  name: string;
  code: string;
  pin_code?: string;
  created_at: string;
  
  // Joined data
  ward?: Ward;
}

export interface SavedLocation {
  id: string;
  user_id: string;
  name: string;
  address: string;
  landmark?: string;
  location?: GeoPoint;
  is_default: boolean;
  created_at: string;
}

// ============================================================================
// COMPLAINT TYPES
// ============================================================================

export interface ComplaintCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  department_id?: string;
  icon?: string;
  color?: string;
  priority_default: ComplaintPriority;
  sla_hours: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  
  // Joined data
  department?: Department;
  sub_categories?: ComplaintSubCategory[];
}

export interface ComplaintSubCategory {
  id: string;
  category_id: string;
  name: string;
  code: string;
  description?: string;
  sla_hours?: number;
  is_active: boolean;
  created_at: string;
}

export interface Complaint {
  id: string;
  complaint_number: string;
  user_id: string;
  
  // Category
  category_id?: string;
  sub_category_id?: string;
  
  // Details
  title: string;
  description: string;
  
  // Location
  location?: GeoPoint;
  address?: string;
  landmark?: string;
  ward_id?: string;
  area_id?: string;
  pin_code?: string;
  
  // Media
  images?: string[];
  voice_note_url?: string;
  
  // Status
  priority: ComplaintPriority;
  status: ComplaintStatus;
  
  // Engagement
  upvote_count: number;
  comment_count: number;
  
  // Recurring
  is_recurring: boolean;
  parent_complaint_id?: string;
  
  // Assignment
  assigned_to?: string;
  department_id?: string;
  assigned_at?: string;
  
  // Dates
  scheduled_date?: string;
  sla_deadline?: string;
  resolution_date?: string;
  
  // Resolution
  resolution_notes?: string;
  resolution_images?: string[];
  
  // Settings
  is_public: boolean;
  is_anonymous: boolean;
  
  // Rating
  citizen_rating?: number;
  citizen_feedback?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Joined data
  user?: User;
  category?: ComplaintCategory;
  sub_category?: ComplaintSubCategory;
  department?: Department;
  assigned_employee?: User;
  ward?: Ward;
  area?: Area;
  updates?: ComplaintUpdate[];
  has_upvoted?: boolean;
}

export interface ComplaintUpdate {
  id: string;
  complaint_id: string;
  updated_by: string;
  old_status?: ComplaintStatus;
  new_status: ComplaintStatus;
  notes?: string;
  images?: string[];
  is_internal: boolean;
  created_at: string;
  
  // Joined data
  updated_by_user?: User;
}

export interface Upvote {
  id: string;
  complaint_id: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  complaint_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  images?: string[];
  is_official: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined data
  user?: User;
  replies?: Comment[];
}

export interface Feedback {
  id: string;
  complaint_id: string;
  user_id: string;
  overall_rating: number;
  resolution_quality?: number;
  response_time?: number;
  staff_behavior?: number;
  comments?: string;
  suggestions?: string;
  created_at: string;
}

// ============================================================================
// SERVICE REQUEST TYPES
// ============================================================================

export interface ServiceRequest {
  id: string;
  request_number: string;
  user_id: string;
  request_type: ServiceRequestType;
  description?: string;
  
  // Location
  location?: GeoPoint;
  address?: string;
  landmark?: string;
  
  // Schedule
  requested_date?: string;
  requested_time_slot?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  
  // Status
  status: ServiceRequestStatus;
  assigned_to?: string;
  
  // Additional
  quantity: number;
  urgency: 'normal' | 'urgent' | 'emergency';
  
  completed_at?: string;
  notes?: string;
  
  created_at: string;
  updated_at: string;
  
  // Joined data
  user?: User;
  assigned_employee?: User;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  complaint_id?: string;
  reference_id?: string;
  reference_type?: string;
  is_read: boolean;
  is_pushed: boolean;
  data?: Record<string, any>;
  action_url?: string;
  created_at: string;
  read_at?: string;
}

// ============================================================================
// EMERGENCY ALERT TYPES
// ============================================================================

export interface EmergencyAlert {
  id: string;
  title: string;
  message: string;
  alert_type: string;
  severity: AlertSeverity;
  target_wards?: string[];
  target_areas?: string[];
  is_city_wide: boolean;
  start_time: string;
  end_time?: string;
  is_active: boolean;
  created_by?: string;
  images?: string[];
  action_url?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ANNOUNCEMENT TYPES
// ============================================================================

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  priority: ComplaintPriority;
  target_user_types?: UserType[];
  target_wards?: string[];
  is_city_wide: boolean;
  images?: string[];
  attachment_url?: string;
  publish_at: string;
  expires_at?: string;
  is_published: boolean;
  is_pinned: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  author?: User;
}

// ============================================================================
// PROGRAM/EVENT TYPES
// ============================================================================

export interface Program {
  id: string;
  title: string;
  description?: string;
  type?: string;
  status: ProgramStatus;
  
  // Location
  venue?: string;
  location?: GeoPoint;
  ward_id?: string;
  
  // Schedule
  start_date: string;
  end_date?: string;
  registration_deadline?: string;
  
  // Capacity
  max_participants?: number;
  current_participants: number;
  
  // Organizer
  organizer_id?: string;
  department_id?: string;
  contact_phone?: string;
  contact_email?: string;
  
  // Media
  images?: string[];
  banner_image?: string;
  
  // Additional
  requirements?: string;
  rewards?: string;
  is_public: boolean;
  
  created_at: string;
  updated_at: string;
  
  // Joined data
  organizer?: User;
  department?: Department;
  ward?: Ward;
  is_registered?: boolean;
}

export interface ProgramRegistration {
  id: string;
  program_id: string;
  user_id: string;
  registration_status: string;
  attended: boolean;
  feedback_rating?: number;
  feedback_comments?: string;
  certificate_issued: boolean;
  certificate_url?: string;
  created_at: string;
  
  // Joined data
  user?: User;
  program?: Program;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface Analytics {
  id: string;
  date: string;
  category_id?: string;
  ward_id?: string;
  department_id?: string;
  complaint_count: number;
  resolved_count: number;
  pending_count: number;
  average_resolution_hours?: number;
  sla_breach_count: number;
  citizen_satisfaction_avg?: number;
  created_at: string;
}

export interface DashboardStats {
  total_complaints: number;
  resolved_complaints: number;
  pending_complaints: number;
  in_progress_complaints: number;
  sla_breached: number;
  avg_resolution_time: number;
  citizen_satisfaction: number;
  complaints_today: number;
  resolved_today: number;
}

export interface CategoryStats {
  category_id: string;
  category_name: string;
  category_icon?: string;
  category_color?: string;
  total: number;
  resolved: number;
  pending: number;
  percentage: number;
}

export interface WardStats {
  ward_id: string;
  ward_name: string;
  ward_code: string;
  total: number;
  resolved: number;
  pending: number;
  resolution_rate: number;
}

export interface TrendData {
  date: string;
  complaints: number;
  resolved: number;
}

// ============================================================================
// RECURRING ISSUES TYPES
// ============================================================================

export interface RecurringIssue {
  id: string;
  location?: GeoPoint;
  address?: string;
  ward_id?: string;
  category_id?: string;
  occurrence_count: number;
  last_reported?: string;
  is_under_maintenance: boolean;
  maintenance_notes?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  category?: ComplaintCategory;
  ward?: Ward;
}

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  
  // Joined data
  user?: User;
}

// ============================================================================
// SYSTEM SETTINGS TYPES
// ============================================================================

export interface SystemSetting {
  id: string;
  key: string;
  value?: string;
  value_type: string;
  description?: string;
  category?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface ComplaintFilters {
  status?: ComplaintStatus[];
  priority?: ComplaintPriority[];
  category_id?: string;
  department_id?: string;
  ward_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  sort_by?: 'created_at' | 'updated_at' | 'priority' | 'upvote_count';
  sort_order?: 'asc' | 'desc';
}

export interface EmployeeFilters {
  department_id?: string;
  ward_id?: string;
  is_available?: boolean;
  search?: string;
}

export interface AnalyticsFilters {
  date_from?: string;
  date_to?: string;
  category_id?: string;
  department_id?: string;
  ward_id?: string;
  group_by?: 'day' | 'week' | 'month';
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface ComplaintFormData {
  category_id: string;
  sub_category_id?: string;
  title: string;
  description: string;
  location?: GeoPoint;
  address?: string;
  landmark?: string;
  ward_id?: string;
  area_id?: string;
  images?: string[];
  voice_note_url?: string;
  priority?: ComplaintPriority;
  is_recurring?: boolean;
  is_anonymous?: boolean;
  is_public?: boolean;
}

export interface ServiceRequestFormData {
  request_type: ServiceRequestType;
  description?: string;
  location?: GeoPoint;
  address?: string;
  landmark?: string;
  requested_date?: string;
  requested_time_slot?: string;
  quantity?: number;
  urgency?: 'normal' | 'urgent' | 'emergency';
}

export interface FeedbackFormData {
  overall_rating: number;
  resolution_quality?: number;
  response_time?: number;
  staff_behavior?: number;
  comments?: string;
  suggestions?: string;
}

export interface UserProfileFormData {
  full_name: string;
  phone?: string;
  address?: string;
  ward_number?: string;
  area?: string;
  pin_code?: string;
  language_preference?: Language;
  notification_enabled?: boolean;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export interface ComplaintDetailParams {
  id: string;
}

export interface ChatParams {
  complaint_id: string;
}

export interface EmployeeDetailParams {
  id: string;
}

export interface ProgramDetailParams {
  id: string;
}
