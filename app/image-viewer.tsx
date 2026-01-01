import { View, Text, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Download, Share2, ZoomIn, ZoomOut } from 'lucide-react-native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

const { width, height } = Dimensions.get('window');

export default function ImageViewerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Mock images - in real app, get from params
  const images = [
    'https://via.placeholder.com/800x600?text=Image+1',
    'https://via.placeholder.com/800x600?text=Image+2',
    'https://via.placeholder.com/800x600?text=Image+3',
  ];

  const handleShare = () => {
    // TODO: Implement share functionality
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 bg-black/50 pt-12 pb-4 px-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-semibold">
            {currentIndex + 1} / {images.length}
          </Text>
          <View className="flex-row">
            <TouchableOpacity onPress={handleShare} className="mr-4">
              <Share2 size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDownload}>
              <Download size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Image Display */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
      >
        {images.map((uri, index) => (
          <View
            key={index}
            style={{ width, height }}
            className="items-center justify-center"
          >
            <ReactNativeZoomableView
              maxZoom={3}
              minZoom={1}
              zoomStep={0.5}
              initialZoom={1}
              bindToBorders={true}
            >
              <Image
                source={{ uri }}
                style={{ width, height: height * 0.8 }}
                resizeMode="contain"
              />
            </ReactNativeZoomableView>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View className="absolute bottom-8 left-0 right-0 flex-row justify-center">
        {images.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full mx-1 ${
              index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </View>

      {/* Instructions */}
      <View className="absolute bottom-20 left-0 right-0 items-center">
        <View className="bg-black/70 px-4 py-2 rounded-full">
          <Text className="text-white text-sm">
            Pinch to zoom • Swipe for more
          </Text>
        </View>
      </View>
    </View>
  );
}
