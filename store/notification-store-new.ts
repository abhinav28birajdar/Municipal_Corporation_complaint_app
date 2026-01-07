// Enhanced Notification Store with Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification, EmergencyAlert, Announcement, NotificationType } from '@/types/complete';
import { NotificationService, AlertService, AnnouncementService } from '@/lib/api';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  emergencyAlerts: EmergencyAlert[];
  announcements: Announcement[];
  
  isLoading: boolean;
  error: string | null;
  
  // Notification actions
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  
  // Alert actions
  fetchEmergencyAlerts: () => Promise<void>;
  acknowledgeAlert: (alertId: string, userId: string) => Promise<void>;
  
  // Announcement actions
  fetchAnnouncements: () => Promise<void>;
  
  // Real-time
  subscribeToNotifications: (userId: string) => void;
  unsubscribeFromNotifications: () => void;
  
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  notifications: [],
  unreadCount: 0,
  emergencyAlerts: [],
  announcements: [],
  isLoading: false,
  error: null,
};

let notificationSubscription: any = null;

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchNotifications: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await NotificationService.getUserNotifications(userId);
          const unreadCount = response.data.filter((n: Notification) => !n.read_at).length;
          set({ 
            notifications: response.data, 
            unreadCount,
            isLoading: false 
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      markAsRead: async (notificationId: string) => {
        try {
          await NotificationService.markAsRead(notificationId);
          set(state => ({
            notifications: state.notifications.map(n =>
              n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }));
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      markAllAsRead: async (userId: string) => {
        try {
          await NotificationService.markAllAsRead(userId);
          set(state => ({
            notifications: state.notifications.map(n => ({
              ...n,
              read_at: n.read_at || new Date().toISOString(),
            })),
            unreadCount: 0,
          }));
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      deleteNotification: async (notificationId: string) => {
        try {
          await NotificationService.delete(notificationId);
          set(state => ({
            notifications: state.notifications.filter(n => n.id !== notificationId),
            unreadCount: state.notifications.find(n => n.id === notificationId && !n.read_at)
              ? state.unreadCount - 1
              : state.unreadCount,
          }));
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      fetchEmergencyAlerts: async () => {
        try {
          const alerts = await AlertService.getActiveAlerts();
          set({ emergencyAlerts: alerts });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      acknowledgeAlert: async (alertId: string, userId: string) => {
        try {
          await AlertService.acknowledge(alertId, userId);
          set(state => ({
            emergencyAlerts: state.emergencyAlerts.map(a =>
              a.id === alertId ? { ...a, acknowledged: true } : a
            ),
          }));
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      fetchAnnouncements: async () => {
        try {
          const announcements = await AnnouncementService.getPublished();
          set({ announcements });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      subscribeToNotifications: (userId: string) => {
        if (notificationSubscription) {
          notificationSubscription.unsubscribe();
        }
        
        notificationSubscription = NotificationService.subscribeToNotifications(
          userId,
          (payload: any) => {
            const newNotification = payload.new as Notification;
            set(state => ({
              notifications: [newNotification, ...state.notifications],
              unreadCount: state.unreadCount + 1,
            }));
          }
        );
      },

      unsubscribeFromNotifications: () => {
        if (notificationSubscription) {
          notificationSubscription.unsubscribe();
          notificationSubscription = null;
        }
      },

      clearError: () => set({ error: null }),
      reset: () => {
        if (notificationSubscription) {
          notificationSubscription.unsubscribe();
          notificationSubscription = null;
        }
        set(initialState);
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        unreadCount: state.unreadCount,
      }),
    }
  )
);

export default useNotificationStore;
