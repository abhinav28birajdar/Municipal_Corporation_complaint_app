// Admin Store with Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Department,
  Ward,
  ComplaintCategory,
  Employee,
  Analytics,
  SystemSetting,
  AuditLog,
} from '@/types/complete';
import {
  UserService,
  DepartmentService,
  WardService,
  CategoryService,
  EmployeeService,
  AnalyticsService,
  AuditService,
  SettingsService,
  AlertService,
  AnnouncementService,
} from '@/lib/api';

interface DashboardStats {
  totalUsers: number;
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  totalDepartments: number;
  totalEmployees: number;
  averageResolutionTime: number;
  satisfactionRate: number;
  monthlyTrend: {
    month: string;
    complaints: number;
    resolved: number;
  }[];
  departmentPerformance: {
    department: string;
    total: number;
    resolved: number;
    efficiency: number;
  }[];
}

interface AdminState {
  // Dashboard
  dashboardStats: DashboardStats | null;
  
  // Users
  users: User[];
  totalUsers: number;
  
  // Departments
  departments: Department[];
  
  // Wards & Areas
  wards: Ward[];
  
  // Categories
  categories: ComplaintCategory[];
  
  // Employees
  employees: Employee[];
  
  // Analytics
  analyticsData: Analytics[];
  
  // System
  systemSettings: SystemSetting[] | null;
  auditLogs: AuditLog[];
  
  // State
  isLoading: boolean;
  error: string | null;
  
  // Dashboard actions
  fetchDashboardStats: () => Promise<void>;
  
