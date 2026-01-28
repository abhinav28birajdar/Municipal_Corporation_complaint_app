import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';

export default function TermsOfService() {
    const theme = useTheme();

    return (
        <ScreenWrapper>
            <AppHeader title="Terms of Service" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                <Text variant="headlineSmall" style={styles.header}>Terms & Conditions</Text>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                    <Text variant="bodyMedium" style={styles.sectionContent}>
                        By downloading, installing, or using the Municipal Connect application, you agree to be bound by these Terms of Service. If you do not agree, please do not use the application.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>2. User Conduct</Text>
                    <Text variant="bodyMedium" style={styles.sectionContent}>
                        You agree to provide accurate information when reporting complaints and not to submit false, malicious, or spam reports. Misuse of the SOS feature is strictly prohibited and may result in account suspension.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>3. Account Responsibility</Text>
                    <Text variant="bodyMedium" style={styles.sectionContent}>
                        You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>4. Limitations of Liability</Text>
                    <Text variant="bodyMedium" style={styles.sectionContent}>
                        The Municipal Corporation handles complaints on a priority basis. While we strive for timely resolution, submission of a complaint does not guarantee immediate action or specific outcomes.
                    </Text>
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.l,
    },
    header: {
        fontWeight: 'bold',
        marginBottom: spacing.l,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    sectionContent: {
        lineHeight: 22,
        color: '#424242',
    }
});
