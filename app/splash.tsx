import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../constants/spacing';

const { height } = Dimensions.get('window');

export default function SplashScreen() {
    const theme = useTheme();
    const router = useRouter();
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.8);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
        ]).start();

        const timer = setTimeout(() => {
            router.replace('/onboarding/welcome');
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
                <View style={styles.logoCircle}>
                    <MaterialCommunityIcons name="office-building" size={60} color={theme.colors.primary} />
                </View>
                <Text variant="displaySmall" style={styles.title}>Municipal Connect</Text>
                <Text variant="bodyLarge" style={styles.subtitle}>Empowering Citizens, Improving Cities</Text>
            </Animated.View>

            <View style={styles.footer}>
                <Text variant="labelSmall" style={styles.version}>Version 1.0.2</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.m,
        elevation: 10,
    },
    title: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.8)',
        marginTop: spacing.xs,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
    },
    version: {
        color: 'rgba(255,255,255,0.6)',
    }
});
