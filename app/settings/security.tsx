import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, List, Switch, Button } from 'react-native-paper';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';

export default function Security() {
    const theme = useTheme();
    const [biometrics, setBiometrics] = useState(false);

    return (
        <ScreenWrapper>
            <AppHeader title="Security" showBack />

            <ScrollView contentContainerStyle={{ padding: spacing.m }}>
                <List.Section>
                    <List.Item
                        title="Two-Factor Authentication"
                        description="Add an extra layer of security"
                        left={props => <List.Icon {...props} icon="shield-lock" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { }}
                    />
                    <List.Item
                        title="Biometric Login"
                        description="Use FaceID / TouchID"
                        left={props => <List.Icon {...props} icon="fingerprint" />}
                        right={() => <Switch value={biometrics} onValueChange={() => setBiometrics(!biometrics)} />}
                    />
                    <List.Item
                        title="Login Activity"
                        description="Where you're logged in"
                        left={props => <List.Icon {...props} icon="map-marker-radius" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { }}
                    />
                </List.Section>

                <Button mode="outlined" textColor={theme.colors.error} style={{ marginTop: spacing.l }}>
                    Change Password
                </Button>
            </ScrollView>
        </ScreenWrapper>
    );
}
