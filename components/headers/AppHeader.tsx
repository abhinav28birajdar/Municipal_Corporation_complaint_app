import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme, IconButton, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { spacing } from '../../constants/spacing';

interface AppHeaderProps {
    title: string;
    showBack?: boolean;
    rightElement?: React.ReactNode;
}

export default function AppHeader({ title, showBack = false, rightElement }: AppHeaderProps) {
    const theme = useTheme();
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.left}>
                {showBack ? (
                    <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
                ) : (
                    <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                        <Avatar.Text size={36} label="JD" style={{ marginLeft: spacing.s }} />
                    </TouchableOpacity>
                )}
                <Text variant="titleLarge" style={[styles.title, { marginLeft: showBack ? 0 : spacing.m }]}>{title}</Text>
            </View>
            <View style={styles.right}>
                {rightElement || (
                    <IconButton icon="bell-outline" size={24} onPress={() => router.push('/(tabs)/notifications')} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 64,
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
    },
    title: {
        fontWeight: 'bold',
    }
});
