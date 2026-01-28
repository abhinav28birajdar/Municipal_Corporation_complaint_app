import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, SegmentedButtons } from 'react-native-paper';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import NotificationCard from '../../components/cards/NotificationCard';
import EmptyState from '../../components/ui/EmptyState';
import { spacing } from '../../constants/spacing';
import { useRouter } from 'expo-router';

const MOCK_NOTIFS = [
    { id: '1', title: 'New Message', description: 'Alice sent you a message.', time: '10m ago', type: 'complaint', read: false },
    { id: '2', title: 'System Update', description: 'Version 2.0 is live', time: '1h ago', type: 'system', read: true },
    { id: '3', title: 'Community Alert', description: 'New guidelines posted.', time: '2h ago', type: 'community', read: true },
];

export default function Notifications() {
    const theme = useTheme();
    const router = useRouter();
    const [filter, setFilter] = useState('All');

    const filteredNotifs = MOCK_NOTIFS.filter(n => filter === 'All' || (filter === 'Unread' && !n.read));

    return (
        <ScreenWrapper>
            <AppHeader title="Notifications" />

            <View style={{ paddingHorizontal: spacing.m, marginBottom: spacing.m }}>
                <SegmentedButtons
                    value={filter}
                    onValueChange={setFilter}
                    buttons={[
                        { value: 'All', label: 'All' },
                        { value: 'Unread', label: 'Unread' },
                    ]}
                />
            </View>

            <FlatList
                data={filteredNotifs}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: spacing.m }}>
                        <NotificationCard
                            {...item}
                            type={item.type as any}
                            onPress={() => { }}
                        />
                    </View>
                )}
                ListEmptyComponent={<EmptyState message="No notifications" subMessage="You're all caught up!" icon="bell-off-outline" />}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </ScreenWrapper>
    );
}
