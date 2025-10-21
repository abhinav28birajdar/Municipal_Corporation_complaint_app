import { create } from "zustand";
import { Complaint, ComplaintStatus, ComplaintUpdate } from "@/types";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "./auth-store";

interface ComplaintState {
  complaints: Complaint[];
  isLoading: boolean;
  error: string | null;

  fetchComplaints: (filters?: { status?: ComplaintStatus, departmentId?: string }) => Promise<void>;
  fetchUserComplaints: (userId: string) => Promise<Complaint[]>;
  fetchAssignedComplaints: (employeeId: string) => Promise<Complaint[]>;
  getComplaintById: (id: string) => Promise<Complaint | null>;
  createComplaint: (complaintData: Omit<Complaint, "id" | "createdAt" | "updatedAt" | "status" | "resolvedAt" | "citizenId">) => Promise<Complaint>;
  updateComplaintStatus: (complaintId: string, status: ComplaintStatus, notes?: string, photoUrls?: string[]) => Promise<void>;
  assignComplaint: (complaintId: string, employeeId: string, departmentId?: string) => Promise<void>;
  getComplaintUpdates: (complaintId: string) => Promise<ComplaintUpdate[]>;
}

export const useComplaintStore = create<ComplaintState>((set, get) => ({
  complaints: [],
  isLoading: false,
  error: null,

  fetchComplaints: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.status) query = query.eq('status', filters.status);
      if (filters.departmentId) query = query.eq('department_id', filters.departmentId);

      const { data, error } = await query;

      if (error) throw error;
      set({ complaints: data as Complaint[], isLoading: false });
    } catch (error: any) {
      console.error("Failed to fetch complaints:", error.message);
      set({
        error: error.message || "Failed to fetch complaints",
        isLoading: false
      });
    }
  },

  fetchUserComplaints: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('citizen_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ isLoading: false });
      return data as Complaint[];
    } catch (error: any) {
      console.error("Failed to fetch user complaints:", error.message);
      set({
        error: error.message || "Failed to fetch user complaints",
        isLoading: false
      });
      return [];
    }
  },

  fetchAssignedComplaints: async (employeeId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('assigned_employee_id', employeeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ isLoading: false });
      return data as Complaint[];
    } catch (error: any) {
      console.error("Failed to fetch assigned complaints:", error.message);
      set({
        error: error.message || "Failed to fetch assigned complaints",
        isLoading: false
      });
      return [];
    }
  },

  getComplaintById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          set({ isLoading: false, error: null });
          return null;
        }
        throw error;
      }
      set({ isLoading: false });
      return data as Complaint;
    } catch (error: any) {
      console.error("Failed to fetch complaint by ID:", error.message);
      set({
        error: error.message || "Failed to fetch complaint details",
        isLoading: false
      });
      return null;
    }
  },

  createComplaint: async (complaintData) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      const errorMsg = "User must be logged in to create a complaint.";
      set({ error: errorMsg, isLoading: false });
      throw new Error(errorMsg);
    }

    set({ isLoading: true, error: null });
    try {
      const newComplaintDataForDb = {
        citizen_id: userId,
        type: complaintData.type,
        description: complaintData.description,
        photo_urls: complaintData.photoUrls,
        location_lat: complaintData.locationLat,
        location_long: complaintData.locationLong,
        address: complaintData.address,
        priority: complaintData.priority || 'normal',
        status: 'new' as const,
        department_id: complaintData.departmentId,
      };

      const { data, error } = await supabase
        .from('complaints')
        .insert(newComplaintDataForDb)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        complaints: [data as Complaint, ...state.complaints],
        isLoading: false
      }));

      return data as Complaint;
    } catch (error: any) {
      console.error("Failed to create complaint:", error.message);
      set({
        error: error.message || "Failed to create complaint",
        isLoading: false
      });
      throw error;
    }
  },

  updateComplaintStatus: async (complaintId, status, notes, photoUrls) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      const errorMsg = "User must be logged in to update a complaint.";
      set({ error: errorMsg, isLoading: false });
      throw new Error(errorMsg);
    }

    set({ isLoading: true, error: null });
    try {
      const updatePayload: any = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (status === 'completed') {
        updatePayload.resolved_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('complaints')
        .update(updatePayload)
        .eq('id', complaintId);

      if (updateError) throw updateError;

      if (notes || (photoUrls && photoUrls.length > 0)) {
        await supabase
          .from('complaint_updates')
          .insert({
            complaint_id: complaintId,
            status,
            notes: notes || undefined,
            photo_urls: photoUrls,
            updated_by: userId,
          });
      }

      set(state => ({
        complaints: state.complaints.map(c =>
          c.id === complaintId
            ? {
                ...c,
                status,
                updatedAt: updatePayload.updated_at,
                resolvedAt: status === 'completed' ? updatePayload.resolved_at : c.resolvedAt,
              }
            : c
        ),
        isLoading: false
      }));
    } catch (error: any) {
      console.error("Failed to update complaint status:", error.message);
      set({
        error: error.message || "Failed to update complaint status",
        isLoading: false
      });
      throw error;
    }
  },

  assignComplaint: async (complaintId, employeeId, departmentId) => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      const errorMsg = "User must be logged in to assign a complaint.";
      set({ error: errorMsg, isLoading: false });
      throw new Error(errorMsg);
    }

    set({ isLoading: true, error: null });
    try {
      const updatePayload: any = {
        assigned_employee_id: employeeId,
        status: 'assigned' as const,
        updated_at: new Date().toISOString(),
      };
      if (departmentId) {
        updatePayload.department_id = departmentId;
      }

      const { error: updateError } = await supabase
        .from('complaints')
        .update(updatePayload)
        .eq('id', complaintId);

      if (updateError) throw updateError;

      await supabase.from('complaint_updates').insert({
        complaint_id: complaintId,
        status: 'assigned',
        notes: `Assigned to employee ID: ${employeeId}`,
        updated_by: userId,
      });

      set(state => ({
        complaints: state.complaints.map(c =>
          c.id === complaintId
            ? {
                ...c,
                assignedEmployeeId: employeeId,
                departmentId: departmentId || c.departmentId,
                status: 'assigned',
                updatedAt: updatePayload.updated_at,
              }
            : c
        ),
        isLoading: false
      }));
    } catch (error: any) {
      console.error("Failed to assign complaint:", error.message);
      set({
        error: error.message || "Failed to assign complaint",
        isLoading: false
      });
      throw error;
    }
  },

  getComplaintUpdates: async (complaintId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('complaint_updates')
        .select('*')
        .eq('complaint_id', complaintId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      set({ isLoading: false });
      return data as ComplaintUpdate[];
    } catch (error: any) {
      console.error("Failed to fetch complaint updates:", error.message);
      set({
        error: error.message || "Failed to fetch complaint history",
        isLoading: false,
      });
      return [];
    }
  },
}));