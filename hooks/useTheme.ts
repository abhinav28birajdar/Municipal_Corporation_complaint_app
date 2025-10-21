import { useThemeStore } from '@/store/theme-store';

export const useTheme = () => {
  const { colors, isDark, themeMode, setThemeMode, toggleTheme } = useThemeStore();
  
  return {
    colors,
    isDark,
    themeMode,
    setThemeMode,
    toggleTheme,
  };
};

export default useTheme;
