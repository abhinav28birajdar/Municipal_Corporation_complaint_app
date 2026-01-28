import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme, IconButton, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { spacing } from '../../constants/spacing';

interface ChatHeaderProps {
    name: string;
    avatar?: string;
    status: string;
}

export default function ChatHeader({ name, avatar, status }: ChatHeaderProps) {
    const theme = useTheme();
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.outline }]}>
            <View style={styles.left}>
                <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
                <Avatar.Text size={40} label={name.substring(0, 2).toUpperCase()} />
                <View style={{ marginLeft: spacing.m }}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{name}</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.primary }}>{status}</Text>
                </View>
            </View>
            <View style={styles.right}>
                <IconButton icon="video-outline" size={24} />
                <IconButton icon="phone-outline" size={24} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 72,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.s,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
