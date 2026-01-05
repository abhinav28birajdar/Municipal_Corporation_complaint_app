import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { ChevronRight, ArrowRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  emoji: string;
  backgroundColor: string[];
  features: string[];
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Report Issues Instantly',
    description: 'Submit complaints about roads, water, garbage, and more with just a few taps. Your voice matters!',
    emoji: '📱',
    backgroundColor: ['#3B82F6', '#1E40AF'],
    features: ['Quick complaint submission', 'Photo & video evidence', 'GPS location tagging'],
  },
  {
    id: '2',
    title: 'Track in Real-Time',
    description: 'Monitor the status of your complaints from submission to resolution. Stay informed every step.',
    emoji: '📍',
    backgroundColor: ['#10B981', '#047857'],
    features: ['Live status updates', 'Timeline visualization', 'Push notifications'],
  },
  {
    id: '3',
    title: 'Direct Communication',
    description: 'Stay connected with municipal staff and get updates instantly through in-app messaging.',
    emoji: '💬',
    backgroundColor: ['#F59E0B', '#D97706'],
    features: ['Chat with officials', 'Comment on complaints', 'Feedback system'],
  },
  {
    id: '4',
    title: 'Community Impact',
    description: 'Join thousands of citizens making their city better. See nearby issues and support others.',
    emoji: '🌟',
    backgroundColor: ['#8B5CF6', '#6D28D9'],
    features: ['View community issues', 'Upvote complaints', 'Earn achievements'],
  },
  {
    id: '5',
    title: 'Ready to Start?',
    description: 'Create your account and become part of the smart city initiative. Together we build better.',
    emoji: '🚀',
    backgroundColor: ['#EF4444', '#DC2626'],
    features: ['Free to use', 'Secure & private', '24/7 support'],
  },
];

export default function EnhancedOnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(auth)');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/(auth)');
    }
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [50, 0, 50],
      extrapolate: 'clamp',
    });

    return (
      <LinearGradient
        colors={item.backgroundColor}
        style={styles.slideContainer}
      >
        <StatusBar barStyle="light-content" />
        
        {/* Background Pattern */}
        <View style={styles.patternOverlay}>
          {[...Array(8)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.patternDot,
                {
                  top: Math.random() * height,
                  left: Math.random() * width,
                  opacity: Math.random() * 0.1,
                },
              ]}
            />
          ))}
        </View>

        {/* Content */}
        <Animated.View
          style={[
            styles.contentContainer,
            {
              transform: [{ scale }, { translateY }],
              opacity,
            },
          ]}
        >
          {/* Emoji/Icon Container */}
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {item.features.map((feature, i) => (
              <View key={i} style={styles.featureItem}>
                <View style={styles.featureBullet} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </LinearGradient>
    );
  };

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {slides.map((_, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.4, 1, 0.4],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.paginationDot,
              {
                width: dotWidth,
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={skipOnboarding}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        {/* Pagination */}
        {renderPagination()}

        {/* Navigation Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            currentIndex === slides.length - 1 && styles.getStartedButton,
          ]}
          onPress={goToNextSlide}
          accessible
          accessibilityRole="button"
          accessibilityLabel={
            currentIndex === slides.length - 1 ? 'Get started' : 'Next slide'
          }
        >
          {currentIndex === slides.length - 1 ? (
            <>
              <Text style={styles.getStartedText}>Get Started</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </>
          ) : (
            <ChevronRight size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideContainer: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  patternDot: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  emojiContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  emoji: {
    fontSize: 72,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 16,
  },
  featuresContainer: {
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 300,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
  },
  nextButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedButton: {
    width: 'auto',
    paddingHorizontal: 32,
    flexDirection: 'row',
    gap: 8,
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
