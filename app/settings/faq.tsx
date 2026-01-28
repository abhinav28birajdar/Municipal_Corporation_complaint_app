import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, useTheme, List, Searchbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';

const FAQ_DATA = [
    {
        q: 'How do I report a new complaint?',
        a: 'Tap the "+" button on the home screen, select a category, add details and location, then submit.'
    },
    {
        q: 'How long does it take to resolve a complaint?',
        a: 'Resolution time varies by category. Most sanitation issues are resolved within 48 hours.'
    },
    {
        q: 'Can I report a complaint anonymously?',
        a: 'Yes, there is an Anonymously toggle in the New Complaint form. Your identity will be hidden from the public feed.'
    },
    {
        q: 'How can I track my complaint?',
        a: 'Go to the "My Complaints" tab or use the "Track Complaint" feature on the home screen using your ID.'
    },
];

export default function FAQ() {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFaq = FAQ_DATA.filter(item =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ScreenWrapper>
            <AppHeader title="FAQ" showBack />

            <View style={{ padding: spacing.m }}>
                <Searchbar
                    placeholder="Search FAQ"
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <List.Section>
                    {filteredFaq.map((item, index) => (
                        <List.Accordion
                            key={index}
                            title={item.q}
                            titleNumberOfLines={2}
                            style={styles.accordion}
                        >
                            <List.Item
                                title={item.a}
                                titleNumberOfLines={0}
                                style={styles.answer}
                            />
                        </List.Accordion>
                    ))}
                    {filteredFaq.length === 0 && (
                        <Text style={styles.noResults}>No search results found.</Text>
                    )}
                </List.Section>
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingBottom: 40,
    },
    searchBar: {
        borderRadius: 12,
        elevation: 1,
    },
    accordion: {
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    answer: {
        backgroundColor: '#fafafa',
        padding: spacing.m,
    },
    noResults: {
        textAlign: 'center',
        padding: spacing.xl,
        color: '#757575',
    }
});
