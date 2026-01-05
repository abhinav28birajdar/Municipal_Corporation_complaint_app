import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { RoleSelector } from '@/components/auth/RoleSelector';
import { useAuthStore } from '@/store/auth-store';
import {
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Building2,
  CheckCircle,
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { UserRole } from '@/types';

const { width } = Dimensions.get('window');

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  address: string;
  ward: string;
  department?: string;
  employeeId?: string;
}

const steps = [
  { id: 1, title: 'Account Type' },
  { id: 2, title: 'Basic Info' },
  { id: 3, title: 'Security' },
  { id: 4, title: 'Location' },
  { id: 5, title: 'Complete' },
];

export default function MultiStepRegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'citizen',
    address: '',
    ward: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<FormData> = {};

    switch (currentStep) {
      case 0: // Account Type
        if (!formData.role) {
          Alert.alert('Error', 'Please select an account type');
          return false;
        }
        break;

      case 1: // Basic Info
        if (!formData.name.trim()) {
          newErrors.name = 'Name is required';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
          newErrors.phone = 'Invalid phone number';
        }
        break;

      case 2: // Security
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;

      case 3: // Location
        if (!formData.address.trim()) {
          newErrors.address = 'Address is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    try {
      await register(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          address: formData.address,
        },
        formData.password
      );

      // Navigate to verification or main app
      router.replace('/(auth)/otp-verification');
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Please try again');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContent}
          >
            <Text style={styles.stepTitle}>Choose Account Type</Text>
            <Text style={styles.stepDescription}>
              Select how you want to use MuniServe. This helps us personalize your experience.
            </Text>

            <View style={styles.roleContainer}>
              {(['citizen', 'employee', 'admin'] as UserRole[]).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleCard,
                    formData.role === role && styles.roleCardActive,
                  ]}
                  onPress={() => updateFormData('role', role)}
                  accessible
                  accessibilityRole="radio"
                  accessibilityState={{ selected: formData.role === role }}
                  accessibilityLabel={`${role} account`}
                >
                  <View style={[
                    styles.roleIcon,
                    formData.role === role && styles.roleIconActive,
                  ]}>
                    {role === 'citizen' && <User size={28} color={formData.role === role ? '#FFFFFF' : colors.primary} />}
                    {role === 'employee' && <Building2 size={28} color={formData.role === role ? '#FFFFFF' : colors.primary} />}
                    {role === 'admin' && <MapPin size={28} color={formData.role === role ? '#FFFFFF' : colors.primary} />}
                  </View>
                  <Text style={[
                    styles.roleTitle,
                    formData.role === role && styles.roleTitleActive,
                  ]}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                  <Text style={styles.roleDescription}>
                    {role === 'citizen' && 'Report issues and track complaints'}
                    {role === 'employee' && 'Handle assigned tasks and updates'}
                    {role === 'admin' && 'Manage departments and oversee operations'}
                  </Text>
                  {formData.role === role && (
                    <View style={styles.roleCheck}>
                      <CheckCircle size={20} color={colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        );

      case 1:
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContent}
          >
            <Text style={styles.stepTitle}>Basic Information</Text>
            <Text style={styles.stepDescription}>
              Tell us a bit about yourself. This information will be used for your profile.
            </Text>

            <View style={styles.formGroup}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(text) => updateFormData('name', text)}
                leftIcon={<User size={20} color={colors.textSecondary} />}
                error={errors.name}
                autoCapitalize="words"
              />

              <Input
                label="Email Address"
                placeholder="you@example.com"
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                leftIcon={<Mail size={20} color={colors.textSecondary} />}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Phone Number"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChangeText={(text) => updateFormData('phone', text)}
                leftIcon={<Phone size={20} color={colors.textSecondary} />}
                error={errors.phone}
                keyboardType="phone-pad"
              />
            </View>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContent}
          >
            <Text style={styles.stepTitle}>Create Password</Text>
            <Text style={styles.stepDescription}>
              Choose a strong password to secure your account. Use a mix of letters, numbers, and symbols.
            </Text>

            <View style={styles.formGroup}>
              <Input
                label="Password"
                placeholder="Create a strong password"
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
                leftIcon={<Lock size={20} color={colors.textSecondary} />}
                error={errors.password}
                isPassword
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData('confirmPassword', text)}
                leftIcon={<Lock size={20} color={colors.textSecondary} />}
                error={errors.confirmPassword}
                isPassword
              />

              {/* Password Strength Indicator */}
              <View style={styles.passwordHints}>
                <Text style={styles.hintTitle}>Password must contain:</Text>
                <View style={styles.hintItem}>
                  <View style={[
                    styles.hintDot,
                    formData.password.length >= 8 && styles.hintDotActive,
                  ]} />
                  <Text style={styles.hintText}>At least 8 characters</Text>
                </View>
                <View style={styles.hintItem}>
                  <View style={[
                    styles.hintDot,
                    /[A-Z]/.test(formData.password) && styles.hintDotActive,
                  ]} />
                  <Text style={styles.hintText}>One uppercase letter</Text>
                </View>
                <View style={styles.hintItem}>
                  <View style={[
                    styles.hintDot,
                    /[0-9]/.test(formData.password) && styles.hintDotActive,
                  ]} />
                  <Text style={styles.hintText}>One number</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContent}
          >
            <Text style={styles.stepTitle}>Location Details</Text>
            <Text style={styles.stepDescription}>
              Help us identify your area for better service routing and local updates.
            </Text>

            <View style={styles.formGroup}>
              <Input
                label="Address"
                placeholder="Enter your full address"
                value={formData.address}
                onChangeText={(text) => updateFormData('address', text)}
                leftIcon={<MapPin size={20} color={colors.textSecondary} />}
                error={errors.address}
                multiline
                numberOfLines={3}
              />

              <Input
                label="Ward (Optional)"
                placeholder="Enter your ward number"
                value={formData.ward}
                onChangeText={(text) => updateFormData('ward', text)}
                leftIcon={<Building2 size={20} color={colors.textSecondary} />}
              />

              {formData.role !== 'citizen' && (
                <>
                  <Input
                    label="Department"
                    placeholder="Select your department"
                    value={formData.department || ''}
                    onChangeText={(text) => updateFormData('department', text)}
                    leftIcon={<Building2 size={20} color={colors.textSecondary} />}
                  />
                  <Input
                    label="Employee ID"
                    placeholder="Enter your employee ID"
                    value={formData.employeeId || ''}
                    onChangeText={(text) => updateFormData('employeeId', text)}
                    leftIcon={<User size={20} color={colors.textSecondary} />}
                  />
                </>
              )}
            </View>
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View
            entering={FadeInRight}
            exiting={FadeOutLeft}
            style={styles.stepContent}
          >
            <View style={styles.completeContainer}>
              <View style={styles.completeIcon}>
                <CheckCircle size={64} color="#10B981" />
              </View>
              <Text style={styles.completeTitle}>Almost Done!</Text>
              <Text style={styles.completeDescription}>
                Review your information and tap "Create Account" to complete registration.
              </Text>

              {/* Summary */}
              <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Name</Text>
                  <Text style={styles.summaryValue}>{formData.name}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Email</Text>
                  <Text style={styles.summaryValue}>{formData.email}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Phone</Text>
                  <Text style={styles.summaryValue}>{formData.phone}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Account Type</Text>
                  <Text style={styles.summaryValue}>
                    {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                  </Text>
                </View>
              </View>

              {/* Terms */}
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={prevStep}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Step Indicator */}
        <View style={styles.stepIndicatorContainer}>
          <StepIndicator
            steps={steps}
            currentStep={currentStep}
            completedSteps={Array.from({ length: currentStep }, (_, i) => i)}
            showLabels={false}
          />
          <Text style={styles.stepLabel}>
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </Text>
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
            title={currentStep === steps.length - 1 ? 'Create Account' : 'Continue'}
            onPress={nextStep}
            isLoading={isLoading}
            rightIcon={<ArrowRight size={20} color="#FFFFFF" />}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
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
    paddingVertical: 16,
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
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
  formGroup: {
    gap: 4,
  },
  roleContainer: {
    gap: 16,
  },
  roleCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  roleCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
  },
  roleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  roleIconActive: {
    backgroundColor: colors.primary,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  roleTitleActive: {
    color: colors.primary,
  },
  roleDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  roleCheck: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  passwordHints: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  hintTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hintDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginRight: 10,
  },
  hintDotActive: {
    backgroundColor: '#10B981',
  },
  hintText: {
    fontSize: 14,
    color: '#6B7280',
  },
  completeContainer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  completeIcon: {
    marginBottom: 24,
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  completeDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  summaryContainer: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  bottomContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
});
