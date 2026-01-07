import { Stack } from 'expo-router';
import { useSettingsStore } from '@/store/settings-store';

export default function SettingsLayout() {
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDark ? '#111827' : '#f9fafb',
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="account" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="linked-accounts" />
      <Stack.Screen name="sessions" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="language" />
      <Stack.Screen name="about" />
      <Stack.Screen name="privacy-policy" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="delete-account" />
    </Stack>
  );
}
