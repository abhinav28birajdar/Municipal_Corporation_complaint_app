import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import Button from '../../components/ui/Button';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FEATURES = [
    {
        title: 'Easy Reporting',
        description: 'Report garbage, water issues, and more in just few taps.',
        icon: 'file-document-edit-outline',
        color: '#2196f3'
    },
    {
        title: 'Track Progress',
        description: 'Get live updates on your complaint status and assigned officers.',
        icon: 'map-marker-path',
        color: '#4caf50'
    },
    {
        title: 'Community Heatmap',
        description: 'See trending issues in your ward and upvote to prioritize them.',
        icon: 'map-search-outline',
        color: '#ff9800'
    }
];

export default function OnboardingFeatures() {
    const theme = useTheme();
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < FEATURES.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            router.push('/onboarding/permissions');
        }
    };

    return (
        <ScreenWrapper style={styles.container}>
            <View style={styles.content}>
                <View style={styles.topActions}>
                    <TouchableOpacity onPress={() => router.push('/onboarding/language-selection')}>
                        <Text style={{ color: theme.colors.outline }}>Skip</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.iconContainer, { backgroundColor: FEATURES[currentIndex].color + '15' }]}>
                    <MaterialCommunityIcons name={FEATURES[currentIndex].icon as any} size={100} color={FEATURES[currentIndex].color} />
                </View>

                <View style={styles.textContainer}>
                    <Text variant="headlineSmall" style={styles.title}>{FEATURES[currentIndex].title}</Text>
                    <Text variant="bodyLarge" style={styles.subtitle}>{FEATURES[currentIndex].description}</Text>
                </View>

                <View style={styles.footer}>
                    <View style={styles.dotsRow}>
                        {FEATURES.map((_, i) => (
                            <View key={i} style={[styles.dot, { backgroundColor: i === currentIndex ? theme.colors.primary : '#E0E0E0', width: i === currentIndex ? 24 : 8 }]} />
                        ))}
                    </View>
                    <Button mode="contained" onPress={handleNext} style={styles.nextBtn}>
                        {currentIndex === FEATURES.length - 1 ? 'Get Started' : 'Next'}
                    </Button>
                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
    },
    content: {
        flex: 1,
        padding: spacing.l,
        justifyContent: 'space-between',
    },
    topActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    iconContainer: {
        width: 180,
        height: 180,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        color: '#757575',
        marginTop: spacing.m,
        lineHeight: 24,
    },
    footer: {
        alignItems: 'center',
    },
    dotsRow: {
        flexDirection: 'row',
        marginBottom: spacing.xl,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    nextBtn: {
        width: '100%',
        marginBottom: spacing.l,
    }
});
