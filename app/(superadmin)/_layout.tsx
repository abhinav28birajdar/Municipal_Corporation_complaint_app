import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { Platform } from 'react-native';

export default function SuperAdminLayout() {
    const theme = useTheme();

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#673ab7', // Unique color for super admin
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
                    title: 'City Overview',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "city-variant" : "city-variant-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="departments"
                options={{
                    title: 'Depts',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "domain" : "domain"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="users"
                options={{
                    title: 'Users',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "account-group" : "account-group-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'System',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "cog-sync" : "cog-sync-outline"} size={26} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
