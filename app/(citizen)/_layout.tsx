import { Tabs, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { Platform, View } from 'react-native';

export default function CitizenLayout() {
    const theme = useTheme();

    return (
        <Tabs screenOptions={{
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
            }
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "home" : "home-outline"} size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="complaints"
                options={{
                    title: 'My Complaints',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "file-document" : "file-document-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: 'Community',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "account-group" : "account-group-outline"} size={28} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Alerts',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "bell" : "bell-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialCommunityIcons name={focused ? "account" : "account-outline"} size={28} color={color} />
                    ),
                }}
            />

            {/* Hidden Tabs for Detail Screens */}
            <Tabs.Screen name="new-complaint" options={{ href: null, tabBarStyle: { display: 'none' } }} />
            <Tabs.Screen name="voice-complaint" options={{ href: null, tabBarStyle: { display: 'none' } }} />
            <Tabs.Screen name="complaint/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }} />
            <Tabs.Screen name="map-view" options={{ href: null, tabBarStyle: { display: 'none' } }} />
            <Tabs.Screen name="leaderboard" options={{ href: null, tabBarStyle: { display: 'none' } }} />
            <Tabs.Screen name="emergency-sos" options={{ href: null, tabBarStyle: { display: 'none' } }} />
            <Tabs.Screen name="track-complaint" options={{ href: null, tabBarStyle: { display: 'none' } }} />
            <Tabs.Screen name="complaint-success" options={{ href: null, tabBarStyle: { display: 'none' } }} />
            <Tabs.Screen name="complaint/index" options={{ href: null, tabBarStyle: { display: 'none' } }} />
        </Tabs>
    );
}
