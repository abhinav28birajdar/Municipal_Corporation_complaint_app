import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ChevronRight,
  User,
  Lock,
  Bell,
  Globe,
  Moon,
  HelpCircle,
  Shield,
  FileText,
  Info,
  LogOut,
  Trash2,
  Link2,
  Smartphone,
} from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';
import { useAuthStore } from '@/store/auth-store';

interface SettingsItemProps {
  icon: any;
  label: string;
  value?: string;
  showChevron?: boolean;
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
  iconColor?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon: Icon,
  label,
  value,
  showChevron = true,
  showToggle = false,
  toggleValue,
  onToggle,
  onPress,
  danger = false,
  iconColor,
}) => {
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';

  const textColor = danger
    ? 'text-red-500'
    : isDark
    ? 'text-white'
    : 'text-gray-900';

  const defaultIconColor = danger
    ? '#ef4444'
    : isDark
    ? '#9ca3af'
    : '#6b7280';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={showToggle}
      className={`flex-row items-center px-4 py-4 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
          isDark ? 'bg-gray-700' : 'bg-gray-100'
        }`}
      >
        <Icon size={20} color={iconColor || defaultIconColor} />
      </View>
      <View className="flex-1">
        <Text className={`font-medium ${textColor}`}>{label}</Text>
        {value && (
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {value}
          </Text>
        )}
      </View>
      {showToggle && onToggle && (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: '#9ca3af', true: '#3b82f6' }}
          thumbColor="#ffffff"
        />
      )}
      {showChevron && !showToggle && (
        <ChevronRight size={20} color={isDark ? '#6b7280' : '#9ca3af'} />
      )}
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const { themeMode, setThemeMode, language } = useSettingsStore();
  const { logout, user } = useAuthStore();
  const isDark = themeMode === 'dark';

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getLanguageName = () => {
    switch (language) {
      case 'hi':
        return 'हिंदी';
      case 'mr':
        return 'मराठी';
      default:
        return 'English';
    }
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <View className={`px-4 py-2 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Text className={`text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {title}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      edges={['top']}
    >
      {/* Header */}
      <View
        className={`px-6 py-4 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${
          isDark ? 'border-gray-700' : 'border-gray-100'
        }`}
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color={isDark ? '#fff' : '#1f2937'} />
          </TouchableOpacity>
          <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <SectionHeader title="Account" />
        <View className={`rounded-none ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <SettingsItem
            icon={User}
            label="Edit Profile"
            value={user?.name || 'Update your profile'}
            onPress={() => router.push('/settings/edit-profile')}
            iconColor="#3b82f6"
          />
          <View className={`h-px ml-16 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
          <SettingsItem
            icon={Lock}
            label="Change Password"
            onPress={() => router.push('/settings/change-password')}
            iconColor="#8b5cf6"
          />
          <View className={`h-px ml-16 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
          <SettingsItem
            icon={Link2}
            label="Linked Accounts"
            value="Google, Phone"
            onPress={() => router.push('/settings/linked-accounts')}
            iconColor="#14b8a6"
          />
          <View className={`h-px ml-16 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
          <SettingsItem
            icon={Smartphone}
            label="Active Sessions"
            onPress={() => router.push('/settings/sessions')}
            iconColor="#f59e0b"
          />
        </View>

        {/* Preferences Section */}
        <SectionHeader title="Preferences" />
        <View className={`rounded-none ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <SettingsItem
            icon={Bell}
            label="Notifications"
            value="Manage notification preferences"
            onPress={() => router.push('/settings/notifications')}
            iconColor="#ef4444"
          />
          <View className={`h-px ml-16 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
          <SettingsItem
            icon={Globe}
            label="Language"
            value={getLanguageName()}
            onPress={() => router.push('/settings/language')}
            iconColor="#22c55e"
          />
          <View className={`h-px ml-16 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
          <SettingsItem
            icon={Moon}
            label="Dark Mode"
            showChevron={false}
            showToggle={true}
            toggleValue={isDark}
            onToggle={(value) => setThemeMode(value ? 'dark' : 'light')}
          />
        </View>

        {/* Support Section */}
        <SectionHeader title="Support" />
        <View className={`rounded-none ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <SettingsItem
            icon={HelpCircle}
            label="Help & FAQ"
            onPress={() => router.push('/settings/about')}
            iconColor="#6366f1"
          />
          <View className={`h-px ml-16 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
          <SettingsItem
            icon={Info}
            label="About"
            value="Version 1.0.0"
            onPress={() => router.push('/settings/about')}
            iconColor="#0ea5e9"
          />
        </View>

        {/* Legal Section */}
        <SectionHeader title="Legal" />
        <View className={`rounded-none ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <SettingsItem
            icon={Shield}
            label="Privacy Policy"
            onPress={() => router.push('/settings/privacy-policy')}
            iconColor="#64748b"
          />
          <View className={`h-px ml-16 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
          <SettingsItem
            icon={FileText}
            label="Terms of Service"
            onPress={() => router.push('/settings/terms')}
            iconColor="#64748b"
          />
        </View>

        {/* Account Actions */}
        <SectionHeader title="Account Actions" />
        <View className={`rounded-none ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <SettingsItem
            icon={LogOut}
            label="Logout"
            showChevron={false}
            onPress={handleLogout}
            danger
          />
          <View className={`h-px ml-16 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />
          <SettingsItem
            icon={Trash2}
            label="Delete Account"
            showChevron={false}
            onPress={() => router.push('/settings/delete-account')}
            danger
          />
        </View>

        {/* Footer */}
        <View className="items-center py-8">
          <Text className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Municipal Corporation App
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
            Version 1.0.0 (Build 1)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
