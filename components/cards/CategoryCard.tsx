import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme, Avatar } from 'react-native-paper';
import { spacing } from '../../constants/spacing';

interface CategoryCardProps {
    title: string;
    icon: string;
    color?: string;
    onPress: () => void;
}

export default function CategoryCard({ title, icon, color, onPress }: CategoryCardProps) {
    const theme = useTheme();

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: color || theme.colors.primaryContainer }]}>
                <Avatar.Icon size={40} icon={icon} style={{ backgroundColor: 'transparent' }} color={color ? '#FFF' : theme.colors.primary} />
            </View>
            <Text variant="labelMedium" style={styles.title} numberOfLines={1}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '23%', // 4 items per row
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    title: {
        marginTop: spacing.xs,
        textAlign: 'center',
        fontWeight: '600',
    }
});
