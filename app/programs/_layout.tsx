import { Stack } from 'expo-router';
import { useSettingsStore } from '@/store/settings-store';

export default function ProgramsLayout() {
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
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
