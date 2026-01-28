import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, List, Divider } from 'react-native-paper';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { useRouter } from 'expo-router';

export default function Settings() {
    const theme = useTheme();
    const router = useRouter();

    const SETTINGS_MENU = [
        { title: 'Privacy', icon: 'lock', route: '/settings/privacy' },
        { title: 'Security', icon: 'shield-check', route: '/settings/security' },
        { title: 'Theme', icon: 'palette', route: '/settings/theme' },
        { title: 'Help & Support', icon: 'help-circle', route: '/settings/help' },
        { title: 'About App', icon: 'information', route: '/settings/about' },
    ];

    return (
        <ScreenWrapper>
            <AppHeader title="Settings" showBack />

            <ScrollView>
                <List.Section>
                    {SETTINGS_MENU.map((item, index) => (
                        <React.Fragment key={index}>
                            <List.Item
                                title={item.title}
                                left={props => <List.Icon {...props} icon={item.icon} />}
                                right={props => <List.Icon {...props} icon="chevron-right" />}
                                onPress={() => router.push(item.route as any)}
                            />
                            <Divider />
                        </React.Fragment>
                    ))}
                </List.Section>
            </ScrollView>
        </ScreenWrapper>
    );
}
