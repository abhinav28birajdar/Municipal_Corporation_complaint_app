import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import ChatHeader from '../../components/headers/ChatHeader';
import { spacing } from '../../constants/spacing';

const MOCK_MESSAGES = [
    { id: '1', text: 'Hey there!', sender: 'them', time: '10:00 AM' },
    { id: '2', text: 'Hi! How are you?', sender: 'me', time: '10:05 AM' },
    { id: '3', text: 'I am good, thanks! What about you?', sender: 'them', time: '10:06 AM' },
    { id: '4', text: 'Doing great. working on the new app.', sender: 'me', time: '10:10 AM' },
];

export default function ChatRoom() {
    const theme = useTheme();
    const { name } = useLocalSearchParams();
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { id: Date.now().toString(), text: newMessage, sender: 'me', time: 'Now' }]);
            setNewMessage('');
        }
    };

    return (
        <ScreenWrapper withKeyboard={false}>
            <ChatHeader name={name as string || 'Chat'} status="Online" />

            <FlatList
                data={[...messages].reverse()}
                inverted
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: spacing.m }}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageBubble,
                        item.sender === 'me'
                            ? { alignSelf: 'flex-end', backgroundColor: theme.colors.primary, borderBottomRightRadius: 2 }
                            : { alignSelf: 'flex-start', backgroundColor: theme.colors.surfaceVariant, borderBottomLeftRadius: 2 }
                    ]}>
                        <Text variant="bodyMedium" style={{ color: item.sender === 'me' ? '#fff' : theme.colors.onSurface }}>{item.text}</Text>
                        <Text variant="labelSmall" style={{ color: item.sender === 'me' ? 'rgba(255,255,255,0.7)' : theme.colors.outline, alignSelf: 'flex-end', marginTop: 4, fontSize: 10 }}>{item.time}</Text>
                    </View>
                )}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                <View style={[styles.inputContainer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.outline }]}>
                    <IconButton icon="plus" size={24} iconColor={theme.colors.primary} />
                    <TextInput
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                        placeholderTextColor={theme.colors.outline}
                        style={[styles.input, { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.onSurface }]}
                    />
                    <TouchableOpacity onPress={handleSend} disabled={!newMessage.trim()}>
                        <IconButton
                            icon="send"
                            size={24}
                            iconColor={newMessage.trim() ? theme.colors.primary : theme.colors.outline}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: spacing.s,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.s,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 8,
        maxHeight: 100,
    }
});
