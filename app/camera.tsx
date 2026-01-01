import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Camera } from 'expo-camera';
import { CameraView } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { X, FlipHorizontal, Zap, ZapOff } from 'lucide-react-native';

export default function CameraScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState<'back' | 'front'>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  const cameraRef = useRef<any>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      if (mediaStatus.status !== 'granted') {
        Alert.alert('Permission Required', 'Media library permission is required to save photos');
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          exif: false,
        });
        
        setCapturedImages([...capturedImages, photo.uri]);
        
        // Save to media library
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        
        // Navigate back with the image
        router.back();
        // TODO: Pass the image URI back to the form
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  const toggleCameraType = () => {
    setType(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlashMode(current => (current === 'off' ? 'on' : 'off'));
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 items-center justify-center bg-black p-6">
        <Text className="text-white text-center text-lg mb-4">
          Camera permission is required to capture photos
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-blue-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView 
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={type}
        flash={flashMode}
      >
        {/* Header Controls */}
        <View className="flex-row justify-between items-center pt-12 px-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-black/50 p-3 rounded-full"
          >
            <X size={24} color="white" />
          </TouchableOpacity>

          <View className="flex-row">
            <TouchableOpacity
              onPress={toggleFlash}
              className="bg-black/50 p-3 rounded-full mr-3"
            >
              {flashMode === 'on' ? (
                <Zap size={24} color="#fbbf24" />
              ) : (
                <ZapOff size={24} color="white" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleCameraType}
              className="bg-black/50 p-3 rounded-full"
            >
              <FlipHorizontal size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Guide Text */}
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-black/60 px-6 py-3 rounded-xl">
            <Text className="text-white text-center text-base">
              📸 Capture clear image of the issue
            </Text>
          </View>
        </View>

        {/* Bottom Controls */}
        <View className="pb-10 items-center">
          {/* Capture Button */}
          <TouchableOpacity
            onPress={takePicture}
            className="w-20 h-20 rounded-full border-4 border-white items-center justify-center mb-4"
          >
            <View className="w-16 h-16 rounded-full bg-white" />
          </TouchableOpacity>

          {/* Counter */}
          <Text className="text-white text-sm">
            {capturedImages.length > 0 ? `${capturedImages.length} photo(s) captured` : 'Tap to capture'}
          </Text>
        </View>
      </CameraView>
    </View>
  );
}
