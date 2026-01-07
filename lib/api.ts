// Comprehensive Supabase Services Layer
import { supabase } from './supabase';
import {
  User,
  UserType,
  UserStatistics,
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
  ComplaintSubCategory,
  ComplaintUpdate,
  ComplaintFormData,
  ComplaintFilters,
  Comment,
  Feedback,
  FeedbackFormData,
  Department,
  Employee,
  EmployeeFilters,
  EmployeeAttendance,
  EmployeeDailyReport,
  Ward,
  Area,
  SavedLocation,
  Notification,
  EmergencyAlert,
  Announcement,
  Program,
  ProgramRegistration,
  ServiceRequest,
  ServiceRequestFormData,
  Analytics,
  AnalyticsFilters,
  DashboardStats,
  CategoryStats,
  WardStats,
  TrendData,
  AuditLog,
  SystemSetting,
  PaginatedResponse,
  GeoPoint,
} from '@/types/complete';

// ============================================================================
// AUTHENTICATION SERVICES
// ============================================================================

export const AuthService = {
  async signUp(email: string, password: string, userData: Partial<User>) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name,
          user_type: userData.user_type || 'citizen',
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Registration failed');

    // Create user profile
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      full_name: userData.full_name,
      phone: userData.phone,
      user_type: userData.user_type || 'citizen',
      ward_number: userData.ward_number,
      area: userData.area,
      address: userData.address,
      pin_code: userData.pin_code,
      language_preference: userData.language_preference || 'en',
    });

    if (profileError) throw profileError;
    return authData;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data as User;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// ============================================================================
// USER SERVICES
// ============================================================================

