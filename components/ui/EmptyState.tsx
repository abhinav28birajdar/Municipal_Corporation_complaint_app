import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../../constants/spacing';

interface EmptyStateProps {
    icon?: string;
    message: string;
    subMessage?: string;
}

export default function EmptyState({ icon = 'database-off', message, subMessage }: EmptyStateProps) {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name={icon as any} size={64} color={theme.colors.outline} />
            <Text variant="titleLarge" style={[styles.text, { color: theme.colors.outline, marginTop: spacing.m }]}>
                {message}
            </Text>
            {subMessage && (
                <Text variant="bodyMedium" style={[styles.text, { color: theme.colors.onSurfaceVariant, marginTop: spacing.xs, textAlign: 'center' }]}>
                    {subMessage}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    text: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
