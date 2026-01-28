import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, List, RadioButton } from 'react-native-paper';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';

export default function ThemeSettings() {
    const theme = useTheme();
    const [themeMode, setThemeMode] = useState('system');

    return (
        <ScreenWrapper>
            <AppHeader title="Theme" showBack />

            <View>
                <RadioButton.Group onValueChange={value => setThemeMode(value)} value={themeMode}>
                    <List.Item
                        title="System Default"
                        left={props => <List.Icon {...props} icon="theme-light-dark" />}
                        right={() => <RadioButton value="system" />}
                    />
                    <List.Item
                        title="Light Mode"
                        left={props => <List.Icon {...props} icon="white-balance-sunny" />}
                        right={() => <RadioButton value="light" />}
                    />
                    <List.Item
                        title="Dark Mode"
                        left={props => <List.Icon {...props} icon="moon-waning-crescent" />}
                        right={() => <RadioButton value="dark" />}
                    />
                </RadioButton.Group>
            </View>
        </ScreenWrapper>
    );
}
