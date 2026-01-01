import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react-native';

export default function LocationPickerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [location, setLocation] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const loc = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setLocation(loc);
      setSelectedLocation(loc);
      getAddressFromCoordinates(loc.latitude, loc.longitude);
      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get current location');
      setLoading(false);
    }
  };

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result.length > 0) {
        const addr = result[0];
        const formattedAddress = `${addr.street || ''}, ${addr.city || ''}, ${addr.region || ''}, ${addr.postalCode || ''}`;
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
    getAddressFromCoordinates(latitude, longitude);
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      // TODO: Pass location back to complaint form
      router.back();
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600">Loading map...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 bg-white pt-12 pb-4 px-6 shadow-sm">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3"
          >
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-gray-900 text-xl font-bold flex-1">
            Select Location
          </Text>
        </View>
        
        {/* Address Display */}
        <View className="bg-gray-50 p-3 rounded-lg flex-row items-start">
          <MapPin size={20} color="#3b82f6" style={{ marginTop: 2, marginRight: 8 }} />
          <Text className="text-gray-700 flex-1 text-sm">
            {address || 'Tap on map to select location'}
          </Text>
        </View>
      </View>

      {/* Map */}
      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={location}
          onPress={handleMapPress}
          showsUserLocation
          showsMyLocationButton
        >
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title="Selected Location"
              description={address}
            />
          )}
        </MapView>
      )}

      {/* Bottom Controls */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-6 shadow-lg">
        <TouchableOpacity
          onPress={getCurrentLocation}
          className="flex-row items-center justify-center bg-gray-100 py-3 rounded-xl mb-3"
        >
          <Navigation size={20} color="#3b82f6" />
          <Text className="text-blue-600 font-semibold ml-2">Use Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleConfirm}
          disabled={!selectedLocation}
          className={`py-4 rounded-xl ${selectedLocation ? 'bg-blue-600' : 'bg-gray-300'}`}
        >
          <Text className="text-white text-center text-lg font-bold">
            Confirm Location
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
