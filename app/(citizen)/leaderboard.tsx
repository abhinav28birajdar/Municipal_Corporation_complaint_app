import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, Card, Avatar, List, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RANKINGS = [
    { id: '1', name: 'Suresh Patil', points: 2450, rank: 1, avatar: 'https://i.pravatar.cc/100?img=11', badge: 'Verified Citizen' },
    { id: '2', name: 'Amit Shah', points: 1980, rank: 2, avatar: 'https://i.pravatar.cc/100?img=12', badge: 'Top Reporter' },
    { id: '3', name: 'Priya Verma', points: 1750, rank: 3, avatar: 'https://i.pravatar.cc/100?img=13', badge: 'Community Helper' },
];

export default function Leaderboard() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <ScreenWrapper>
            <AppHeader title="Citizen Leaderboard" showBack />

            <View style={styles.topThree}>
                <View style={[styles.rankItem, { marginTop: 40 }]}>
                    <Avatar.Image size={60} source={{ uri: RANKINGS[1].avatar }} />
                    <View style={styles.rankBadge}><Text style={{ color: '#FFF', fontWeight: 'bold' }}>2</Text></View>
                    <Text variant="titleSmall" style={styles.name}>{RANKINGS[1].name}</Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.outline }}>{RANKINGS[1].points} pts</Text>
                </View>

                <View style={styles.rankItem}>
                    <Avatar.Image size={80} source={{ uri: RANKINGS[0].avatar }} style={{ borderWidth: 4, borderColor: '#FFD700' }} />
                    <View style={[styles.rankBadge, { backgroundColor: '#FFD700' }]}><Text style={{ color: '#000', fontWeight: 'bold' }}>1</Text></View>
                    <Text variant="titleMedium" style={[styles.name, { fontWeight: 'bold' }]}>{RANKINGS[0].name}</Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.outline }}>{RANKINGS[0].points} pts</Text>
                </View>

                <View style={[styles.rankItem, { marginTop: 50 }]}>
                    <Avatar.Image size={60} source={{ uri: RANKINGS[2].avatar }} />
                    <View style={[styles.rankBadge, { backgroundColor: '#CD7F32' }]}><Text style={{ color: '#FFF', fontWeight: 'bold' }}>3</Text></View>
                    <Text variant="titleSmall" style={styles.name}>{RANKINGS[2].name}</Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.outline }}>{RANKINGS[2].points} pts</Text>
                </View>
            </View>

            <View style={styles.listSection}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', margin: spacing.m }}>Your Ranking: #42</Text>
                <Card style={styles.listCard}>
                    <FlatList
                        data={RANKINGS}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <List.Item
                                title={item.name}
                                description={item.badge}
                                left={props => <Text style={styles.listRank}>{item.rank}</Text>}
                                right={props => (
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>{item.points} pts</Text>
                                    </View>
                                )}
                            />
                        )}
                        ItemSeparatorComponent={() => <Divider />}
                    />
                </Card>
            </View>

            <View style={styles.infoBox}>
                <MaterialCommunityIcons name="information-outline" size={20} color={theme.colors.outline} />
                <Text variant="bodySmall" style={styles.infoText}>
                    Earn points by reporting valid complaints, upvoting others, and providing helpful feedback.
                </Text>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    topThree: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        padding: spacing.l,
        backgroundColor: '#f8f9fa',
        paddingBottom: 40,
    },
    rankItem: {
        alignItems: 'center',
    },
    rankBadge: {
        position: 'absolute',
        top: 0,
        right: -5,
        backgroundColor: '#C0C0C0',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        marginTop: spacing.s,
    },
    listSection: {
        flex: 1,
    },
    listCard: {
        marginHorizontal: spacing.m,
        borderRadius: 16,
    },
    listRank: {
        width: 30,
        textAlign: 'center',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#757575',
    },
    infoBox: {
        flexDirection: 'row',
        padding: spacing.l,
        alignItems: 'center',
    },
    infoText: {
        marginLeft: spacing.s,
        color: '#757575',
        flex: 1,
    }
});
