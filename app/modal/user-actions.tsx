import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, List, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';

export default function UserActions() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <ScreenWrapper>
            <AppHeader title="Actions" showBack />

            <List.Section>
                <List.Item
                    title="View Profile"
                    left={props => <List.Icon {...props} icon="account" />}
                    onPress={() => { }}
                />
                <List.Item
                    title="Mute Notifications"
                    left={props => <List.Icon {...props} icon="bell-off" />}
                    onPress={() => { }}
                />
                <Divider />
                <List.Item
                    title="Block User"
                    titleStyle={{ color: theme.colors.error }}
                    left={props => <List.Icon {...props} icon="block-helper" color={theme.colors.error} />}
                    onPress={() => { }}
                />
                <List.Item
                    title="Report"
                    titleStyle={{ color: theme.colors.error }}
                    left={props => <List.Icon {...props} icon="alert-octagon" color={theme.colors.error} />}
                    onPress={() => { }}
                />
            </List.Section>
        </ScreenWrapper>
    );
}
