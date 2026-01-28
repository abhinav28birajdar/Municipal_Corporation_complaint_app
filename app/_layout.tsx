import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { LightTheme, DarkTheme } from '../constants/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    useFonts,
    Inter_400Regular,
    Inter_700Bold,
} from '@expo-google-fonts/inter';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;

    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <PaperProvider theme={theme}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: 'slide_from_right',
                    }}
                >
                    <Stack.Screen name="splash" options={{ headerShown: false }} />
                    <Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} />
                    <Stack.Screen name="onboarding/language-selection" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="(citizen)" options={{ headerShown: false }} />
                    <Stack.Screen name="(employee)" options={{ headerShown: false }} />
                    <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                    <Stack.Screen name="(superadmin)" options={{ headerShown: false }} />
                    <Stack.Screen name="settings" options={{ presentation: 'card' }} />
                </Stack>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            </PaperProvider>
        </GestureHandlerRootView>
    );
}
