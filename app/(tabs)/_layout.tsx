import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
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
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "home" : "home-outline"} color={color} size={28} />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    tabBarLabel: 'Explore',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "compass" : "compass-outline"} color={color} size={28} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    tabBarLabel: 'Chat',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "chat-processing" : "chat-processing-outline"} color={color} size={28} />
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    tabBarLabel: 'Alerts',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "bell" : "bell-outline"} color={color} size={28} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "account" : "account-outline"} color={color} size={28} />
                    ),
                }}
            />
        </Tabs>
    );
}
