import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Camera, Upload, CheckCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function TaskCompletionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async (type: 'before' | 'after') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map(asset => asset.uri);
      if (type === 'before') {
        setBeforePhotos([...beforePhotos, ...uris]);
      } else {
        setAfterPhotos([...afterPhotos, ...uris]);
      }
    }
  };

  const takePhoto = async (type: 'before' | 'after') => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'before') {
        setBeforePhotos([...beforePhotos, result.assets[0].uri]);
      } else {
        setAfterPhotos([...afterPhotos, result.assets[0].uri]);
      }
    }
  };

  const handleSubmit = async () => {
    if (afterPhotos.length === 0) {
      Alert.alert('Required', 'Please upload at least one after completion photo');
      return;
    }

    if (!notes.trim()) {
      Alert.alert('Required', 'Please provide completion notes');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement task completion submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Task marked as completed successfully',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/employee/dashboard'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit completion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = (type: 'before' | 'after', index: number) => {
    if (type === 'before') {
      setBeforePhotos(beforePhotos.filter((_, i) => i !== index));
    } else {
      setAfterPhotos(afterPhotos.filter((_, i) => i !== index));
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-600 pt-12 pb-4 px-6">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold flex-1">
            Complete Task
          </Text>
        </View>
        <Text className="text-white/80 text-sm">
          {params.id || 'CMP-12345678'}
        </Text>
      </View>

      <ScrollView className="flex-1 p-6">
        {/* Before Photos */}
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-3">
            Before Photos (Optional)
          </Text>
          <View className="flex-row flex-wrap">
            {beforePhotos.map((uri, index) => (
              <View key={index} className="relative mr-2 mb-2">
                <Image
                  source={{ uri }}
                  className="w-24 h-24 rounded-lg"
                />
                <TouchableOpacity
                  onPress={() => removePhoto('before', index)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                >
                  <Text className="text-white text-xs font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity
              onPress={() => pickImage('before')}
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center mr-2 mb-2"
            >
              <Upload size={24} color="#6b7280" />
              <Text className="text-gray-600 text-xs mt-1">Upload</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => takePhoto('before')}
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center mb-2"
            >
              <Camera size={24} color="#6b7280" />
              <Text className="text-gray-600 text-xs mt-1">Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* After Photos */}
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-3">
            After Completion Photos *
          </Text>
          <View className="flex-row flex-wrap">
            {afterPhotos.map((uri, index) => (
              <View key={index} className="relative mr-2 mb-2">
                <Image
                  source={{ uri }}
                  className="w-24 h-24 rounded-lg"
                />
                <TouchableOpacity
                  onPress={() => removePhoto('after', index)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                >
                  <Text className="text-white text-xs font-bold">✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity
              onPress={() => pickImage('after')}
              className="w-24 h-24 border-2 border-dashed border-green-300 rounded-lg items-center justify-center mr-2 mb-2"
            >
              <Upload size={24} color="#16a34a" />
              <Text className="text-green-600 text-xs mt-1">Upload</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => takePhoto('after')}
              className="w-24 h-24 border-2 border-dashed border-green-300 rounded-lg items-center justify-center mb-2"
            >
              <Camera size={24} color="#16a34a" />
              <Text className="text-green-600 text-xs mt-1">Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Completion Notes */}
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-3">
            Completion Notes *
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Describe the work completed, any challenges faced, etc."
            multiline
            numberOfLines={4}
            className="bg-white border border-gray-300 rounded-xl p-4 text-gray-900"
            style={{ textAlignVertical: 'top' }}
          />
        </View>

        {/* Materials Used */}
        <View className="mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-3">
            Materials/Resources Used
          </Text>
          <TextInput
            value={materialsUsed}
            onChangeText={setMaterialsUsed}
            placeholder="List materials, equipment, or resources used"
            multiline
            numberOfLines={3}
            className="bg-white border border-gray-300 rounded-xl p-4 text-gray-900"
            style={{ textAlignVertical: 'top' }}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={`py-4 rounded-xl mb-6 ${
            loading ? 'bg-green-400' : 'bg-green-600'
          }`}
        >
          <View className="flex-row items-center justify-center">
            <CheckCircle size={20} color="white" />
            <Text className="text-white text-lg font-bold ml-2">
              {loading ? 'Submitting...' : 'Mark as Completed'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Info */}
        <View className="bg-blue-50 p-4 rounded-xl mb-6">
          <Text className="text-blue-800 text-sm">
            ℹ️ Make sure to upload clear photos and provide detailed notes for verification.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
