import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Text, useTheme, Card, Avatar, List, Divider, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Support() {
    const theme = useTheme();
    const router = useRouter();

    const HELP_NUMBERS = [
        { label: 'Control Room', number: '022-22620251' },
        { label: 'Ambulance', number: '108' },
        { label: 'Fire Brigade', number: '101' },
    ];

    return (
        <ScreenWrapper>
            <AppHeader title="Help & Support" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Avatar.Icon size={80} icon="face-agent" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.primary} />
                    <Text variant="headlineSmall" style={{ fontWeight: 'bold', marginTop: spacing.m }}>How can we help?</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.outline, textAlign: 'center' }}>
                        Our support team is available 24/7 to assist you.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Emergency Helplines</Text>
                    <Card style={styles.card}>
                        {HELP_NUMBERS.map((item, index) => (
                            <View key={index}>
                                <List.Item
                                    title={item.label}
                                    description={item.number}
                                    left={props => <List.Icon {...props} icon="phone" color={theme.colors.primary} />}
                                    onPress={() => Linking.openURL(`tel:${item.number}`)}
                                />
                                {index < HELP_NUMBERS.length - 1 && <Divider />}
                            </View>
                        ))}
                    </Card>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Send us a Message</Text>
                    <TextInput
                        label="Subject"
                        mode="outlined"
                        style={styles.input}
                    />
                    <TextInput
                        label="Describe your query"
                        mode="outlined"
                        multiline
                        numberOfLines={4}
                        style={styles.input}
                    />
                    <Button mode="contained" onPress={() => { }} style={styles.button}>
                        Submit
                    </Button>
                </View>

                <View style={styles.socialSection}>
                    <Text variant="titleSmall" style={{ textAlign: 'center', marginBottom: spacing.m }}>Follow us on</Text>
                    <View style={styles.socialRow}>
                        <TouchableOpacity style={styles.socialBtn}>
                            <MaterialCommunityIcons name="twitter" size={24} color="#1DA1F2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn}>
                            <MaterialCommunityIcons name="facebook" size={24} color="#4267B2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn}>
                            <MaterialCommunityIcons name="instagram" size={24} color="#E1306C" />
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.l,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: spacing.m,
    },
    card: {
        borderRadius: 16,
        backgroundColor: '#FFF',
    },
    input: {
        marginBottom: spacing.m,
        backgroundColor: '#FFF',
    },
    button: {
        marginTop: spacing.s,
    },
    socialSection: {
        marginTop: spacing.l,
        marginBottom: spacing.xl,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    socialBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: spacing.m,
    }
});
