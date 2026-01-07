// i18n Configuration
import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import en from './locales/en';
import hi from './locales/hi';
import mr from './locales/mr';

const i18n = new I18n({
  en,
  hi,
  mr,
});

// Set default and fallback locale
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

// Language storage key
const LANGUAGE_KEY = '@app_language';

// Initialize language from storage or device locale
export const initializeLanguage = async (): Promise<string> => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (storedLanguage && ['en', 'hi', 'mr'].includes(storedLanguage)) {
      i18n.locale = storedLanguage;
      return storedLanguage;
    }
    
    // Get device locale using new API
    const locales = Localization.getLocales();
    const deviceLocale = locales?.[0]?.languageCode || 'en';
    const supportedLocale = ['en', 'hi', 'mr'].includes(deviceLocale) ? deviceLocale : 'en';
    i18n.locale = supportedLocale;
    return supportedLocale;
  } catch (error) {
    console.error('Error initializing language:', error);
    i18n.locale = 'en';
    return 'en';
  }
};

// Change language
export const changeLanguage = async (locale: 'en' | 'hi' | 'mr'): Promise<void> => {
  try {
    i18n.locale = locale;
    await AsyncStorage.setItem(LANGUAGE_KEY, locale);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

// Get current language
export const getCurrentLanguage = (): string => {
  return i18n.locale;
};

// Get all available languages
export const getAvailableLanguages = () => [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

// Translate function
export const t = (key: string, options?: Record<string, any>): string => {
  return i18n.t(key, options);
};

export default i18n;
