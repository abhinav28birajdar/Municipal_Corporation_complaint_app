import React from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, Searchbar, Card, Avatar, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import CategoryCard from '../../components/cards/CategoryCard';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CATEGORIES = [
    { title: 'Garbage', icon: 'delete', color: '#66bb6a' },
    { title: 'Water', icon: 'water', color: '#42a5f5' },
    { title: 'Roads', icon: 'road', color: '#ffa726' },
    { title: 'Lights', icon: 'lightbulb', color: '#fbc02d' },
    { title: 'Drainage', icon: 'waves', color: '#7e57c2' },
    { title: 'Construction', icon: 'office-building', color: '#ff7043' },
    { title: 'Pollution', icon: 'volume-high', color: '#26a69a' },
    { title: 'Tree', icon: 'tree', color: '#8d6e63' },
];

const RECENT_COMPLAINTS = [
    { id: '1', title: 'Street light not working', status: 'Pending', date: '2 hours ago', category: 'Lights' },
    { id: '2', title: 'Open manhole in ward 12', status: 'In Progress', date: '5 hours ago', category: 'Drainage' },
];

export default function CitizenHome() {
    const theme = useTheme();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState('');

    return (
        <ScreenWrapper withKeyboard={false}>
            <AppHeader
                title="Municipal Connect"
                rightElement={<Avatar.Image size={32} source={{ uri: 'https://i.pravatar.cc/100?img=12' }} />}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.hero}>
                    <Text variant="headlineSmall" style={styles.welcomeText}>Hello, John Doe 👋</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>Report any civic issues in your area.</Text>
                </View>

                <Searchbar
                    placeholder="Search complaints..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />

                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Categories</Text>
                    <TouchableOpacity>
                        <Text variant="bodySmall" style={{ color: theme.colors.primary }}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.categoriesGrid}>
                    {CATEGORIES.map((cat, index) => (
                        <CategoryCard
                            key={index}
                            title={cat.title}
                            icon={cat.icon}
                            color={cat.color}
                            onPress={() => router.push('/(citizen)/new-complaint')}
                        />
                    ))}
                </View>

                <View style={[styles.sectionHeader, { marginTop: spacing.l }]}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Recent Activity</Text>
                    <TouchableOpacity onPress={() => router.push('/(citizen)/complaints')}>
                        <Text variant="bodySmall" style={{ color: theme.colors.primary }}>See All</Text>
                    </TouchableOpacity>
                </View>

                {RECENT_COMPLAINTS.map((item) => (
                    <Card key={item.id} style={styles.complaintCard} onPress={() => router.push(`/(citizen)/complaint/${item.id}`)}>
                        <Card.Content style={styles.cardContent}>
                            <Avatar.Icon size={40} icon="file-document-outline" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.primary} />
                            <View style={{ flex: 1, marginLeft: spacing.m }}>
                                <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>{item.title}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>{item.category} • {item.date}</Text>
                                </View>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: item.status === 'Pending' ? '#fff9c4' : '#e3f2fd' }]}>
                                <Text variant="labelSmall" style={{ color: item.status === 'Pending' ? '#fbc02d' : '#2196f3' }}>{item.status}</Text>
                            </View>
                        </Card.Content>
                    </Card>
                ))}

                <View style={styles.sosBanner}>
                    <MaterialCommunityIcons name="alert-decagram" size={24} color="#FFF" />
                    <View style={{ flex: 1, marginLeft: spacing.m }}>
                        <Text variant="titleMedium" style={{ color: '#FFF', fontWeight: 'bold' }}>Emergency SOS</Text>
                        <Text variant="bodySmall" style={{ color: '#FFF' }}>Quickly report life-threatening issues.</Text>
                    </View>
                    <TouchableOpacity style={styles.sosButton} onPress={() => router.push('/(citizen)/emergency-sos')}>
                        <Text style={styles.sosButtonText}>REPORT</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color="#FFF"
                label="New Complaint"
                onPress={() => router.push('/(citizen)/new-complaint')}
            />
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.m,
        paddingBottom: 100,
    },
    hero: {
        marginBottom: spacing.l,
    },
    welcomeText: {
        fontWeight: 'bold',
    },
    searchBar: {
        borderRadius: 12,
        marginBottom: spacing.l,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    complaintCard: {
        marginBottom: spacing.m,
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    sosBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e53935',
        padding: spacing.m,
        borderRadius: 16,
        marginTop: spacing.l,
    },
    sosButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    sosButtonText: {
        color: '#e53935',
        fontWeight: 'bold',
        fontSize: 12,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        borderRadius: 28,
    }
});