export const UserService = {
  async getProfile(userId: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDeviceToken(userId: string, token: string) {
    const { error } = await supabase
      .from('users')
      .update({ device_token: token })
      .eq('id', userId);

    if (error) throw error;
  },

  async getUserStatistics(userId: string): Promise<UserStatistics> {
    const { data: complaints, error } = await supabase
      .from('complaints')
      .select('status, citizen_rating')
      .eq('user_id', userId);

    if (error) throw error;

    // Calculate complaint statistics
    const complaintsResolved = complaints?.filter(c => c.status === 'resolved').length || 0;
    
    // Get upvotes statistics
    const { data: upvotesGiven, error: upvotesGivenError } = await supabase
      .from('complaint_upvotes')
      .select('id')
      .eq('user_id', userId);
    
    const { data: userComplaints, error: userComplaintsError } = await supabase
      .from('complaints')
      .select('id')
      .eq('user_id', userId);
    
    let upvotesReceived = 0;
    if (userComplaints && userComplaints.length > 0) {
      const complaintIds = userComplaints.map(c => c.id);
      const { count, error: upvotesReceivedError } = await supabase
        .from('complaint_upvotes')
        .select('id', { count: 'exact', head: true })
        .in('complaint_id', complaintIds);
      
      upvotesReceived = count || 0;
    }

    const stats: UserStatistics = {
      complaints_submitted: complaints?.length || 0,
      complaints_resolved: complaintsResolved,
      contribution_points: (complaintsResolved * 10) + (upvotesGiven?.length || 0),
      upvotes_given: upvotesGiven?.length || 0,
      upvotes_received: upvotesReceived,
    };

    return stats;
  },

  async getUserBadges(userId: string) {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('awarded_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getSavedLocations(userId: string): Promise<SavedLocation[]> {
    const { data, error } = await supabase
      .from('saved_locations')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addSavedLocation(location: Omit<SavedLocation, 'id' | 'created_at'>): Promise<SavedLocation> {
    const { data, error } = await supabase
      .from('saved_locations')
      .insert(location)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteSavedLocation(locationId: string) {
    const { error } = await supabase
      .from('saved_locations')
      .delete()
      .eq('id', locationId);

    if (error) throw error;
  },

  // Admin functions
  async getAllUsers(
    page = 1,
    perPage = 20,
    filters?: { user_type?: UserType; search?: string }
  ): Promise<PaginatedResponse<User>> {
    let query = supabase.from('users').select('*', { count: 'exact' });

    if (filters?.user_type) {
      query = query.eq('user_type', filters.user_type);
    }
    if (filters?.search) {
      query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    };
  },

  async verifyUser(userId: string, verified: boolean) {
    const { error } = await supabase
      .from('users')
      .update({ is_verified: verified, verification_badge: verified })
      .eq('id', userId);

    if (error) throw error;
  },

  async updateUserStatus(userId: string, isActive: boolean) {
    const { error } = await supabase
      .from('users')
      .update({ is_active: isActive })
      .eq('id', userId);

    if (error) throw error;
  },
};

// ============================================================================
// COMPLAINT SERVICES
// ============================================================================

export const ComplaintService = {
  async create(formData: ComplaintFormData, userId: string): Promise<Complaint> {
    const complaintData = {
      user_id: userId,
      category_id: formData.category_id,
      sub_category_id: formData.sub_category_id,
      title: formData.title,
      description: formData.description,
      address: formData.address,
      landmark: formData.landmark,
      ward_id: formData.ward_id,
      area_id: formData.area_id,
      images: formData.images,
      voice_note_url: formData.voice_note_url,
      priority: formData.priority || 'medium',
      is_recurring: formData.is_recurring || false,
      is_anonymous: formData.is_anonymous || false,
      is_public: formData.is_public !== false,
    };

    // Handle location point
    if (formData.location) {
      // PostGIS point format
      (complaintData as any).location = `POINT(${formData.location.longitude} ${formData.location.latitude})`;
    }

    const { data, error } = await supabase
      .from('complaints')
      .insert(complaintData)
      .select(`
        *,
        category:complaint_categories(*),
        sub_category:complaint_sub_categories(*),
        user:users!complaints_user_id_fkey(id, full_name, profile_image_url),
        ward:wards(*),
        area:areas(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async getById(complaintId: string, userId?: string): Promise<Complaint> {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        category:complaint_categories(*),
        sub_category:complaint_sub_categories(*),
        user:users!complaints_user_id_fkey(id, full_name, profile_image_url, phone),
        department:departments(*),
        assigned_employee:users!complaints_assigned_to_fkey(id, full_name, profile_image_url, phone, designation),
        ward:wards(*),
        area:areas(*),
        updates:complaint_updates(
          *,
          updated_by_user:users(id, full_name, profile_image_url)
        )
      `)
      .eq('id', complaintId)
      .single();

    if (error) throw error;

    // Check if user has upvoted
    if (userId) {
      const { data: upvote } = await supabase
        .from('upvotes')
        .select('id')
        .eq('complaint_id', complaintId)
        .eq('user_id', userId)
        .single();

      data.has_upvoted = !!upvote;
    }

    return data;
  },

  async getByNumber(complaintNumber: string): Promise<Complaint> {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        category:complaint_categories(*),
        user:users!complaints_user_id_fkey(id, full_name, profile_image_url),
        department:departments(*),
        assigned_employee:users!complaints_assigned_to_fkey(id, full_name, profile_image_url)
      `)
      .eq('complaint_number', complaintNumber)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserComplaints(
    userId: string,
    page = 1,
    perPage = 20,
    filters?: ComplaintFilters
  ): Promise<PaginatedResponse<Complaint>> {
    let query = supabase
      .from('complaints')
      .select(`
        *,
        category:complaint_categories(id, name, icon, color),
        department:departments(id, name),
        assigned_employee:users!complaints_assigned_to_fkey(id, full_name)
      `, { count: 'exact' })
      .eq('user_id', userId);

    query = this.applyFilters(query, filters);

    const { data, error, count } = await query
      .order(filters?.sort_by || 'created_at', { ascending: filters?.sort_order === 'asc' })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    };
  },

  async getPublicComplaints(
    page = 1,
    perPage = 20,
    filters?: ComplaintFilters
  ): Promise<PaginatedResponse<Complaint>> {
    let query = supabase
      .from('complaints')
      .select(`
        *,
        category:complaint_categories(id, name, icon, color),
        user:users!complaints_user_id_fkey(id, full_name, profile_image_url),
        ward:wards(id, name)
      `, { count: 'exact' })
      .eq('is_public', true);

    query = this.applyFilters(query, filters);

    const { data, error, count } = await query
      .order(filters?.sort_by || 'created_at', { ascending: filters?.sort_order === 'asc' })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    };
  },

  async getAssignedComplaints(
    employeeId: string,
    page = 1,
    perPage = 20,
    filters?: ComplaintFilters
  ): Promise<PaginatedResponse<Complaint>> {
    let query = supabase
      .from('complaints')
      .select(`
        *,
        category:complaint_categories(id, name, icon, color),
        user:users!complaints_user_id_fkey(id, full_name, profile_image_url, phone, address),
        ward:wards(id, name)
      `, { count: 'exact' })
      .eq('assigned_to', employeeId);

    query = this.applyFilters(query, filters);

    const { data, error, count } = await query
      .order(filters?.sort_by || 'created_at', { ascending: filters?.sort_order === 'asc' })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    };
  },

  async getDepartmentComplaints(
    departmentId: string,
    page = 1,
    perPage = 20,
    filters?: ComplaintFilters
  ): Promise<PaginatedResponse<Complaint>> {
    let query = supabase
      .from('complaints')
      .select(`
        *,
        category:complaint_categories(id, name, icon, color),
        user:users!complaints_user_id_fkey(id, full_name, profile_image_url),
        assigned_employee:users!complaints_assigned_to_fkey(id, full_name)
      `, { count: 'exact' })
      .eq('department_id', departmentId);

    query = this.applyFilters(query, filters);

    const { data, error, count } = await query
      .order(filters?.sort_by || 'created_at', { ascending: filters?.sort_order === 'asc' })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    };
  },

  async getAllComplaints(
    page = 1,
    perPage = 20,
    filters?: ComplaintFilters
  ): Promise<PaginatedResponse<Complaint>> {
    let query = supabase
      .from('complaints')
      .select(`
        *,
        category:complaint_categories(id, name, icon, color),
        user:users!complaints_user_id_fkey(id, full_name, profile_image_url),
        department:departments(id, name),
        assigned_employee:users!complaints_assigned_to_fkey(id, full_name),
        ward:wards(id, name)
      `, { count: 'exact' });

    query = this.applyFilters(query, filters);

    const { data, error, count } = await query
      .order(filters?.sort_by || 'created_at', { ascending: filters?.sort_order === 'asc' })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    };
  },

  applyFilters(query: any, filters?: ComplaintFilters) {
    if (!filters) return query;

    if (filters.status && filters.status.length > 0) {
      query = query.in('status', filters.status);
    }
    if (filters.priority && filters.priority.length > 0) {
      query = query.in('priority', filters.priority);
    }
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters.department_id) {
      query = query.eq('department_id', filters.department_id);
    }
    if (filters.ward_id) {
      query = query.eq('ward_id', filters.ward_id);
    }
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,complaint_number.ilike.%${filters.search}%`);
    }

    return query;
  },

  async updateStatus(
    complaintId: string,
    status: ComplaintStatus,
    userId: string,
    notes?: string,
    images?: string[]
  ): Promise<Complaint> {
    // Get current status
    const { data: current } = await supabase
      .from('complaints')
      .select('status')
      .eq('id', complaintId)
      .single();

    // Update complaint
    const updates: any = { status };
    if (status === 'resolved') {
      updates.resolution_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('complaints')
      .update(updates)
      .eq('id', complaintId)
      .select()
      .single();

    if (error) throw error;

    // Create status update record
    await supabase.from('complaint_updates').insert({
      complaint_id: complaintId,
      updated_by: userId,
      old_status: current?.status,
      new_status: status,
      notes,
      images,
    });

    return data;
  },

  async assignComplaint(
    complaintId: string,
    employeeId: string,
    assignedBy: string
  ): Promise<Complaint> {
    // Get department from category
    const { data: complaint } = await supabase
      .from('complaints')
      .select('category_id, category:complaint_categories(department_id)')
      .eq('id', complaintId)
      .single();

    const departmentId = (complaint?.category as any)?.department_id;

    const { data, error } = await supabase
      .from('complaints')
      .update({
        assigned_to: employeeId,
        department_id: departmentId,
        assigned_at: new Date().toISOString(),
        status: 'acknowledged',
      })
      .eq('id', complaintId)
      .select()
      .single();

    if (error) throw error;

    // Update employee workload
    await supabase.rpc('increment_employee_workload', { employee_id: employeeId });

    return data;
  },

  async addResolution(
    complaintId: string,
    userId: string,
    notes: string,
    images?: string[]
  ) {
    const { data, error } = await supabase
      .from('complaints')
      .update({
        status: 'resolved',
        resolution_date: new Date().toISOString(),
        resolution_notes: notes,
        resolution_images: images,
      })
      .eq('id', complaintId)
      .select()
      .single();

    if (error) throw error;

    // Create status update
    await supabase.from('complaint_updates').insert({
      complaint_id: complaintId,
      updated_by: userId,
      old_status: 'in_progress',
      new_status: 'resolved',
      notes,
      images,
    });

    return data;
  },

  async toggleUpvote(complaintId: string, userId: string): Promise<boolean> {
    const { data: existing } = await supabase
      .from('upvotes')
      .select('id')
      .eq('complaint_id', complaintId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      await supabase
        .from('upvotes')
        .delete()
        .eq('id', existing.id);
      return false;
    } else {
      await supabase
        .from('upvotes')
        .insert({ complaint_id: complaintId, user_id: userId });
      return true;
    }
  },

  async getComments(complaintId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users(id, full_name, profile_image_url, user_type)
      `)
      .eq('complaint_id', complaintId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async addComment(
    complaintId: string,
    userId: string,
    content: string,
    images?: string[],
    isOfficial = false
  ): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        complaint_id: complaintId,
        user_id: userId,
        content,
        images,
        is_official: isOfficial,
      })
      .select(`
        *,
        user:users(id, full_name, profile_image_url, user_type)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async submitFeedback(
    complaintId: string,
    userId: string,
    feedback: FeedbackFormData
  ): Promise<Feedback> {
    const { data, error } = await supabase
      .from('feedback')
      .insert({
        complaint_id: complaintId,
        user_id: userId,
        ...feedback,
      })
      .select()
      .single();

    if (error) throw error;

    // Update complaint rating
    await supabase
      .from('complaints')
      .update({ citizen_rating: feedback.overall_rating })
      .eq('id', complaintId);

    return data;
  },

  // Real-time subscription
  subscribeToComplaint(complaintId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`complaint:${complaintId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'complaints',
          filter: `id=eq.${complaintId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToUserComplaints(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user_complaints:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'complaints',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};

// ============================================================================
// CATEGORY SERVICES
// ============================================================================

export const CategoryService = {
  async getAll(): Promise<ComplaintCategory[]> {
    const { data, error } = await supabase
      .from('complaint_categories')
      .select(`
        *,
        department:departments(id, name),
        sub_categories:complaint_sub_categories(*)
      `)
      .eq('is_active', true)
      .order('sort_order');

    if (error) throw error;
    return data;
  },

  async getById(categoryId: string): Promise<ComplaintCategory> {
    const { data, error } = await supabase
      .from('complaint_categories')
      .select(`
        *,
        department:departments(*),
        sub_categories:complaint_sub_categories(*)
      `)
      .eq('id', categoryId)
      .single();

    if (error) throw error;
    return data;
  },

  async getSubCategories(categoryId: string): Promise<ComplaintSubCategory[]> {
    const { data, error } = await supabase
      .from('complaint_sub_categories')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true);

    if (error) throw error;
    return data;
  },

  // Admin functions
  async create(category: Omit<ComplaintCategory, 'id' | 'created_at'>): Promise<ComplaintCategory> {
    const { data, error } = await supabase
      .from('complaint_categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(categoryId: string, updates: Partial<ComplaintCategory>): Promise<ComplaintCategory> {
    const { data, error } = await supabase
      .from('complaint_categories')
      .update(updates)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ============================================================================
// DEPARTMENT SERVICES
// ============================================================================

export const DepartmentService = {
  async getAll(): Promise<Department[]> {
    const { data, error } = await supabase
      .from('departments')
      .select(`
        *,
        head:users!departments_head_id_fkey(id, full_name, profile_image_url)
      `)
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  },

  async getById(departmentId: string): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .select(`
        *,
        head:users!departments_head_id_fkey(id, full_name, profile_image_url, email, phone),
        categories:complaint_categories(*)
      `)
      .eq('id', departmentId)
      .single();

    if (error) throw error;

    // Get employee count
    const { count } = await supabase
      .from('employees')
      .select('*', { count: 'exact', head: true })
      .eq('department_id', departmentId);

    data.employee_count = count || 0;
    return data;
  },

  async create(department: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .insert(department)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(departmentId: string, updates: Partial<Department>): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .update(updates)
      .eq('id', departmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDepartmentStats(departmentId: string) {
    const { data, error } = await supabase
      .from('complaints')
      .select('status, priority, created_at, resolution_date, citizen_rating')
      .eq('department_id', departmentId);

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      resolved: data?.filter(c => c.status === 'resolved').length || 0,
      pending: data?.filter(c => !['resolved', 'rejected'].includes(c.status)).length || 0,
      avgResolutionTime: 0,
      avgRating: 0,
    };

    // Calculate avg resolution time
    const resolvedWithTime = data?.filter(c => c.status === 'resolved' && c.resolution_date);
    if (resolvedWithTime && resolvedWithTime.length > 0) {
      const totalHours = resolvedWithTime.reduce((sum, c) => {
        const created = new Date(c.created_at);
        const resolved = new Date(c.resolution_date!);
        return sum + (resolved.getTime() - created.getTime()) / (1000 * 60 * 60);
      }, 0);
      stats.avgResolutionTime = totalHours / resolvedWithTime.length;
    }

    // Calculate avg rating
    const ratings = data?.filter(c => c.citizen_rating).map(c => c.citizen_rating) || [];
    if (ratings.length > 0) {
      stats.avgRating = ratings.reduce((a, b) => a + (b || 0), 0) / ratings.length;
    }

    return stats;
  },
};

// ============================================================================
// EMPLOYEE SERVICES
// ============================================================================

export const EmployeeService = {
  async getAll(filters?: EmployeeFilters): Promise<Employee[]> {
    let query = supabase
      .from('employees')
      .select(`
        *,
        user:users!employees_id_fkey(id, full_name, email, phone, profile_image_url),
        department:departments(id, name),
        ward:wards(id, name)
      `);

    if (filters?.department_id) {
      query = query.eq('department_id', filters.department_id);
    }
    if (filters?.ward_id) {
      query = query.eq('ward_id', filters.ward_id);
    }
    if (filters?.is_available !== undefined) {
      query = query.eq('is_available', filters.is_available);
    }
    if (filters?.search) {
      // Search in joined user table
      query = query.ilike('user.full_name', `%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(employeeId: string): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        user:users!employees_id_fkey(*),
        department:departments(*),
        ward:wards(*)
      `)
      .eq('id', employeeId)
      .single();

    if (error) throw error;
    return data;
  },

  async getByDepartment(departmentId: string): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        user:users!employees_id_fkey(id, full_name, profile_image_url, phone)
      `)
      .eq('department_id', departmentId)
      .eq('is_available', true)
      .order('current_workload');

    if (error) throw error;
    return data;
  },

  async updateAvailability(employeeId: string, isAvailable: boolean) {
    const { error } = await supabase
      .from('employees')
      .update({ is_available: isAvailable })
      .eq('id', employeeId);

    if (error) throw error;
  },

  async markAttendance(
    employeeId: string,
    type: 'check_in' | 'check_out',
    location?: GeoPoint
  ): Promise<EmployeeAttendance> {
    const today = new Date().toISOString().split('T')[0];

    // Check if record exists for today
    const { data: existing } = await supabase
      .from('employee_attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .single();

    const locationPoint = location
      ? `POINT(${location.longitude} ${location.latitude})`
      : null;

    if (existing) {
      const updates: any = {};
      if (type === 'check_in') {
        updates.check_in_time = new Date().toISOString();
        updates.check_in_location = locationPoint;
      } else {
        updates.check_out_time = new Date().toISOString();
        updates.check_out_location = locationPoint;
        // Calculate work hours
        if (existing.check_in_time) {
          const checkIn = new Date(existing.check_in_time);
          const checkOut = new Date();
          updates.work_hours = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60);
        }
      }

      const { data, error } = await supabase
        .from('employee_attendance')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('employee_attendance')
        .insert({
          employee_id: employeeId,
          date: today,
          check_in_time: type === 'check_in' ? new Date().toISOString() : null,
          check_in_location: type === 'check_in' ? locationPoint : null,
          status: 'present',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  async getAttendanceHistory(employeeId: string, startDate: string, endDate: string): Promise<EmployeeAttendance[]> {
    const { data, error } = await supabase
      .from('employee_attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async submitDailyReport(report: Omit<EmployeeDailyReport, 'id' | 'created_at'>): Promise<EmployeeDailyReport> {
    const { data, error } = await supabase
      .from('employee_daily_reports')
      .upsert(report, { onConflict: 'employee_id,date' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getEmployeePerformance(employeeId: string) {
    const { data: complaints, error } = await supabase
      .from('complaints')
      .select('status, created_at, resolution_date, citizen_rating')
      .eq('assigned_to', employeeId);

    if (error) throw error;

    const resolved = complaints?.filter(c => c.status === 'resolved') || [];
    const ratings = resolved.filter(c => c.citizen_rating).map(c => c.citizen_rating);

    return {
      totalAssigned: complaints?.length || 0,
      resolved: resolved.length,
      pending: (complaints?.length || 0) - resolved.length,
      avgRating: ratings.length > 0 ? ratings.reduce((a, b) => a + (b || 0), 0) / ratings.length : 0,
    };
  },

  async getByUserId(userId: string): Promise<Employee> {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        user:users!employees_id_fkey(*),
        department:departments(*),
        ward:wards(*)
      `)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async getAssignedComplaints(employeeId: string): Promise<Complaint[]> {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        user:users!complaints_user_id_fkey(id, full_name, phone, profile_image_url),
        category:complaint_categories(id, name, icon),
        ward:wards(id, name)
      `)
      .eq('assigned_to', employeeId)
      .neq('status', 'resolved')
      .neq('status', 'rejected')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async checkIn(employeeId: string, location?: { lat: number; lng: number }): Promise<EmployeeAttendance> {
    const geoPoint = location ? { latitude: location.lat, longitude: location.lng } : undefined;
    return this.markAttendance(employeeId, 'check_in', geoPoint);
  },

  async checkOut(employeeId: string): Promise<EmployeeAttendance> {
    return this.markAttendance(employeeId, 'check_out');
  },

  async getTodayAttendance(employeeId: string): Promise<EmployeeAttendance | null> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('employee_attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  },

  async getRecentReports(employeeId: string): Promise<EmployeeDailyReport[]> {
    const { data, error } = await supabase
      .from('employee_daily_reports')
      .select('*')
      .eq('employee_id', employeeId)
      .order('date', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data;
  },

  async getWorkStatistics(employeeId: string) {
    const performance = await this.getEmployeePerformance(employeeId);
    
    // Calculate average resolution time
    const { data: resolvedComplaints, error } = await supabase
      .from('complaints')
      .select('created_at, resolution_date')
      .eq('assigned_to', employeeId)
      .eq('status', 'resolved')
      .not('resolution_date', 'is', null);

    if (error) throw error;

    let averageResolutionTime = 0;
    if (resolvedComplaints && resolvedComplaints.length > 0) {
      const totalTime = resolvedComplaints.reduce((sum, c) => {
        const created = new Date(c.created_at);
        const resolved = new Date(c.resolution_date);
        return sum + (resolved.getTime() - created.getTime()) / (1000 * 60 * 60); // hours
      }, 0);
      averageResolutionTime = totalTime / resolvedComplaints.length;
    }

    return {
      totalAssigned: performance.totalAssigned,
      resolved: performance.resolved,
      pending: performance.pending,
      averageResolutionTime,
    };
  },
};

// ============================================================================
// WARD & AREA SERVICES
// ============================================================================

export const WardService = {
  async getAll(): Promise<Ward[]> {
    const { data, error } = await supabase
      .from('wards')
      .select(`
        *,
        head:users!wards_head_id_fkey(id, full_name)
      `)
      .eq('is_active', true)
      .order('code');

    if (error) throw error;
    return data;
  },

  async getById(wardId: string): Promise<Ward> {
    const { data, error } = await supabase
      .from('wards')
      .select(`
        *,
        head:users!wards_head_id_fkey(*),
        areas:areas(*)
      `)
      .eq('id', wardId)
      .single();

    if (error) throw error;
    return data;
  },

  async getAreas(wardId: string): Promise<Area[]> {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('ward_id', wardId)
      .order('name');

    if (error) throw error;
    return data;
  },
};

// ============================================================================
// NOTIFICATION SERVICES
// ============================================================================

export const NotificationService = {
  async getUserNotifications(userId: string, page = 1, perPage = 20): Promise<PaginatedResponse<Notification>> {
    const { data, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    };
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  },

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },

  async create(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },

  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};

// ============================================================================
// EMERGENCY ALERT SERVICES
// ============================================================================

export const AlertService = {
  async getActiveAlerts(wardId?: string): Promise<EmergencyAlert[]> {
    let query = supabase
      .from('emergency_alerts')
      .select('*')
      .eq('is_active', true)
      .or(`end_time.is.null,end_time.gt.${new Date().toISOString()}`);

    if (wardId) {
      query = query.or(`is_city_wide.eq.true,target_wards.cs.{${wardId}}`);
    }

    const { data, error } = await query.order('severity', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(alert: Omit<EmergencyAlert, 'id' | 'created_at' | 'updated_at'>): Promise<EmergencyAlert> {
    const { data, error } = await supabase
      .from('emergency_alerts')
      .insert(alert)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(alertId: string, updates: Partial<EmergencyAlert>): Promise<EmergencyAlert> {
    const { data, error } = await supabase
      .from('emergency_alerts')
      .update(updates)
      .eq('id', alertId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deactivate(alertId: string) {
    const { error } = await supabase
      .from('emergency_alerts')
      .update({ is_active: false, end_time: new Date().toISOString() })
      .eq('id', alertId);

    if (error) throw error;
  },

  async acknowledge(alertId: string, userId: string) {
    const { error } = await supabase
      .from('alert_acknowledgments')
      .upsert({ 
        alert_id: alertId, 
        user_id: userId,
        acknowledged_at: new Date().toISOString() 
      });

    if (error) throw error;
  },
};

// ============================================================================
// ANNOUNCEMENT SERVICES
// ============================================================================

export const AnnouncementService = {
  async getPublished(userType?: UserType, wardId?: string): Promise<Announcement[]> {
    let query = supabase
      .from('announcements')
      .select(`
        *,
        author:users!announcements_created_by_fkey(id, full_name)
      `)
      .eq('is_published', true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    const { data, error } = await query.order('is_pinned', { ascending: false }).order('publish_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async create(announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>): Promise<Announcement> {
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcement)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(announcementId: string, updates: Partial<Announcement>): Promise<Announcement> {
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', announcementId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// ============================================================================
// PROGRAM/EVENT SERVICES
// ============================================================================

export const ProgramService = {
  async getUpcoming(limit?: number): Promise<Program[]> {
    let query = supabase
      .from('programs')
      .select(`
        *,
        organizer:users!programs_organizer_id_fkey(id, full_name),
        department:departments(id, name),
        ward:wards(id, name)
      `)
      .in('status', ['upcoming', 'ongoing'])
      .gte('start_date', new Date().toISOString())
      .order('start_date');

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  async getById(programId: string): Promise<Program> {
    const { data, error } = await supabase
      .from('programs')
      .select(`
        *,
        organizer:users!programs_organizer_id_fkey(*),
        department:departments(*),
        ward:wards(*)
      `)
      .eq('id', programId)
      .single();

    if (error) throw error;
    return data;
  },

  async register(programId: string, userId: string): Promise<ProgramRegistration> {
    const { data, error } = await supabase
      .from('program_registrations')
      .insert({ program_id: programId, user_id: userId })
      .select()
      .single();

    if (error) throw error;

    // Increment participant count
    await supabase.rpc('increment_program_participants', { program_id: programId });

    return data;
  },

  async cancelRegistration(programId: string, userId: string) {
    const { error } = await supabase
      .from('program_registrations')
      .update({ registration_status: 'cancelled' })
      .eq('program_id', programId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  async getUserRegistrations(userId: string): Promise<ProgramRegistration[]> {
    const { data, error } = await supabase
      .from('program_registrations')
      .select(`
        *,
        program:programs(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};

// ============================================================================
// SERVICE REQUEST SERVICES
// ============================================================================

export const ServiceRequestService = {
  async create(formData: ServiceRequestFormData, userId: string): Promise<ServiceRequest> {
    const requestData = {
      user_id: userId,
      ...formData,
    };

    if (formData.location) {
      (requestData as any).location = `POINT(${formData.location.longitude} ${formData.location.latitude})`;
    }

    const { data, error } = await supabase
      .from('service_requests')
      .insert(requestData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserRequests(userId: string): Promise<ServiceRequest[]> {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        assigned_employee:users!service_requests_assigned_to_fkey(id, full_name, phone)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(requestId: string): Promise<ServiceRequest> {
    const { data, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        user:users!service_requests_user_id_fkey(id, full_name, phone, address),
        assigned_employee:users!service_requests_assigned_to_fkey(id, full_name, phone)
      `)
      .eq('id', requestId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(requestId: string, status: string, notes?: string) {
    const { error } = await supabase
      .from('service_requests')
      .update({ status, notes, ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}) })
      .eq('id', requestId);

    if (error) throw error;
  },
};

// ============================================================================
// ANALYTICS SERVICES
// ============================================================================

export const AnalyticsService = {
  async getDashboardStats(filters?: AnalyticsFilters): Promise<DashboardStats> {
    let query = supabase.from('complaints').select('status, priority, created_at, resolution_date, citizen_rating');

    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }
    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters?.department_id) {
      query = query.eq('department_id', filters.department_id);
    }
    if (filters?.ward_id) {
      query = query.eq('ward_id', filters.ward_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    const today = new Date().toISOString().split('T')[0];
    const todayComplaints = data?.filter(c => c.created_at.startsWith(today)) || [];

    const resolved = data?.filter(c => c.status === 'resolved') || [];
    const ratings = resolved.filter(c => c.citizen_rating).map(c => c.citizen_rating);

    // Calculate avg resolution time
    let avgResolutionTime = 0;
    const resolvedWithTime = resolved.filter(c => c.resolution_date);
    if (resolvedWithTime.length > 0) {
      const totalHours = resolvedWithTime.reduce((sum, c) => {
        const created = new Date(c.created_at);
        const resolvedDate = new Date(c.resolution_date!);
        return sum + (resolvedDate.getTime() - created.getTime()) / (1000 * 60 * 60);
      }, 0);
      avgResolutionTime = totalHours / resolvedWithTime.length;
    }

    return {
      total_complaints: data?.length || 0,
      resolved_complaints: resolved.length,
      pending_complaints: data?.filter(c => c.status === 'submitted' || c.status === 'acknowledged').length || 0,
      in_progress_complaints: data?.filter(c => c.status === 'in_progress').length || 0,
      sla_breached: 0, // Would need SLA deadline comparison
      avg_resolution_time: avgResolutionTime,
      citizen_satisfaction: ratings.length > 0 ? ratings.reduce((a, b) => a + (b || 0), 0) / ratings.length : 0,
      complaints_today: todayComplaints.length,
      resolved_today: todayComplaints.filter(c => c.status === 'resolved').length,
    };
  },

  async getCategoryStats(): Promise<CategoryStats[]> {
    const { data: categories, error: catError } = await supabase
      .from('complaint_categories')
      .select('id, name, icon, color');

    if (catError) throw catError;

    const { data: complaints, error: compError } = await supabase
      .from('complaints')
      .select('category_id, status');

    if (compError) throw compError;

    const total = complaints?.length || 1;

    return (categories || []).map(cat => {
      const catComplaints = complaints?.filter(c => c.category_id === cat.id) || [];
      return {
        category_id: cat.id,
        category_name: cat.name,
        category_icon: cat.icon,
        category_color: cat.color,
        total: catComplaints.length,
        resolved: catComplaints.filter(c => c.status === 'resolved').length,
        pending: catComplaints.filter(c => !['resolved', 'rejected'].includes(c.status)).length,
        percentage: (catComplaints.length / total) * 100,
      };
    }).sort((a, b) => b.total - a.total);
  },

  async getWardStats(): Promise<WardStats[]> {
    const { data: wards, error: wardError } = await supabase
      .from('wards')
      .select('id, name, code');

    if (wardError) throw wardError;

    const { data: complaints, error: compError } = await supabase
      .from('complaints')
      .select('ward_id, status');

    if (compError) throw compError;

    return (wards || []).map(ward => {
      const wardComplaints = complaints?.filter(c => c.ward_id === ward.id) || [];
      const resolved = wardComplaints.filter(c => c.status === 'resolved').length;
      return {
        ward_id: ward.id,
        ward_name: ward.name,
        ward_code: ward.code,
        total: wardComplaints.length,
        resolved,
        pending: wardComplaints.length - resolved,
        resolution_rate: wardComplaints.length > 0 ? (resolved / wardComplaints.length) * 100 : 0,
      };
    });
  },

  async getTrendData(days = 30): Promise<TrendData[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('complaints')
      .select('created_at, status, resolution_date')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const trends: Record<string, TrendData> = {};

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trends[dateStr] = { date: dateStr, complaints: 0, resolved: 0 };
    }

    (data || []).forEach(complaint => {
      const date = complaint.created_at.split('T')[0];
      if (trends[date]) {
        trends[date].complaints++;
      }
      if (complaint.resolution_date) {
        const resolvedDate = complaint.resolution_date.split('T')[0];
        if (trends[resolvedDate]) {
          trends[resolvedDate].resolved++;
        }
      }
    });

    return Object.values(trends).sort((a, b) => a.date.localeCompare(b.date));
  },
};

// ============================================================================
// AUDIT LOG SERVICES
// ============================================================================

export const AuditService = {
  async getLogs(
    page = 1,
    perPage = 50,
    filters?: { user_id?: string; resource_type?: string; action?: string }
  ): Promise<PaginatedResponse<AuditLog>> {
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:users(id, full_name, email)
      `, { count: 'exact' });

    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    if (filters?.resource_type) {
      query = query.eq('resource_type', filters.resource_type);
    }
    if (filters?.action) {
      query = query.eq('action', filters.action);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    };
  },

  async log(entry: Omit<AuditLog, 'id' | 'created_at'>) {
    const { error } = await supabase.from('audit_logs').insert(entry);
    if (error) console.error('Audit log error:', error);
  },
};

// ============================================================================
// SYSTEM SETTINGS SERVICES
// ============================================================================

export const SettingsService = {
  async getAll(): Promise<SystemSetting[]> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('category', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getPublic(): Promise<SystemSetting[]> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('is_public', true);

    if (error) throw error;
    return data;
  },

  async get(key: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) return null;
    return data?.value || null;
  },

  async set(key: string, value: string): Promise<void> {
    const { error } = await supabase
      .from('system_settings')
      .update({ value })
      .eq('key', key);

    if (error) throw error;
  },

  async bulkUpdate(settings: { key: string; value: string }[]): Promise<void> {
    for (const setting of settings) {
      await this.set(setting.key, setting.value);
    }
  },
};

// ============================================================================
// STORAGE SERVICES
// ============================================================================

export const StorageService = {
  async uploadImage(
    bucket: 'complaint-images' | 'resolution-images' | 'profile-images',
    file: { uri: string; type: string; name: string },
    path: string
  ): Promise<string> {
    const response = await fetch(file.uri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, blob, {
        contentType: file.type,
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  async uploadVoiceNote(file: { uri: string; type: string; name: string }, path: string): Promise<string> {
    const response = await fetch(file.uri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from('voice-notes')
      .upload(path, blob, {
        contentType: file.type,
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('voice-notes')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  },

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
  },
};

// Export all services
export default {
  Auth: AuthService,
  User: UserService,
  Complaint: ComplaintService,
  Category: CategoryService,
  Department: DepartmentService,
  Employee: EmployeeService,
  Ward: WardService,
  Notification: NotificationService,
  Alert: AlertService,
  Announcement: AnnouncementService,
  Program: ProgramService,
  ServiceRequest: ServiceRequestService,
  Analytics: AnalyticsService,
  Audit: AuditService,
  Settings: SettingsService,
  Storage: StorageService,
};
