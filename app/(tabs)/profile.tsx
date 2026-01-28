import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Avatar, List, Divider, Switch } from 'react-native-paper';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';
import { useRouter } from 'expo-router';

export default function Profile() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <ScreenWrapper>
            <AppHeader title="Profile" rightElement={<Button mode="text" onPress={() => { }}>Edit</Button>} />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Avatar.Image size={100} source={{ uri: 'https://i.pravatar.cc/150?img=12' }} />
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginTop: spacing.m }}>John Doe</Text>
                    <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>@johndoe</Text>

                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>120</Text>
                            <Text variant="bodySmall">Following</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>350</Text>
                            <Text variant="bodySmall">Followers</Text>
                        </View>
                    </View>
                </View>

                <List.Section>
                    <List.Subheader>Account</List.Subheader>
                    <List.Item
                        title="Personal Information"
                        left={props => <List.Icon {...props} icon="account-details" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { }}
                    />
                    <List.Item
                        title="Privacy & Security"
                        left={props => <List.Icon {...props} icon="shield-account" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => router.push('/settings/privacy')}
                    />
                </List.Section>

                <Divider />

                <List.Section>
                    <List.Subheader>Preferences</List.Subheader>
                    <List.Item
                        title="Dark Mode"
                        left={props => <List.Icon {...props} icon="theme-light-dark" />}
                        right={() => <Switch value={theme.dark} onValueChange={() => { }} />}
                    />
                    <List.Item
                        title="Settings"
                        left={props => <List.Icon {...props} icon="cog" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => router.push('/settings')}
                    />
                </List.Section>

                <View style={{ padding: spacing.l }}>
                    <Button
                        mode="outlined"
                        onPress={() => router.replace('/(auth)/login')}
                        style={{ borderColor: theme.colors.error }}
                        labelStyle={{ color: theme.colors.error }}
                        icon="logout"
                    >
                        Log Out
                    </Button>
                    <Text variant="labelSmall" style={{ textAlign: 'center', marginTop: spacing.m, color: theme.colors.outline }}>
                        Version 1.0.0
                    </Text>
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
        paddingVertical: spacing.l,
    },
    stats: {
        flexDirection: 'row',
        marginTop: spacing.l,
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        width: 100,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: '#ccc',
    }
});
