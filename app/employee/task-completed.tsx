import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  CheckCircle,
  Home,
  ListTodo,
  Share2,
  Star,
  Clock,
  Camera,
  Package,
  FileText,
  Trophy,
  Zap,
  ArrowRight,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function TaskCompletedScreen() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  
  const checkScale = useSharedValue(0);
  const ringScale = useSharedValue(0);
  const confettiOpacity = useSharedValue(0);
  const statsOpacity = useSharedValue(0);
  
  const completionData = {
    taskId: taskId || 'TSK-001',
    complaintId: 'CMP-2024-0892',
    title: 'Water pipe burst on Main Street',
    timeSpent: '2h 15m',
    photosUploaded: 6,
    materialsUsed: 4,
    completedAt: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
    points: 50,
    streak: 8,
    rating: 4.8,
  };

  useEffect(() => {
    // Trigger haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Animate check mark
    checkScale.value = withSequence(
      withDelay(200, withSpring(1.2, { damping: 8 })),
      withSpring(1, { damping: 10 })
    );
    
    // Animate ring
    ringScale.value = withDelay(
      300,
      withRepeat(
        withSequence(
          withTiming(1.3, { duration: 1500, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 0 })
        ),
        -1,
        false
      )
    );
    
    // Fade in confetti
    confettiOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    
    // Fade in stats
    statsOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
  }, []);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: 1 - ringScale.value + 1,
  }));

  const statsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));

  const handleShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      await Share.share({
        message: `Task Completed! 🎉\n\n${completionData.title}\n\nTime: ${completionData.timeSpent}\nPoints Earned: +${completionData.points}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleViewTasks = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/employee/task-queue');
  };

  const handleGoHome = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace('/employee/employee-dashboard');
  };

  return (
    <View className="flex-1 bg-green-500">
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#22c55e', '#16a34a', '#15803d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        {/* Success Animation */}
        <View className="flex-1 items-center justify-center px-6">
          {/* Animated Ring */}
          <View className="relative items-center justify-center mb-8">
            <Animated.View
              style={[
                ringAnimatedStyle,
                {
                  position: 'absolute',
                  width: 160,
                  height: 160,
                  borderRadius: 80,
                  borderWidth: 3,
                  borderColor: 'rgba(255,255,255,0.3)',
                },
              ]}
            />
            
            {/* Check Icon */}
            <Animated.View
              style={checkAnimatedStyle}
              className="w-32 h-32 rounded-full bg-white items-center justify-center"
            >
              <CheckCircle size={64} color="#22c55e" strokeWidth={2.5} />
            </Animated.View>
          </View>

          {/* Success Text */}
          <Animated.View
            entering={FadeInUp.delay(400).springify()}
            className="items-center mb-8"
          >
            <Text className="text-white text-3xl font-bold mb-2">Task Completed!</Text>
            <Text className="text-white/80 text-center">
              Great job! Your work has been submitted for review.
            </Text>
          </Animated.View>

          {/* Points & Streak */}
          <Animated.View
            entering={FadeInUp.delay(600).springify()}
            className="flex-row items-center gap-4 mb-8"
          >
            <View className="bg-white/20 rounded-2xl px-6 py-4 items-center">
              <View className="flex-row items-center mb-1">
                <Zap size={20} color="#fbbf24" fill="#fbbf24" />
                <Text className="text-white text-2xl font-bold ml-1">
                  +{completionData.points}
                </Text>
              </View>
              <Text className="text-white/70 text-sm">Points Earned</Text>
            </View>
            
            <View className="bg-white/20 rounded-2xl px-6 py-4 items-center">
              <View className="flex-row items-center mb-1">
                <Trophy size={20} color="#fbbf24" />
                <Text className="text-white text-2xl font-bold ml-1">
                  {completionData.streak}
                </Text>
              </View>
              <Text className="text-white/70 text-sm">Day Streak</Text>
            </View>
          </Animated.View>

          {/* Task Summary */}
          <Animated.View
            style={statsAnimatedStyle}
            className="bg-white rounded-3xl p-6 w-full mb-8"
          >
            <Text className="text-gray-900 font-bold text-lg mb-4">Task Summary</Text>
            
            <View className="mb-4">
              <Text className="text-gray-500 text-sm">{completionData.complaintId}</Text>
              <Text className="text-gray-900 font-semibold">{completionData.title}</Text>
            </View>

            <View className="flex-row flex-wrap">
              <View className="w-1/2 mb-4">
                <View className="flex-row items-center mb-1">
                  <Clock size={16} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-2">Time Spent</Text>
                </View>
                <Text className="text-gray-900 font-semibold ml-6">
                  {completionData.timeSpent}
                </Text>
              </View>
              
              <View className="w-1/2 mb-4">
                <View className="flex-row items-center mb-1">
                  <Camera size={16} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-2">Photos</Text>
                </View>
                <Text className="text-gray-900 font-semibold ml-6">
                  {completionData.photosUploaded} uploaded
                </Text>
              </View>
              
              <View className="w-1/2">
                <View className="flex-row items-center mb-1">
                  <Package size={16} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-2">Materials</Text>
                </View>
                <Text className="text-gray-900 font-semibold ml-6">
                  {completionData.materialsUsed} items
                </Text>
              </View>
              
              <View className="w-1/2">
                <View className="flex-row items-center mb-1">
                  <FileText size={16} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-2">Completed At</Text>
                </View>
                <Text className="text-gray-900 font-semibold ml-6">
                  {completionData.completedAt}
                </Text>
              </View>
            </View>

            {/* Rating Preview */}
            <View className="mt-4 pt-4 border-t border-gray-100">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-500">Your Average Rating</Text>
                <View className="flex-row items-center">
                  <Star size={18} color="#fbbf24" fill="#fbbf24" />
                  <Text className="text-gray-900 font-bold ml-1">
                    {completionData.rating}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            entering={FadeInDown.delay(1000).springify()}
            className="w-full gap-3"
          >
            <TouchableOpacity
              className="bg-white rounded-2xl py-4 flex-row items-center justify-center"
              onPress={handleViewTasks}
            >
              <ListTodo size={20} color="#22c55e" />
              <Text className="text-green-600 font-bold text-lg ml-2">
                View More Tasks
              </Text>
              <ArrowRight size={20} color="#22c55e" className="ml-2" />
            </TouchableOpacity>
            
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-white/20 rounded-2xl py-4 flex-row items-center justify-center"
                onPress={handleShare}
              >
                <Share2 size={20} color="#fff" />
                <Text className="text-white font-semibold ml-2">Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-1 bg-white/20 rounded-2xl py-4 flex-row items-center justify-center"
                onPress={handleGoHome}
              >
                <Home size={20} color="#fff" />
                <Text className="text-white font-semibold ml-2">Dashboard</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* Decorative Elements */}
        <View className="absolute top-20 left-10 w-3 h-3 rounded-full bg-white/30" />
        <View className="absolute top-40 right-8 w-2 h-2 rounded-full bg-white/40" />
        <View className="absolute top-60 left-20 w-4 h-4 rounded-full bg-white/20" />
        <View className="absolute bottom-40 right-16 w-3 h-3 rounded-full bg-white/30" />
        <View className="absolute bottom-60 left-8 w-2 h-2 rounded-full bg-white/40" />
      </LinearGradient>
    </View>
  );
}
