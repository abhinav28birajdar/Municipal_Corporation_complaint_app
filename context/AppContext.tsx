// App Context Provider
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Import stores
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';
import { useNotificationStore } from '@/store/notification-store-new';

interface AppContextType {
  isReady: boolean;
  isOnline: boolean;
  isAuthenticated: boolean;
  isDarkMode: boolean;
  user: any | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  
  const { user, isAuthenticated, checkSession } = useAuthStore();
  const { isDarkMode, themeMode } = useSettingsStore();
  const { fetchNotifications, subscribeToNotifications, unsubscribeFromNotifications } = useNotificationStore();
  
  const systemColorScheme = useColorScheme();

  // Initialize app
  useEffect(() => {
    const initialize = async () => {
      try {
        // Check authentication status
        await checkSession();
        
        // App is ready
        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsReady(true);
      }
    };

    initialize();
  }, []);

  // Monitor network state
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Handle notifications subscription
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Fetch initial notifications
      fetchNotifications(user.id);
      
      // Subscribe to real-time notifications
      subscribeToNotifications(user.id);
    }

    return () => {
      unsubscribeFromNotifications();
    };
  }, [isAuthenticated, user?.id]);

  // Handle system theme changes
  useEffect(() => {
    if (themeMode === 'system') {
      // Theme is automatically handled by the store listener
    }
  }, [systemColorScheme, themeMode]);

  const value: AppContextType = {
    isReady,
    isOnline,
    isAuthenticated,
    isDarkMode,
    user,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppProvider;
