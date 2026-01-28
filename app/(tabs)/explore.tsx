import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, Searchbar, SegmentedButtons } from 'react-native-paper';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import UserCard from '../../components/cards/UserCard';
import { spacing } from '../../constants/spacing';
import { useRouter } from 'expo-router';

const MOCK_USERS = [
    { id: '1', name: 'Alice Johnson', role: 'Designer', verified: true },
    { id: '2', name: 'Bob Smith', role: 'Developer', verified: false },
    { id: '3', name: 'Charlie Brown', role: 'Manager', verified: true },
    { id: '4', name: 'Diana Prince', role: 'Admin', verified: true },
    { id: '5', name: 'Evan Wright', role: 'Developer', verified: false },
];

export default function Explore() {
    const theme = useTheme();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredUsers = MOCK_USERS.filter(user =>
        (filter === 'All' || user.role === filter) &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ScreenWrapper>
            <AppHeader title="Explore" />

            <View style={{ padding: spacing.m }}>
                <Searchbar
                    placeholder="Find people..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />

                <SegmentedButtons
                    value={filter}
                    onValueChange={setFilter}
                    buttons={[
                        { value: 'All', label: 'All' },
                        { value: 'Designer', label: 'Designer' },
                        { value: 'Developer', label: 'Dev' },
                    ]}
                    style={{ marginBottom: spacing.m }}
                />
            </View>

            <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: spacing.m }}>
                        <UserCard
                            name={item.name}
                            role={item.role}
                            verified={item.verified}
                            onPress={() => { }}
                        />
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 80 }}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        marginBottom: spacing.m,
        borderRadius: 12,
    },
});
