// Comprehensive Complaint Store with Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
  ComplaintSubCategory,
  ComplaintFormData,
  ComplaintFilters,
  Comment,
  Feedback,
  FeedbackFormData,
  PaginatedResponse,
} from '@/types/complete';
import { ComplaintService, CategoryService } from '@/lib/api';

interface ComplaintState {
  // Data
  complaints: Complaint[];
  userComplaints: Complaint[];
  assignedComplaints: Complaint[];
  publicComplaints: Complaint[];
  currentComplaint: Complaint | null;
  categories: ComplaintCategory[];
  subCategories: ComplaintSubCategory[];
  comments: Comment[];
  
  // Pagination
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  
  // Filters
  filters: ComplaintFilters;
  
  // UI State
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  
  // Draft (for offline support)
  draftComplaint: Partial<ComplaintFormData> | null;
  pendingComplaints: ComplaintFormData[];
  
  // Actions
  fetchCategories: () => Promise<void>;
  fetchSubCategories: (categoryId: string) => Promise<void>;
  
  fetchUserComplaints: (userId: string, page?: number) => Promise<void>;
  fetchAssignedComplaints: (employeeId: string, page?: number) => Promise<void>;
  fetchPublicComplaints: (page?: number) => Promise<void>;
  fetchAllComplaints: (page?: number) => Promise<void>;
  fetchDepartmentComplaints: (departmentId: string, page?: number) => Promise<void>;
  
  fetchComplaintById: (complaintId: string, userId?: string) => Promise<void>;
  fetchComplaintByNumber: (complaintNumber: string) => Promise<void>;
  
  createComplaint: (formData: ComplaintFormData, userId: string) => Promise<Complaint>;
  updateComplaintStatus: (complaintId: string, status: ComplaintStatus, userId: string, notes?: string, images?: string[]) => Promise<void>;
  assignComplaint: (complaintId: string, employeeId: string, assignedBy: string) => Promise<void>;
  addResolution: (complaintId: string, userId: string, notes: string, images?: string[]) => Promise<void>;
  
  toggleUpvote: (complaintId: string, userId: string) => Promise<void>;
  
  fetchComments: (complaintId: string) => Promise<void>;
  addComment: (complaintId: string, userId: string, content: string, images?: string[], isOfficial?: boolean) => Promise<void>;
  
  submitFeedback: (complaintId: string, userId: string, feedback: FeedbackFormData) => Promise<void>;
  
  setFilters: (filters: Partial<ComplaintFilters>) => void;
  clearFilters: () => void;
  
