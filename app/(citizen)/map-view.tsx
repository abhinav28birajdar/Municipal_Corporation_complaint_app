import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text, useTheme, Card, Avatar, FAB, Searchbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';
import { spacing } from '../../constants/spacing';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import MapView, { Marker } from 'react-native-maps'; // Simulate for UI

const { width, height } = Dimensions.get('window');

const MOCK_MARKERS = [
    { id: '1', type: 'Garbage', color: '#66bb6a', lat: 0.1, lng: 0.1 },
    { id: '2', type: 'Water', color: '#42a5f5', lat: 0.2, lng: 0.2 },
    { id: '3', type: 'Roads', color: '#ffa726', lat: -0.1, lng: 0.1 },
];

export default function MapViewScreen() {
    const theme = useTheme();
    const router = useRouter();
    const [selected, setSelected] = useState<any>(null);

    return (
        <ScreenWrapper withKeyboard={false}>
            <AppHeader title="Nearby Issues" showBack />

            <View style={styles.mapPlaceholder}>
                <View style={StyleSheet.absoluteFill}>
                    <Image
                        source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/static/72.8777,19.0760,12,0/600x600?access_token=MAPBOX_TOKEN' }}
                        style={styles.mapImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Simulated Markers */}
                {MOCK_MARKERS.map((m) => (
                    <TouchableOpacity
                        key={m.id}
                        style={[styles.marker, { backgroundColor: m.color, left: width / 2 + m.lng * 200, top: height / 3 + m.lat * 200 }]}
                        onPress={() => setSelected(m)}
                    >
                        <MaterialCommunityIcons name="alert-circle" size={20} color="#FFF" />
                    </TouchableOpacity>
                ))}

                <View style={styles.overlayTop}>
                    <Searchbar placeholder="Search area or ward..." style={styles.searchBar} value="" onChangeText={() => { }} />
                </View>

                {selected && (
                    <View style={styles.overlayBottom}>
                        <Card style={styles.detailCard}>
                            <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Avatar.Icon size={40} icon="delete" style={{ backgroundColor: selected.color }} color="#FFF" />
                                <View style={{ flex: 1, marginLeft: spacing.m }}>
                                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{selected.type} Issue</Text>
                                    <Text variant="bodySmall">Sector 12 • 200m away</Text>
                                </View>
                                <TouchableOpacity onPress={() => router.push(`/(citizen)/complaint/${selected.id}`)}>
                                    <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>VIEW</Text>
                                </TouchableOpacity>
                            </Card.Content>
                        </Card>
                    </View>
                )}

                <FAB
                    icon="crosshairs-gps"
                    style={styles.gpsFab}
                    onPress={() => { }}
                />
            </View>
        </ScreenWrapper>
    );
}

import { Image } from 'react-native';

const styles = StyleSheet.create({
    mapPlaceholder: {
        flex: 1,
        backgroundColor: '#e0e0e0',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    marker: {
        position: 'absolute',
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
        elevation: 4,
    },
    overlayTop: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
    },
    searchBar: {
        elevation: 4,
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    overlayBottom: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        right: 10,
    },
    detailCard: {
        borderRadius: 16,
        elevation: 8,
    },
    gpsFab: {
        position: 'absolute',
        right: 16,
        bottom: 120,
        backgroundColor: '#FFF',
    }
});
