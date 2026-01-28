import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, Card, Avatar, Divider, List, Badge } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SuperAdminDashboard() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <ScreenWrapper>
            <AppHeader title="City Control Center" />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.headerCard}>
                    <View>
                        <Text variant="headlineSmall" style={{ color: '#FFF', fontWeight: 'bold' }}>Greater Mumbai</Text>
                        <Text variant="bodyMedium" style={{ color: 'rgba(255,255,255,0.8)' }}>Predictive Analytics: High Rain Alert 🌧️</Text>
                    </View>
                    <Avatar.Icon size={48} icon="shield-crown" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} color="#FFF" />
                </View>

                <View style={styles.metricsGrid}>
                    <Card style={[styles.statItem, { borderBottomColor: theme.colors.primary, borderBottomWidth: 4 }]}>
                        <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>14</Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>Departments</Text>
                    </Card>
                    <Card style={[styles.statItem, { borderBottomColor: theme.colors.secondary, borderBottomWidth: 4 }]}>
                        <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>1.2k</Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>Staff Active</Text>
                    </Card>
                    <Card style={[styles.statItem, { borderBottomColor: theme.colors.tertiary, borderBottomWidth: 4 }]}>
                        <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>8.5k</Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>Citizens</Text>
                    </Card>
                </View>

                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Department Efficiency</Text>
                </View>

                <Card style={styles.deptCard}>
                    <List.Item
                        title="Sanitation"
                        description="94% Efficiency • 42 Pending"
                        left={props => <List.Icon {...props} icon="delete-sweep" color="#4caf50" />}
                        right={props => <MaterialCommunityIcons {...props} name="trending-up" size={20} color="#4caf50" style={{ alignSelf: 'center' }} />}
                    />
                    <Divider />
                    <List.Item
                        title="Water Dept"
                        description="72% Efficiency • 156 Pending"
                        left={props => <List.Icon {...props} icon="water" color="#2196f3" />}
                        right={props => <MaterialCommunityIcons {...props} name="trending-down" size={20} color="#f44336" style={{ alignSelf: 'center' }} />}
                    />
                    <Divider />
                    <List.Item
                        title="Roads & Traffic"
                        description="81% Efficiency • 89 Pending"
                        left={props => <List.Icon {...props} icon="traffic-light" color="#ffa726" />}
                        right={props => <MaterialCommunityIcons {...props} name="trending-neutral" size={20} color="#9e9e9e" style={{ alignSelf: 'center' }} />}
                    />
                </Card>

                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Real-time Heatmap Notifications</Text>
                    <Badge style={{ backgroundColor: theme.colors.error }}>NEW</Badge>
                </View>

                <Card style={styles.heatmapPlaceholder}>
                    <Card.Content style={{ alignItems: 'center', paddingVertical: 40 }}>
                        <MaterialCommunityIcons name="google-maps" size={60} color={theme.colors.outline} />
                        <Text variant="titleSmall" style={{ marginTop: 12 }}>Active Problem Clusters: Ward 7, Ward 12</Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>Tap to open full city map</Text>
                    </Card.Content>
                </Card>

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.m,
    },
    headerCard: {
        backgroundColor: '#673ab7',
        padding: spacing.l,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    metricsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.l,
    },
    statItem: {
        width: '31%',
        padding: spacing.m,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    deptCard: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: spacing.l,
    },
    heatmapPlaceholder: {
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#ccc',
    }
});
