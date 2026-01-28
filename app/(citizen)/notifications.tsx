import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, Card, Avatar, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import EmptyState from '../../components/ui/EmptyState';

const MOCK_NOTIFICATIONS = [
    { id: '1', title: 'Complaint Assigned', message: 'Your complaint #8842 has been assigned to Rajesh Kumar.', type: 'update', date: '10 mins ago', read: false },
    { id: '2', title: 'Water Supply Alert', message: 'Main line repair in Ward 12. Supply will be cut from 2PM to 6PM.', type: 'alert', date: '1 hour ago', read: false },
    { id: '3', title: 'System Update', message: 'New version 2.1 is now available with improved map features.', type: 'system', date: 'Yesterday', read: true },
    { id: '4', title: 'Complaint Resolved', message: 'Complaint #8750 has been marked as resolved. Rate our service!', type: 'success', date: '2 days ago', read: true },
];

export default function Notifications() {
    const theme = useTheme();
    const router = useRouter();
    const [filter, setFilter] = useState('All');

    const filteredData = filter === 'All'
        ? MOCK_NOTIFICATIONS
        : MOCK_NOTIFICATIONS.filter(n => filter === 'Unread' ? !n.read : true);

    const getIcon = (type: string) => {
        switch (type) {
            case 'update': return 'file-document-edit';
            case 'alert': return 'alert-decagram';
            case 'success': return 'check-circle';
            default: return 'bell-ring';
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'update': return theme.colors.primary;
            case 'alert': return theme.colors.error;
            case 'success': return theme.colors.secondary;
            default: return theme.colors.outline;
        }
    };

    return (
        <ScreenWrapper>
            <AppHeader title="Notifications" />

            <View style={{ padding: spacing.m }}>
                <SegmentedButtons
                    value={filter}
                    onValueChange={setFilter}
                    buttons={[
                        { value: 'All', label: 'All' },
                        { value: 'Unread', label: 'Unread' },
                    ]}
                    style={styles.segmented}
                />
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={[styles.notificationItem, { backgroundColor: item.read ? '#FFF' : '#e3f2fd20' }]}>
                        <Avatar.Icon
                            size={40}
                            icon={getIcon(item.type)}
                            style={{ backgroundColor: getColor(item.type) + '15' }}
                            color={getColor(item.type)}
                        />
                        <View style={{ flex: 1, marginLeft: spacing.m }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text variant="titleSmall" style={{ fontWeight: item.read ? 'normal' : 'bold' }}>{item.title}</Text>
                                {!item.read && <View style={styles.unreadDot} />}
                            </View>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurface, marginTop: 2 }}>{item.message}</Text>
                            <Text variant="labelSmall" style={{ color: theme.colors.outline, marginTop: 4 }}>{item.date}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<EmptyState message="No notifications" subMessage="We'll notify you when something important happens." />}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    segmented: {
        marginBottom: spacing.s,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2196f3',
    }
});
