import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';

const LANGUAGES = [
    { id: 'en', name: 'English', flag: '🇬🇧' },
    { id: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { id: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
    { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
];

export default function LanguageSelection() {
    const theme = useTheme();
    const router = useRouter();
    const [selected, setSelected] = useState('en');

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.title}>Choose Language</Text>
                <Text variant="bodyLarge" style={styles.subtitle}>Select your preferred language for the application.</Text>
            </View>

            <FlatList
                data={LANGUAGES}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.langItem,
                            {
                                borderColor: selected === item.id ? theme.colors.primary : theme.colors.outline,
                                backgroundColor: selected === item.id ? theme.colors.primary + '10' : theme.colors.surface
                            }
                        ]}
                        onPress={() => setSelected(item.id)}
                    >
                        <Text style={styles.flag}>{item.flag}</Text>
                        <View style={{ flex: 1, marginLeft: spacing.m }}>
                            <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.name}</Text>
                            {item.native && <Text variant="bodySmall" style={{ color: theme.colors.outline }}>{item.native}</Text>}
                        </View>
                        {selected === item.id && <Avatar.Icon size={24} icon="check-circle" style={{ backgroundColor: 'transparent' }} color={theme.colors.primary} />}
                    </TouchableOpacity>
                )}
            />

            <Button mode="contained" onPress={() => router.push('/(auth)/login')} style={styles.button}>
                Continue
            </Button>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.l,
    },
    header: {
        marginTop: spacing.xl,
        marginBottom: spacing.xl,
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        color: '#757575',
        marginTop: spacing.s,
    },
    langItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.m,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: spacing.m,
    },
    flag: {
        fontSize: 32,
    },
    button: {
        marginTop: spacing.l,
        marginBottom: spacing.xl,
    }
});
