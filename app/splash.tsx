import { View, Text, Image, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const router = useRouter();

  useEffect(() => {
    // Fade and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#3b82f6', '#1e40af', '#1e3a8a']}
      className="flex-1 items-center justify-center"
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
        className="items-center"
      >
        <View className="bg-white/20 rounded-full p-8 mb-6">
          <Text className="text-7xl">🏛️</Text>
        </View>
        <Text className="text-white text-4xl font-bold mb-2">MuniServe</Text>
        <Text className="text-white/80 text-lg">Municipal Corporation Portal</Text>
        
        {/* Loading indicator */}
        <View className="mt-12">
          <View className="w-32 h-1 bg-white/30 rounded-full overflow-hidden">
            <Animated.View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                opacity: fadeAnim,
              }}
            />
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}
