import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StatusBar,
  TextInput,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  Settings,
  Bell,
  Shield,
  Database,
  Globe,
  Clock,
  Mail,
  Smartphone,
  Building2,
  Palette,
  ChevronRight,
  Save,
  RotateCcw,
  Info,
  AlertTriangle,
  CheckCircle,
  X,
  Upload,
  Download,
  Trash2,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface SettingSection {
  id: string;
  title: string;
  icon: any;
  color: string;
  settings: Setting[];
}

interface Setting {
  id: string;
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'input' | 'action';
  value?: any;
  options?: { value: string; label: string }[];
  dangerous?: boolean;
}

export default function SystemSettingsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const [settings, setSettings] = useState<{
    notifications: {
      emailNotifications: boolean;
      pushNotifications: boolean;
      smsNotifications: boolean;
      dailyDigest: boolean;
      weeklyReport: boolean;
    };
    security: {
      twoFactorAuth: boolean;
      sessionTimeout: string;
      passwordExpiry: string;
      ipWhitelist: boolean;
      auditLogging: boolean;
    };
    system: {
      maintenanceMode: boolean;
      debugMode: boolean;
      cacheEnabled: boolean;
      autoBackup: boolean;
      backupFrequency: string;
    };
    complaints: {
      autoAssignment: boolean;
      escalationEnabled: boolean;
      escalationTime: string;
      maxAttachments: string;
      allowAnonymous: boolean;
    };
    appearance: {
      theme: string;
      language: string;
      dateFormat: string;
      timezone: string;
    };
  }>({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      dailyDigest: true,
      weeklyReport: true,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: '30',
      passwordExpiry: '90',
      ipWhitelist: false,
      auditLogging: true,
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      cacheEnabled: true,
      autoBackup: true,
      backupFrequency: 'daily',
    },
    complaints: {
      autoAssignment: true,
      escalationEnabled: true,
      escalationTime: '24',
      maxAttachments: '5',
      allowAnonymous: false,
    },
    appearance: {
      theme: 'system',
      language: 'en',
      dateFormat: 'DD/MM/YYYY',
      timezone: 'Asia/Kolkata',
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadSettings();
    setRefreshing(false);
  }, []);

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setHasChanges(false);
    Alert.alert('Success', 'Settings saved successfully');
  };

  const handleDangerousAction = (action: string) => {
    setPendingAction(action);
    setShowConfirmModal(true);
  };

  const confirmDangerousAction = async () => {
    if (!pendingAction) return;

    setShowConfirmModal(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    switch (pendingAction) {
      case 'clearCache':
        Alert.alert('Cache Cleared', 'Application cache has been cleared.');
        break;
      case 'resetDefaults':
        Alert.alert('Reset Complete', 'All settings have been reset to defaults.');
        break;
      case 'exportData':
        Alert.alert('Export Started', 'Data export has been initiated. You will receive an email when ready.');
        break;
    }

    setPendingAction(null);
  };

  const renderToggle = (
    section: string,
    key: string,
    label: string,
    description?: string
  ) => {
    const value = settings[section as keyof typeof settings][key as keyof typeof settings[keyof typeof settings]];
    
    return (
      <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
        <View className="flex-1 mr-4">
          <Text className="text-gray-900 font-medium">{label}</Text>
          {description && (
            <Text className="text-gray-500 text-sm mt-1">{description}</Text>
          )}
        </View>
        <Switch
          value={value as boolean}
          onValueChange={(v) => updateSetting(section, key, v)}
          trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
          thumbColor={value ? '#fff' : '#f4f3f4'}
        />
      </View>
    );
  };

  const renderSelect = (
    section: string,
    key: string,
    label: string,
    options: { value: string; label: string }[],
    description?: string
  ) => {
    const value = settings[section as keyof typeof settings][key as keyof typeof settings[keyof typeof settings]];
    const selectedOption = options.find(o => o.value === value);

    return (
      <TouchableOpacity
        className="flex-row items-center justify-between py-4 border-b border-gray-100"
        onPress={() => {
          // In a real app, this would open a picker/modal
          const currentIndex = options.findIndex(o => o.value === value);
          const nextIndex = (currentIndex + 1) % options.length;
          updateSetting(section, key, options[nextIndex].value);
        }}
      >
        <View className="flex-1 mr-4">
          <Text className="text-gray-900 font-medium">{label}</Text>
          {description && (
            <Text className="text-gray-500 text-sm mt-1">{description}</Text>
          )}
        </View>
        <View className="flex-row items-center">
          <Text className="text-blue-600 mr-2">{selectedOption?.label}</Text>
          <ChevronRight size={18} color="#6b7280" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderActionButton = (
    label: string,
    icon: any,
    color: string,
    onPress: () => void,
    dangerous?: boolean
  ) => (
    <TouchableOpacity
      className={`flex-row items-center py-4 border-b border-gray-100`}
      onPress={onPress}
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: color + '20' }}
      >
        {React.createElement(icon, { size: 20, color })}
      </View>
      <Text className={`flex-1 font-medium ${dangerous ? 'text-red-500' : 'text-gray-900'}`}>
        {label}
      </Text>
      <ChevronRight size={18} color={dangerous ? '#ef4444' : '#6b7280'} />
    </TouchableOpacity>
  );

  const renderSection = (
    title: string,
    icon: any,
    color: string,
    children: React.ReactNode
  ) => (
    <Animated.View
      entering={FadeInDown.springify()}
      className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
    >
      <View className="flex-row items-center mb-4">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: color + '20' }}
        >
          {React.createElement(icon, { size: 20, color })}
        </View>
        <Text className="text-gray-900 font-bold text-lg">{title}</Text>
      </View>
      {children}
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['#374151', '#4b5563']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>

          <Text className="text-white text-lg font-semibold">System Settings</Text>

          <TouchableOpacity
            className={`w-10 h-10 rounded-full items-center justify-center ${
              hasChanges ? 'bg-green-500' : 'bg-white/20'
            }`}
            onPress={hasChanges ? handleSave : undefined}
            disabled={!hasChanges}
          >
            <Save size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {hasChanges && (
          <View className="mt-4 bg-amber-500/20 rounded-xl px-4 py-2 flex-row items-center">
            <AlertTriangle size={16} color="#fcd34d" />
            <Text className="text-amber-200 ml-2 text-sm">You have unsaved changes</Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {/* Notifications */}
        {renderSection('Notifications', Bell, '#3b82f6', (
          <>
            {renderToggle('notifications', 'emailNotifications', 'Email Notifications', 'Receive important updates via email')}
            {renderToggle('notifications', 'pushNotifications', 'Push Notifications', 'Get instant push notifications')}
            {renderToggle('notifications', 'smsNotifications', 'SMS Notifications', 'Receive SMS for critical alerts')}
            {renderToggle('notifications', 'dailyDigest', 'Daily Digest', 'Receive daily summary email')}
            {renderToggle('notifications', 'weeklyReport', 'Weekly Report', 'Receive weekly analytics report')}
          </>
        ))}

        {/* Security */}
        {renderSection('Security', Shield, '#ef4444', (
          <>
            {renderToggle('security', 'twoFactorAuth', 'Two-Factor Authentication', 'Require 2FA for all admin accounts')}
            {renderSelect(
              'security',
              'sessionTimeout',
              'Session Timeout',
              [
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '60', label: '1 hour' },
                { value: '120', label: '2 hours' },
              ],
              'Auto-logout after inactivity'
            )}
            {renderSelect(
              'security',
              'passwordExpiry',
              'Password Expiry',
              [
                { value: '30', label: '30 days' },
                { value: '60', label: '60 days' },
                { value: '90', label: '90 days' },
                { value: '180', label: '180 days' },
              ],
              'Force password change interval'
            )}
            {renderToggle('security', 'ipWhitelist', 'IP Whitelist', 'Restrict admin access to specific IPs')}
            {renderToggle('security', 'auditLogging', 'Audit Logging', 'Log all administrative actions')}
          </>
        ))}

        {/* System */}
        {renderSection('System', Settings, '#6b7280', (
          <>
            {renderToggle('system', 'maintenanceMode', 'Maintenance Mode', 'Disable public access temporarily')}
            {renderToggle('system', 'debugMode', 'Debug Mode', 'Enable detailed error logging')}
            {renderToggle('system', 'cacheEnabled', 'Cache Enabled', 'Enable system caching for better performance')}
            {renderToggle('system', 'autoBackup', 'Auto Backup', 'Automatic database backup')}
            {renderSelect(
              'system',
              'backupFrequency',
              'Backup Frequency',
              [
                { value: 'hourly', label: 'Hourly' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
              ],
              'How often to backup data'
            )}
          </>
        ))}

        {/* Complaints */}
        {renderSection('Complaints', Building2, '#22c55e', (
          <>
            {renderToggle('complaints', 'autoAssignment', 'Auto Assignment', 'Automatically assign complaints to available employees')}
            {renderToggle('complaints', 'escalationEnabled', 'Escalation', 'Enable automatic escalation')}
            {renderSelect(
              'complaints',
              'escalationTime',
              'Escalation Time',
              [
                { value: '12', label: '12 hours' },
                { value: '24', label: '24 hours' },
                { value: '48', label: '48 hours' },
                { value: '72', label: '72 hours' },
              ],
              'Time before escalation triggers'
            )}
            {renderSelect(
              'complaints',
              'maxAttachments',
              'Max Attachments',
              [
                { value: '3', label: '3 files' },
                { value: '5', label: '5 files' },
                { value: '10', label: '10 files' },
              ],
              'Maximum attachments per complaint'
            )}
            {renderToggle('complaints', 'allowAnonymous', 'Anonymous Complaints', 'Allow citizens to file anonymous complaints')}
          </>
        ))}

        {/* Appearance */}
        {renderSection('Appearance', Palette, '#8b5cf6', (
          <>
            {renderSelect(
              'appearance',
              'theme',
              'Theme',
              [
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
                { value: 'system', label: 'System' },
              ]
            )}
            {renderSelect(
              'appearance',
              'language',
              'Language',
              [
                { value: 'en', label: 'English' },
                { value: 'hi', label: 'Hindi' },
                { value: 'mr', label: 'Marathi' },
                { value: 'gu', label: 'Gujarati' },
              ]
            )}
            {renderSelect(
              'appearance',
              'dateFormat',
              'Date Format',
              [
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
              ]
            )}
            {renderSelect(
              'appearance',
              'timezone',
              'Timezone',
              [
                { value: 'Asia/Kolkata', label: 'IST (Asia/Kolkata)' },
                { value: 'UTC', label: 'UTC' },
              ]
            )}
          </>
        ))}

        {/* Data Management */}
        {renderSection('Data Management', Database, '#f59e0b', (
          <>
            {renderActionButton('Export All Data', Download, '#3b82f6', () => handleDangerousAction('exportData'))}
            {renderActionButton('Import Data', Upload, '#22c55e', () => router.push('/admin/import-data'))}
            {renderActionButton('Clear Cache', Trash2, '#f59e0b', () => handleDangerousAction('clearCache'))}
            {renderActionButton('Reset to Defaults', RotateCcw, '#ef4444', () => handleDangerousAction('resetDefaults'), true)}
          </>
        ))}
      </ScrollView>

      {/* Save Button (Fixed at bottom) */}
      {hasChanges && (
        <View className="absolute bottom-6 left-4 right-4">
          <TouchableOpacity
            className="bg-blue-500 rounded-xl py-4 flex-row items-center justify-center shadow-lg"
            onPress={handleSave}
          >
            <Save size={20} color="#fff" />
            <Text className="text-white font-bold text-lg ml-2">Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <View className="items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-amber-100 items-center justify-center mb-4">
                <AlertTriangle size={32} color="#f59e0b" />
              </View>
              <Text className="text-gray-900 font-bold text-xl">Confirm Action</Text>
              <Text className="text-gray-500 text-center mt-2">
                {pendingAction === 'clearCache' && 'This will clear all cached data. The app may be slower temporarily.'}
                {pendingAction === 'resetDefaults' && 'This will reset all settings to their default values. This cannot be undone.'}
                {pendingAction === 'exportData' && 'This will export all system data. You will receive an email with the download link.'}
              </Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-xl py-3 items-center"
                onPress={() => setShowConfirmModal(false)}
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 rounded-xl py-3 items-center ${
                  pendingAction === 'resetDefaults' ? 'bg-red-500' : 'bg-blue-500'
                }`}
                onPress={confirmDangerousAction}
              >
                <Text className="text-white font-semibold">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
