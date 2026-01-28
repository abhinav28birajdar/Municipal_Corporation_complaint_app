import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { colors } from './colors';

const fontConfig = {
    displayLarge: { fontFamily: 'Inter_700Bold', fontSize: 57, letterSpacing: 0 },
    displayMedium: { fontFamily: 'Inter_700Bold', fontSize: 45, letterSpacing: 0 },
    displaySmall: { fontFamily: 'Inter_700Bold', fontSize: 36, letterSpacing: 0 },
    headlineLarge: { fontFamily: 'Inter_700Bold', fontSize: 32, letterSpacing: 0 },
    headlineMedium: { fontFamily: 'Inter_700Bold', fontSize: 28, letterSpacing: 0 },
    headlineSmall: { fontFamily: 'Inter_700Bold', fontSize: 24, letterSpacing: 0 },
    titleLarge: { fontFamily: 'Inter_700Bold', fontSize: 22, letterSpacing: 0 },
    titleMedium: { fontFamily: 'Inter_700Bold', fontSize: 16, letterSpacing: 0.15 },
    titleSmall: { fontFamily: 'Inter_700Bold', fontSize: 14, letterSpacing: 0.1 },
    labelLarge: { fontFamily: 'Inter_700Bold', fontSize: 14, letterSpacing: 0.1 },
    labelMedium: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 0.5 },
    labelSmall: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 0.5 },
    bodyLarge: { fontFamily: 'Inter_400Regular', fontSize: 16, letterSpacing: 0.15 },
    bodyMedium: { fontFamily: 'Inter_400Regular', fontSize: 14, letterSpacing: 0.25 },
    bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 12, letterSpacing: 0.4 },
};

export const LightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: colors.light.primary,
        secondary: colors.light.secondary,
        tertiary: colors.light.accent,
        error: colors.light.error,
        background: colors.light.background,
        surface: colors.light.surface,
        onPrimary: '#FFFFFF',
        onSecondary: '#FFFFFF',
        onBackground: colors.light.text,
        onSurface: colors.light.text,
    },
    fonts: fontConfig,
};

export const DarkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: colors.dark.primary,
        secondary: colors.dark.secondary,
        tertiary: colors.dark.accent,
        error: colors.dark.error,
        background: colors.dark.background,
        surface: colors.dark.surface,
        onPrimary: '#000000',
        onSecondary: '#000000',
        onBackground: colors.dark.text,
        onSurface: colors.dark.text,
    },
    fonts: fontConfig,
};
