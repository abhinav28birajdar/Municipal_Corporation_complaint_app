import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Notification, UserRole } from "@/types";
import { supabase } from "@/lib/supabase";

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  lastFetchedUserId: string | null;

  fetchUserNotifications: (userId: string, userRole: UserRole) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  addNotification: (notificationData: Omit<Notification, "id" | "timestamp" | "read">) => Promise<Notification | null>;
  clearNotifications: (userId: string) => Promise<void>;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      isLoading: false,
      error: null,
      lastFetchedUserId: null,

      fetchUserNotifications: async (userId, userRole) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('timestamp', { ascending: false });

          if (error) throw error;
          set({ notifications: data as Notification[], isLoading: false, lastFetchedUserId: userId });
        } catch (error: any) {
          console.error("Failed to fetch notifications:", error.message);
          set({
            error: error.message || "Failed to fetch notifications",
            isLoading: false,
            lastFetchedUserId: null,
            notifications: [],
          });
        }
      },

      markAsRead: async (notificationId) => {
        const originalNotifications = get().notifications;
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        }));

        try {
          const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);

          if (error) {
            set({ notifications: originalNotifications, error: error.message || "Failed to mark notification as read" });
            throw error;
          }
          set({ error: null });
        } catch (error: any) {
          console.error("Failed to mark notification as read:", error.message);
        }
      },

      markAllAsRead: async (userId) => {
        const originalNotifications = get().notifications;
        set(state => ({
          notifications: state.notifications.map(n =>
            n.userId === userId ? { ...n, read: true } : n
          ),
        }));

        try {
          const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false);

          if (error) {
            set({ notifications: originalNotifications, error: error.message || "Failed to mark all notifications as read" });
            throw error;
          }
          set({ error: null });
        } catch (error: any) {
          console.error("Failed to mark all notifications as read:", error.message);
        }
      },

      addNotification: async (notificationData) => {
        try {
          const newNotificationForDb = {
            user_id: notificationData.userId,
            user_role: notificationData.userRole,
            title: notificationData.title,
            message: notificationData.message,
          };

          const { data, error } = await supabase
            .from('notifications')
            .insert(newNotificationForDb)
            .select()
            .single();

          if (error) throw error;

          if (get().lastFetchedUserId === notificationData.userId) {
            set(state => ({
              notifications: [data as Notification, ...state.notifications],
            }));
          }
          return data as Notification;
        } catch (error: any) {
          console.error("Failed to add notification:", error.message);
          return null;
        }
      },

      clearNotifications: async (userId) => {
        const originalNotifications = get().notifications;
        set(state => ({
          notifications: state.notifications.filter(n => n.userId !== userId)
        }));

        try {
          const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('user_id', userId);

          if (error) {
            set({ notifications: originalNotifications, error: error.message || "Failed to clear notifications" });
            throw error;
          }
          set({ error: null });
        } catch (error: any) {
          console.error("Failed to clear notifications:", error.message);
        }
      },

      getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length;
      }
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        lastFetchedUserId: state.lastFetchedUserId,
      }),
    }
  )
);