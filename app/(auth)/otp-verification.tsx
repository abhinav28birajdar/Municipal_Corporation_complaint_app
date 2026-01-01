import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement OTP verification logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate based on context
      if (params.type === 'forgot-password') {
        router.replace('/reset-password');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    Alert.alert('Success', 'OTP has been resent to your phone/email');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
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
        <Text className="text-white text-3xl font-bold">Verify OTP</Text>
        <Text className="text-white/80 text-base mt-2">
          Enter the 6-digit code sent to {'\n'}
          {params.contact || 'your registered contact'}
        </Text>
      </View>

      <View className="flex-1 p-6">
        {/* OTP Input */}
        <View className="flex-row justify-between mb-8 mt-8">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              className="w-12 h-14 border-2 border-gray-300 rounded-lg text-center text-xl font-bold"
              style={{ fontSize: 24 }}
            />
          ))}
        </View>

        {/* Resend OTP */}
        <View className="flex-row justify-center mb-6">
          <Text className="text-gray-600">Didn't receive code? </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text className="text-blue-600 font-semibold">Resend OTP</Text>
          </TouchableOpacity>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          onPress={handleVerify}
          disabled={loading}
          className={`py-4 rounded-xl ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
        >
          <Text className="text-white text-center text-lg font-bold">
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Text>
        </TouchableOpacity>

        {/* Info */}
        <View className="mt-8 p-4 bg-blue-50 rounded-lg">
          <Text className="text-blue-800 text-sm text-center">
            🔒 Your OTP is valid for 10 minutes
          </Text>
        </View>
      </View>
    </View>
  );
}
