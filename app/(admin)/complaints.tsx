import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, SegmentedButtons, Card, Avatar, Searchbar } from 'react-native-paper';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ALL_COMPLAINTS = [
    { id: '1', title: 'Road Pothole', ward: 'Ward 12', status: 'Unassigned', priority: 'Medium' },
    { id: '2', title: 'Water Leakage', ward: 'Ward 7', status: 'Assigned', priority: 'High' },
    { id: '3', title: 'Street Light', ward: 'Ward 4', status: 'Pending', priority: 'Low' },
];

export default function AdminComplaints() {
    const theme = useTheme();
    const [search, setSearch] = useState('');

    return (
        <ScreenWrapper>
            <AppHeader title="All Complaints" />

            <View style={{ padding: spacing.m }}>
                <Searchbar
                    placeholder="Search by ID or Ward"
                    value={search}
                    onChangeText={setSearch}
                    style={{ marginBottom: spacing.m, borderRadius: 12 }}
                />

                <SegmentedButtons
                    value="Unassigned"
                    onValueChange={() => { }}
                    buttons={[
                        { value: 'Unassigned', label: 'Unassigned' },
                        { value: 'Assigned', label: 'Assigned' },
                        { value: 'Resolved', label: 'Done' },
                    ]}
                />
            </View>

            <FlatList
                data={ALL_COMPLAINTS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text variant="labelSmall" style={{ color: theme.colors.outline }}>{item.ward}</Text>
                                <View style={[styles.priorityBadge, { backgroundColor: item.priority === 'High' ? theme.colors.error + '15' : '#e0e0e0' }]}>
                                    <Text variant="labelSmall" style={{ color: item.priority === 'High' ? theme.colors.error : '#757575' }}>{item.priority}</Text>
                                </View>
                            </View>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginVertical: 4 }}>{item.title}</Text>
                            <View style={styles.footer}>
                                <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{item.status}</Text>
                                <TouchableOpacity style={styles.assignBtn}>
                                    <Text style={{ color: '#FFF', fontSize: 12 }}>ASSIGN NOW</Text>
                                </TouchableOpacity>
                            </View>
                        </Card.Content>
                    </Card>
                )}
                contentContainerStyle={{ padding: spacing.m }}
            />
        </ScreenWrapper>
    );
}

import { TouchableOpacity } from 'react-native';

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
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.s,
    },
    assignBtn: {
        backgroundColor: '#2196f3',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    }
});
