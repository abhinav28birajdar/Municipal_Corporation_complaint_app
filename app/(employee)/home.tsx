import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, Card, Avatar, Button as PaperButton, Badge } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function EmployeeDashboard() {
    const theme = useTheme();
    const router = useRouter();

    const TASK_COUNTS = [
        { label: 'Pending', count: 5, color: theme.colors.error },
        { label: 'In Progress', count: 3, color: theme.colors.primary },
        { label: 'Completed', count: 12, color: theme.colors.secondary },
    ];

    return (
        <ScreenWrapper>
            <AppHeader
                title="Employee Portal"
                rightElement={<Badge size={24} style={{ backgroundColor: theme.colors.error }}>3</Badge>}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Welcome Back, Rajesh!</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>You have 5 urgent complaints today.</Text>
                </View>

                <View style={styles.statsGrid}>
                    {TASK_COUNTS.map((task, index) => (
                        <Card key={index} style={styles.statCard}>
                            <Card.Content style={{ alignItems: 'center' }}>
                                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: task.color }}>{task.count}</Text>
                                <Text variant="labelSmall" style={{ marginTop: 4 }}>{task.label}</Text>
                            </Card.Content>
                        </Card>
                    ))}
                </View>

                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Urgent Tasks</Text>
                    <TouchableOpacity onPress={() => router.push('/(employee)/assigned')}>
                        <Text variant="bodySmall" style={{ color: theme.colors.primary }}>View All</Text>
                    </TouchableOpacity>
                </View>

                <Card style={styles.urgentCard} onPress={() => router.push('/(employee)/task/1')}>
                    <Card.Content>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text variant="labelMedium" style={{ color: theme.colors.error, fontWeight: 'bold' }}>HIGH PRIORITY</Text>
                            <Text variant="labelSmall" style={{ color: theme.colors.outline }}>SLA: 2h left</Text>
                        </View>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold', marginVertical: 4 }}>Main Sewer Blockage</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.outline} />
                            <Text variant="bodySmall" style={{ color: theme.colors.outline, marginLeft: 4 }}>Sector 4, Near Gandhi Park</Text>
                        </View>
                        <View style={styles.cardActions}>
                            <PaperButton mode="contained" onPress={() => { }} style={{ flex: 1, marginRight: 8 }}>START WORK</PaperButton>
                            <PaperButton mode="outlined" onPress={() => { }} style={{ flex: 1 }}>MAP VIEW</PaperButton>
                        </View>
                    </Card.Content>
                </Card>

                <View style={[styles.sectionHeader, { marginTop: spacing.l }]}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Attendance Tracking</Text>
                </View>

                <Card style={styles.attendanceCard}>
                    <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.timeIcon}>
                            <MaterialCommunityIcons name="clock-check" size={24} color={theme.colors.secondary} />
                        </View>
                        <View style={{ flex: 1, marginLeft: spacing.m }}>
                            <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>Checked In at 09:15 AM</Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>Location: Ward 12 Office</Text>
                        </View>
                        <PaperButton mode="text" onPress={() => router.push('/(employee)/attendance')}>DETAILS</PaperButton>
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
    header: {
        marginBottom: spacing.l,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.l,
    },
    statCard: {
        width: '31%',
        borderRadius: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    urgentCard: {
        borderLeftWidth: 5,
        borderLeftColor: '#f44336',
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    cardActions: {
        flexDirection: 'row',
        marginTop: spacing.m,
    },
    attendanceCard: {
        borderRadius: 16,
        backgroundColor: '#e8f5e930',
        borderWidth: 1,
        borderColor: '#e8f5e9',
    },
    timeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
    }
});
