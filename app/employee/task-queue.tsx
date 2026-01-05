import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  Filter,
  Search,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Timer,
  Navigation,
  Phone,
  MessageCircle,
  MoreVertical,
  Calendar,
  User,
  ChevronRight,
  Zap,
  Target,
  TrendingUp,
  ListFilter,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Task {
  id: string;
  complaintId: string;
  title: string;
  description: string;
  category: string;
  categoryEmoji: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  location: {
    address: string;
    distance: string;
    coordinates: { lat: number; lng: number };
  };
  assignedAt: string;
  deadline: string;
  estimatedTime: string;
  citizen: {
    name: string;
    phone: string;
  };
  isUrgent?: boolean;
}

const PRIORITY_CONFIG = {
  low: { color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)', label: 'Low' },
  medium: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', label: 'Medium' },
  high: { color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)', label: 'High' },
  critical: { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', label: 'Critical' },
};

const STATUS_CONFIG = {
  pending: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', label: 'Pending', icon: Clock },
  'in-progress': { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', label: 'In Progress', icon: Timer },
  completed: { color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)', label: 'Completed', icon: CheckCircle },
  cancelled: { color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)', label: 'Cancelled', icon: AlertTriangle },
};

const FILTER_OPTIONS = ['All', 'Pending', 'In Progress', 'Completed', 'High Priority'];

export default function TaskQueueScreen() {
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completedToday: 0,
    avgResolutionTime: '2.5 hrs',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockTasks: Task[] = [
      {
        id: '1',
        complaintId: 'CMP-2024-0892',
        title: 'Water pipe burst on Main Street',
        description: 'Major water leakage causing road flooding',
        category: 'Water Supply',
        categoryEmoji: '💧',
        priority: 'critical',
        status: 'in-progress',
        location: {
          address: '123 Main Street, Ward 5',
          distance: '0.8 km',
          coordinates: { lat: 23.0225, lng: 72.5714 },
        },
        assignedAt: '2024-01-15T08:30:00',
        deadline: '2024-01-15T14:00:00',
        estimatedTime: '2 hours',
        citizen: {
          name: 'Rajesh Kumar',
          phone: '+91 98765 43210',
        },
        isUrgent: true,
      },
      {
        id: '2',
        complaintId: 'CMP-2024-0891',
        title: 'Street light not working',
        description: 'Street light pole #456 has been non-functional for 3 days',
        category: 'Street Lighting',
        categoryEmoji: '💡',
        priority: 'medium',
        status: 'pending',
        location: {
          address: 'Gandhi Nagar, Near Park',
          distance: '1.2 km',
          coordinates: { lat: 23.0245, lng: 72.5734 },
        },
        assignedAt: '2024-01-15T09:15:00',
        deadline: '2024-01-16T18:00:00',
        estimatedTime: '1 hour',
        citizen: {
          name: 'Priya Sharma',
          phone: '+91 87654 32109',
        },
      },
      {
        id: '3',
        complaintId: 'CMP-2024-0890',
        title: 'Garbage not collected',
        description: 'Garbage has not been collected for 2 days in residential area',
        category: 'Waste Management',
        categoryEmoji: '🗑️',
        priority: 'high',
        status: 'pending',
        location: {
          address: 'Sector 21, Block B',
          distance: '2.5 km',
          coordinates: { lat: 23.0265, lng: 72.5754 },
        },
        assignedAt: '2024-01-15T10:00:00',
        deadline: '2024-01-15T17:00:00',
        estimatedTime: '30 mins',
        citizen: {
          name: 'Amit Patel',
          phone: '+91 76543 21098',
        },
        isUrgent: true,
      },
      {
        id: '4',
        complaintId: 'CMP-2024-0889',
        title: 'Pothole on highway junction',
        description: 'Large pothole causing traffic issues and accidents',
        category: 'Road & Infrastructure',
        categoryEmoji: '🛣️',
        priority: 'high',
        status: 'pending',
        location: {
          address: 'Highway Junction, Near Mall',
          distance: '3.1 km',
          coordinates: { lat: 23.0285, lng: 72.5774 },
        },
        assignedAt: '2024-01-15T11:30:00',
        deadline: '2024-01-17T12:00:00',
        estimatedTime: '4 hours',
        citizen: {
          name: 'Suresh Mehta',
          phone: '+91 65432 10987',
        },
      },
    ];
    
    setTasks(mockTasks);
    setStats({
      pending: 3,
      inProgress: 1,
      completedToday: 5,
      avgResolutionTime: '2.5 hrs',
    });
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadTasks();
    setRefreshing(false);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const headerHeight = interpolate(
      scrollY.value,
      [0, 100],
      [200, 100],
      'clamp'
    );
    return {
      height: headerHeight,
    };
  });

  const statsAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [1, 0],
      'clamp'
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 50],
      [0, -20],
      'clamp'
    );
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case 'Pending':
        return tasks.filter(t => t.status === 'pending');
      case 'In Progress':
        return tasks.filter(t => t.status === 'in-progress');
      case 'Completed':
        return tasks.filter(t => t.status === 'completed');
      case 'High Priority':
        return tasks.filter(t => t.priority === 'high' || t.priority === 'critical');
      default:
        return tasks;
    }
  };

  const handleStartTask = async (task: Task) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/employee/work-session',
      params: { taskId: task.id },
    });
  };

  const handleNavigate = async (task: Task) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Open maps with directions
    router.push({
      pathname: '/map-view',
      params: {
        lat: task.location.coordinates.lat,
        lng: task.location.coordinates.lng,
        title: task.title,
      },
    });
  };

  const handleCall = async (phone: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Initiate phone call
  };

  const handleChat = async (taskId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/chat',
      params: { taskId },
    });
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    if (diff < 0) return { text: 'Overdue', isOverdue: true };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return { text: `${days}d ${hours % 24}h remaining`, isOverdue: false };
    }
    
    return { text: `${hours}h ${minutes}m remaining`, isOverdue: false };
  };

  const renderTaskCard = (task: Task, index: number) => {
    const priorityConfig = PRIORITY_CONFIG[task.priority];
    const statusConfig = STATUS_CONFIG[task.status];
    const StatusIcon = statusConfig.icon;
    const timeRemaining = getTimeRemaining(task.deadline);

    return (
      <Animated.View
        key={task.id}
        entering={FadeInDown.delay(index * 100).springify()}
        className="mx-4 mb-4"
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push({
            pathname: '/employee/task-details',
            params: { id: task.id },
          })}
        >
          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Urgent Banner */}
            {task.isUrgent && (
              <View className="bg-red-500 px-4 py-2 flex-row items-center">
                <AlertTriangle size={16} color="#fff" />
                <Text className="text-white text-xs font-semibold ml-2">
                  URGENT - Immediate Attention Required
                </Text>
              </View>
            )}

            <View className="p-4">
              {/* Header */}
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center mr-3">
                    <Text className="text-2xl">{task.categoryEmoji}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 text-xs mb-0.5">
                      {task.complaintId}
                    </Text>
                    <Text className="text-gray-900 font-semibold text-base" numberOfLines={2}>
                      {task.title}
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity className="p-2">
                  <MoreVertical size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Status & Priority Badges */}
              <View className="flex-row items-center mb-3 flex-wrap gap-2">
                <View
                  className="px-3 py-1.5 rounded-full flex-row items-center"
                  style={{ backgroundColor: statusConfig.bgColor }}
                >
                  <StatusIcon size={14} color={statusConfig.color} />
                  <Text
                    className="text-xs font-medium ml-1"
                    style={{ color: statusConfig.color }}
                  >
                    {statusConfig.label}
                  </Text>
                </View>
                
                <View
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: priorityConfig.bgColor }}
                >
                  <Text
                    className="text-xs font-medium"
                    style={{ color: priorityConfig.color }}
                  >
                    {priorityConfig.label} Priority
                  </Text>
                </View>
                
                <View
                  className={`px-3 py-1.5 rounded-full ${
                    timeRemaining.isOverdue ? 'bg-red-100' : 'bg-blue-100'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      timeRemaining.isOverdue ? 'text-red-600' : 'text-blue-600'
                    }`}
                  >
                    {timeRemaining.text}
                  </Text>
                </View>
              </View>

              {/* Location */}
              <View className="flex-row items-center mb-3 bg-gray-50 rounded-xl p-3">
                <MapPin size={16} color="#6b7280" />
                <Text className="text-gray-600 text-sm flex-1 ml-2" numberOfLines={1}>
                  {task.location.address}
                </Text>
                <View className="bg-blue-100 px-2 py-1 rounded-lg">
                  <Text className="text-blue-600 text-xs font-medium">
                    {task.location.distance}
                  </Text>
                </View>
              </View>

              {/* Time Info */}
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <Clock size={14} color="#6b7280" />
                  <Text className="text-gray-500 text-xs ml-1">
                    Est. {task.estimatedTime}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <User size={14} color="#6b7280" />
                  <Text className="text-gray-500 text-xs ml-1">
                    {task.citizen.name}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row items-center gap-2">
                {task.status === 'pending' && (
                  <TouchableOpacity
                    className="flex-1 bg-blue-500 rounded-xl py-3 flex-row items-center justify-center"
                    onPress={() => handleStartTask(task)}
                  >
                    <Zap size={18} color="#fff" />
                    <Text className="text-white font-semibold ml-2">Start Task</Text>
                  </TouchableOpacity>
                )}
                
                {task.status === 'in-progress' && (
                  <TouchableOpacity
                    className="flex-1 bg-green-500 rounded-xl py-3 flex-row items-center justify-center"
                    onPress={() => handleStartTask(task)}
                  >
                    <Timer size={18} color="#fff" />
                    <Text className="text-white font-semibold ml-2">Continue</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center"
                  onPress={() => handleNavigate(task)}
                >
                  <Navigation size={20} color="#3b82f6" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center"
                  onPress={() => handleCall(task.citizen.phone)}
                >
                  <Phone size={20} color="#22c55e" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center"
                  onPress={() => handleChat(task.id)}
                >
                  <MessageCircle size={20} color="#8b5cf6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const filteredTasks = getFilteredTasks();

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={headerAnimatedStyle}>
        <LinearGradient
          colors={['#3b82f6', '#1d4ed8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1"
        >
          <View className="flex-1 px-4 pt-12">
            {/* Top Row */}
            <View className="flex-row items-center justify-between mb-4">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              >
                <ArrowLeft size={20} color="#fff" />
              </TouchableOpacity>
              
              <Text className="text-white text-lg font-semibold">My Tasks</Text>
              
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                  onPress={() => router.push('/search')}
                >
                  <Search size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                  onPress={() => setShowFilterSheet(true)}
                >
                  <Filter size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Stats Row */}
            <Animated.View
              style={statsAnimatedStyle}
              className="flex-row justify-between"
            >
              <View className="items-center">
                <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mb-1">
                  <Clock size={20} color="#fff" />
                </View>
                <Text className="text-white text-lg font-bold">{stats.pending}</Text>
                <Text className="text-white/70 text-xs">Pending</Text>
              </View>
              
              <View className="items-center">
                <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mb-1">
                  <Timer size={20} color="#fff" />
                </View>
                <Text className="text-white text-lg font-bold">{stats.inProgress}</Text>
                <Text className="text-white/70 text-xs">In Progress</Text>
              </View>
              
              <View className="items-center">
                <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mb-1">
                  <CheckCircle size={20} color="#fff" />
                </View>
                <Text className="text-white text-lg font-bold">{stats.completedToday}</Text>
                <Text className="text-white/70 text-xs">Done Today</Text>
              </View>
              
              <View className="items-center">
                <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mb-1">
                  <TrendingUp size={20} color="#fff" />
                </View>
                <Text className="text-white text-lg font-bold">{stats.avgResolutionTime}</Text>
                <Text className="text-white/70 text-xs">Avg Time</Text>
              </View>
            </Animated.View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Filter Chips */}
      <View className="bg-white border-b border-gray-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-4 py-3"
        >
          {FILTER_OPTIONS.map((filter, index) => (
            <TouchableOpacity
              key={filter}
              className={`px-4 py-2 rounded-full mr-2 ${
                activeFilter === filter
                  ? 'bg-blue-500'
                  : 'bg-gray-100'
              }`}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveFilter(filter);
              }}
            >
              <Text
                className={`text-sm font-medium ${
                  activeFilter === filter ? 'text-white' : 'text-gray-600'
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Task List */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
      >
        {loading ? (
          <View className="items-center justify-center py-20">
            <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-4">
              <Timer size={24} color="#3b82f6" />
            </View>
            <Text className="text-gray-500">Loading tasks...</Text>
          </View>
        ) : filteredTasks.length === 0 ? (
          <View className="items-center justify-center py-20">
            <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
              <CheckCircle size={32} color="#22c55e" />
            </View>
            <Text className="text-gray-900 font-semibold text-lg mb-2">
              All caught up!
            </Text>
            <Text className="text-gray-500 text-center px-8">
              No tasks matching your current filter. Great job staying on top of things!
            </Text>
          </View>
        ) : (
          filteredTasks.map((task, index) => renderTaskCard(task, index))
        )}
      </Animated.ScrollView>

      {/* Quick Actions FAB */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          className="w-14 h-14 rounded-full bg-blue-500 items-center justify-center shadow-lg"
          style={{
            shadowColor: '#3b82f6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          onPress={() => router.push('/employee/route-optimizer')}
        >
          <Target size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
