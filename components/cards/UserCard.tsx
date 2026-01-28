import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, useTheme, Card, Avatar, Button } from 'react-native-paper';
import { spacing } from '../../constants/spacing';
import { useRouter } from 'expo-router';

interface UserCardProps {
    name: string;
    role: string;
    avatar?: string;
    verified?: boolean;
    onPress?: () => void;
}

export default function UserCard({ name, role, avatar, verified, onPress }: UserCardProps) {
    const theme = useTheme();

    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            // Assuming we have an ID prop, if not lets create one or use name as ID for mock
            // But existing interface doesn't have ID. Let's redirect to generic user page for demo
            router.push({ pathname: '/user/[id]', params: { id: '1', name } });
        }
    };

    return (
        <Card style={styles.card} onPress={handlePress}>
            <Card.Content style={styles.content}>
                <Avatar.Text
                    size={60}
                    label={name.substring(0, 2).toUpperCase()}
                    style={{ backgroundColor: theme.colors.primaryContainer }}
                />
                <View style={styles.textContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{name}</Text>
                        {verified && <Avatar.Icon size={16} icon="check-decagram" style={{ backgroundColor: 'transparent', marginLeft: 4 }} color={theme.colors.primary} />}
                    </View>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{role}</Text>
                </View>
                <Button mode="outlined" style={{ borderRadius: 8 }}>Follow</Button>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing.m,
        borderRadius: 16,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginLeft: spacing.m,
    }
});
