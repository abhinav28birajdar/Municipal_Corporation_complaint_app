import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  Navigation,
  MapPin,
  Clock,
  Route,
  Play,
  RefreshCw,
  ChevronRight,
  CheckCircle,
  Car,
  Bike,
  Footprints,
  Timer,
  AlertTriangle,
  Target,
  Zap,
  ArrowUpRight,
  MoreVertical,
  Phone,
  MessageCircle,
  Share2,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Task {
  id: string;
  title: string;
  location: {
    address: string;
    distance: string;
    coordinates: { lat: number; lng: number };
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: string;
  order: number;
  status: 'pending' | 'in-progress' | 'completed';
  emoji: string;
}

type TransportMode = 'car' | 'bike' | 'walk';

export default function RouteOptimizerScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [transportMode, setTransportMode] = useState<TransportMode>('bike');
  const [currentLocation, setCurrentLocation] = useState<string>('Fetching...');
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const pulseAnim = useSharedValue(1);
  
  const routeStats = {
    totalDistance: '12.5 km',
    estimatedTime: '2h 45m',
    tasksCount: 4,
    optimizedSavings: '35 mins',
  };

  useEffect(() => {
    loadRouteData();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (optimizing) {
      pulseAnim.value = withRepeat(
        withTiming(1.1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulseAnim.value = withTiming(1);
    }
  }, [optimizing]);

  const loadRouteData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTasks([
      {
        id: '1',
        title: 'Water pipe burst on Main Street',
        location: {
          address: '123 Main Street, Ward 5',
          distance: '0.8 km',
          coordinates: { lat: 23.0225, lng: 72.5714 },
        },
        priority: 'critical',
        estimatedTime: '2 hours',
        order: 1,
        status: 'pending',
        emoji: '💧',
      },
      {
        id: '2',
        title: 'Garbage collection',
        location: {
          address: 'Sector 21, Block B',
          distance: '2.5 km',
          coordinates: { lat: 23.0265, lng: 72.5754 },
        },
        priority: 'high',
        estimatedTime: '30 mins',
        order: 2,
        status: 'pending',
        emoji: '🗑️',
      },
      {
        id: '3',
        title: 'Street light not working',
        location: {
          address: 'Gandhi Nagar, Near Park',
          distance: '3.8 km',
          coordinates: { lat: 23.0245, lng: 72.5734 },
        },
        priority: 'medium',
        estimatedTime: '1 hour',
        order: 3,
        status: 'pending',
        emoji: '💡',
      },
      {
        id: '4',
        title: 'Pothole on highway junction',
        location: {
          address: 'Highway Junction, Near Mall',
          distance: '5.2 km',
          coordinates: { lat: 23.0285, lng: 72.5774 },
        },
        priority: 'high',
        estimatedTime: '4 hours',
        order: 4,
        status: 'pending',
        emoji: '🛣️',
      },
    ]);
    
    setLoading(false);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCurrentLocation('Location denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address) {
        setCurrentLocation(`${address.street || ''}, ${address.city || ''}`);
      } else {
        setCurrentLocation('Current Location');
      }
    } catch (error) {
      setCurrentLocation('Unable to get location');
    }
  };

  const handleOptimizeRoute = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setOptimizing(true);
    
    // Simulate optimization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reorder tasks based on "optimization"
    const optimized = [...tasks].sort((a, b) => {
      // Prioritize critical and closer tasks
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    setTasks(optimized.map((task, index) => ({ ...task, order: index + 1 })));
    setOptimizing(false);
    
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Route Optimized!',
      `Your route has been optimized. You'll save approximately ${routeStats.optimizedSavings}.`
    );
  };

  const handleStartNavigation = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    const firstTask = tasks.find(t => t.status === 'pending');
    if (firstTask) {
      router.push({
        pathname: '/map-view',
        params: {
          lat: firstTask.location.coordinates.lat,
          lng: firstTask.location.coordinates.lng,
          title: firstTask.title,
          mode: transportMode,
        },
      });
    }
  };

  const handleNavigateToTask = async (task: Task) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/map-view',
      params: {
        lat: task.location.coordinates.lat,
        lng: task.location.coordinates.lng,
        title: task.title,
        mode: transportMode,
      },
    });
  };

  const handleReorderTask = (taskId: string, direction: 'up' | 'down') => {
    const currentIndex = tasks.findIndex(t => t.id === taskId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === tasks.length - 1)
    ) {
      return;
    }

    const newTasks = [...tasks];
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newTasks[currentIndex], newTasks[swapIndex]] = [newTasks[swapIndex], newTasks[currentIndex]];
    
    setTasks(newTasks.map((task, index) => ({ ...task, order: index + 1 })));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#f59e0b';
      default:
        return '#22c55e';
    }
  };

  const getTransportIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'car':
        return Car;
      case 'bike':
        return Bike;
      case 'walk':
        return Footprints;
    }
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const renderTaskCard = (task: Task, index: number) => {
    const TransportIcon = getTransportIcon(transportMode);
    
    return (
      <Animated.View
        key={task.id}
        entering={FadeInRight.delay(index * 100).springify()}
        className="mb-3"
      >
        <TouchableOpacity
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
          activeOpacity={0.9}
          onPress={() => router.push({
            pathname: '/employee/task-details',
            params: { id: task.id },
          })}
        >
          <View className="flex-row">
            {/* Order Number */}
            <View
              className="w-12 items-center justify-center"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
            >
              <Text className="text-white text-xl font-bold">{task.order}</Text>
            </View>
            
            <View className="flex-1 p-4">
              {/* Task Header */}
              <View className="flex-row items-start mb-2">
                <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center mr-3">
                  <Text className="text-xl">{task.emoji}</Text>
                </View>
                
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold" numberOfLines={1}>
                    {task.title}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <MapPin size={12} color="#6b7280" />
                    <Text className="text-gray-500 text-xs ml-1 flex-1" numberOfLines={1}>
                      {task.location.address}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Task Info */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center">
                    <TransportIcon size={14} color="#6b7280" />
                    <Text className="text-gray-500 text-xs ml-1">{task.location.distance}</Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <Timer size={14} color="#6b7280" />
                    <Text className="text-gray-500 text-xs ml-1">{task.estimatedTime}</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center"
                    onPress={() => handleNavigateToTask(task)}
                  >
                    <Navigation size={14} color="#3b82f6" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                    onPress={() => {}}
                  >
                    <Phone size={14} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          
          <Text className="text-white text-lg font-semibold">Route Optimizer</Text>
          
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            onPress={() => {}}
          >
            <Share2 size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Current Location */}
        <View className="bg-white/20 rounded-xl p-3 flex-row items-center mb-4">
          <View className="w-10 h-10 rounded-full bg-green-500 items-center justify-center">
            <Target size={20} color="#fff" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-white/70 text-xs">Your Location</Text>
            <Text className="text-white font-medium">{currentLocation}</Text>
          </View>
        </View>

        {/* Route Stats */}
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-white text-xl font-bold">{routeStats.tasksCount}</Text>
            <Text className="text-white/70 text-xs">Tasks</Text>
          </View>
          
          <View className="h-10 w-px bg-white/30" />
          
          <View className="items-center">
            <Text className="text-white text-xl font-bold">{routeStats.totalDistance}</Text>
            <Text className="text-white/70 text-xs">Distance</Text>
          </View>
          
          <View className="h-10 w-px bg-white/30" />
          
          <View className="items-center">
            <Text className="text-white text-xl font-bold">{routeStats.estimatedTime}</Text>
            <Text className="text-white/70 text-xs">Duration</Text>
          </View>
          
          <View className="h-10 w-px bg-white/30" />
          
          <View className="items-center">
            <View className="flex-row items-center">
              <Zap size={16} color="#fbbf24" />
              <Text className="text-white text-xl font-bold ml-1">{routeStats.optimizedSavings}</Text>
            </View>
            <Text className="text-white/70 text-xs">Saved</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Transport Mode Selector */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        className="px-4 py-4"
      >
        <View className="flex-row gap-3">
          {(['car', 'bike', 'walk'] as TransportMode[]).map((mode) => {
            const Icon = getTransportIcon(mode);
            const isActive = transportMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
                  isActive ? 'bg-blue-500' : 'bg-white'
                }`}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTransportMode(mode);
                }}
              >
                <Icon size={18} color={isActive ? '#fff' : '#6b7280'} />
                <Text
                  className={`ml-2 font-medium capitalize ${
                    isActive ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {mode}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        {/* Optimize Button */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={optimizing ? pulseStyle : {}}
        >
          <TouchableOpacity
            className={`rounded-2xl py-4 flex-row items-center justify-center mb-4 ${
              optimizing ? 'bg-amber-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}
            style={{ backgroundColor: '#f59e0b' }}
            onPress={handleOptimizeRoute}
            disabled={optimizing}
          >
            <RefreshCw
              size={20}
              color="#fff"
              style={{ transform: [{ rotate: optimizing ? '360deg' : '0deg' }] }}
            />
            <Text className="text-white font-bold text-lg ml-2">
              {optimizing ? 'Optimizing Route...' : 'Optimize Route'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Route Preview */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="mb-4"
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-900 font-bold text-lg">Task Route</Text>
            <View className="flex-row items-center">
              <Route size={16} color="#3b82f6" />
              <Text className="text-blue-500 font-medium text-sm ml-1">
                {tasks.length} stops
              </Text>
            </View>
          </View>

          {/* Route Line */}
          <View className="relative">
            {/* Connecting Line */}
            <View
              className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"
              style={{ zIndex: 0 }}
            />
            
            {loading ? (
              <View className="items-center py-10">
                <Timer size={32} color="#3b82f6" />
                <Text className="text-gray-500 mt-2">Loading route...</Text>
              </View>
            ) : (
              tasks.map((task, index) => renderTaskCard(task, index))
            )}
          </View>
        </Animated.View>

        {/* Route Tips */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="bg-blue-50 rounded-2xl p-4"
        >
          <View className="flex-row items-center mb-2">
            <Zap size={18} color="#3b82f6" />
            <Text className="text-blue-700 font-bold ml-2">Route Tips</Text>
          </View>
          
          <View className="gap-2">
            <View className="flex-row items-start">
              <View className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 mr-2" />
              <Text className="text-blue-600 text-sm flex-1">
                Critical tasks are prioritized first for immediate attention
              </Text>
            </View>
            <View className="flex-row items-start">
              <View className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 mr-2" />
              <Text className="text-blue-600 text-sm flex-1">
                Route is optimized to minimize travel time between tasks
              </Text>
            </View>
            <View className="flex-row items-start">
              <View className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 mr-2" />
              <Text className="text-blue-600 text-sm flex-1">
                You can manually reorder tasks if needed
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Start Navigation Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4">
        <TouchableOpacity
          className="bg-green-500 rounded-2xl py-4 flex-row items-center justify-center"
          onPress={handleStartNavigation}
        >
          <Play size={24} color="#fff" fill="#fff" />
          <Text className="text-white font-bold text-lg ml-2">Start Navigation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
