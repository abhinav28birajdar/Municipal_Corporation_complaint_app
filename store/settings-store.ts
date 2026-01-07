// Settings Store with Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'en' | 'hi' | 'mr';

interface SettingsState {
  // Theme settings
  themeMode: ThemeMode;
  isDarkMode: boolean;
  
  // Language settings
  language: Language;
  
  // Notification settings
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  
  // Privacy settings
  locationSharingEnabled: boolean;
  analyticsEnabled: boolean;
  
  // Display settings
  fontSize: 'small' | 'medium' | 'large';
  highContrastMode: boolean;
  
  // Offline settings
  offlineModeEnabled: boolean;
  autoSyncEnabled: boolean;
  wifiOnlySync: boolean;
  
  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  toggleDarkMode: () => void;
  setLanguage: (language: Language) => void;
  
  setPushNotifications: (enabled: boolean) => void;
  setEmailNotifications: (enabled: boolean) => void;
  setSmsNotifications: (enabled: boolean) => void;
  
  setLocationSharing: (enabled: boolean) => void;
  setAnalytics: (enabled: boolean) => void;
  
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setHighContrastMode: (enabled: boolean) => void;
  
  setOfflineMode: (enabled: boolean) => void;
  setAutoSync: (enabled: boolean) => void;
  setWifiOnlySync: (enabled: boolean) => void;
  
  resetSettings: () => void;
}

const getSystemTheme = (): boolean => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark';
};

const initialState = {
  themeMode: 'system' as ThemeMode,
  isDarkMode: getSystemTheme(),
  language: 'en' as Language,
  pushNotificationsEnabled: true,
  emailNotificationsEnabled: true,
  smsNotificationsEnabled: false,
  locationSharingEnabled: true,
  analyticsEnabled: true,
  fontSize: 'medium' as const,
  highContrastMode: false,
  offlineModeEnabled: true,
  autoSyncEnabled: true,
  wifiOnlySync: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setThemeMode: (mode: ThemeMode) => {
        let isDarkMode: boolean;
        if (mode === 'system') {
          isDarkMode = getSystemTheme();
        } else {
          isDarkMode = mode === 'dark';
        }
        set({ themeMode: mode, isDarkMode });
      },

      toggleDarkMode: () => {
        const { themeMode, isDarkMode } = get();
        if (themeMode === 'system') {
          set({ themeMode: isDarkMode ? 'light' : 'dark', isDarkMode: !isDarkMode });
        } else {
          set({ themeMode: isDarkMode ? 'light' : 'dark', isDarkMode: !isDarkMode });
        }
      },

      setLanguage: (language: Language) => {
        set({ language });
      },

      setPushNotifications: (enabled: boolean) => {
        set({ pushNotificationsEnabled: enabled });
      },

      setEmailNotifications: (enabled: boolean) => {
        set({ emailNotificationsEnabled: enabled });
      },

      setSmsNotifications: (enabled: boolean) => {
        set({ smsNotificationsEnabled: enabled });
      },

      setLocationSharing: (enabled: boolean) => {
        set({ locationSharingEnabled: enabled });
      },

      setAnalytics: (enabled: boolean) => {
        set({ analyticsEnabled: enabled });
      },

      setFontSize: (size: 'small' | 'medium' | 'large') => {
        set({ fontSize: size });
      },

      setHighContrastMode: (enabled: boolean) => {
        set({ highContrastMode: enabled });
      },

      setOfflineMode: (enabled: boolean) => {
        set({ offlineModeEnabled: enabled });
      },

      setAutoSync: (enabled: boolean) => {
        set({ autoSyncEnabled: enabled });
      },

      setWifiOnlySync: (enabled: boolean) => {
        set({ wifiOnlySync: enabled });
      },

      resetSettings: () => set(initialState),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Listen for system theme changes
Appearance.addChangeListener(({ colorScheme }) => {
  const { themeMode } = useSettingsStore.getState();
  if (themeMode === 'system') {
    useSettingsStore.setState({ isDarkMode: colorScheme === 'dark' });
  }
});

export default useSettingsStore;
