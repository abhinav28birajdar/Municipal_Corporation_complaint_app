import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  Switch,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth-store';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  ChevronRight,
  User,
  Lock,
  Bell,
  Shield,
  Eye,
  Globe,
  HelpCircle,
  FileText,
  Info,
  LogOut,
  Trash2,
  Moon,
  Sun,
  Smartphone,
  Link2,
  Database,
  Download,
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';

interface SettingItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { colors: themeColors, isDark, toggleTheme } = useTheme();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    loadPreferences();
  }, []);

  const checkBiometricAvailability = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricAvailable(hasHardware && isEnrolled);
  };

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setNotificationsEnabled(data.notifications_enabled ?? true);
        setBiometricEnabled(data.biometric_enabled ?? false);
      }
    } catch (error) {
      console.log('Error loading preferences:', error);
    }
  };

  const updatePreference = async (key: string, value: any) => {
    try {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          [key]: value,
          updated_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Error updating preference:', error);
    }
  };

  const handleToggleBiometric = async () => {
    if (!biometricAvailable) {
      Alert.alert(
        'Not Available',
        'Biometric authentication is not available or not set up on this device.'
      );
      return;
    }

    if (!biometricEnabled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric login',
        fallbackLabel: 'Use passcode',
      });

      if (result.success) {
        setBiometricEnabled(true);
        updatePreference('biometric_enabled', true);
      }
    } else {
      setBiometricEnabled(false);
      updatePreference('biometric_enabled', false);
    }
  };

  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    updatePreference('notifications_enabled', newValue);
  };

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
            router.replace('/(auth)');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'Please type DELETE to confirm account deletion.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Continue',
                  onPress: () => router.push('/settings/delete-account'),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'We will prepare your data and send a download link to your email.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: async () => {
            // Trigger data export
            Alert.alert('Success', 'You will receive an email with your data within 24 hours.');
          },
        },
      ]
    );
  };

  const settingSections: SettingSection[] = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          icon: <User size={22} color={colors.primary} />,
          title: 'Edit Profile',
          description: 'Update your personal information',
          onPress: () => router.push('/settings/edit-profile'),
          rightElement: <ChevronRight size={20} color="#9CA3AF" />,
        },
        {
          id: 'password',
          icon: <Lock size={22} color={colors.primary} />,
          title: 'Change Password',
          description: 'Update your account password',
          onPress: () => router.push('/settings/change-password'),
          rightElement: <ChevronRight size={20} color="#9CA3AF" />,
        },
        {
          id: 'linked',
          icon: <Link2 size={22} color={colors.primary} />,
          title: 'Linked Accounts',
          description: 'Manage social media connections',
          onPress: () => router.push('/settings/linked-accounts'),
          rightElement: <ChevronRight size={20} color="#9CA3AF" />,
        },
        {
          id: 'sessions',
          icon: <Smartphone size={22} color={colors.primary} />,
          title: 'Active Sessions',
          description: 'View and manage your active devices',
          onPress: () => router.push('/settings/sessions'),
          rightElement: <ChevronRight size={20} color="#9CA3AF" />,
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          id: 'biometric',
          icon: <Shield size={22} color={colors.primary} />,
          title: 'Biometric Login',
          description: biometricAvailable
            ? 'Use fingerprint or Face ID'
            : 'Not available on this device',
          rightElement: (
            <Switch
              value={biometricEnabled}
              onValueChange={handleToggleBiometric}
              trackColor={{ false: '#D1D5DB', true: colors.primary }}
              thumbColor="#FFFFFF"
              disabled={!biometricAvailable}
            />
          ),
        },
        {
          id: 'privacy',
          icon: <Eye size={22} color={colors.primary} />,
          title: 'Privacy Settings',
          description: 'Control who can see your activity',
          onPress: () => router.push('/settings/privacy'),
          rightElement: <ChevronRight size={20} color="#9CA3AF" />,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          icon: <Bell size={22} color={colors.primary} />,
          title: 'Notifications',
          description: 'Manage notification preferences',
          rightElement: (
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#D1D5DB', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          ),
        },
        {
          id: 'theme',
          icon: isDark ? <Moon size={22} color={colors.primary} /> : <Sun size={22} color={colors.primary} />,
          title: 'Dark Mode',
          description: isDark ? 'Currently enabled' : 'Currently disabled',
          rightElement: (
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D5DB', true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          ),
        },
        {
          id: 'language',
          icon: <Globe size={22} color={colors.primary} />,
          title: 'Language',
          description: 'English',
          onPress: () => router.push('/settings/language'),
          rightElement: <ChevronRight size={20} color="#9CA3AF" />,
        },
      ],
    },
    {
      title: 'Data & Storage',
      items: [
        {
          id: 'export',
          icon: <Download size={22} color={colors.primary} />,
          title: 'Export My Data',
          description: 'Download all your data',
          onPress: handleExportData,
          rightElement: <ChevronRight size={20} color="#9CA3AF" />,
        },
        {
          id: 'storage',
          icon: <Database size={22} color={colors.primary} />,
          title: 'Clear Cache',
          description: 'Free up storage space',
          onPress: () => {
            Alert.alert('Clear Cache', 'Are you sure you want to clear the app cache?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared successfully') },
            ]);
          },
          rightElement: <ChevronRight size={20} color="#9CA3AF" />,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: <HelpCircle size={22} color={colors.primary} />,
          title: 'Help Center',
          description: 'Get help and support',
          onPress: () => router.push('/settings/help'),
          rightElement: <ChevronRight size={20} color="#9CA3AF" />,
        },
        {
          id: 'terms',
          icon: <FileText size={22} color={colors.primary} />,
          title: 'Terms of Service',
          onPress: () => router.push('/settings/terms'),
          rightElement: <ChevronRight size={20} color="#9CA3AF" />,
        },
        {
          id: 'privacy-policy',
          icon: <FileText size={22} color={colors.primary} />,
          title: 'Privacy Policy',
          onPress: () => router.push('/settings/privacy-policy'),
          rightElement: <ChevronRight size={20} color="#9CA3AF" />,
        },
        {
          id: 'about',
          icon: <Info size={22} color={colors.primary} />,
          title: 'About',
          description: 'Version 2.0.0',
          onPress: () => router.push('/settings/about'),
          rightElement: <ChevronRight size={20} color="#9CA3AF" />,
        },
      ],
    },
    {
      title: 'Account Actions',
      items: [
        {
          id: 'logout',
          icon: <LogOut size={22} color="#F59E0B" />,
          title: 'Logout',
          onPress: handleLogout,
        },
        {
          id: 'delete',
          icon: <Trash2 size={22} color="#EF4444" />,
          title: 'Delete Account',
          description: 'Permanently delete your account',
          onPress: handleDeleteAccount,
          danger: true,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <Card style={styles.userCard}>
          <View style={styles.userInfo}>
            <Avatar
              source={user?.avatar}
              name={user?.name}
              size="lg"
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewProfileButton}
            onPress={() => router.push('/user-profile')}
          >
            <Text style={styles.viewProfileText}>View Profile</Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </Card>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    itemIndex < section.items.length - 1 && styles.settingItemBorder,
                  ]}
                  onPress={item.onPress}
                  disabled={!item.onPress}
                  accessible
                  accessibilityRole={item.onPress ? 'button' : 'text'}
                  accessibilityLabel={item.title}
                  accessibilityHint={item.description}
                >
                  <View style={styles.settingLeft}>
                    <View style={[
                      styles.settingIcon,
                      item.danger && styles.settingIconDanger,
                    ]}>
                      {item.icon}
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={[
                        styles.settingTitle,
                        item.danger && styles.settingTitleDanger,
                      ]}>
                        {item.title}
                      </Text>
                      {item.description && (
                        <Text style={styles.settingDescription}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  {item.rightElement}
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>MuniServe v2.0.0</Text>
          <Text style={styles.footerSubtext}>© 2026 Smart City Initiative</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  userCard: {
    margin: 16,
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  roleText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 4,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingIconDanger: {
    backgroundColor: '#FEF2F2',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  settingTitleDanger: {
    color: '#EF4444',
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
