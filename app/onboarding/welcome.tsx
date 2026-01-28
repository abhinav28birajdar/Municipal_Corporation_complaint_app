import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[theme.colors.primary, '#1976D2']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.content}>
                <View style={styles.imagePlaceholder}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1753939582590-ca05f0511033?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text variant="displaySmall" style={styles.title}>Welcome to Municipal Connect</Text>
                    <Text variant="bodyLarge" style={styles.subtitle}>
                        Reporting civic issues is now easier than ever. Together, let's build a better city.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Button mode="contained" onPress={() => router.push('/onboarding/features')} style={styles.button} buttonColor="#FFF" textColor={theme.colors.primary}>
                        Learn More
                    </Button>
                    <TouchableOpacity onPress={() => router.push('/onboarding/language-selection')} style={styles.skipBtn}>
                        <Text style={styles.skipText}>Skip Onboarding</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholder: {
        width: width * 0.8,
        height: height * 0.35,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 30,
        marginBottom: spacing.xl,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        color: '#FFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginTop: spacing.m,
        lineHeight: 24,
    },
    footer: {
        width: '100%',
        marginTop: spacing.xl,
        alignItems: 'center',
    },
    button: {
        width: '100%',
        height: 56,
        justifyContent: 'center',
        borderRadius: 16,
    },
    skipBtn: {
        marginTop: spacing.l,
    },
    skipText: {
        color: '#FFF',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    }
});
