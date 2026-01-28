import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { Platform } from 'react-native';

export default function EmployeeLayout() {
    const theme = useTheme();

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.colors.secondary,
            tabBarInactiveTintColor: theme.colors.outline,
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
                backgroundColor: theme.colors.surface,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                height: Platform.OS === 'ios' ? 85 : 70,
                paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                paddingTop: 10,
                position: 'absolute',
                borderTopWidth: 0,
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
                fontFamily: 'Inter_700Bold',
            }
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "view-dashboard" : "view-dashboard-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="assigned"
                options={{
                    title: 'Assigned',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "briefcase-check" : "briefcase-check-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="attendance"
                options={{
                    title: 'Attendance',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "calendar-check" : "calendar-check-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "account-tie" : "account-tie-outline"} size={26} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
