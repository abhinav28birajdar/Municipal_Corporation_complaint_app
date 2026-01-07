// User Store with Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  UserProfile,
  UserStatistics,
  UserBadge,
  SavedLocation,
  UserProfileFormData,
} from '@/types/complete';
import { UserService } from '@/lib/api';

interface UserState {
  profile: UserProfile | null;
  statistics: UserStatistics | null;
  badges: UserBadge[];
  savedLocations: SavedLocation[];
  
  isLoading: boolean;
  error: string | null;
  
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, updates: UserProfileFormData) => Promise<void>;
  fetchStatistics: (userId: string) => Promise<void>;
  fetchBadges: (userId: string) => Promise<void>;
  
  fetchSavedLocations: (userId: string) => Promise<void>;
  addSavedLocation: (location: Omit<SavedLocation, 'id' | 'created_at'>) => Promise<void>;
  deleteSavedLocation: (locationId: string) => Promise<void>;
  
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  profile: null,
  statistics: null,
  badges: [],
  savedLocations: [],
  isLoading: false,
  error: null,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,

      fetchProfile: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const profile = await UserService.getProfile(userId);
          set({ profile, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      updateProfile: async (userId: string, updates: UserProfileFormData) => {
        try {
          set({ isLoading: true, error: null });
          const updatedProfile = await UserService.updateProfile(userId, updates as any);
          set({ profile: updatedProfile as UserProfile, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      fetchStatistics: async (userId: string) => {
        try {
          const statistics = await UserService.getUserStatistics(userId);
          set({ statistics });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      fetchBadges: async (userId: string) => {
        try {
          const badges = await UserService.getUserBadges(userId);
          set({ badges });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      fetchSavedLocations: async (userId: string) => {
        try {
          const savedLocations = await UserService.getSavedLocations(userId);
          set({ savedLocations });
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      addSavedLocation: async (location: Omit<SavedLocation, 'id' | 'created_at'>) => {
        try {
          const newLocation = await UserService.addSavedLocation(location);
          set(state => ({
            savedLocations: [...state.savedLocations, newLocation],
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      deleteSavedLocation: async (locationId: string) => {
        try {
          await UserService.deleteSavedLocation(locationId);
          set(state => ({
            savedLocations: state.savedLocations.filter(l => l.id !== locationId),
          }));
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      reset: () => set(initialState),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profile: state.profile,
        savedLocations: state.savedLocations,
      }),
    }
  )
);

export default useUserStore;