  saveDraft: (draft: Partial<ComplaintFormData>) => void;
  clearDraft: () => void;
  addToPendingQueue: (complaint: ComplaintFormData) => void;
  removeFromPendingQueue: (index: number) => void;
  syncPendingComplaints: (userId: string) => Promise<void>;
  
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  complaints: [],
  userComplaints: [],
  assignedComplaints: [],
  publicComplaints: [],
  currentComplaint: null,
  categories: [],
  subCategories: [],
  comments: [],
  pagination: {
    page: 1,
    perPage: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  isLoading: false,
  isSubmitting: false,
  error: null,
  draftComplaint: null,
  pendingComplaints: [],
};

export const useComplaintStore = create<ComplaintState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchCategories: async () => {
        try {
          set({ isLoading: true, error: null });
          const categories = await CategoryService.getAll();
          set({ categories, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchSubCategories: async (categoryId: string) => {
        try {
          const subCategories = await CategoryService.getSubCategories(categoryId);
          set({ subCategories });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      fetchUserComplaints: async (userId: string, page = 1) => {
        try {
          set({ isLoading: true, error: null });
          const { filters, pagination } = get();
          const response = await ComplaintService.getUserComplaints(userId, page, pagination.perPage, filters);
          set({
            userComplaints: response.data,
            pagination: {
              page: response.page,
              perPage: response.per_page,
              total: response.total,
              totalPages: response.total_pages,
            },
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchAssignedComplaints: async (employeeId: string, page = 1) => {
        try {
          set({ isLoading: true, error: null });
          const { filters, pagination } = get();
          const response = await ComplaintService.getAssignedComplaints(employeeId, page, pagination.perPage, filters);
          set({
            assignedComplaints: response.data,
            pagination: {
              page: response.page,
              perPage: response.per_page,
              total: response.total,
              totalPages: response.total_pages,
            },
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchPublicComplaints: async (page = 1) => {
        try {
          set({ isLoading: true, error: null });
          const { filters, pagination } = get();
          const response = await ComplaintService.getPublicComplaints(page, pagination.perPage, filters);
          set({
            publicComplaints: response.data,
            pagination: {
              page: response.page,
              perPage: response.per_page,
              total: response.total,
              totalPages: response.total_pages,
            },
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchAllComplaints: async (page = 1) => {
        try {
          set({ isLoading: true, error: null });
          const { filters, pagination } = get();
          const response = await ComplaintService.getAllComplaints(page, pagination.perPage, filters);
          set({
            complaints: response.data,
            pagination: {
              page: response.page,
              perPage: response.per_page,
              total: response.total,
              totalPages: response.total_pages,
            },
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchDepartmentComplaints: async (departmentId: string, page = 1) => {
        try {
          set({ isLoading: true, error: null });
          const { filters, pagination } = get();
          const response = await ComplaintService.getDepartmentComplaints(departmentId, page, pagination.perPage, filters);
          set({
            complaints: response.data,
            pagination: {
              page: response.page,
              perPage: response.per_page,
              total: response.total,
              totalPages: response.total_pages,
            },
            isLoading: false,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchComplaintById: async (complaintId: string, userId?: string) => {
        try {
          set({ isLoading: true, error: null });
          const complaint = await ComplaintService.getById(complaintId, userId);
          set({ currentComplaint: complaint, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      fetchComplaintByNumber: async (complaintNumber: string) => {
        try {
          set({ isLoading: true, error: null });
          const complaint = await ComplaintService.getByNumber(complaintNumber);
          set({ currentComplaint: complaint, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      createComplaint: async (formData: ComplaintFormData, userId: string) => {
        try {
          set({ isSubmitting: true, error: null });
          const complaint = await ComplaintService.create(formData, userId);
          
          // Add to user complaints
          set(state => ({
            userComplaints: [complaint, ...state.userComplaints],
            isSubmitting: false,
            draftComplaint: null,
          }));
          
          return complaint;
        } catch (error: any) {
          set({ error: error.message, isSubmitting: false });
          throw error;
        }
      },

      updateComplaintStatus: async (complaintId: string, status: ComplaintStatus, userId: string, notes?: string, images?: string[]) => {
        try {
          set({ isSubmitting: true, error: null });
          const updated = await ComplaintService.updateStatus(complaintId, status, userId, notes, images);
          
          // Update in all lists
          const updateList = (list: Complaint[]) =>
            list.map(c => c.id === complaintId ? { ...c, status, ...(status === 'resolved' ? { resolution_date: new Date().toISOString() } : {}) } : c);
          
          set(state => ({
            currentComplaint: state.currentComplaint?.id === complaintId
              ? { ...state.currentComplaint, status }
              : state.currentComplaint,
            userComplaints: updateList(state.userComplaints),
            assignedComplaints: updateList(state.assignedComplaints),
            complaints: updateList(state.complaints),
            isSubmitting: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isSubmitting: false });
          throw error;
        }
      },

      assignComplaint: async (complaintId: string, employeeId: string, assignedBy: string) => {
        try {
          set({ isSubmitting: true, error: null });
          await ComplaintService.assignComplaint(complaintId, employeeId, assignedBy);
          
          set(state => ({
            complaints: state.complaints.map(c =>
              c.id === complaintId ? { ...c, assigned_to: employeeId, status: 'acknowledged' as ComplaintStatus } : c
            ),
            isSubmitting: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isSubmitting: false });
          throw error;
        }
      },

      addResolution: async (complaintId: string, userId: string, notes: string, images?: string[]) => {
        try {
          set({ isSubmitting: true, error: null });
          await ComplaintService.addResolution(complaintId, userId, notes, images);
          
          const updateList = (list: Complaint[]) =>
            list.map(c => c.id === complaintId
              ? { ...c, status: 'resolved' as ComplaintStatus, resolution_notes: notes, resolution_images: images, resolution_date: new Date().toISOString() }
              : c
            );
          
          set(state => ({
            currentComplaint: state.currentComplaint?.id === complaintId
              ? { ...state.currentComplaint, status: 'resolved', resolution_notes: notes, resolution_images: images }
              : state.currentComplaint,
            assignedComplaints: updateList(state.assignedComplaints),
            complaints: updateList(state.complaints),
            isSubmitting: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isSubmitting: false });
          throw error;
        }
      },

      toggleUpvote: async (complaintId: string, userId: string) => {
        try {
          const upvoted = await ComplaintService.toggleUpvote(complaintId, userId);
          
          const updateList = (list: Complaint[]) =>
            list.map(c => c.id === complaintId
              ? { ...c, upvote_count: c.upvote_count + (upvoted ? 1 : -1), has_upvoted: upvoted }
              : c
            );
          
          set(state => ({
            currentComplaint: state.currentComplaint?.id === complaintId
              ? { ...state.currentComplaint, upvote_count: state.currentComplaint.upvote_count + (upvoted ? 1 : -1), has_upvoted: upvoted }
              : state.currentComplaint,
            publicComplaints: updateList(state.publicComplaints),
            userComplaints: updateList(state.userComplaints),
          }));
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      fetchComments: async (complaintId: string) => {
        try {
          const comments = await ComplaintService.getComments(complaintId);
          set({ comments });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      addComment: async (complaintId: string, userId: string, content: string, images?: string[], isOfficial = false) => {
        try {
          const comment = await ComplaintService.addComment(complaintId, userId, content, images, isOfficial);
          set(state => ({
            comments: [...state.comments, comment],
            currentComplaint: state.currentComplaint
              ? { ...state.currentComplaint, comment_count: state.currentComplaint.comment_count + 1 }
              : null,
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      submitFeedback: async (complaintId: string, userId: string, feedback: FeedbackFormData) => {
        try {
          set({ isSubmitting: true, error: null });
          await ComplaintService.submitFeedback(complaintId, userId, feedback);
          
          set(state => ({
            currentComplaint: state.currentComplaint?.id === complaintId
              ? { ...state.currentComplaint, citizen_rating: feedback.overall_rating }
              : state.currentComplaint,
            isSubmitting: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isSubmitting: false });
          throw error;
        }
      },

      setFilters: (filters: Partial<ComplaintFilters>) => {
        set(state => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      clearFilters: () => {
        set({ filters: {} });
      },

      saveDraft: (draft: Partial<ComplaintFormData>) => {
        set({ draftComplaint: draft });
      },

      clearDraft: () => {
        set({ draftComplaint: null });
      },

      addToPendingQueue: (complaint: ComplaintFormData) => {
        set(state => ({
          pendingComplaints: [...state.pendingComplaints, complaint],
        }));
      },

      removeFromPendingQueue: (index: number) => {
        set(state => ({
          pendingComplaints: state.pendingComplaints.filter((_, i) => i !== index),
        }));
      },

      syncPendingComplaints: async (userId: string) => {
        const { pendingComplaints, createComplaint, removeFromPendingQueue } = get();
        
        for (let i = 0; i < pendingComplaints.length; i++) {
          try {
            await createComplaint(pendingComplaints[i], userId);
            removeFromPendingQueue(i);
          } catch (error) {
            console.error('Failed to sync complaint:', error);
          }
        }
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: 'complaint-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        draftComplaint: state.draftComplaint,
        pendingComplaints: state.pendingComplaints,
        categories: state.categories,
      }),
    }
  )
);

export default useComplaintStore;
