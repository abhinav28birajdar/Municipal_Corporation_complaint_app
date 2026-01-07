// Employee Store with Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Employee,
  EmployeeAttendance,
  EmployeeDailyReport,
  Complaint,
  ComplaintFilters,
} from '@/types/complete';
import { EmployeeService, ComplaintService } from '@/lib/api';

interface EmployeeState {
  employee: Employee | null;
  assignedComplaints: Complaint[];
  todayAttendance: EmployeeAttendance | null;
  recentReports: EmployeeDailyReport[];
  workStatistics: {
    totalAssigned: number;
    resolved: number;
    pending: number;
    averageResolutionTime: number;
  } | null;
  
  isLoading: boolean;
  error: string | null;
  
  // Employee data
  fetchEmployeeData: (userId: string) => Promise<void>;
  fetchAssignedComplaints: (employeeId: string, filters?: ComplaintFilters) => Promise<void>;
  
  // Attendance
  checkIn: (employeeId: string, location?: { lat: number; lng: number }) => Promise<void>;
  checkOut: (employeeId: string) => Promise<void>;
  fetchTodayAttendance: (employeeId: string) => Promise<void>;
  
  // Reports
  submitDailyReport: (report: Omit<EmployeeDailyReport, 'id' | 'created_at'>) => Promise<void>;
  fetchRecentReports: (employeeId: string) => Promise<void>;
  
  // Work statistics
  fetchWorkStatistics: (employeeId: string) => Promise<void>;
  
  // Complaint actions
  updateComplaintStatus: (complaintId: string, status: string, notes?: string) => Promise<void>;
  addComplaintUpdate: (complaintId: string, content: string, images?: string[]) => Promise<void>;
  
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  employee: null,
  assignedComplaints: [],
  todayAttendance: null,
  recentReports: [],
  workStatistics: null,
  isLoading: false,
  error: null,
};

export const useEmployeeStore = create<EmployeeState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchEmployeeData: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const employee = await EmployeeService.getByUserId(userId);
          set({ employee, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchAssignedComplaints: async (employeeId: string, filters?: ComplaintFilters) => {
        try {
          set({ isLoading: true, error: null });
          const response = await EmployeeService.getAssignedComplaints(employeeId);
          set({ assignedComplaints: response, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      checkIn: async (employeeId: string, location?: { lat: number; lng: number }) => {
        try {
          set({ isLoading: true, error: null });
          const attendance = await EmployeeService.checkIn(employeeId, location);
          set({ todayAttendance: attendance, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      checkOut: async (employeeId: string) => {
        try {
          set({ isLoading: true, error: null });
          const attendance = await EmployeeService.checkOut(employeeId);
          set({ todayAttendance: attendance, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      fetchTodayAttendance: async (employeeId: string) => {
        try {
          const attendance = await EmployeeService.getTodayAttendance(employeeId);
          set({ todayAttendance: attendance });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      submitDailyReport: async (report: Omit<EmployeeDailyReport, 'id' | 'created_at'>) => {
        try {
          set({ isLoading: true, error: null });
          const newReport = await EmployeeService.submitDailyReport(report);
          set(state => ({
            recentReports: [newReport, ...state.recentReports],
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      fetchRecentReports: async (employeeId: string) => {
        try {
          const reports = await EmployeeService.getRecentReports(employeeId);
          set({ recentReports: reports });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      fetchWorkStatistics: async (employeeId: string) => {
        try {
          const stats = await EmployeeService.getWorkStatistics(employeeId);
          set({ workStatistics: stats });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      updateComplaintStatus: async (complaintId: string, status: string, notes?: string) => {
        try {
          set({ isLoading: true, error: null });
          const { employee } = get();
          if (!employee || !employee.user) throw new Error('No employee data');
          
          await ComplaintService.updateStatus(complaintId, status as any, employee.user.id, notes);
          
          set(state => ({
            assignedComplaints: state.assignedComplaints.map(c =>
              c.id === complaintId ? { ...c, status: status as any } : c
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      addComplaintUpdate: async (complaintId: string, content: string, images?: string[]) => {
        try {
          set({ isLoading: true, error: null });
          const { employee } = get();
          if (!employee || !employee.user) throw new Error('No employee data');
          
          await ComplaintService.addComment(
            complaintId,
            employee.user.id,
            content,
            images,
            true // isOfficial
          );
          
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      reset: () => set(initialState),
    }),
    {
      name: 'employee-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        employee: state.employee,
        todayAttendance: state.todayAttendance,
      }),
    }
  )
);

export default useEmployeeStore;
