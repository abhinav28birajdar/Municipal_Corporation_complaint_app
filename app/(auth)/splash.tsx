import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/store/auth-store';

const { width, height } = Dimensions.get('window');

export default function EnhancedSplashScreen() {
  const router = useRouter();
  const { checkSession, isAuthenticated, user } = useAuthStore();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(50)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate text
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(textSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 400);

    // Simulate loading stages
    const stages = [
      { text: 'Initializing...', progress: 10 },
      { text: 'Loading resources...', progress: 30 },
      { text: 'Checking authentication...', progress: 50 },
      { text: 'Loading user data...', progress: 70 },
      { text: 'Preparing app...', progress: 90 },
      { text: 'Ready!', progress: 100 },
    ];

    for (const stage of stages) {
      setLoadingText(stage.text);
      setProgress(stage.progress);
      
      Animated.timing(progressAnim, {
        toValue: stage.progress / 100,
        duration: 400,
        useNativeDriver: false,
      }).start();

      if (stage.text === 'Checking authentication...') {
        await checkSession();
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Navigate based on state
    setTimeout(async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      
      if (!hasSeenOnboarding) {
        router.replace('/onboarding');
      } else if (isAuthenticated && user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)');
      }
    }, 500);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <LinearGradient
      colors={['#1e40af', '#3b82f6', '#60a5fa']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Background Pattern */}
      <View style={styles.patternContainer}>
        {[...Array(6)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.patternCircle,
              {
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.1],
                }),
                top: Math.random() * height,
                left: Math.random() * width,
                width: 100 + Math.random() * 200,
                height: 100 + Math.random() * 200,
              },
            ]}
          />
        ))}
      </View>

      {/* Logo and Branding */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoWrapper}>
          <View style={styles.iconBackground}>
            <Text style={styles.emoji}>🏛️</Text>
          </View>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>v2.0</Text>
          </View>
        </View>
      </Animated.View>

      {/* App Name */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            transform: [{ translateY: textSlideAnim }],
            opacity: taglineOpacity,
          },
        ]}
      >
        <Text style={styles.appName}>MuniServe</Text>
        <Text style={styles.tagline}>Municipal Corporation Portal</Text>
        <Text style={styles.subtitle}>Smart City • Smart Services</Text>
      </Animated.View>

      {/* Loading Section */}
      <View style={styles.loadingContainer}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              { width: progressWidth },
            ]}
          />
        </View>
        
        {/* Progress Text */}
        <View style={styles.progressTextContainer}>
          <Text style={styles.loadingText}>{loadingText}</Text>
          <Text style={styles.progressPercentage}>{progress}%</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Smart City Initiative</Text>
        <Text style={styles.versionText}>Version 2.0.0</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoWrapper: {
    position: 'relative',
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  emoji: {
    fontSize: 60,
  },
  logoBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    letterSpacing: 2,
  },
  loadingContainer: {
    width: width * 0.7,
    position: 'absolute',
    bottom: 120,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  versionText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 4,
  },
});
