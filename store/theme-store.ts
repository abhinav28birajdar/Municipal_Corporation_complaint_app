import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, darkColors } from '@/constants/Colors';
import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: typeof colors;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const getSystemTheme = () => {
  return Appearance.getColorScheme() === 'dark';
};

const getIsDark = (mode: ThemeMode) => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode === 'dark';
};

const getColors = (isDark: boolean) => {
  return isDark ? darkColors : colors;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: 'system',
      isDark: getSystemTheme(),
      colors: getColors(getSystemTheme()),
      
      setThemeMode: (mode: ThemeMode) => {
        const isDark = getIsDark(mode);
        set({
          themeMode: mode,
          isDark,
          colors: getColors(isDark),
        });
      },
      
      toggleTheme: () => {
        const { themeMode } = get();
        if (themeMode === 'system') {
          set({
            themeMode: 'light',
            isDark: false,
            colors: getColors(false),
          });
        } else if (themeMode === 'light') {
          set({
            themeMode: 'dark',
            isDark: true,
            colors: getColors(true),
          });
        } else {
          set({
            themeMode: 'system',
            isDark: getSystemTheme(),
            colors: getColors(getSystemTheme()),
          });
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Listen to system theme changes
Appearance.addChangeListener(({ colorScheme }) => {
  const { themeMode, setThemeMode } = useThemeStore.getState();
  if (themeMode === 'system') {
    setThemeMode('system'); // This will trigger the state update
  }
});