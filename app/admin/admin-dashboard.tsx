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
  Settings,
  Users,
  FileText,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  ChevronRight,
  Filter,
  Calendar,
  Building2,
  UserCheck,
  Briefcase,
  Activity,
  Target,
  Zap,
  PieChart,
  ArrowUpRight,
  MoreHorizontal,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface DashboardStats {
  totalComplaints: number;
  complaintsChange: number;
  resolvedToday: number;
  pendingCritical: number;
  avgResolutionTime: string;
  resolutionTimeChange: number;
  activeEmployees: number;
  citizenSatisfaction: number;
}

interface RecentComplaint {
  id: string;
  title: string;
  category: string;
  emoji: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: string;
  location: string;
  time: string;
}

interface Department {
  id: string;
  name: string;
  icon: string;
  pending: number;
  resolved: number;
  efficiency: number;
}

export default function AdminDashboardScreen() {
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  
  const [stats, setStats] = useState<DashboardStats>({
    totalComplaints: 0,
    complaintsChange: 0,
    resolvedToday: 0,
    pendingCritical: 0,
    avgResolutionTime: '-',
    resolutionTimeChange: 0,
    activeEmployees: 0,
    citizenSatisfaction: 0,
  });
  
  const [recentComplaints, setRecentComplaints] = useState<RecentComplaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  
  const user = {
    name: 'Dr. Ramesh Patel',
    role: 'Municipal Commissioner',
    avatar: null,
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStats({
      totalComplaints: 1247,
      complaintsChange: 12.5,
      resolvedToday: 89,
      pendingCritical: 23,
      avgResolutionTime: '4.2 hrs',
      resolutionTimeChange: -8.3,
      activeEmployees: 145,
      citizenSatisfaction: 87,
    });
    
    setRecentComplaints([
      {
        id: '1',
        title: 'Water pipe burst on Main Street',
        category: 'Water Supply',
        emoji: '💧',
        priority: 'critical',
        status: 'In Progress',
        location: 'Ward 5',
        time: '10 mins ago',
      },
      {
        id: '2',
        title: 'Garbage collection delayed',
        category: 'Sanitation',
        emoji: '🗑️',
        priority: 'high',
        status: 'Assigned',
        location: 'Ward 12',
        time: '25 mins ago',
      },
      {
        id: '3',
        title: 'Street light malfunction',
        category: 'Electricity',
        emoji: '💡',
        priority: 'medium',
        status: 'Pending',
        location: 'Ward 8',
        time: '45 mins ago',
      },
      {
        id: '4',
        title: 'Pothole on highway junction',
        category: 'Roads',
        emoji: '🛣️',
        priority: 'high',
        status: 'In Progress',
        location: 'Ward 3',
        time: '1 hour ago',
      },
    ]);
    
    setDepartments([
      { id: '1', name: 'Water Supply', icon: '💧', pending: 45, resolved: 128, efficiency: 92 },
      { id: '2', name: 'Sanitation', icon: '🗑️', pending: 32, resolved: 156, efficiency: 88 },
      { id: '3', name: 'Roads', icon: '🛣️', pending: 28, resolved: 89, efficiency: 85 },
      { id: '4', name: 'Electricity', icon: '💡', pending: 19, resolved: 112, efficiency: 94 },
      { id: '5', name: 'Parks & Gardens', icon: '🌳', pending: 12, resolved: 67, efficiency: 91 },
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
    return {
      transform: [{ scale }],
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'assigned':
        return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'pending':
        return { bg: 'bg-amber-100', text: 'text-amber-600' };
      case 'resolved':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
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
        colors={['#1e3a8a', '#1d4ed8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center flex-1">
            <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center mr-3">
              <Text className="text-white text-xl font-bold">
                {user.name.charAt(0)}
              </Text>
            </View>
            
            <View className="flex-1">
              <Text className="text-white/70 text-sm">{getTimeGreeting()}</Text>
              <Text className="text-white font-bold text-lg">{user.name}</Text>
              <Text className="text-white/60 text-xs">{user.role}</Text>
            </View>
          </View>
          
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center relative"
              onPress={() => router.push('/notifications')}
            >
              <Bell size={20} color="#fff" />
              <View className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">5</Text>
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

        {/* Period Selector */}
        <View className="flex-row bg-white/20 rounded-xl p-1 mb-4">
          {(['today', 'week', 'month'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              className={`flex-1 py-2 rounded-lg ${
                selectedPeriod === period ? 'bg-white' : ''
              }`}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedPeriod(period);
              }}
            >
              <Text
                className={`text-center font-medium capitalize ${
                  selectedPeriod === period ? 'text-blue-700' : 'text-white'
                }`}
              >
                {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Overview */}
        <Animated.View style={headerAnimatedStyle}>
          <View className="flex-row flex-wrap gap-3">
            {/* Total Complaints */}
            <View className="bg-white/20 rounded-2xl p-4 flex-1 min-w-[45%]">
              <View className="flex-row items-center justify-between mb-2">
                <FileText size={20} color="#fff" />
                <View className="flex-row items-center">
                  <TrendingUp size={14} color="#4ade80" />
                  <Text className="text-green-400 text-xs ml-1">
                    +{stats.complaintsChange}%
                  </Text>
                </View>
              </View>
              <Text className="text-white text-2xl font-bold">{stats.totalComplaints}</Text>
              <Text className="text-white/70 text-sm">Total Complaints</Text>
            </View>
            
            {/* Resolved Today */}
            <View className="bg-white/20 rounded-2xl p-4 flex-1 min-w-[45%]">
              <View className="flex-row items-center justify-between mb-2">
                <CheckCircle size={20} color="#4ade80" />
                <View className="bg-green-400/30 px-2 py-0.5 rounded-full">
                  <Text className="text-green-300 text-xs font-medium">Good</Text>
                </View>
              </View>
              <Text className="text-white text-2xl font-bold">{stats.resolvedToday}</Text>
              <Text className="text-white/70 text-sm">Resolved Today</Text>
            </View>
            
            {/* Pending Critical */}
            <View className="bg-white/20 rounded-2xl p-4 flex-1 min-w-[45%]">
              <View className="flex-row items-center justify-between mb-2">
                <AlertTriangle size={20} color="#f87171" />
                <View className="bg-red-400/30 px-2 py-0.5 rounded-full">
                  <Text className="text-red-300 text-xs font-medium">Urgent</Text>
                </View>
              </View>
              <Text className="text-white text-2xl font-bold">{stats.pendingCritical}</Text>
              <Text className="text-white/70 text-sm">Critical Pending</Text>
            </View>
            
            {/* Avg Resolution Time */}
            <View className="bg-white/20 rounded-2xl p-4 flex-1 min-w-[45%]">
              <View className="flex-row items-center justify-between mb-2">
                <Clock size={20} color="#fff" />
                <View className="flex-row items-center">
                  <TrendingDown size={14} color="#4ade80" />
                  <Text className="text-green-400 text-xs ml-1">
                    {stats.resolutionTimeChange}%
                  </Text>
                </View>
              </View>
              <Text className="text-white text-2xl font-bold">{stats.avgResolutionTime}</Text>
              <Text className="text-white/70 text-sm">Avg Resolution</Text>
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
        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="mb-6"
        >
          <Text className="text-gray-900 font-bold text-lg mb-4">Quick Actions</Text>
          
          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity
              className="bg-white rounded-2xl p-4 items-center shadow-sm"
              style={{ width: (width - 48) / 4 }}
              onPress={() => router.push('/admin/user-management')}
            >
              <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-2">
                <Users size={24} color="#3b82f6" />
              </View>
              <Text className="text-gray-700 text-xs text-center">Users</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-white rounded-2xl p-4 items-center shadow-sm"
              style={{ width: (width - 48) / 4 }}
              onPress={() => router.push('/admin/complaint-console')}
            >
              <View className="w-12 h-12 rounded-full bg-amber-100 items-center justify-center mb-2">
                <FileText size={24} color="#f59e0b" />
              </View>
              <Text className="text-gray-700 text-xs text-center">Complaints</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-white rounded-2xl p-4 items-center shadow-sm"
              style={{ width: (width - 48) / 4 }}
              onPress={() => router.push('/analytics')}
            >
              <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center mb-2">
                <BarChart3 size={24} color="#8b5cf6" />
              </View>
              <Text className="text-gray-700 text-xs text-center">Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-white rounded-2xl p-4 items-center shadow-sm"
              style={{ width: (width - 48) / 4 }}
              onPress={() => router.push('/admin/workflow')}
            >
              <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mb-2">
                <Activity size={24} color="#22c55e" />
              </View>
              <Text className="text-gray-700 text-xs text-center">Workflow</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Department Performance */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="mb-6"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 font-bold text-lg">Department Performance</Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push('/admin/departments')}
            >
              <Text className="text-blue-500 font-medium text-sm mr-1">View All</Text>
              <ChevronRight size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {departments.map((dept, index) => (
                <Animated.View
                  key={dept.id}
                  entering={FadeInRight.delay(index * 100).springify()}
                >
                  <TouchableOpacity
                    className="bg-white rounded-2xl p-4 shadow-sm"
                    style={{ width: 160 }}
                    onPress={() => router.push({
                      pathname: '/admin/department-details',
                      params: { id: dept.id },
                    })}
                  >
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="text-2xl">{dept.icon}</Text>
                      <View className={`px-2 py-1 rounded-full ${
                        dept.efficiency >= 90 ? 'bg-green-100' : 
                        dept.efficiency >= 80 ? 'bg-amber-100' : 'bg-red-100'
                      }`}>
                        <Text className={`text-xs font-medium ${
                          dept.efficiency >= 90 ? 'text-green-600' : 
                          dept.efficiency >= 80 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {dept.efficiency}%
                        </Text>
                      </View>
                    </View>
                    
                    <Text className="text-gray-900 font-semibold mb-2" numberOfLines={1}>
                      {dept.name}
                    </Text>
                    
                    <View className="flex-row justify-between">
                      <View>
                        <Text className="text-gray-500 text-xs">Pending</Text>
                        <Text className="text-amber-500 font-bold">{dept.pending}</Text>
                      </View>
                      <View>
                        <Text className="text-gray-500 text-xs">Resolved</Text>
                        <Text className="text-green-500 font-bold">{dept.resolved}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Additional Stats */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="flex-row gap-3 mb-6"
        >
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <UserCheck size={20} color="#22c55e" />
              <Text className="text-green-500 text-xs">Online</Text>
            </View>
            <Text className="text-gray-900 text-2xl font-bold">{stats.activeEmployees}</Text>
            <Text className="text-gray-500 text-sm">Active Employees</Text>
          </View>
          
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <Target size={20} color="#8b5cf6" />
              <View className="flex-row items-center">
                <TrendingUp size={14} color="#22c55e" />
                <Text className="text-green-500 text-xs ml-1">+2%</Text>
              </View>
            </View>
            <Text className="text-gray-900 text-2xl font-bold">{stats.citizenSatisfaction}%</Text>
            <Text className="text-gray-500 text-sm">Satisfaction Rate</Text>
          </View>
        </Animated.View>

        {/* Recent Complaints */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 font-bold text-lg">Recent Complaints</Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push('/admin/complaint-console')}
            >
              <Text className="text-blue-500 font-medium text-sm mr-1">View All</Text>
              <ChevronRight size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {recentComplaints.map((complaint, index) => {
              const statusStyle = getStatusColor(complaint.status);
              return (
                <TouchableOpacity
                  key={complaint.id}
                  className={`p-4 ${
                    index !== recentComplaints.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                  onPress={() => router.push({
                    pathname: '/complaints/[id]',
                    params: { id: complaint.id },
                  })}
                >
                  <View className="flex-row items-start">
                    <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center mr-3">
                      <Text className="text-xl">{complaint.emoji}</Text>
                    </View>
                    
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-gray-900 font-semibold flex-1 mr-2" numberOfLines={1}>
                          {complaint.title}
                        </Text>
                        <View
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getPriorityColor(complaint.priority) }}
                        />
                      </View>
                      
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <MapPin size={12} color="#6b7280" />
                          <Text className="text-gray-500 text-xs ml-1">{complaint.location}</Text>
                          <Text className="text-gray-300 mx-2">•</Text>
                          <Text className="text-gray-500 text-xs">{complaint.time}</Text>
                        </View>
                        
                        <View className={`px-2 py-1 rounded-full ${statusStyle.bg}`}>
                          <Text className={`text-xs font-medium ${statusStyle.text}`}>
                            {complaint.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </Animated.ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 items-center justify-center shadow-lg"
        style={{
          shadowColor: '#3b82f6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        onPress={() => router.push('/admin/complaint-console')}
      >
        <FileText size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
