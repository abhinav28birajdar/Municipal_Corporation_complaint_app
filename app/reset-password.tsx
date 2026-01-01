import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react-native';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement password reset logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success',
        'Your password has been reset successfully',
        [
          {
            text: 'Login',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">Reset Password</Text>
        <Text className="text-white/80 text-base mt-2">
          Create a new strong password
        </Text>
      </View>

      <View className="flex-1 p-6">
        {/* New Password */}
        <View className="mb-4">
          <Text className="text-gray-700 text-base font-semibold mb-2">
            New Password
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
            <Lock size={20} color="#6b7280" />
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry={!showNewPassword}
              className="flex-1 ml-3 text-base"
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? (
                <EyeOff size={20} color="#6b7280" />
              ) : (
                <Eye size={20} color="#6b7280" />
              )}
            </TouchableOpacity>
          </View>
          <Text className="text-gray-500 text-sm mt-1">
            Must be at least 8 characters
          </Text>
        </View>

        {/* Confirm Password */}
        <View className="mb-6">
          <Text className="text-gray-700 text-base font-semibold mb-2">
            Confirm Password
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-3">
            <Lock size={20} color="#6b7280" />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry={!showConfirmPassword}
              className="flex-1 ml-3 text-base"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? (
                <EyeOff size={20} color="#6b7280" />
              ) : (
                <Eye size={20} color="#6b7280" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Password Requirements */}
        <View className="mb-6 p-4 bg-gray-50 rounded-lg">
          <Text className="text-gray-700 font-semibold mb-2">Password must contain:</Text>
          <Text className="text-gray-600 text-sm">✓ At least 8 characters</Text>
          <Text className="text-gray-600 text-sm">✓ Upper and lowercase letters</Text>
          <Text className="text-gray-600 text-sm">✓ At least one number</Text>
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          onPress={handleResetPassword}
          disabled={loading}
          className={`py-4 rounded-xl ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
        >
          <Text className="text-white text-center text-lg font-bold">
            {loading ? 'Resetting...' : 'Reset Password'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
