import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Button as PaperButton, useTheme } from 'react-native-paper';

interface ButtonProps {
    onPress: () => void;
    children: React.ReactNode;
    mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
    loading?: boolean;
    disabled?: boolean;
    icon?: string;
    style?: ViewStyle;
    labelStyle?: TextStyle;
}

export default function Button({
    onPress,
    children,
    mode = 'contained',
    loading = false,
    disabled = false,
    icon,
    style,
    labelStyle
}: ButtonProps) {
    const theme = useTheme();

    return (
        <PaperButton
            mode={mode}
            onPress={onPress}
            loading={loading}
            disabled={disabled || loading}
            icon={icon}
            style={[styles.button, style]}
            labelStyle={[styles.label, labelStyle]}
            contentStyle={styles.content}
        >
            {children}
        </PaperButton>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        marginVertical: 8,
    },
    content: {
        height: 48,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Inter_700Bold',
    },
});
