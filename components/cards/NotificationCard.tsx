import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme, Card, Avatar, IconButton } from 'react-native-paper';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NotificationCardProps {
    title: string;
    description: string;
    time: string;
    type: 'complaint' | 'system' | 'community' | 'alert';
    read?: boolean;
    onPress: () => void;
}

export default function NotificationCard({ title, description, time, type, read, onPress }: NotificationCardProps) {
    const theme = useTheme();

    const getIcon = () => {
        switch (type) {
            case 'complaint': return { name: 'clipboard-text', color: '#2196F3' };
            case 'community': return { name: 'account-group', color: '#4CAF50' };
            case 'alert': return { name: 'alert-circle', color: '#F44336' };
            default: return { name: 'bell', color: '#FF9800' };
        }
    };

    const icon = getIcon();

    return (
        <Card style={[styles.card, { backgroundColor: read ? 'transparent' : theme.colors.elevation.level1 }]} onPress={onPress}>
            <Card.Content style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
                    <MaterialCommunityIcons name={icon.name as any} size={24} color={icon.color} />
                </View>
                <View style={styles.textContainer}>
                    <Text variant="labelLarge" style={{ fontWeight: read ? 'normal' : 'bold' }}>{title}</Text>
                    <Text variant="bodySmall" numberOfLines={2} style={{ color: theme.colors.onSurfaceVariant }}>{description}</Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.outline, marginTop: 4 }}>{time}</Text>
                </View>
                {!read && <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />}
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing.s,
        elevation: 0,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: spacing.m,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: spacing.s,
    }
});
