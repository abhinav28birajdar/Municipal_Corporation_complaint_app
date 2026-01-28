import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

export default function ComplaintSuccess() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Avatar.Icon size={100} icon="check-bold" style={{ backgroundColor: theme.colors.secondary }} color="#FFF" />
                </View>

                <Text variant="headlineSmall" style={styles.title}>Complaint Submitted!</Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                    Your complaint has been successfully registered. You can track its progress in the "My Complaints" section.
                </Text>

                <View style={styles.idCard}>
                    <Text variant="labelLarge" style={{ color: theme.colors.outline }}>COMPLAINT ID</Text>
                    <Text variant="headlineMedium" style={styles.idText}>#MC-2026-8842</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text variant="bodyMedium">Expected Resolution:</Text>
                    <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>48 Hours</Text>
                </View>

                <Button mode="contained" onPress={() => router.replace('/(citizen)/complaints')} style={styles.button}>
                    Track Progress
                </Button>

                <Button mode="outlined" onPress={() => router.replace('/(citizen)/home')} style={styles.button}>
                    Back to Home
                </Button>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        padding: spacing.l,
    },
    iconContainer: {
        marginBottom: spacing.xl,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    subtitle: {
        textAlign: 'center',
        color: '#757575',
        lineHeight: 22,
        marginBottom: spacing.xl,
    },
    idCard: {
        width: '100%',
        backgroundColor: '#f5f5f5',
        padding: spacing.l,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    idText: {
        fontWeight: 'bold',
        letterSpacing: 1,
        marginTop: 4,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: spacing.xl,
    },
    button: {
        width: '100%',
        marginBottom: spacing.m,
    }
});
