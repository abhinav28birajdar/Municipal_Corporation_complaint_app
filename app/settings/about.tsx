import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, useTheme, Avatar } from 'react-native-paper';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AboutUs() {
    const theme = useTheme();

    return (
        <ScreenWrapper>
            <AppHeader title="About Us" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.logoSection}>
                    <View style={[styles.logoCircle, { backgroundColor: theme.colors.primary }]}>
                        <MaterialCommunityIcons name="office-building" size={50} color="#FFF" />
                    </View>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginTop: spacing.m }}>Municipal Connect</Text>
                    <Text variant="labelMedium" style={{ color: theme.colors.outline }}>v1.0.2 Stable</Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Our Mission</Text>
                    <Text variant="bodyMedium" style={styles.bodyText}>
                        Municipal Connect is a digital initiative aimed at bridging the gap between citizens and municipal authorities. We believe in transparent, efficient, and technology-driven civic governance.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Key Features</Text>
                    <View style={styles.featureRow}>
                        <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.secondary} />
                        <Text style={styles.featureText}>Real-time complaint tracking</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.secondary} />
                        <Text style={styles.featureText}>AI-powered issue classification</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.secondary} />
                        <Text style={styles.featureText}>Community-driven problem heatmap</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Contact</Text>
                    <Text variant="bodyMedium">Developed by Digital India Municipal Division.</Text>
                    <Text variant="bodySmall" style={{ marginTop: 4, color: theme.colors.primary }}>digital@mnc.gov.in</Text>
                </View>

                <View style={styles.footer}>
                    <Text variant="labelSmall" style={{ color: '#9e9e9e' }}>© 2026 Municipal Corporation. All rights reserved.</Text>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.l,
    },
    logoSection: {
        alignItems: 'center',
        marginVertical: spacing.xl,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    bodyText: {
        lineHeight: 22,
        color: '#424242',
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        marginLeft: spacing.s,
        color: '#424242',
    },
    footer: {
        paddingTop: spacing.xl,
        alignItems: 'center',
        paddingBottom: 40,
    }
});
