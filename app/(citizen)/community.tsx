import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme, Card, Avatar, ProgressBar, List, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TRENDING_ISSUES = [
    { title: 'Water Scarcity', count: 156, progress: 0.8, color: '#42a5f5' },
    { title: 'Garbage Collection', count: 89, progress: 0.5, color: '#66bb6a' },
    { title: 'Street Lights', count: 45, progress: 0.3, color: '#ffa726' },
];

export default function CommunityDashboard() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <ScreenWrapper>
            <AppHeader
                title="Community Feed"
                rightElement={<TouchableOpacity onPress={() => router.push('/(citizen)/map-view')}><MaterialCommunityIcons name="map-marker-radius" size={28} color={theme.colors.primary} /></TouchableOpacity>}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <Card style={styles.wardInfoCard}>
                    <Card.Content>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <Text variant="labelLarge" style={{ color: '#FFF' }}>CURRENT WARD</Text>
                                <Text variant="headlineSmall" style={{ color: '#FFF', fontWeight: 'bold' }}>Ward 12 - City Center</Text>
                            </View>
                            <Avatar.Icon size={48} icon="office-building" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} color="#FFF" />
                        </View>
                        <Divider style={{ marginVertical: spacing.m, backgroundColor: 'rgba(255,255,255,0.3)' }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text variant="titleMedium" style={{ color: '#FFF', fontWeight: 'bold' }}>85%</Text>
                                <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.8)' }}>Resolution Rate</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text variant="titleMedium" style={{ color: '#FFF', fontWeight: 'bold' }}>12h</Text>
                                <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.8)' }}>Avg. Response</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Trending in your area</Text>
                </View>

                {TRENDING_ISSUES.map((issue, index) => (
                    <Card key={index} style={styles.trendingCard}>
                        <Card.Content>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text variant="titleMedium">{issue.title}</Text>
                                <Text variant="labelLarge" style={{ color: theme.colors.outline }}>{issue.count} Reports</Text>
                            </View>
                            <ProgressBar progress={issue.progress} color={issue.color} style={{ height: 8, borderRadius: 4 }} />
                        </Card.Content>
                    </Card>
                ))}

                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Recent Community Reports</Text>
                </View>

                <Card style={styles.feedCard}>
                    <Card.Content>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.m }}>
                            <Avatar.Text size={32} label="SM" />
                            <View style={{ marginLeft: spacing.m }}>
                                <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>Suresh M.</Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.outline }}>15 mins ago • Road Pothole</Text>
                            </View>
                        </View>
                        <Text variant="bodyMedium">Huge pothole near the bus stand in Sector 4. Very dangerous for two-wheelers.</Text>
                        <View style={styles.feedActions}>
                            <TouchableOpacity style={styles.actionBtn}>
                                <MaterialCommunityIcons name="arrow-up-bold-outline" size={20} color={theme.colors.outline} />
                                <Text style={{ marginLeft: 4 }}>Upvote (24)</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionBtn}>
                                <MaterialCommunityIcons name="comment-text-outline" size={20} color={theme.colors.outline} />
                                <Text style={{ marginLeft: 4 }}>Comment (5)</Text>
                            </TouchableOpacity>
                        </View>
                    </Card.Content>
                </Card>

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.m,
    },
    wardInfoCard: {
        backgroundColor: '#2196f3',
        borderRadius: 20,
        marginBottom: spacing.l,
    },
    sectionHeader: {
        marginBottom: spacing.m,
        marginTop: spacing.s,
    },
    trendingCard: {
        marginBottom: spacing.m,
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    feedCard: {
        marginBottom: spacing.m,
        borderRadius: 16,
    },
    feedActions: {
        flexDirection: 'row',
        marginTop: spacing.m,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: spacing.m,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing.l,
    }
});
