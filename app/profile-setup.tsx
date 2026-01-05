import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as LocalAuthentication from 'expo-local-authentication';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { useAuthStore } from '@/store/auth-store';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  User,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Globe,
  Bell,
  Shield,
  Check,
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';

const steps = [
  { id: 1, title: 'Profile Photo' },
  { id: 2, title: 'Personal Info' },
  { id: 3, title: 'Contact Details' },
  { id: 4, title: 'Preferences' },
];

interface ProfileData {
  avatar: string | null;
  fullName: string;
  bio: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  ward: string;
  zone: string;
  language: string;
  notificationsEnabled: boolean;
  biometricEnabled: boolean;
}

export default function ProfileSetupWizard() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    avatar: user?.avatar || null,
    fullName: user?.name || '',
    bio: '',
    phone: user?.phone || '',
    alternatePhone: '',
    address: user?.address || '',
    city: '',
    state: '',
    pincode: '',
    ward: '',
    zone: '',
    language: 'en',
    notificationsEnabled: true,
    biometricEnabled: false,
  });

  const updateProfileData = (field: keyof ProfileData, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateProfileData('avatar', result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateProfileData('avatar', result.assets[0].uri);
    }
  };

  const setupBiometric = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware) {
      Alert.alert('Not Available', 'Biometric authentication is not available on this device.');
      return;
    }

    if (!isEnrolled) {
      Alert.alert('Not Set Up', 'Please set up biometric authentication in your device settings first.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Enable biometric login',
      fallbackLabel: 'Use passcode',
    });

    if (result.success) {
      updateProfileData('biometricEnabled', true);
      Alert.alert('Success', 'Biometric login enabled!');
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      // Upload avatar if changed
      let avatarUrl = profileData.avatar;
      if (profileData.avatar && profileData.avatar.startsWith('file://')) {
        // Upload to Supabase Storage
        const filename = `avatars/${user?.id}_${Date.now()}.jpg`;
        const response = await fetch(profileData.avatar);
        const blob = await response.blob();
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(filename, blob);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(filename);
        
        avatarUrl = publicUrl;
      }

      // Update user profile
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: profileData.fullName,
          avatar: avatarUrl,
          phone: profileData.phone,
          address: `${profileData.address}, ${profileData.city}, ${profileData.state} - ${profileData.pincode}`,
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Update preferences
      const { error: prefError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          language: profileData.language,
          notifications_enabled: profileData.notificationsEnabled,
        });

      if (prefError) throw prefError;

      Alert.alert('Success', 'Profile setup complete!', [
        { text: 'Continue', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (error: any) {
      console.error('Profile setup error:', error);
      Alert.alert('Error', error.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Profile Photo
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Add Profile Photo</Text>
            <Text style={styles.stepDescription}>
              Add a photo to personalize your account. This helps municipal staff identify you.
            </Text>

            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                {profileData.avatar ? (
                  <Image
                    source={{ uri: profileData.avatar }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <User size={60} color="#9CA3AF" />
                  </View>
                )}
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={pickImage}
                >
                  <Camera size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.avatarActions}>
                <TouchableOpacity
                  style={styles.avatarActionButton}
                  onPress={pickImage}
                >
                  <Text style={styles.avatarActionText}>Choose from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.avatarActionButton}
                  onPress={takePhoto}
                >
                  <Text style={styles.avatarActionText}>Take a Photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={nextStep}
            >
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        );

      case 1: // Personal Info
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Personal Information</Text>
            <Text style={styles.stepDescription}>
              Tell us more about yourself. This information helps us serve you better.
            </Text>

            <View style={styles.formGroup}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={profileData.fullName}
                onChangeText={(text) => updateProfileData('fullName', text)}
                leftIcon={<User size={20} color={colors.textSecondary} />}
                autoCapitalize="words"
              />

              <Input
                label="Bio (Optional)"
                placeholder="A short description about yourself"
                value={profileData.bio}
                onChangeText={(text) => updateProfileData('bio', text)}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        );

      case 2: // Contact Details
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Contact & Location</Text>
            <Text style={styles.stepDescription}>
              Provide your contact details and location for complaint registration.
            </Text>

            <View style={styles.formGroup}>
              <Input
                label="Phone Number"
                placeholder="+91 9876543210"
                value={profileData.phone}
                onChangeText={(text) => updateProfileData('phone', text)}
                leftIcon={<Phone size={20} color={colors.textSecondary} />}
                keyboardType="phone-pad"
              />

              <Input
                label="Alternate Phone (Optional)"
                placeholder="+91 9876543210"
                value={profileData.alternatePhone}
                onChangeText={(text) => updateProfileData('alternatePhone', text)}
                leftIcon={<Phone size={20} color={colors.textSecondary} />}
                keyboardType="phone-pad"
              />

              <Input
                label="Address"
                placeholder="Street address"
                value={profileData.address}
                onChangeText={(text) => updateProfileData('address', text)}
                leftIcon={<MapPin size={20} color={colors.textSecondary} />}
              />

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Input
                    label="City"
                    placeholder="City"
                    value={profileData.city}
                    onChangeText={(text) => updateProfileData('city', text)}
                  />
                </View>
                <View style={styles.flex1}>
                  <Input
                    label="State"
                    placeholder="State"
                    value={profileData.state}
                    onChangeText={(text) => updateProfileData('state', text)}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Input
                    label="PIN Code"
                    placeholder="123456"
                    value={profileData.pincode}
                    onChangeText={(text) => updateProfileData('pincode', text)}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.flex1}>
                  <Input
                    label="Ward (Optional)"
                    placeholder="Ward No."
                    value={profileData.ward}
                    onChangeText={(text) => updateProfileData('ward', text)}
                  />
                </View>
              </View>
            </View>
          </View>
        );

      case 3: // Preferences
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>App Preferences</Text>
            <Text style={styles.stepDescription}>
              Customize how you want to use MuniServe.
            </Text>

            <View style={styles.preferencesContainer}>
              {/* Language */}
              <Card style={styles.preferenceCard}>
                <View style={styles.preferenceHeader}>
                  <Globe size={24} color={colors.primary} />
                  <Text style={styles.preferenceTitle}>Language</Text>
                </View>
                <View style={styles.languageOptions}>
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिंदी' },
                    { code: 'mr', label: 'मराठी' },
                  ].map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.languageOption,
                        profileData.language === lang.code && styles.languageOptionActive,
                      ]}
                      onPress={() => updateProfileData('language', lang.code)}
                    >
                      <Text
                        style={[
                          styles.languageOptionText,
                          profileData.language === lang.code && styles.languageOptionTextActive,
                        ]}
                      >
                        {lang.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>

              {/* Notifications */}
              <Card style={styles.preferenceCard}>
                <TouchableOpacity
                  style={styles.preferenceRow}
                  onPress={() => updateProfileData('notificationsEnabled', !profileData.notificationsEnabled)}
                >
                  <View style={styles.preferenceInfo}>
                    <Bell size={24} color={colors.primary} />
                    <View style={styles.preferenceTextContainer}>
                      <Text style={styles.preferenceTitle}>Push Notifications</Text>
                      <Text style={styles.preferenceDescription}>
                        Receive updates about your complaints
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.toggle,
                    profileData.notificationsEnabled && styles.toggleActive,
                  ]}>
                    {profileData.notificationsEnabled && (
                      <Check size={16} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
              </Card>

              {/* Biometric */}
              <Card style={styles.preferenceCard}>
                <TouchableOpacity
                  style={styles.preferenceRow}
                  onPress={setupBiometric}
                >
                  <View style={styles.preferenceInfo}>
                    <Shield size={24} color={colors.primary} />
                    <View style={styles.preferenceTextContainer}>
                      <Text style={styles.preferenceTitle}>Biometric Login</Text>
                      <Text style={styles.preferenceDescription}>
                        Use fingerprint or Face ID to login
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.toggle,
                    profileData.biometricEnabled && styles.toggleActive,
                  ]}>
                    {profileData.biometricEnabled && (
                      <Check size={16} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
              </Card>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={prevStep}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setup Profile</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicatorContainer}>
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          completedSteps={Array.from({ length: currentStep }, (_, i) => i)}
        />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderStepContent()}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomContainer}>
        <Button
          title={currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
          onPress={nextStep}
          isLoading={isLoading}
          rightIcon={<ArrowRight size={20} color="#FFFFFF" />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  stepIndicatorContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  stepContent: {
    flex: 1,
    paddingVertical: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  avatarImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarActions: {
    gap: 12,
  },
  avatarActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  avatarActionText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    color: '#6B7280',
  },
  formGroup: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  preferencesContainer: {
    gap: 16,
  },
  preferenceCard: {
    padding: 16,
  },
  preferenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  preferenceTextContainer: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  preferenceDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  languageOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  languageOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  languageOptionActive: {
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
  },
  languageOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  languageOptionTextActive: {
    color: colors.primary,
  },
  toggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  bottomContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
});
