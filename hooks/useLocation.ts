// Location Hook
import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  timestamp: number;
}

interface AddressData {
  name: string | null;
  street: string | null;
  city: string | null;
  district: string | null;
  region: string | null;
  postalCode: string | null;
  country: string | null;
  formattedAddress: string;
}

interface UseLocationReturn {
  location: LocationData | null;
  address: AddressData | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<LocationData | null>;
  getAddress: (latitude: number, longitude: number) => Promise<AddressData | null>;
  watchLocation: () => void;
  stopWatchingLocation: () => void;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [watchSubscription, setWatchSubscription] = useState<Location.LocationSubscription | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to use this feature. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        setHasPermission(false);
        return false;
      }

      setHasPermission(true);
      return true;
    } catch (err) {
      setError('Failed to request location permission');
      return false;
    }
  }, []);

  const checkPermission = useCallback(async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const permissionGranted = await checkPermission();
      if (!permissionGranted) {
        const requested = await requestPermission();
        if (!requested) {
          setIsLoading(false);
          return null;
        }
      }

      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData: LocationData = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
        accuracy: locationResult.coords.accuracy,
        altitude: locationResult.coords.altitude,
        timestamp: locationResult.timestamp,
      };

      setLocation(locationData);
      
      // Also get address
      const addressResult = await getAddress(locationData.latitude, locationData.longitude);
      if (addressResult) {
        setAddress(addressResult);
      }

      setIsLoading(false);
      return locationData;
    } catch (err: any) {
      setError(err.message || 'Failed to get location');
      setIsLoading(false);
      return null;
    }
  }, []);

  const getAddress = useCallback(async (latitude: number, longitude: number): Promise<AddressData | null> => {
    try {
      const results = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      if (results.length > 0) {
        const result = results[0];
        const formattedAddress = [
          result.name,
          result.street,
          result.district,
          result.city,
          result.region,
          result.postalCode,
        ]
          .filter(Boolean)
          .join(', ');

        return {
          name: result.name,
          street: result.street,
          city: result.city,
          district: result.district,
          region: result.region,
          postalCode: result.postalCode,
          country: result.country,
          formattedAddress,
        };
      }
      return null;
    } catch (err) {
      console.error('Failed to get address:', err);
      return null;
    }
  }, []);

  const watchLocation = useCallback(async () => {
    try {
      const permissionGranted = await checkPermission();
      if (!permissionGranted) {
        const requested = await requestPermission();
        if (!requested) return;
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 10, // Update when moved 10 meters
        },
        (locationResult) => {
          setLocation({
            latitude: locationResult.coords.latitude,
            longitude: locationResult.coords.longitude,
            accuracy: locationResult.coords.accuracy,
            altitude: locationResult.coords.altitude,
            timestamp: locationResult.timestamp,
          });
        }
      );

      setWatchSubscription(subscription);
    } catch (err: any) {
      setError(err.message || 'Failed to watch location');
    }
  }, []);

  const stopWatchingLocation = useCallback(() => {
    if (watchSubscription) {
      watchSubscription.remove();
      setWatchSubscription(null);
    }
  }, [watchSubscription]);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, []);

  // Cleanup watch subscription on unmount
  useEffect(() => {
    return () => {
      if (watchSubscription) {
        watchSubscription.remove();
      }
    };
  }, [watchSubscription]);

  return {
    location,
    address,
    isLoading,
    error,
    hasPermission,
    requestPermission,
    getCurrentLocation,
    getAddress,
    watchLocation,
    stopWatchingLocation,
  };
};

export default useLocation;
