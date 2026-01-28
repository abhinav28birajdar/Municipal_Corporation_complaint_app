import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, useTheme, Card, Avatar, Divider, List } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <ScreenWrapper>
            <AppHeader title="Admin Console" />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.metricsGrid}>
                    <Card style={[styles.metricCard, { backgroundColor: '#e3f2fd' }]}>
                        <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#2196f3' }}>248</Text>
                        <Text variant="labelMedium" style={{ color: '#2196f3' }}>Total Complaints</Text>
                    </Card>
                    <Card style={[styles.metricCard, { backgroundColor: '#e8f5e9' }]}>
                        <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#4caf50' }}>182</Text>
                        <Text variant="labelMedium" style={{ color: '#4caf50' }}>Resolved</Text>
                    </Card>
                </View>

                <View style={styles.metricsGrid}>
                    <Card style={[styles.metricCard, { backgroundColor: '#fff3e0' }]}>
                        <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#ff9800' }}>42</Text>
                        <Text variant="labelMedium" style={{ color: '#ff9800' }}>In Progress</Text>
                    </Card>
                    <Card style={[styles.metricCard, { backgroundColor: '#ffebee' }]}>
                        <Text variant="displaySmall" style={{ fontWeight: 'bold', color: '#f44336' }}>24</Text>
                        <Text variant="labelMedium" style={{ color: '#f44336' }}>SLA Breached</Text>
                    </Card>
                </View>

                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Department Performance</Text>
                </View>

                <Card style={styles.chartPlaceholder}>
                    <Card.Content>
                        <View style={{ height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12 }}>
                            <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={60} color={theme.colors.outline} />
                            <Text variant="labelSmall" style={{ marginTop: 8 }}>Resolution Trends Chart (Placeholder)</Text>
                        </View>
                    </Card.Content>
                </Card>

                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Active Workforce</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.primary }}>Manage Staff</Text>
                </View>

                <Card style={styles.listCard}>
                    <List.Item
                        title="Rajesh Kumar"
                        description="Sanitation • 12 Assigned"
                        left={(props: any) => <Avatar.Image {...props} size={40} source={{ uri: 'https://i.pravatar.cc/100?img=1' }} />}
                        right={(props: any) => <Text {...props} style={{ alignSelf: 'center', fontWeight: 'bold', color: '#4caf50' }}>92%</Text>}
                    />
                    <Divider />
                    <List.Item
                        title="Suresh Raina"
                        description="Electrical • 8 Assigned"
                        left={(props: any) => <Avatar.Image {...props} size={40} source={{ uri: 'https://i.pravatar.cc/100?img=2' }} />}
                        right={(props: any) => <Text {...props} style={{ alignSelf: 'center', fontWeight: 'bold', color: '#fbc02d' }}>78%</Text>}
                    />
                </Card>

                <View style={[styles.sectionHeader, { marginTop: spacing.l }]}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Recent Alerts</Text>
                </View>

                <Card style={styles.alertCard}>
                    <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="alert-circle" size={24} color={theme.colors.error} />
                        <View style={{ flex: 1, marginLeft: spacing.m }}>
                            <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>Large Crowd reporting water issue</Text>
                            <Text variant="labelSmall" style={{ color: theme.colors.outline }}>Ward 12 • 10 mins ago</Text>
                        </View>
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
    metricsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.m,
    },
    metricCard: {
        width: '48%',
        padding: spacing.m,
        borderRadius: 16,
        elevation: 0,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: spacing.m,
    },
    chartPlaceholder: {
        borderRadius: 16,
        marginBottom: spacing.m,
    },
    listCard: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    alertCard: {
        borderRadius: 12,
        backgroundColor: '#ffebee50',
        borderLeftWidth: 4,
        borderLeftColor: '#f44336',
    }
});
