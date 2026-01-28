import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, Searchbar } from 'react-native-paper';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import UserCard from '../../components/cards/UserCard';
import { spacing } from '../../constants/spacing';
import { useRouter } from 'expo-router';

const MOCK_CONTACTS = [
    { id: '1', name: 'Alice Johnson', role: 'Designer', verified: true },
    { id: '2', name: 'Bob Smith', role: 'Developer', verified: false },
    { id: '3', name: 'Charlie Brown', role: 'Manager', verified: true },
];

export default function CreateChat() {
    const theme = useTheme();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredContacts = MOCK_CONTACTS.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ScreenWrapper>
            <AppHeader title="New Message" showBack />

            <View style={{ padding: spacing.m }}>
                <Searchbar
                    placeholder="Search contacts..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    autoFocus
                />
            </View>

            <View style={{ paddingHorizontal: spacing.m, paddingBottom: spacing.s }}>
                <Text variant="labelLarge" style={{ color: theme.colors.primary }}>SUGGESTED</Text>
            </View>

            <FlatList
                data={filteredContacts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: spacing.m }}>
                        <UserCard
                            name={item.name}
                            role={item.role}
                            verified={item.verified}
                            onPress={() => router.replace({ pathname: '/chat/chat-room', params: { id: item.id, name: item.name } })}
                        />
                    </View>
                )}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        borderRadius: 12,
    },
});
