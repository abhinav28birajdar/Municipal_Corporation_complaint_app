import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, useTheme, Card, Avatar } from 'react-native-paper';
import { spacing } from '../../constants/spacing';

interface ChatCardProps {
    name: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    avatar?: string;
    onPress: () => void;
}

export default function ChatCard({ name, lastMessage, time, unreadCount, avatar, onPress }: ChatCardProps) {
    const theme = useTheme();

    return (
        <TouchableOpacity onPress={onPress}>
            <Card style={styles.card}>
                <Card.Content style={styles.content}>
                    <Avatar.Text
                        size={50}
                        label={name.substring(0, 2).toUpperCase()}
                        style={{ backgroundColor: theme.colors.primaryContainer }}
                        labelStyle={{ color: theme.colors.onPrimaryContainer }}
                    />
                    <View style={styles.textContainer}>
                        <View style={styles.header}>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{name}</Text>
                            <Text variant="labelSmall" style={{ color: theme.colors.outline }}>{time}</Text>
                        </View>
                        <View style={styles.footer}>
                            <Text variant="bodyMedium" numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant, flex: 1 }}>{lastMessage}</Text>
                            {unreadCount ? (
                                <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                                    <Text variant="labelSmall" style={{ color: '#fff' }}>{unreadCount}</Text>
                                </View>
                            ) : null}
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing.s,
        backgroundColor: 'transparent',
        elevation: 0,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: spacing.m,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    badge: {
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing.s,
    }
});
