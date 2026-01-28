import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface ScreenWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
    withKeyboard?: boolean;
}

export default function ScreenWrapper({ children, style, withKeyboard = true }: ScreenWrapperProps) {
    const theme = useTheme();

    const Content = (
        <View style={[styles.container, { backgroundColor: theme.colors.background }, style]}>
            <StatusBar
                barStyle={theme.dark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />
            <SafeAreaView style={{ flex: 1 }}>
                {children}
            </SafeAreaView>
        </View>
    );

    if (withKeyboard) {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {Content}
            </KeyboardAvoidingView>
        );
    }

    return Content;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
