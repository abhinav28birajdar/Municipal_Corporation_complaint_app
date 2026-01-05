import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth-store';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';

interface PasswordRequirement {
  label: string;
  validator: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters',
    validator: (pwd) => pwd.length >= 8,
  },
  {
    label: 'Contains uppercase letter',
    validator: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    label: 'Contains lowercase letter',
    validator: (pwd) => /[a-z]/.test(pwd),
  },
  {
    label: 'Contains a number',
    validator: (pwd) => /[0-9]/.test(pwd),
  },
  {
    label: 'Contains special character (!@#$%^&*)',
    validator: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  },
];

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const strengthProgress = useSharedValue(0);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    passwordRequirements.forEach((req) => {
      if (req.validator(password)) strength++;
    });
    return strength / passwordRequirements.length;
  };

  const getStrengthLabel = (strength: number): string => {
    if (strength === 0) return 'Very Weak';
    if (strength <= 0.25) return 'Weak';
    if (strength <= 0.5) return 'Fair';
    if (strength <= 0.75) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = (strength: number): string => {
    if (strength <= 0.25) return '#EF4444';
    if (strength <= 0.5) return '#F59E0B';
    if (strength <= 0.75) return '#3B82F6';
    return '#10B981';
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    const strength = calculatePasswordStrength(value);
    strengthProgress.value = withTiming(strength, { duration: 300 });
    
    if (errors.newPassword) {
      setErrors((prev) => ({ ...prev, newPassword: undefined }));
    }
  };

  const strengthBarStyle = useAnimatedStyle(() => ({
    width: `${strengthProgress.value * 100}%`,
  }));

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (newPassword === currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        setErrors({ currentPassword: 'Current password is incorrect' });
        setIsLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      Alert.alert(
        'Success',
        'Your password has been changed successfully. Please log in with your new password.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Password change error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to change password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const strength = calculatePasswordStrength(newPassword);
  const strengthLabel = getStrengthLabel(strength);
  const strengthColor = getStrengthColor(strength);

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
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.placeholder} />
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
          {/* Security Notice */}
          <Card style={styles.noticeCard}>
            <View style={styles.noticeContent}>
              <ShieldCheck size={24} color={colors.primary} />
              <View style={styles.noticeText}>
                <Text style={styles.noticeTitle}>Security Reminder</Text>
                <Text style={styles.noticeDescription}>
                  Choose a strong, unique password that you don't use for other accounts.
                </Text>
              </View>
            </View>
          </Card>

          {/* Password Form */}
          <Card style={styles.formCard}>
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
              <Input
                label="Current Password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChangeText={(value) => {
                  setCurrentPassword(value);
                  if (errors.currentPassword) {
                    setErrors((prev) => ({ ...prev, currentPassword: undefined }));
                  }
                }}
                error={errors.currentPassword}
                secureTextEntry={!showCurrentPassword}
                leftIcon={<Lock size={20} color="#6B7280" />}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} color="#6B7280" />
                    ) : (
                      <Eye size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                }
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(200).duration(400)}>
              <Input
                label="New Password"
                placeholder="Enter your new password"
                value={newPassword}
                onChangeText={handleNewPasswordChange}
                error={errors.newPassword}
                secureTextEntry={!showNewPassword}
                leftIcon={<Lock size={20} color="#6B7280" />}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff size={20} color="#6B7280" />
                    ) : (
                      <Eye size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                }
              />
            </Animated.View>

            {/* Password Strength Indicator */}
            {newPassword.length > 0 && (
              <Animated.View
                entering={FadeInDown.duration(300)}
                style={styles.strengthContainer}
              >
                <View style={styles.strengthHeader}>
                  <Text style={styles.strengthLabel}>Password Strength:</Text>
                  <Text style={[styles.strengthValue, { color: strengthColor }]}>
                    {strengthLabel}
                  </Text>
                </View>
                <View style={styles.strengthBarBackground}>
                  <Animated.View
                    style={[
                      styles.strengthBarFill,
                      strengthBarStyle,
                      { backgroundColor: strengthColor },
                    ]}
                  />
                </View>

                {/* Requirements Checklist */}
                <View style={styles.requirementsList}>
                  {passwordRequirements.map((req, index) => {
                    const isMet = req.validator(newPassword);
                    return (
                      <View key={index} style={styles.requirementItem}>
                        {isMet ? (
                          <Check size={16} color="#10B981" />
                        ) : (
                          <X size={16} color="#9CA3AF" />
                        )}
                        <Text
                          style={[
                            styles.requirementText,
                            isMet && styles.requirementMet,
                          ]}
                        >
                          {req.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </Animated.View>
            )}

            <Animated.View entering={FadeInDown.delay(300).duration(400)}>
              <Input
                label="Confirm New Password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }
                }}
                error={errors.confirmPassword}
                secureTextEntry={!showConfirmPassword}
                leftIcon={<Lock size={20} color="#6B7280" />}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#6B7280" />
                    ) : (
                      <Eye size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                }
              />
            </Animated.View>

            {/* Match Indicator */}
            {confirmPassword.length > 0 && (
              <View style={styles.matchIndicator}>
                {confirmPassword === newPassword ? (
                  <>
                    <Check size={16} color="#10B981" />
                    <Text style={styles.matchText}>Passwords match</Text>
                  </>
                ) : (
                  <>
                    <X size={16} color="#EF4444" />
                    <Text style={styles.noMatchText}>Passwords do not match</Text>
                  </>
                )}
              </View>
            )}
          </Card>

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotLink}
            onPress={() => router.push('/reset-password')}
          >
            <Text style={styles.forgotText}>Forgot your current password?</Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Change Password"
              onPress={handleChangePassword}
              loading={isLoading}
              disabled={!currentPassword || !newPassword || !confirmPassword}
              leftIcon={<Lock size={18} color="#FFFFFF" />}
            />
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => router.back()}
              style={styles.cancelButton}
            />
          </View>

          {/* Additional Security Info */}
          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>Tips for a secure password:</Text>
            <View style={styles.infoList}>
              <Text style={styles.infoItem}>• Use a mix of letters, numbers, and symbols</Text>
              <Text style={styles.infoItem}>• Avoid personal information like birthdays</Text>
              <Text style={styles.infoItem}>• Don't reuse passwords from other accounts</Text>
              <Text style={styles.infoItem}>• Consider using a password manager</Text>
            </View>
          </Card>
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
  placeholder: {
    width: 40,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  noticeCard: {
    marginBottom: 16,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  noticeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  noticeText: {
    flex: 1,
    marginLeft: 12,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
  },
  noticeDescription: {
    fontSize: 14,
    color: '#3B82F6',
    marginTop: 4,
    lineHeight: 20,
  },
  formCard: {
    marginBottom: 16,
    padding: 16,
  },
  strengthContainer: {
    marginBottom: 16,
    marginTop: -8,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  strengthLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  strengthValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  strengthBarBackground: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  requirementsList: {
    marginTop: 12,
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: 13,
    color: '#6B7280',
  },
  requirementMet: {
    color: '#10B981',
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -8,
    marginBottom: 8,
  },
  matchText: {
    fontSize: 13,
    color: '#10B981',
  },
  noMatchText: {
    fontSize: 13,
    color: '#EF4444',
  },
  forgotLink: {
    alignItems: 'center',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  cancelButton: {
    borderColor: '#D1D5DB',
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  infoList: {
    gap: 4,
  },
  infoItem: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
});
