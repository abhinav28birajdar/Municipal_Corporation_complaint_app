import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, SegmentedButtons, Card, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';
import EmptyState from '../../components/ui/EmptyState';

const MOCK_COMPLAINTS = [
    { id: '1', title: 'Garbage pile-up', category: 'Garbage', status: 'Pending', date: '24 Jan 2026', id_num: '#8842' },
    { id: '2', title: 'Street light broken', category: 'Lights', status: 'In Progress', date: '22 Jan 2026', id_num: '#8821' },
    { id: '3', title: 'Water leakage', category: 'Water', status: 'Resolved', date: '20 Jan 2026', id_num: '#8750' },
];

export default function MyComplaints() {
    const theme = useTheme();
    const router = useRouter();
    const [filter, setFilter] = useState('All');

    const filteredData = filter === 'All'
        ? MOCK_COMPLAINTS
        : MOCK_COMPLAINTS.filter(c => c.status === filter);

    return (
        <ScreenWrapper>
            <AppHeader title="My Complaints" />

            <View style={{ padding: spacing.m }}>
                <SegmentedButtons
                    value={filter}
                    onValueChange={setFilter}
                    buttons={[
                        { value: 'All', label: 'All' },
                        { value: 'Pending', label: 'Pending' },
                        { value: 'Resolved', label: 'Done' },
                    ]}
                    style={styles.segmented}
                />
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Card style={styles.card} onPress={() => router.push(`/(citizen)/complaint/${item.id}`)}>
                        <Card.Content style={styles.cardContent}>
                            <Avatar.Text
                                size={48}
                                label={item.category[0]}
                                style={{ backgroundColor: theme.colors.primaryContainer }}
                                labelStyle={{ color: theme.colors.primary }}
                            />
                            <View style={{ flex: 1, marginLeft: spacing.m }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text variant="labelSmall" style={{ color: theme.colors.outline }}>{item.id_num}</Text>
                                    <Text variant="labelSmall" style={{ color: theme.colors.outline }}>{item.date}</Text>
                                </View>
                                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.title}</Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.outline }}>{item.category}</Text>
                            </View>
                            <View style={[styles.statusBadge, {
                                backgroundColor: item.status === 'Resolved' ? '#e8f5e9' : item.status === 'Pending' ? '#fff9c4' : '#e3f2fd'
                            }]}>
                                <Text variant="labelSmall" style={{
                                    color: item.status === 'Resolved' ? '#4caf50' : item.status === 'Pending' ? '#fbc02d' : '#2196f3'
                                }}>{item.status}</Text>
                            </View>
                        </Card.Content>
                    </Card>
                )}
                ListEmptyComponent={<EmptyState message="No complaints found" subMessage="Try changing your filter or report a new issue." />}
                contentContainerStyle={{ padding: spacing.m }}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    segmented: {
        marginBottom: spacing.m,
    },
    card: {
        marginBottom: spacing.m,
        borderRadius: 16,
        backgroundColor: '#FFF',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: spacing.s,
    }
});
