import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "../global.css";

import { ErrorBoundary } from "./error-boundary";
import { AppProvider } from "@/context/AppContext";
import { useSettingsStore } from "@/store/settings-store";

export const unstable_settings = {
  initialRouteName: "splash",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <AppProvider>
          <RootLayoutNav />
        </AppProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { isDarkMode } = useSettingsStore();
  
  const headerStyle = {
    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
  };
  
  const contentStyle = {
    backgroundColor: isDarkMode ? '#111827' : '#F9FAFB',
  };

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle,
        headerTintColor: "#3B82F6",
        headerTitleStyle: {
          fontWeight: "600",
        },
        contentStyle,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      {/* Complaint screens */}
      <Stack.Screen name="complaints/[id]" options={{ title: "Complaint Details" }} />
      <Stack.Screen name="complaints/[id]/chat" options={{ title: "Chat" }} />
      <Stack.Screen name="complaints/new" options={{ title: "Report Issue" }} />
      <Stack.Screen name="complaints/wizard" options={{ title: "Report Issue", headerShown: false }} />
      <Stack.Screen name="complaints/tracking" options={{ title: "Track Complaint" }} />
      <Stack.Screen name="complaints/confirmation" options={{ title: "Confirmation", headerShown: false }} />
      
      {/* Events */}
      <Stack.Screen name="events/[id]" options={{ title: "Event Details" }} />
      <Stack.Screen name="events" options={{ title: "All Events" }} />
      
      {/* Citizen screens */}
      <Stack.Screen name="citizen/dashboard" options={{ headerShown: false }} />
      
      {/* Employee screens */}
      <Stack.Screen name="employee/dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="employee/attendance" options={{ title: "Attendance" }} />
      <Stack.Screen name="employee/daily-report" options={{ title: "Daily Report" }} />
      <Stack.Screen name="employee/task-details" options={{ title: "Task Details" }} />
      <Stack.Screen name="employee/route-optimizer" options={{ title: "Route Planner" }} />
      
      {/* Department Head screens */}
      <Stack.Screen name="head" options={{ headerShown: false }} />
      <Stack.Screen name="head/dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="head/team-overview" options={{ title: "Team Overview" }} />
      <Stack.Screen name="head/complaint-queue" options={{ title: "Complaint Queue" }} />
      <Stack.Screen name="head/assign-task" options={{ title: "Assign Task" }} />
      <Stack.Screen name="head/escalations" options={{ title: "Escalations" }} />
      <Stack.Screen name="head/performance-metrics" options={{ title: "Performance" }} />
      <Stack.Screen name="head/team-schedule" options={{ title: "Team Schedule" }} />
      <Stack.Screen name="head/analytics" options={{ title: "Analytics" }} />
      <Stack.Screen name="head/reports" options={{ title: "Reports" }} />
      <Stack.Screen name="department/dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="department/assign-complaints" options={{ title: "Assign Complaints" }} />
      
      {/* Admin screens */}
      <Stack.Screen name="admin/dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="admin/admin-dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="admin/employees" options={{ title: "Manage Employees" }} />
      <Stack.Screen name="admin/employees/[id]" options={{ title: "Employee Details" }} />
      <Stack.Screen name="admin/events/new" options={{ title: "Create Event" }} />
      <Stack.Screen name="admin/user-management" options={{ title: "User Management" }} />
      <Stack.Screen name="admin/department-management" options={{ title: "Department Management" }} />
      <Stack.Screen name="admin/ward-management" options={{ title: "Ward Management" }} />
      <Stack.Screen name="admin/announcements" options={{ title: "Announcements" }} />
      <Stack.Screen name="admin/system-settings" options={{ title: "System Settings" }} />
      <Stack.Screen name="admin/audit-logs" options={{ title: "Audit Logs" }} />
      <Stack.Screen name="admin/reports" options={{ title: "Reports" }} />
      
      {/* Settings screens */}
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="settings/notifications" options={{ title: "Notification Settings" }} />
      <Stack.Screen name="settings/language" options={{ title: "Language" }} />
      <Stack.Screen name="settings/privacy-policy" options={{ title: "Privacy Policy" }} />
      <Stack.Screen name="settings/terms" options={{ title: "Terms of Service" }} />
      <Stack.Screen name="settings/about" options={{ title: "About" }} />
      
      {/* Utility screens */}
      <Stack.Screen name="map-view" options={{ title: "Map View", headerShown: false }} />
      <Stack.Screen name="search" options={{ title: "Search" }} />
      <Stack.Screen name="chat" options={{ title: "Support Chat" }} />
      <Stack.Screen name="camera" options={{ title: "Camera", headerShown: false }} />
      <Stack.Screen name="image-viewer" options={{ headerShown: false }} />
      <Stack.Screen name="location-picker" options={{ title: "Select Location" }} />
      <Stack.Screen name="user-profile" options={{ title: "Profile" }} />
      <Stack.Screen name="profile-setup" options={{ title: "Setup Profile" }} />
      <Stack.Screen name="feedback" options={{ title: "Feedback" }} />
      
      {/* Modal screens */}
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      
      {/* Analytics */}
      <Stack.Screen name="analytics" options={{ title: "Analytics" }} />
      
      {/* Programs */}
      <Stack.Screen name="programs" options={{ title: "Programs" }} />
    </Stack>
  );
}