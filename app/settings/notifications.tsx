// Notification Settings Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import {
  ChevronLeft,
  Bell,
  BellOff,
  Mail,
  MessageSquare,
  AlertTriangle,
  Megaphone,
  Clock,
  Volume2,
  Vibrate,
} from 'lucide-react-native';

import { useSettingsStore } from '@/store/settings-store';
import { colors as lightColors, darkColors } from '@/constants/Colors';

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
}

const NotificationSettings: React.FC = () => {
  const { 
    isDarkMode, 
    pushNotificationsEnabled, 
    emailNotificationsEnabled,
    smsNotificationsEnabled,
    setPushNotifications,
    setEmailNotifications,
    setSmsNotifications,
  } = useSettingsStore();
  
  const colors = isDarkMode ? darkColors : lightColors;

  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'complaint_updates',
      title: 'Complaint Updates',
      description: 'Status changes and comments on your complaints',
      icon: MessageSquare,
      enabled: true,
    },
    {
      id: 'emergency_alerts',
      title: 'Emergency Alerts',
      description: 'Critical alerts and urgent notifications',
      icon: AlertTriangle,
      enabled: true,
    },
    {
      id: 'announcements',
      title: 'Announcements',
      description: 'Municipal news and announcements',
      icon: Megaphone,
      enabled: true,
    },
    {
      id: 'reminders',
      title: 'Reminders',
      description: 'Pending actions and follow-up reminders',
      icon: Clock,
      enabled: true,
    },
  ]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('07:00');

  const requestNotificationPermission = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings to receive updates.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Notifications.requestPermissionsAsync() },
        ]
      );
      return false;
    }
    return true;
  };

  const handlePushToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }
    setPushNotifications(value);
  };

  const handleCategoryToggle = (categoryId: string, enabled: boolean) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId ? { ...cat, enabled } : cat
      )
    );
  };

  const SettingRow: React.FC<{
    icon: React.ComponentType<any>;
    iconColor?: string;
    iconBg?: string;
    title: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
  }> = ({ icon: Icon, iconColor, iconBg, title, description, value, onValueChange, disabled }) => (
    <View style={[styles.settingRow, { opacity: disabled ? 0.5 : 1 }]}>
      <View style={[styles.settingIcon, { backgroundColor: iconBg || (isDarkMode ? '#374151' : '#F3F4F6') }]}>
        <Icon size={20} color={iconColor || colors.tint} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.settingDescription, { color: colors.tabIconDefault }]}>
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: isDarkMode ? '#4B5563' : '#D1D5DB', true: `${colors.tint}80` }}
        thumbColor={value ? colors.tint : isDarkMode ? '#9CA3AF' : '#FFFFFF'}
        disabled={disabled}
      />
    </View>
  );

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
          Notification Settings
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Toggles */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.tabIconDefault }]}>
            NOTIFICATION CHANNELS
          </Text>
          
          <View style={[styles.card, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
            <SettingRow
              icon={Bell}
              iconColor="#3B82F6"
              iconBg="#DBEAFE"
              title="Push Notifications"
              description="Receive notifications on your device"
              value={pushNotificationsEnabled}
              onValueChange={handlePushToggle}
            />
            
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }]} />
            
            <SettingRow
              icon={Mail}
              iconColor="#10B981"
              iconBg="#D1FAE5"
              title="Email Notifications"
              description="Get updates via email"
              value={emailNotificationsEnabled}
              onValueChange={setEmailNotifications}
            />
            
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }]} />
            
            <SettingRow
              icon={MessageSquare}
              iconColor="#8B5CF6"
              iconBg="#EDE9FE"
              title="SMS Notifications"
              description="Receive text messages for important updates"
              value={smsNotificationsEnabled}
              onValueChange={setSmsNotifications}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.tabIconDefault }]}>
            NOTIFICATION CATEGORIES
          </Text>
          
          <View style={[styles.card, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <React.Fragment key={category.id}>
                  {index > 0 && (
                    <View style={[styles.divider, { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }]} />
                  )}
                  <SettingRow
                    icon={Icon}
                    title={category.title}
                    description={category.description}
                    value={category.enabled}
                    onValueChange={(value) => handleCategoryToggle(category.id, value)}
                    disabled={!pushNotificationsEnabled}
                  />
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* Sound & Vibration */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.tabIconDefault }]}>
            SOUND & VIBRATION
          </Text>
          
          <View style={[styles.card, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
            <SettingRow
              icon={Volume2}
              iconColor="#F59E0B"
              iconBg="#FEF3C7"
              title="Sound"
              description="Play sound for notifications"
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              disabled={!pushNotificationsEnabled}
            />
            
            <View style={[styles.divider, { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }]} />
            
            <SettingRow
              icon={Vibrate}
              iconColor="#EC4899"
              iconBg="#FCE7F3"
              title="Vibration"
              description="Vibrate for notifications"
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              disabled={!pushNotificationsEnabled}
            />
          </View>
        </View>

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.tabIconDefault }]}>
            QUIET HOURS
          </Text>
          
          <View style={[styles.card, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
            <SettingRow
              icon={BellOff}
              iconColor="#6B7280"
              iconBg="#E5E7EB"
              title="Enable Quiet Hours"
              description="Mute notifications during specific hours"
              value={quietHoursEnabled}
              onValueChange={setQuietHoursEnabled}
            />
            
            {quietHoursEnabled && (
              <>
                <View style={[styles.divider, { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }]} />
                
                <View style={styles.quietHoursRow}>
                  <View style={styles.quietHoursItem}>
                    <Text style={[styles.quietHoursLabel, { color: colors.tabIconDefault }]}>
                      From
                    </Text>
                    <TouchableOpacity 
                      style={[styles.timeButton, { backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }]}
                    >
                      <Text style={[styles.timeText, { color: colors.text }]}>
                        {quietHoursStart}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.quietHoursItem}>
                    <Text style={[styles.quietHoursLabel, { color: colors.tabIconDefault }]}>
                      To
                    </Text>
                    <TouchableOpacity 
                      style={[styles.timeButton, { backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }]}
                    >
                      <Text style={[styles.timeText, { color: colors.text }]}>
                        {quietHoursEnd}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
          
          <Text style={[styles.hint, { color: colors.tabIconDefault }]}>
            Emergency alerts will still be delivered during quiet hours
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 70,
  },
  quietHoursRow: {
    flexDirection: 'row',
    padding: 16,
    paddingLeft: 70,
    gap: 16,
  },
  quietHoursItem: {
    flex: 1,
  },
  quietHoursLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  timeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 13,
    marginTop: 8,
    marginLeft: 4,
    fontStyle: 'italic',
  },
});

export default NotificationSettings;
