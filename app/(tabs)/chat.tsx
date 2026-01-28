import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, FAB } from 'react-native-paper';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import ChatCard from '../../components/cards/ChatCard';
import EmptyState from '../../components/ui/EmptyState';
import { spacing } from '../../constants/spacing';
import { useRouter } from 'expo-router';

const MOCK_CHATS = [
    { id: '1', name: 'Alice Johnson', lastMessage: 'Hey, are we still on for tomorrow?', time: '10:30 AM', unreadCount: 2 },
    { id: '2', name: 'Bob Smith', lastMessage: 'Can you send the files?', time: 'Yesterday', unreadCount: 0 },
    { id: '3', name: 'Project Team', lastMessage: 'Meeting link: zoom.us/j/123...', time: 'Yesterday', unreadCount: 5 },
];

export default function ChatList() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <ScreenWrapper>
            <AppHeader title="Messages" />

            <FlatList
                data={MOCK_CHATS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: spacing.m }}>
                        <ChatCard
                            name={item.name}
                            lastMessage={item.lastMessage}
                            time={item.time}
                            unreadCount={item.unreadCount}
                            onPress={() => router.push({ pathname: '/chat/chat-room', params: { id: item.id, name: item.name } })}
                        />
                    </View>
                )}
                ListEmptyComponent={<EmptyState message="No messages yet" subMessage="Start a conversation with someone!" icon="chat-outline" />}
                contentContainerStyle={{ paddingVertical: spacing.m }}
            />

            <FAB
                icon="message-plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color="white"
                onPress={() => router.push('/chat/create-chat')}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 30,
    },
});
