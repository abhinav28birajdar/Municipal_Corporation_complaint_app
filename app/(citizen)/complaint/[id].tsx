import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, useTheme, Card, Avatar, Divider, List } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ScreenWrapper from '../../../components/ui/ScreenWrapper';
import AppHeader from '../../../components/headers/AppHeader';
import Button from '../../../components/ui/Button';
import { spacing } from '../../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ComplaintDetail() {
    const theme = useTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const STATUS_FLOW = [
        { status: 'Submitted', done: true, date: '24 Jan, 10:00 AM' },
        { status: 'Acknowledged', done: true, date: '24 Jan, 02:30 PM' },
        { status: 'Assigned', done: true, date: '25 Jan, 09:15 AM' },
        { status: 'In Progress', done: false, date: 'Pending' },
        { status: 'Resolved', done: false, date: 'Expected 27 Jan' },
    ];

    return (
        <ScreenWrapper>
            <AppHeader title="Complaint Details" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <View style={{ flex: 1 }}>
                        <Text variant="labelLarge" style={{ color: theme.colors.outline }}>ID: #MC-2026-8842</Text>
                        <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Garbage pile-up</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: '#e3f2fd' }]}>
                        <Text variant="labelMedium" style={{ color: '#2196f3' }}>Assigned</Text>
                    </View>
                </View>

                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: spacing.s }}>Status Timeline</Text>
                        {STATUS_FLOW.map((item, index) => (
                            <View key={index} style={styles.timelineItem}>
                                <View style={styles.timelineLine}>
                                    <View style={[styles.dot, { backgroundColor: item.done ? theme.colors.secondary : '#ccc' }]} />
                                    {index < STATUS_FLOW.length - 1 && <View style={[styles.connector, { backgroundColor: item.done ? theme.colors.secondary : '#ccc' }]} />}
                                </View>
                                <View style={styles.timelineText}>
                                    <Text variant="bodyLarge" style={{ fontWeight: item.done ? 'bold' : 'normal' }}>{item.status}</Text>
                                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>{item.date}</Text>
                                </View>
                            </View>
                        ))}
                    </Card.Content>
                </Card>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Description</Text>
                    <Text variant="bodyMedium" style={{ lineHeight: 22 }}>
                        There is a large amount of garbage collected at the corner of Main Street. It has been there for over 3 days and is causing a foul smell. Please clear it as soon as possible.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Location</Text>
                    <View style={styles.locationContainer}>
                        <MaterialCommunityIcons name="map-marker-radius" size={24} color={theme.colors.primary} />
                        <View style={{ marginLeft: spacing.m }}>
                            <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>Main Street Cross Road</Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.outline }}>Ward 12, Area B, City Center</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Officer Details</Text>
                    <Card style={{ backgroundColor: '#f5f5f5', elevation: 0 }}>
                        <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Avatar.Image size={50} source={{ uri: 'https://i.pravatar.cc/100?img=33' }} />
                            <View style={{ flex: 1, marginLeft: spacing.m }}>
                                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Officer Rajesh Kumar</Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.outline }}>Sanitation Department</Text>
                            </View>
                            <TouchableOpacity style={styles.callButton}>
                                <MaterialCommunityIcons name="phone" size={20} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                </View>

            </ScrollView>

            <View style={styles.footer}>
                <Button mode="outlined" onPress={() => { }} style={{ flex: 1, marginRight: spacing.m }}>
                    Add Comment
                </Button>
                <Button mode="contained" onPress={() => { }} style={{ flex: 1 }}>
                    Upvote (12)
                </Button>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.m,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.l,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    card: {
        marginBottom: spacing.l,
        borderRadius: 16,
        elevation: 1,
    },
    timelineItem: {
        flexDirection: 'row',
        height: 60,
    },
    timelineLine: {
        alignItems: 'center',
        width: 30,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        zIndex: 1,
    },
    connector: {
        width: 2,
        flex: 1,
    },
    timelineText: {
        flex: 1,
        marginLeft: spacing.s,
    },
    section: {
        marginBottom: spacing.l,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: spacing.s,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
        backgroundColor: '#fff9c430',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fff9c4',
    },
    callButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        padding: spacing.m,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    }
});
