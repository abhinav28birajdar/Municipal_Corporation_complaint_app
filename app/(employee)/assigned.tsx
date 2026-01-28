import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, SegmentedButtons, Card, Avatar, Button as PaperButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ASSIGNED_MOCK = [
    { id: '1', title: 'Main Sewer Blockage', priority: 'High', status: 'Pending', sla: '2h left', loc: 'Sector 4' },
    { id: '2', title: 'Water Leakage', priority: 'Medium', status: 'In Progress', sla: '5h left', loc: 'Ward 12' },
    { id: '3', title: 'Street Light', priority: 'Low', status: 'Completed', sla: 'Done', loc: 'Sector 2' },
];

export default function AssignedComplaints() {
    const theme = useTheme();
    const router = useRouter();
    const [filter, setFilter] = useState('Pending');

    return (
        <ScreenWrapper>
            <AppHeader title="Assigned Work" />

            <View style={{ padding: spacing.m }}>
                <SegmentedButtons
                    value={filter}
                    onValueChange={setFilter}
                    buttons={[
                        { value: 'Pending', label: 'Todo' },
                        { value: 'In Progress', label: 'In Progress' },
                        { value: 'Completed', label: 'Done' },
                    ]}
                />
            </View>

            <FlatList
                data={ASSIGNED_MOCK.filter(a => a.status === filter)}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Card style={styles.card} onPress={() => router.push(`/(employee)/task/${item.id}`)}>
                        <Card.Content>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={[styles.priorityBadge, { backgroundColor: item.priority === 'High' ? theme.colors.error + '15' : '#e0e0e0' }]}>
                                    <Text variant="labelSmall" style={{ color: item.priority === 'High' ? theme.colors.error : '#757575', fontWeight: 'bold' }}>{item.priority.toUpperCase()}</Text>
                                </View>
                                <Text variant="labelSmall" style={{ color: theme.colors.outline }}>SLA: {item.sla}</Text>
                            </View>

                            <Text variant="titleMedium" style={styles.title}>{item.title}</Text>

                            <View style={styles.locRow}>
                                <MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.outline} />
                                <Text variant="bodySmall" style={{ marginLeft: 4, color: theme.colors.outline }}>{item.loc}</Text>
                            </View>

                            <View style={styles.actions}>
                                {item.status === 'Pending' && <PaperButton mode="contained" onPress={() => { }}>ACCEPT</PaperButton>}
                                {item.status === 'In Progress' && <PaperButton mode="contained" buttonColor={theme.colors.secondary} onPress={() => { }}>MARK DONE</PaperButton>}
                                <PaperButton mode="text">DETAILS</PaperButton>
                            </View>
                        </Card.Content>
                    </Card>
                )}
                contentContainerStyle={{ padding: spacing.m }}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing.m,
        borderRadius: 16,
        backgroundColor: '#FFF',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    title: {
        fontWeight: 'bold',
        marginVertical: 8,
    },
    locRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: spacing.m,
    }
});
