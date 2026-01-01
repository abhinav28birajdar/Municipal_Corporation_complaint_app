import { View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    emoji: '📱',
    title: 'Report Issues Instantly',
    description: 'Submit complaints about roads, water, garbage, and more with just a few taps',
  },
  {
    id: 2,
    emoji: '📍',
    title: 'Track in Real-Time',
    description: 'Monitor the status of your complaints from submission to resolution',
  },
  {
    id: 3,
    emoji: '👥',
    title: 'Direct Communication',
    description: 'Stay connected with municipal staff and get updates instantly',
  },
  {
    id: 4,
    emoji: '✅',
    title: 'Make a Difference',
    description: 'Help improve your city by reporting issues and contributing to solutions',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const router = useRouter();

  const scrollTo = (index: number) => {
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollTo(currentIndex + 1);
    } else {
      router.replace('/(auth)');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)');
  };

  return (
    <LinearGradient
      colors={['#3b82f6', '#1e40af']}
      className="flex-1"
    >
      <View className="flex-1 p-6">
        {/* Skip Button */}
        <TouchableOpacity
          onPress={handleSkip}
          className="self-end mb-4"
        >
          <Text className="text-white text-base font-semibold">Skip</Text>
        </TouchableOpacity>

        {/* Content */}
        <View className="flex-1 items-center justify-center">
          {slides.map((slide, index) => (
            currentIndex === index && (
              <View key={slide.id} className="items-center px-6">
                <Text className="text-9xl mb-8">{slide.emoji}</Text>
                <Text className="text-white text-3xl font-bold text-center mb-4">
                  {slide.title}
                </Text>
                <Text className="text-white/80 text-lg text-center leading-7">
                  {slide.description}
                </Text>
              </View>
            )
          ))}
        </View>

        {/* Pagination Dots */}
        <View className="flex-row justify-center mb-8">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className="bg-white rounded-xl py-4 mb-6"
        >
          <Text className="text-blue-600 text-center text-lg font-bold">
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
