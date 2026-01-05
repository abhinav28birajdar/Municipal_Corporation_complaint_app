import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth-store';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  Trash2,
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';

interface FormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  bio: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    bio: user?.bio || '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    // Check for unsaved changes
    const originalData = {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      pincode: user?.pincode || '',
      bio: user?.bio || '',
    };
    
    const hasDataChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    const hasAvatarChange = avatar !== (user?.avatar || null);
    setHasChanges(hasDataChanges || hasAvatarChange);
  }, [formData, avatar, user]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    if (formData.pincode && !/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Invalid pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to update your profile photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploading(true);
        try {
          const asset = result.assets[0];
          const fileName = `avatar_${user?.id}_${Date.now()}.jpg`;
          
          // Upload to Supabase Storage
          const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, {
              uri: asset.uri,
              type: 'image/jpeg',
              name: fileName,
            } as any);

          if (error) throw error;

          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

          setAvatar(urlData.publicUrl);
        } catch (error) {
          console.error('Upload error:', error);
          // For development, just use local URI
          setAvatar(result.assets[0].uri);
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera permissions to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleRemoveAvatar = () => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove your profile photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setAvatar(null),
        },
      ]
    );
  };

  const handleShowImageOptions = () => {
    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: handleTakePhoto },
        { text: 'Choose from Library', onPress: handleSelectImage },
        ...(avatar ? [{ text: 'Remove Photo', onPress: handleRemoveAvatar, style: 'destructive' as const }] : []),
        { text: 'Cancel', style: 'cancel' as const },
      ]
    );
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Update user profile in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          bio: formData.bio,
          avatar: avatar,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Update local state
      updateUser({
        ...user!,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        bio: formData.bio,
        avatar: avatar,
      });

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleCancel}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!hasChanges || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Save size={24} color={hasChanges ? colors.primary : '#9CA3AF'} />
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={handleShowImageOptions}
              disabled={isUploading}
            >
              <Avatar
                source={avatar}
                name={formData.name}
                size="xl"
              />
              <View style={styles.cameraButton}>
                {isUploading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Camera size={16} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Tap to change photo</Text>
          </View>

          {/* Personal Information */}
          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => updateField('name', value)}
              error={errors.name}
              leftIcon={<User size={20} color="#6B7280" />}
              autoCapitalize="words"
            />
            
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              error={errors.email}
              leftIcon={<Mail size={20} color="#6B7280" />}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(value) => updateField('phone', value)}
              error={errors.phone}
              leftIcon={<Phone size={20} color="#6B7280" />}
              keyboardType="phone-pad"
            />
            
            <Input
              label="Date of Birth"
              placeholder="DD/MM/YYYY"
              value={formData.dateOfBirth}
              onChangeText={(value) => updateField('dateOfBirth', value)}
              error={errors.dateOfBirth}
              leftIcon={<Calendar size={20} color="#6B7280" />}
            />
            
            <Input
              label="Bio"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChangeText={(value) => updateField('bio', value)}
              multiline
              numberOfLines={3}
              style={styles.bioInput}
            />
          </Card>

          {/* Address Information */}
          <Card style={styles.formCard}>
            <Text style={styles.sectionTitle}>Address</Text>
            
            <Input
              label="Street Address"
              placeholder="Enter your street address"
              value={formData.address}
              onChangeText={(value) => updateField('address', value)}
              error={errors.address}
              leftIcon={<MapPin size={20} color="#6B7280" />}
            />
            
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Input
                  label="City"
                  placeholder="City"
                  value={formData.city}
                  onChangeText={(value) => updateField('city', value)}
                  error={errors.city}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label="State"
                  placeholder="State"
                  value={formData.state}
                  onChangeText={(value) => updateField('state', value)}
                  error={errors.state}
                />
              </View>
            </View>
            
            <Input
              label="Pincode"
              placeholder="Enter pincode"
              value={formData.pincode}
              onChangeText={(value) => updateField('pincode', value)}
              error={errors.pincode}
              keyboardType="number-pad"
              maxLength={6}
            />
          </Card>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={isLoading}
              disabled={!hasChanges}
              leftIcon={<Save size={18} color="#FFFFFF" />}
            />
            <Button
              title="Cancel"
              variant="outline"
              onPress={handleCancel}
              style={styles.cancelButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarHint: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  formCard: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 8,
    gap: 12,
  },
  cancelButton: {
    borderColor: '#D1D5DB',
  },
});
