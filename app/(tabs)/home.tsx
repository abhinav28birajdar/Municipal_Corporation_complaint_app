import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, useTheme, Card, Avatar, FAB, Searchbar, Chip } from 'react-native-paper';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import NotificationCard from '../../components/cards/NotificationCard';
import UserCard from '../../components/cards/UserCard';
import { spacing } from '../../constants/spacing';
import { useRouter } from 'expo-router';

export default function Home() {
    const theme = useTheme();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    return (
        <ScreenWrapper>
            <AppHeader title="Dashboard" />

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Search Bar */}
                <Searchbar
                    placeholder="Search users, groups..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    elevation={1}
                />

                {/* Quick Actions / Highlights */}
                <View style={styles.highlights}>
                    <Card style={[styles.highlightCard, { backgroundColor: theme.colors.primaryContainer }]}>
                        <Card.Content>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>New Message</Text>
                            <Text variant="bodySmall">Check your inbox</Text>
                        </Card.Content>
                    </Card>
                    <Card style={[styles.highlightCard, { backgroundColor: theme.colors.secondaryContainer }]}>
                        <Card.Content>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Updates</Text>
                            <Text variant="bodySmall">System online</Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Recent Users */}
                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Recommended Users</Text>
                    <Text variant="labelMedium" style={{ color: theme.colors.primary }}>View All</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                    {[1, 2, 3, 4].map(i => (
                        <View key={i} style={{ marginRight: spacing.m, alignItems: 'center' }}>
                            <Avatar.Image size={60} source={{ uri: `https://i.pravatar.cc/150?img=${i + 10}` }} />
                            <Text variant="bodySmall" style={{ marginTop: 4 }}>User {i}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Recent Activity */}
                <Text variant="titleMedium" style={[styles.sectionHeader, { fontWeight: 'bold', marginTop: spacing.l }]}>Recent Activity</Text>

                {[1, 2, 3].map(i => (
                    <NotificationCard
                        key={i}
                        title={`System Update ${i}`}
                        description="Maintenance scheduled for tonight."
                        time={`${i} hours ago`}
                        type={i % 2 === 0 ? 'system' : 'alert'}
                        read={i !== 1}
                        onPress={() => { }}
                    />
                ))}

            </ScrollView>

            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color="white"
                onPress={() => router.push('/chat/create-chat')}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.m,
        paddingBottom: 80,
    },
    searchBar: {
        marginBottom: spacing.m,
        borderRadius: 12,
    },
    highlights: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.l,
    },
    highlightCard: {
        width: '48%',
        borderRadius: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    horizontalList: {
        marginBottom: spacing.m,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 30,
    },
});
