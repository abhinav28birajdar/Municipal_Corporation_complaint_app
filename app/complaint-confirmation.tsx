import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CheckCircle, MapPin, Calendar, Tag } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ComplaintConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const handleTrackComplaint = () => {
    // TODO: Navigate to complaint detail screen with the complaint ID
    router.push('/complaints/track');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Success Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        className="pt-16 pb-8 px-6 items-center"
      >
        <View className="bg-white/20 rounded-full p-4 mb-4">
          <CheckCircle size={64} color="white" strokeWidth={2} />
        </View>
        <Text className="text-white text-3xl font-bold mb-2">
          Complaint Submitted!
        </Text>
        <Text className="text-white/90 text-center text-base">
          Your complaint has been registered successfully
        </Text>
      </LinearGradient>

      <ScrollView className="flex-1 p-6">
        {/* Complaint ID Card */}
        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <Text className="text-gray-600 text-sm mb-1">Complaint ID</Text>
          <Text className="text-blue-600 text-2xl font-bold">
            CMP-{new Date().getTime().toString().slice(-8)}
          </Text>
          <Text className="text-gray-600 text-sm mt-2">
            Save this ID for future reference
          </Text>
        </View>

        {/* Summary */}
        <View className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-4">Summary</Text>

          <View className="mb-3">
            <View className="flex-row items-center mb-1">
              <Tag size={18} color="#6b7280" />
              <Text className="text-gray-600 ml-2">Category</Text>
            </View>
            <Text className="text-gray-900 font-semibold ml-7">
              {params.category || 'Road Damage'}
            </Text>
          </View>

          <View className="mb-3">
            <View className="flex-row items-center mb-1">
              <MapPin size={18} color="#6b7280" />
              <Text className="text-gray-600 ml-2">Location</Text>
            </View>
            <Text className="text-gray-900 ml-7">
              {params.address || 'Current Location'}
            </Text>
          </View>

          <View>
            <View className="flex-row items-center mb-1">
              <Calendar size={18} color="#6b7280" />
              <Text className="text-gray-600 ml-2">Submitted On</Text>
            </View>
            <Text className="text-gray-900 ml-7">
              {new Date().toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        {/* What's Next */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-3">What's Next?</Text>
          
          <View className="mb-3">
            <Text className="text-gray-900 font-semibold mb-1">✅ Step 1: Review</Text>
            <Text className="text-gray-600 text-sm">
              Your complaint will be reviewed by the concerned department
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-gray-900 font-semibold mb-1">👷 Step 2: Assignment</Text>
            <Text className="text-gray-600 text-sm">
              A field worker will be assigned to address the issue
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-gray-900 font-semibold mb-1">🔧 Step 3: Resolution</Text>
            <Text className="text-gray-600 text-sm">
              The assigned worker will resolve the issue
            </Text>
          </View>

          <View>
            <Text className="text-gray-900 font-semibold mb-1">🔔 Step 4: Notification</Text>
            <Text className="text-gray-600 text-sm">
              You'll receive updates at each stage via notifications
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          onPress={handleTrackComplaint}
          className="bg-blue-600 py-4 rounded-xl mb-3"
        >
          <Text className="text-white text-center text-lg font-bold">
            Track This Complaint
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGoHome}
          className="bg-gray-100 py-4 rounded-xl mb-6"
        >
          <Text className="text-gray-700 text-center text-lg font-bold">
            Go to Home
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
