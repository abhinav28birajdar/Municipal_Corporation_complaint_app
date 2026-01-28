import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '../../components/ui/ScreenWrapper';
import AppHeader from '../../components/headers/AppHeader';

const { width } = Dimensions.get('window');

export default function ImagePreview() {
    const theme = useTheme();
    const router = useRouter();
    const { uri } = useLocalSearchParams();

    return (
        <ScreenWrapper style={{ backgroundColor: '#000' }}>
            <AppHeader title="Preview" showBack />
            <View style={styles.container}>
                {uri ? (
                    <Image source={{ uri: uri as string }} style={styles.image} resizeMode="contain" />
                ) : (
                    <Text variant="bodyLarge" style={{ color: '#fff' }}>No Image Selected</Text>
                )}
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width,
        height: '80%',
    }
});
