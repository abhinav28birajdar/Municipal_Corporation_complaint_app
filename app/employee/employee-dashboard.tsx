import React, { useState, useEffect, useCallback } from 'react';
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
import { Image } from 'expo-image';
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
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Timer,
  TrendingUp,
  Target,
  Award,
  Zap,
  AlertTriangle,
  ChevronRight,
  Navigation,
  Briefcase,
  Star,
  BarChart3,
  Settings,
  LogOut,
  Users,
  FileText,
  Camera,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface DashboardStats {
  pendingTasks: number;
  completedToday: number;
  avgResolutionTime: string;
  performanceScore: number;
  streak: number;
  rank: number;
  totalEmployees: number;
}

interface UpcomingTask {
  id: string;
  title: string;
  location: string;
  time: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  emoji: string;
}

interface RecentActivity {
  id: string;
  type: 'completed' | 'assigned' | 'review';
  title: string;
  time: string;
  status: string;
}

export default function EmployeeDashboardScreen() {
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<DashboardStats>({
    pendingTasks: 0,
    completedToday: 0,
    avgResolutionTime: '-',
    performanceScore: 0,
    streak: 0,
    rank: 0,
    totalEmployees: 0,
  });
  
  const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  
  const user = {
    name: 'Amit Singh',
    role: 'Field Worker',
    department: 'Water Supply',
    avatar: null,
    employeeId: 'EMP-2024-0123',
    isOnDuty: true,
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStats({
      pendingTasks: 4,
      completedToday: 5,
      avgResolutionTime: '2.5 hrs',
      performanceScore: 92,
      streak: 7,
      rank: 12,
      totalEmployees: 150,
    });
    
    setUpcomingTasks([
      {
        id: '1',
        title: 'Water pipe burst on Main Street',
        location: '123 Main Street, Ward 5',
        time: '10:00 AM',
        priority: 'critical',
        category: 'Water Supply',
        emoji: '💧',
      },
      {
        id: '2',
        title: 'Street light repair',
        location: 'Gandhi Nagar, Near Park',
        time: '11:30 AM',
        priority: 'medium',
        category: 'Street Lighting',
        emoji: '💡',
      },
      {
        id: '3',
        title: 'Garbage collection',
        location: 'Sector 21, Block B',
        time: '02:00 PM',
        priority: 'high',
        category: 'Waste Management',
        emoji: '🗑️',
      },
    ]);
    
    setRecentActivity([
      {
        id: '1',
        type: 'completed',
        title: 'Drainage blockage cleared',
        time: '2 hours ago',
        status: 'Completed',
      },
      {
        id: '2',
        type: 'assigned',
        title: 'Road pothole repair',
        time: '3 hours ago',
        status: 'Assigned',
      },
      {
        id: '3',
        type: 'review',
        title: 'Water meter installation',
        time: '5 hours ago',
        status: 'Under Review',
      },
    ]);
    
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadDashboardData();
    setRefreshing(false);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.95],
      'clamp'
    );
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.8],
      'clamp'
    );
    return {
      transform: [{ scale }],
      opacity,
    };
  });

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return <CheckCircle size={16} color="#22c55e" />;
      case 'assigned':
        return <Briefcase size={16} color="#3b82f6" />;
      case 'review':
        return <FileText size={16} color="#f59e0b" />;
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
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
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center mr-3">
              {user.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <Text className="text-white text-xl font-bold">
                  {user.name.charAt(0)}
                </Text>
              )}
              {user.isOnDuty && (
                <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              )}
            </View>
            
            <View className="flex-1">
              <Text className="text-white/70 text-sm">{getTimeGreeting()}</Text>
              <Text className="text-white font-bold text-lg">{user.name}</Text>
              <Text className="text-white/70 text-xs">{user.department} • {user.employeeId}</Text>
            </View>
          </View>
          
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center relative"
              onPress={() => router.push('/notifications')}
            >
              <Bell size={20} color="#fff" />
              <View className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">3</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              onPress={() => router.push('/settings')}
            >
              <Settings size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Performance Card */}
        <Animated.View 
          style={headerAnimatedStyle}
          className="bg-white rounded-2xl p-4 shadow-lg"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-gray-500 text-sm">Performance Score</Text>
              <View className="flex-row items-end">
                <Text className="text-gray-900 text-4xl font-bold">{stats.performanceScore}</Text>
                <Text className="text-gray-500 text-lg mb-1">/100</Text>
              </View>
            </View>
            
            <View className="items-center">
              <View className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 items-center justify-center">
                <Award size={28} color="#fff" />
              </View>
              <Text className="text-gray-500 text-xs mt-1">Rank #{stats.rank}</Text>
            </View>
          </View>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center mr-2">
                <Zap size={16} color="#f97316" />
              </View>
              <View>
                <Text className="text-gray-500 text-xs">Day Streak</Text>
                <Text className="text-gray-900 font-bold">{stats.streak} days</Text>
              </View>
            </View>
            
            <View className="h-8 w-px bg-gray-200" />
            
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-2">
                <TrendingUp size={16} color="#3b82f6" />
              </View>
              <View>
                <Text className="text-gray-500 text-xs">Avg Time</Text>
                <Text className="text-gray-900 font-bold">{stats.avgResolutionTime}</Text>
              </View>
            </View>
            
            <View className="h-8 w-px bg-gray-200" />
            
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-2">
                <Target size={16} color="#22c55e" />
              </View>
              <View>
                <Text className="text-gray-500 text-xs">Today</Text>
                <Text className="text-gray-900 font-bold">{stats.completedToday} done</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      >
        {/* Quick Stats */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="flex-row gap-4 mb-6"
        >
          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl p-4 shadow-sm"
            onPress={() => router.push('/employee/task-queue')}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-10 h-10 rounded-full bg-amber-100 items-center justify-center">
                <Clock size={20} color="#f59e0b" />
              </View>
              <ChevronRight size={16} color="#9ca3af" />
            </View>
            <Text className="text-gray-900 text-2xl font-bold">{stats.pendingTasks}</Text>
            <Text className="text-gray-500 text-sm">Pending Tasks</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl p-4 shadow-sm"
            onPress={() => router.push('/employee/completed-tasks')}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                <CheckCircle size={20} color="#22c55e" />
              </View>
              <ChevronRight size={16} color="#9ca3af" />
            </View>
            <Text className="text-gray-900 text-2xl font-bold">{stats.completedToday}</Text>
            <Text className="text-gray-500 text-sm">Completed Today</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="mb-6"
        >
          <Text className="text-gray-900 font-bold text-lg mb-4">Quick Actions</Text>
          
          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity
              className="bg-blue-500 rounded-2xl p-4 items-center"
              style={{ width: (width - 48) / 4 }}
              onPress={() => router.push('/employee/task-queue')}
            >
              <Briefcase size={24} color="#fff" />
              <Text className="text-white text-xs mt-2 text-center">My Tasks</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-green-500 rounded-2xl p-4 items-center"
              style={{ width: (width - 48) / 4 }}
              onPress={() => router.push('/employee/attendance')}
            >
              <Clock size={24} color="#fff" />
              <Text className="text-white text-xs mt-2 text-center">Attendance</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-purple-500 rounded-2xl p-4 items-center"
              style={{ width: (width - 48) / 4 }}
              onPress={() => router.push('/employee/daily-report')}
            >
              <FileText size={24} color="#fff" />
              <Text className="text-white text-xs mt-2 text-center">Report</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-amber-500 rounded-2xl p-4 items-center"
              style={{ width: (width - 48) / 4 }}
              onPress={() => router.push('/employee/route-optimizer')}
            >
              <Navigation size={24} color="#fff" />
              <Text className="text-white text-xs mt-2 text-center">Route</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Upcoming Tasks */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="mb-6"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 font-bold text-lg">Upcoming Tasks</Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push('/employee/task-queue')}
            >
              <Text className="text-blue-500 font-medium text-sm mr-1">View All</Text>
              <ChevronRight size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          
          {upcomingTasks.map((task, index) => (
            <Animated.View
              key={task.id}
              entering={FadeInRight.delay(index * 100).springify()}
            >
              <TouchableOpacity
                className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
                onPress={() => router.push({
                  pathname: '/employee/task-details',
                  params: { id: task.id },
                })}
              >
                <View className="flex-row items-start">
                  <View className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center mr-3">
                    <Text className="text-2xl">{task.emoji}</Text>
                  </View>
                  
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-gray-900 font-semibold flex-1 mr-2" numberOfLines={1}>
                        {task.title}
                      </Text>
                      <View
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      />
                    </View>
                    
                    <View className="flex-row items-center mb-2">
                      <MapPin size={12} color="#6b7280" />
                      <Text className="text-gray-500 text-xs ml-1 flex-1" numberOfLines={1}>
                        {task.location}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Clock size={12} color="#6b7280" />
                        <Text className="text-gray-500 text-xs ml-1">{task.time}</Text>
                      </View>
                      
                      <View
                        className="px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${getPriorityColor(task.priority)}20` }}
                      >
                        <Text
                          className="text-xs font-medium capitalize"
                          style={{ color: getPriorityColor(task.priority) }}
                        >
                          {task.priority}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="mb-6"
        >
          <Text className="text-gray-900 font-bold text-lg mb-4">Recent Activity</Text>
          
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {recentActivity.map((activity, index) => (
              <View
                key={activity.id}
                className={`flex-row items-center p-4 ${
                  index !== recentActivity.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3">
                  {getActivityIcon(activity.type)}
                </View>
                
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium" numberOfLines={1}>
                    {activity.title}
                  </Text>
                  <Text className="text-gray-500 text-xs">{activity.time}</Text>
                </View>
                
                <View
                  className={`px-2 py-1 rounded-full ${
                    activity.type === 'completed' ? 'bg-green-100' :
                    activity.type === 'assigned' ? 'bg-blue-100' : 'bg-amber-100'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      activity.type === 'completed' ? 'text-green-600' :
                      activity.type === 'assigned' ? 'text-blue-600' : 'text-amber-600'
                    }`}
                  >
                    {activity.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Leaderboard Preview */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-4 mb-6"
        >
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Star size={20} color="#fbbf24" fill="#fbbf24" />
              <Text className="text-white font-bold text-lg ml-2">Leaderboard</Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push('/employee/leaderboard')}
            >
              <Text className="text-white/80 text-sm mr-1">View All</Text>
              <ChevronRight size={16} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </View>
          
          <View className="bg-white/20 rounded-xl p-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-yellow-400 items-center justify-center">
                <Text className="text-yellow-900 font-bold">#{stats.rank}</Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-white font-semibold">{user.name}</Text>
                <Text className="text-white/70 text-sm">
                  {stats.completedToday} tasks today • Score: {stats.performanceScore}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-white/70 text-xs">of {stats.totalEmployees}</Text>
                <Text className="text-white text-sm font-medium">employees</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Today's Schedule */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 font-bold text-lg">Today's Schedule</Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push('/employee/schedule')}
            >
              <Calendar size={16} color="#3b82f6" />
              <Text className="text-blue-500 font-medium text-sm ml-1">Calendar</Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center mb-3">
              <View className="w-2 h-10 bg-green-500 rounded-full mr-3" />
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Morning Shift</Text>
                <Text className="text-gray-500 text-sm">9:00 AM - 1:00 PM</Text>
              </View>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-600 text-xs font-medium">Active</Text>
              </View>
            </View>
            
            <View className="flex-row items-center mb-3">
              <View className="w-2 h-10 bg-gray-300 rounded-full mr-3" />
              <View className="flex-1">
                <Text className="text-gray-500 font-medium">Lunch Break</Text>
                <Text className="text-gray-400 text-sm">1:00 PM - 2:00 PM</Text>
              </View>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-2 h-10 bg-gray-300 rounded-full mr-3" />
              <View className="flex-1">
                <Text className="text-gray-500 font-medium">Evening Shift</Text>
                <Text className="text-gray-400 text-sm">2:00 PM - 6:00 PM</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>

      {/* Bottom Navigation Hint */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4">
        <TouchableOpacity
          className="bg-blue-500 rounded-2xl py-4 flex-row items-center justify-center"
          onPress={() => router.push('/employee/task-queue')}
        >
          <Briefcase size={20} color="#fff" />
          <Text className="text-white font-bold text-lg ml-2">
            View {stats.pendingTasks} Pending Tasks
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
