import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, Avatar, Button as PaperButton, Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';
import Skeleton from '../../components/ui/Skeleton';

export default function UserProfile() {
    const theme = useTheme();
    const router = useRouter();
    const { id, name } = useLocalSearchParams();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return (
            <ScreenWrapper>
                <AppHeader title="Profile" showBack />
                <View style={{ alignItems: 'center', padding: spacing.xl }}>
                    <Skeleton width={100} height={100} borderRadius={50} style={{ marginBottom: spacing.m }} />
                    <Skeleton width={200} height={32} style={{ marginBottom: spacing.s }} />
                    <Skeleton width={150} height={20} />
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <AppHeader title="Profile" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Avatar.Text size={100} label={(name as string)?.[0] || 'U'} style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.onPrimaryContainer} />
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginTop: spacing.m }}>{name || 'User ' + id}</Text>
                    <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>@user{id}</Text>

                    <View style={styles.actions}>
                        <Button mode="contained" onPress={() => router.push({ pathname: '/chat/chat-room', params: { id, name } })} style={{ flex: 1, marginRight: spacing.s }}>
                            Message
                        </Button>
                        <Button mode="outlined" onPress={() => { }} style={{ flex: 1, marginLeft: spacing.s }}>
                            Follow
                        </Button>
                    </View>

                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>50</Text>
                            <Text variant="bodySmall">Following</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>120</Text>
                            <Text variant="bodySmall">Followers</Text>
                        </View>
                    </View>
                </View>

                <Divider style={{ marginVertical: spacing.l }} />

                <View style={{ padding: spacing.m }}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: spacing.s }}>About</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        Passionate about technology and community building. Love to explore new places and meet new people.
                    </Text>
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        paddingVertical: spacing.l,
    },
    actions: {
        flexDirection: 'row',
        marginTop: spacing.l,
        paddingHorizontal: spacing.l,
        width: '100%',
    },
    stats: {
        flexDirection: 'row',
        marginTop: spacing.l,
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        width: 100,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: '#ccc',
    }
});
