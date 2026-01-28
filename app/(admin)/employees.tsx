import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, useTheme, Card, Avatar, List, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const EMPLOYEES = [
    { id: '1', name: 'Rajesh Kumar', dept: 'Sanitation', status: 'Active', tasks: 5, avatar: 'https://i.pravatar.cc/100?img=1' },
    { id: '2', name: 'Suresh Raina', dept: 'Electrical', status: 'On Field', tasks: 3, avatar: 'https://i.pravatar.cc/100?img=2' },
    { id: '3', name: 'Amit Singh', dept: 'Water', status: 'On Leave', tasks: 0, avatar: 'https://i.pravatar.cc/100?img=3' },
];

export default function ManageEmployees() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <ScreenWrapper>
            <AppHeader title="Manage Staff" showBack />

            <View style={styles.searchContainer}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Department Staff ({EMPLOYEES.length})</Text>
            </View>

            <FlatList
                data={EMPLOYEES}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Content style={styles.content}>
                            <Avatar.Image size={50} source={{ uri: item.avatar }} />
                            <View style={{ flex: 1, marginLeft: spacing.m }}>
                                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.outline }}>{item.dept} • {item.tasks} Tasks Assigned</Text>
                                <View style={[styles.statusBadge, { backgroundColor: item.status === 'Active' ? '#e8f5e9' : item.status === 'On Field' ? '#e3f2fd' : '#f5f5f5' }]}>
                                    <Text variant="labelSmall" style={{ color: item.status === 'Active' ? '#4caf50' : item.status === 'On Field' ? '#2196f3' : '#9e9e9e' }}>{item.status}</Text>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.colors.outline} />
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                )}
                contentContainerStyle={{ padding: spacing.m }}
            />

            <FAB
                icon="account-plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color="#FFF"
                onPress={() => { }}
            />
        </ScreenWrapper>
    );
}

import { FAB } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
    searchContainer: {
        padding: spacing.m,
    },
    card: {
        marginBottom: spacing.m,
        borderRadius: 16,
        backgroundColor: '#FFF',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    }
});
