import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme, Avatar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SOS_TYPES = [
    { label: 'Fire', icon: 'fire', color: '#f44336' },
    { label: 'Medical', icon: 'hospital-marker', color: '#e91e63' },
    { label: 'Accident', icon: 'car-emergency', color: '#ff9800' },
    { label: 'Flood', icon: 'home-flood', color: '#2196f3' },
];

export default function EmergencySOS() {
    const theme = useTheme();
    const router = useRouter();

    return (
        <ScreenWrapper style={styles.container}>
            <AppHeader title="Emergency SOS" showBack />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.pulseContainer}>
                        <View style={[styles.pulseCircle, { backgroundColor: theme.colors.error + '20' }]} />
                        <TouchableOpacity style={[styles.sosButton, { backgroundColor: theme.colors.error }]}>
                            <Text style={styles.sosText}>SOS</Text>
                        </TouchableOpacity>
                    </View>
                    <Text variant="headlineSmall" style={styles.title}>Tap SOS for Help</Text>
                    <Text variant="bodyMedium" style={styles.subtitle}>Your location will be sent to the command center immediately.</Text>
                </View>

                <View style={styles.grid}>
                    {SOS_TYPES.map((type, index) => (
                        <TouchableOpacity key={index} style={styles.gridItem}>
                            <View style={[styles.iconBox, { backgroundColor: type.color + '15' }]}>
                                <Avatar.Icon size={48} icon={type.icon} style={{ backgroundColor: 'transparent' }} color={type.color} />
                            </View>
                            <Text variant="titleMedium" style={{ marginTop: 8, fontWeight: 'bold' }}>{type.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.locationInfo}>
                    <MaterialCommunityIcons name="map-marker-radius" size={24} color={theme.colors.primary} />
                    <View style={{ marginLeft: spacing.m }}>
                        <Text variant="labelLarge">Current Location Detected</Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.outline }}>Ward 12, Main Street, Mumbai</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.callStrip}>
                    <MaterialCommunityIcons name="phone" size={24} color="#FFF" />
                    <Text style={styles.callText}>CALL EMERGENCY: 112</Text>
                </TouchableOpacity>
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
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.xl,
    },
    pulseContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.l,
    },
    pulseCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        position: 'absolute',
    },
    sosButton: {
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    sosText: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '900',
    },
    title: {
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        color: '#757575',
        marginTop: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: spacing.l,
    },
    gridItem: {
        width: '46%',
        backgroundColor: '#f8f9fa',
        padding: spacing.m,
        borderRadius: 20,
        alignItems: 'center',
        marginBottom: spacing.m,
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: spacing.m,
        backgroundColor: '#e3f2fd50',
        borderRadius: 16,
        marginTop: spacing.m,
    },
    callStrip: {
        width: '100%',
        backgroundColor: '#000',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.m,
        borderRadius: 16,
        marginTop: spacing.xl,
    },
    callText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: spacing.s,
    }
});
