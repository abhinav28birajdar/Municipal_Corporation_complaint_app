import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';

export default function PrivacyPolicy() {
    const theme = useTheme();

    const sections = [
        {
            title: '1. Information Collection',
            content: 'We collect information you provide directly to us when you create an account, report a complaint, or communicate with us. This includes your name, email, phone number, and location data when you use our location-based services.'
        },
        {
            title: '2. Use of Information',
            content: 'We use the information we collect to facilitate the resolution of civic issues, communicate with you about your complaints, and improve our services. Your location is used solely to identify the area of a reported issue.'
        },
        {
            title: '3. Data Sharing',
            content: 'We share your information with municipal departments and assigned officers only to the extent necessary to resolve your complaints. We do not sell your personal data to third parties.'
        },
        {
            title: '4. Security',
            content: 'We take reasonable measures to protect your personal information from loss, theft, misuse, and unauthorized access. However, no internet transmission is 100% secure.'
        }
    ];

    return (
        <ScreenWrapper>
            <AppHeader title="Privacy Policy" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                <Text variant="headlineSmall" style={styles.header}>Privacy Policy</Text>
                <Text variant="bodySmall" style={styles.lastUpdated}>Last Updated: January 2026</Text>

                <Text variant="bodyMedium" style={styles.intro}>
                    Your privacy is important to us. This policy explains how Municipal Connect collects, uses, and protects your personal data.
                </Text>

                <Divider style={styles.divider} />

                {sections.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <Text variant="titleMedium" style={styles.sectionTitle}>{section.title}</Text>
                        <Text variant="bodyMedium" style={styles.sectionContent}>{section.content}</Text>
                    </View>
                ))}

                <View style={styles.footer}>
                    <Text variant="labelSmall" style={styles.footerText}>
                        If you have any questions about this policy, please contact us at privacy@mnc.gov.in
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
    },
    lastUpdated: {
        color: '#757575',
        marginTop: 4,
        marginBottom: spacing.l,
    },
    intro: {
        lineHeight: 22,
        marginBottom: spacing.l,
    },
    divider: {
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
    },
    footer: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
    },
    footerText: {
        textAlign: 'center',
        color: '#9e9e9e',
    }
});
