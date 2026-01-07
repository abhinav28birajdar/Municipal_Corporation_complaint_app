import { Stack } from 'expo-router';
import { useSettingsStore } from '@/store/settings-store';

export default function HeadLayout() {
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
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="team-overview" />
      <Stack.Screen name="performance-metrics" />
      <Stack.Screen name="complaint-queue" />
      <Stack.Screen name="assign-task" />
      <Stack.Screen name="escalations" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="team-schedule" />
      <Stack.Screen name="analytics" />
    </Stack>
  );
}
