import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, useTheme, Avatar, List, Divider, Switch, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CitizenProfile() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <ScreenWrapper>
            <AppHeader title="Profile" />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Avatar.Image size={100} source={{ uri: 'https://i.pravatar.cc/150?img=12' }} />
                        <TouchableOpacity style={styles.editAvatar}>
                            <MaterialCommunityIcons name="camera" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginTop: spacing.m }}>John Doe</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>+91 9876543210</Text>
                    <View style={styles.wardBadge}>
                        <Text variant="labelSmall" style={{ color: theme.colors.primary }}>Ward 12 • City Center</Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <Card style={styles.statCard}>
                        <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>12</Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>Total Filed</Text>
                    </Card>
                    <Card style={[styles.statCard, { backgroundColor: '#e8f5e9' }]}>
                        <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: '#4caf50' }}>08</Text>
                        <Text variant="labelSmall" style={{ color: '#4caf50' }}>Resolved</Text>
                    </Card>
                    <Card style={[styles.statCard, { backgroundColor: '#fff9c4' }]}>
                        <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: '#fbc02d' }}>04</Text>
                        <Text variant="labelSmall" style={{ color: '#fbc02d' }}>Pending</Text>
                    </Card>
                </View>

                <List.Section>
                    <List.Subheader>Account Settings</List.Subheader>
                    <List.Item
                        title="Edit Profile"
                        left={props => <List.Icon {...props} icon="account-edit" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => router.push('/(citizen)/profile-edit')}
                    />
                    <List.Item
                        title="My Addresses"
                        left={props => <List.Icon {...props} icon="map-marker" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { }}
                    />
                    <List.Item
                        title="Language"
                        description="English"
                        left={props => <List.Icon {...props} icon="translate" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => router.push('/onboarding/language-selection')}
                    />
                </List.Section>

                <Divider />

                <List.Section>
                    <List.Subheader>Preferences</List.Subheader>
                    <List.Item
                        title="Notifications"
                        left={props => <List.Icon {...props} icon="bell-outline" />}
                        right={() => <Switch value={true} onValueChange={() => { }} />}
                    />
                    <List.Item
                        title="Dark Mode"
                        left={props => <List.Icon {...props} icon="theme-light-dark" />}
                        right={() => <Switch value={theme.dark} onValueChange={() => { }} />}
                    />
                </List.Section>

                <View style={{ padding: spacing.l }}>
                    <Button
                        mode="outlined"
                        onPress={() => router.replace('/(auth)/login')}
                        labelStyle={{ color: theme.colors.error }}
                        style={{ borderColor: theme.colors.error }}
                    >
                        Log Out
                    </Button>
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        backgroundColor: '#f5f5f550',
    },
    avatarContainer: {
        position: 'relative',
    },
    editAvatar: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#2196f3',
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    wardBadge: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: spacing.s,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: spacing.m,
        justifyContent: 'space-between',
        marginTop: -spacing.l,
    },
    statCard: {
        width: '31%',
        padding: spacing.m,
        alignItems: 'center',
        borderRadius: 16,
        elevation: 2,
    },
});
