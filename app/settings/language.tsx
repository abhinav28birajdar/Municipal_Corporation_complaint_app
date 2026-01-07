// Language Settings Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  Check,
  Globe,
} from 'lucide-react-native';

import { useSettingsStore, Language } from '@/store/settings-store';
import { colors as lightColors, darkColors } from '@/constants/Colors';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
];

const LanguageSettings: React.FC = () => {
  const { isDarkMode, language, setLanguage } = useSettingsStore();
  const colors = isDarkMode ? darkColors : lightColors;

  const handleLanguageChange = (newLanguage: Language) => {
    if (newLanguage === language) return;
    
    Alert.alert(
      'Change Language',
      'Are you sure you want to change the app language? The app will reload to apply changes.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: () => {
            setLanguage(newLanguage);
            // In a real app, you would also update the i18n configuration
            Alert.alert('Success', 'Language changed successfully. Please restart the app for full effect.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Language
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: isDarkMode ? '#1F2937' : '#F0F9FF' }]}>
          <Globe size={24} color={colors.tint} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              App Language
            </Text>
            <Text style={[styles.infoDescription, { color: colors.tabIconDefault }]}>
              Select your preferred language for the app interface
            </Text>
          </View>
        </View>

        {/* Language Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.tabIconDefault }]}>
            AVAILABLE LANGUAGES
          </Text>
          
          <View style={[styles.card, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
            {languages.map((lang, index) => (
              <React.Fragment key={lang.code}>
                {index > 0 && (
                  <View style={[styles.divider, { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }]} />
                )}
                <TouchableOpacity
                  style={styles.languageRow}
                  onPress={() => handleLanguageChange(lang.code)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <View style={styles.languageContent}>
                    <Text style={[styles.languageName, { color: colors.text }]}>
                      {lang.name}
                    </Text>
                    <Text style={[styles.nativeName, { color: colors.tabIconDefault }]}>
                      {lang.nativeName}
                    </Text>
                  </View>
                  {language === lang.code && (
                    <View style={[styles.checkmark, { backgroundColor: colors.tint }]}>
                      <Check size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Hint */}
        <View style={styles.hintContainer}>
          <Text style={[styles.hint, { color: colors.tabIconDefault }]}>
            The app supports English, Hindi, and Marathi. More languages will be added in future updates.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 14,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  flag: {
    fontSize: 28,
    marginRight: 14,
  },
  languageContent: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
  },
  nativeName: {
    fontSize: 14,
    marginTop: 2,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginLeft: 58,
  },
  hintContainer: {
    paddingHorizontal: 20,
  },
  hint: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LanguageSettings;
