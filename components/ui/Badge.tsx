import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface BadgeProps {
    status: string;
    style?: ViewStyle;
}

export default function Badge({ status, style }: BadgeProps) {
    const theme = useTheme();

    const getStatusStyles = () => {
        switch (status.toLowerCase()) {
            case 'pending':
                return { bg: '#FFF3E0', text: '#FF9800' };
            case 'in progress':
                return { bg: '#E3F2FD', text: '#2196F3' };
            case 'resolved':
                return { bg: '#E8F5E9', text: '#4CAF50' };
            case 'rejected':
                return { bg: '#FFEBEE', text: '#F44336' };
            case 'active':
                return { bg: '#E8F5E9', text: '#4CAF50' };
            default:
                return { bg: theme.colors.surfaceVariant, text: theme.colors.onSurfaceVariant };
        }
    };

    const colors = getStatusStyles();

    return (
        <View style={[styles.badge, { backgroundColor: colors.bg }, style]}>
            <Text variant="labelMedium" style={[styles.text, { color: colors.text }]}>
                {status.toUpperCase()}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 10,
    },
});
