import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme, TextInput, Avatar, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TrackComplaint() {
    const theme = useTheme();
    const router = useRouter();
    const [searchId, setSearchId] = useState('');

    return (
        <ScreenWrapper>
            <AppHeader title="Track Complaint" showBack />

            <View style={styles.container}>
                <View style={styles.header}>
                    <Avatar.Icon size={80} icon="magnify-scan" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.primary} />
                    <Text variant="headlineSmall" style={styles.title}>Track Status</Text>
                    <Text variant="bodyMedium" style={styles.subtitle}>Enter your complaint ID or scan the QR code to track the live status.</Text>
                </View>

                <View style={styles.searchSection}>
                    <TextInput
                        label="Complaint ID"
                        placeholder="E.g. MC-2026-8842"
                        mode="outlined"
                        value={searchId}
                        onChangeText={setSearchId}
                        style={styles.input}
                        right={<TextInput.Icon icon="qrcode-scan" onPress={() => { }} />}
                    />
                    <Button mode="contained" onPress={() => router.push(`/(citizen)/complaint/${searchId || '1'}`)} style={styles.button}>
                        Track Now
                    </Button>
                </View>

                <View style={styles.recentSection}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: spacing.m }}>Recently Tracked</Text>
                    <Card style={styles.recentCard}>
                        <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="history" size={24} color={theme.colors.outline} />
                            <View style={{ flex: 1, marginLeft: spacing.m }}>
                                <Text variant="titleSmall">#MC-2026-8821</Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.primary }}>In Progress</Text>
                            </View>
                            <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.outline} />
                        </Card.Content>
                    </Card>
                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.l,
    },
    header: {
        alignItems: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.xl,
    },
    title: {
        fontWeight: 'bold',
        marginTop: spacing.m,
    },
    subtitle: {
        textAlign: 'center',
        color: '#757575',
        marginTop: 8,
    },
    searchSection: {
        width: '100%',
        marginBottom: spacing.xl,
    },
    input: {
        marginBottom: spacing.m,
        backgroundColor: '#FFF',
    },
    button: {
        marginTop: spacing.s,
    },
    recentSection: {
        width: '100%',
    },
    recentCard: {
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
    }
});