  // User management
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  updateUserRole: (userId: string, role: string) => Promise<void>;
  updateUserStatus: (userId: string, isActive: boolean) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  
  // Department management
  fetchDepartments: () => Promise<void>;
  createDepartment: (department: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateDepartment: (id: string, updates: Partial<Department>) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  
  // Ward management
  fetchWards: () => Promise<void>;
  createWard: (ward: Omit<Ward, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateWard: (id: string, updates: Partial<Ward>) => Promise<void>;
  deleteWard: (id: string) => Promise<void>;
  
  // Category management
  fetchCategories: () => Promise<void>;
  createCategory: (category: Omit<ComplaintCategory, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<ComplaintCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Employee management
  fetchEmployees: () => Promise<void>;
  createEmployee: (employee: any) => Promise<void>;
  updateEmployee: (id: string, updates: any) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  
  // Analytics
  fetchAnalytics: (dateRange?: { start: string; end: string }) => Promise<void>;
  generateReport: (type: string, dateRange: { start: string; end: string }) => Promise<any>;
  
  // System settings
  fetchSystemSettings: () => Promise<void>;
  updateSystemSettings: (settings: { key: string; value: string }[]) => Promise<void>;
  
  // Audit logs
  fetchAuditLogs: (filters?: { action?: string; userId?: string }) => Promise<void>;
  
  // Alerts & Announcements
  createEmergencyAlert: (alert: any) => Promise<void>;
  createAnnouncement: (announcement: any) => Promise<void>;
  
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  dashboardStats: null,
  users: [],
  totalUsers: 0,
  departments: [],
  wards: [],
  categories: [],
  employees: [],
  analyticsData: [],
  systemSettings: null,
  auditLogs: [],
  isLoading: false,
  error: null,
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchDashboardStats: async () => {
        try {
          set({ isLoading: true, error: null });
          const stats = await AnalyticsService.getDashboardStats();
          // Map the service response to local DashboardStats format
          const dashboardStats: DashboardStats = {
            totalUsers: 0, // Will be fetched separately
            totalComplaints: stats.total_complaints || 0,
            resolvedComplaints: stats.resolved_complaints || 0,
            pendingComplaints: stats.pending_complaints || 0,
            totalDepartments: 0, // Will be fetched separately  
            totalEmployees: 0, // Will be fetched separately
            averageResolutionTime: stats.avg_resolution_time || 0,
            satisfactionRate: stats.citizen_satisfaction || 0,
            monthlyTrend: [],
            departmentPerformance: [],
          };
          set({ dashboardStats, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // User Management
      fetchUsers: async (page = 1, limit = 20) => {
        try {
          set({ isLoading: true, error: null });
          const response = await UserService.getAllUsers(page, limit);
          set({ 
            users: response.data, 
            totalUsers: response.total,
            isLoading: false 
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      updateUserRole: async (userId: string, role: string) => {
        try {
          await UserService.updateProfile(userId, { role } as any);
          set(state => ({
            users: state.users.map(u =>
              u.id === userId ? { ...u, role: role as any } : u
            ),
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      updateUserStatus: async (userId: string, isActive: boolean) => {
        try {
          await UserService.updateProfile(userId, { is_active: isActive } as any);
          set(state => ({
            users: state.users.map(u =>
              u.id === userId ? { ...u, is_active: isActive } : u
            ),
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      deleteUser: async (userId: string) => {
        try {
          // Deactivate user instead of delete
          await UserService.updateUserStatus(userId, false);
          set(state => ({
            users: state.users.filter(u => u.id !== userId),
            totalUsers: state.totalUsers - 1,
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // Department Management
      fetchDepartments: async () => {
        try {
          set({ isLoading: true, error: null });
          const departments = await DepartmentService.getAll();
          set({ departments, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      createDepartment: async (department) => {
        try {
          const newDept = await DepartmentService.create(department);
          set(state => ({
            departments: [...state.departments, newDept],
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      updateDepartment: async (id: string, updates: Partial<Department>) => {
        try {
          const updated = await DepartmentService.update(id, updates);
          set(state => ({
            departments: state.departments.map(d =>
              d.id === id ? updated : d
            ),
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      deleteDepartment: async (id: string) => {
        try {
          // Mark as inactive instead of deleting
          await DepartmentService.update(id, { is_active: false } as any);
          set(state => ({
            departments: state.departments.filter(d => d.id !== id),
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // Ward Management
      fetchWards: async () => {
        try {
          set({ isLoading: true, error: null });
          const wards = await WardService.getAll();
          set({ wards, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      createWard: async (ward) => {
        try {
          // Ward creation not directly supported - would need to add to API
          throw new Error('Ward creation not implemented');
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      updateWard: async (id: string, updates: Partial<Ward>) => {
        try {
          // Ward update not directly supported - would need to add to API
          throw new Error('Ward update not implemented');
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      deleteWard: async (id: string) => {
        try {
          // Ward deletion not directly supported - would need to add to API
          throw new Error('Ward deletion not implemented');
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // Category Management
      fetchCategories: async () => {
        try {
          set({ isLoading: true, error: null });
          const categories = await CategoryService.getAll();
          set({ categories, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      createCategory: async (category) => {
        try {
          const newCat = await CategoryService.create(category);
          set(state => ({
            categories: [...state.categories, newCat],
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      updateCategory: async (id: string, updates: Partial<ComplaintCategory>) => {
        try {
          const updated = await CategoryService.update(id, updates);
          set(state => ({
            categories: state.categories.map(c =>
              c.id === id ? updated : c
            ),
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      deleteCategory: async (id: string) => {
        try {
          // Mark as inactive instead of deleting
          await CategoryService.update(id, { is_active: false } as any);
          set(state => ({
            categories: state.categories.filter(c => c.id !== id),
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // Employee Management
      fetchEmployees: async () => {
        try {
          set({ isLoading: true, error: null });
          const employees = await EmployeeService.getAll();
          set({ employees, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      createEmployee: async (employee) => {
        try {
          // Employee creation not directly supported - would need to add to API
          throw new Error('Employee creation not implemented');
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      updateEmployee: async (id: string, updates: any) => {
        try {
          // Employee update - use updateAvailability for now
          if ('is_available' in updates) {
            await EmployeeService.updateAvailability(id, updates.is_available);
          }
          set(state => ({
            employees: state.employees.map(e =>
              e.id === id ? { ...e, ...updates } : e
            ),
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      deleteEmployee: async (id: string) => {
        try {
          // Mark employee as unavailable instead of deleting
          await EmployeeService.updateAvailability(id, false);
          set(state => ({
            employees: state.employees.filter(e => e.id !== id),
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // Analytics
      fetchAnalytics: async (dateRange) => {
        try {
          set({ isLoading: true, error: null });
          const data = await AnalyticsService.getDashboardStats(dateRange as any);
          set({ analyticsData: [data as any], isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      generateReport: async (type: string, dateRange) => {
        try {
          // Generate report from trend data
          const trendData = await AnalyticsService.getTrendData(30);
          return { type, dateRange, data: trendData };
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // System Settings
      fetchSystemSettings: async () => {
        try {
          const settings = await SettingsService.getAll();
          set({ systemSettings: settings });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      updateSystemSettings: async (settings: { key: string; value: string }[]) => {
        try {
          await SettingsService.bulkUpdate(settings);
          // Refetch settings after update
          const updated = await SettingsService.getAll();
          set({ systemSettings: updated });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      // Audit Logs
      fetchAuditLogs: async (filters) => {
        try {
          set({ isLoading: true, error: null });
          const response = await AuditService.getLogs(1, 50, filters as any);
          set({ auditLogs: response.data, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Alerts & Announcements
      createEmergencyAlert: async (alert) => {
        try {
          await AlertService.create(alert);
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      createAnnouncement: async (announcement) => {
        try {
          await AnnouncementService.create(announcement);
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      reset: () => set(initialState),
    }),
    {
      name: 'admin-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        dashboardStats: state.dashboardStats,
      }),
    }
  )
);

export default useAdminStore;
