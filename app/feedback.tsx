import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star } from 'lucide-react-native';

export default function FeedbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Required', 'Please provide a rating');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement feedback submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-6">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold mb-2">
          Rate Your Experience
        </Text>
        <Text className="text-white/80 text-base">
          Help us improve our service
        </Text>
      </View>

      <View className="flex-1 p-6">
        {/* Complaint Info */}
        <View className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
          <Text className="text-gray-600 text-sm mb-1">Complaint ID</Text>
          <Text className="text-gray-900 font-bold text-lg">
            {params.complaintId || 'CMP-12345678'}
          </Text>
        </View>

        {/* Rating */}
        <View className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <Text className="text-gray-900 text-lg font-bold mb-4 text-center">
            How satisfied are you with the resolution?
          </Text>
          <View className="flex-row justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                className="mx-2"
              >
                <Star
                  size={40}
                  color={star <= rating ? '#fbbf24' : '#d1d5db'}
                  fill={star <= rating ? '#fbbf24' : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text className="text-gray-600 text-center">
            {rating === 0 && 'Tap to rate'}
            {rating === 1 && 'Very Dissatisfied'}
            {rating === 2 && 'Dissatisfied'}
            {rating === 3 && 'Neutral'}
            {rating === 4 && 'Satisfied'}
            {rating === 5 && 'Very Satisfied'}
          </Text>
        </View>

        {/* Feedback Text */}
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-3">
            Additional Comments (Optional)
          </Text>
          <TextInput
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Share your experience or suggestions..."
            multiline
            numberOfLines={6}
            className="bg-white border border-gray-300 rounded-xl p-4 text-gray-900"
            style={{ textAlignVertical: 'top' }}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading || rating === 0}
          className={`py-4 rounded-xl ${
            loading || rating === 0 ? 'bg-blue-400' : 'bg-blue-600'
          }`}
        >
          <Text className="text-white text-center text-lg font-bold">
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Text>
        </TouchableOpacity>

        {/* Info */}
        <View className="mt-6 p-4 bg-blue-50 rounded-xl">
          <Text className="text-blue-800 text-sm text-center">
            Your feedback helps us serve you better 💙
          </Text>
        </View>
      </View>
    </View>
  );
}
