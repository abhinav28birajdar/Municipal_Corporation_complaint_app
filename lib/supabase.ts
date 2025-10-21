import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Network from 'expo-network';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://glhxlldfkcuusvarkxil.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsaHhsbGRma2N1dXN2YXJreGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNzc2OTEsImV4cCI6MjA2MTY1MzY5MX0.EkqePkMTfijGqVGiCRqk8TAnvaxGDxLckfQPyr_FGGE';


class ExpoSecureStoreAdapter {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(key);
    }
    
    try {
      return await SecureStore.getItemAsync(key) || null;
    } catch (error) {
      console.error('Error reading from SecureStore:', error);
      return null;
    }
  }
  
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      return AsyncStorage.setItem(key, value);
    }
    
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error writing to SecureStore:', error);
    }
  }
  
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      return AsyncStorage.removeItem(key);
    }
    
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing from SecureStore:', error);
    }
  }
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: new ExpoSecureStoreAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  db: {
    schema: 'public',
  },
});

// Function to check connection status to Supabase
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // First check if device has internet connectivity
    const { isConnected } = await Network.getNetworkStateAsync();
    if (!isConnected) {
      console.log('No internet connection');
      return false;
    }
    
    // Then try to make a simple request to Supabase
    const { data, error } = await supabase.from('_schema').select('*').limit(1);
    
    if (error) {
      console.error('Supabase connection check failed:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking Supabase connection:', error);
    return false;
  }
};