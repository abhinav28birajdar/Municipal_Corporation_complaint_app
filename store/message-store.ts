import { create } from "zustand";
import { Message } from "@/types";
import { supabase } from "@/lib/supabase";

interface MessageState {
  isLoading: boolean;
  error: string | null;
  fetchComplaintMessages: (complaintId: string) => Promise<Message[]>;
  sendMessage: (messageData: Omit<Message, "id" | "timestamp" | "read">) => Promise<Message>;
}

export const useMessageStore = create<MessageState>((set) => ({
  isLoading: false,
  error: null,

  fetchComplaintMessages: async (complaintId) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('complaint_id', complaintId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      set({ isLoading: false });
      return data as Message[];
    } catch (error: any) {
      console.error("Failed to fetch messages:", error.message);
      set({
        error: error.message || "Failed to fetch messages",
        isLoading: false
      });
      return [];
    }
  },

  sendMessage: async (messageData) => {
    set({ isLoading: true, error: null });
    try {
      const newMessageDataForDb = {
        complaint_id: messageData.complaintId,
        sender_id: messageData.senderId,
        sender_role: messageData.senderRole,
        receiver_id: messageData.receiverId,
        message: messageData.message,
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(newMessageDataForDb)
        .select()
        .single();

      if (error) throw error;

      set({ isLoading: false });
      return data as Message;
    } catch (error: any) {
      console.error("Failed to send message:", error.message);
      set({
        error: error.message || "Failed to send message",
        isLoading: false
      });
      throw error;
    }
  },
}));