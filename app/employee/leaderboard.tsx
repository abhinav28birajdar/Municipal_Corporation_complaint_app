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
  FadeInLeft,
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
  Trophy,
  Medal,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Award,
  Target,
  Zap,
  Calendar,
  ChevronDown,
  Filter,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Employee {
  id: string;
  name: string;
  avatar: string | null;
  department: string;
  rank: number;
  previousRank: number;
  score: number;
  tasksCompleted: number;
  avgRating: number;
  streak: number;
  isCurrentUser?: boolean;
}

type TimeFilter = 'today' | 'week' | 'month' | 'all-time';
type DepartmentFilter = 'all' | 'water' | 'roads' | 'sanitation' | 'electricity';

export default function LeaderboardScreen() {
  const router = useRouter();
  const scrollY = useSharedValue(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [departmentFilter, setDepartmentFilter] = useState<DepartmentFilter>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  const currentUser = {
    id: 'current',
    name: 'Amit Singh',
    rank: 12,
    score: 850,
  };

  useEffect(() => {
    loadLeaderboard();
  }, [timeFilter, departmentFilter]);

  const loadLeaderboard = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockEmployees: Employee[] = [
      {
        id: '1',
        name: 'Rahul Verma',
        avatar: null,
        department: 'Water Supply',
        rank: 1,
        previousRank: 1,
        score: 1250,
        tasksCompleted: 48,
        avgRating: 4.9,
        streak: 15,
      },
      {
        id: '2',
        name: 'Priya Sharma',
        avatar: null,
        department: 'Sanitation',
        rank: 2,
        previousRank: 3,
        score: 1180,
        tasksCompleted: 45,
        avgRating: 4.8,
        streak: 12,
      },
      {
        id: '3',
        name: 'Suresh Kumar',
        avatar: null,
        department: 'Roads',
        rank: 3,
        previousRank: 2,
        score: 1150,
        tasksCompleted: 42,
        avgRating: 4.7,
        streak: 10,
      },
      {
        id: '4',
        name: 'Anita Patel',
        avatar: null,
        department: 'Electricity',
        rank: 4,
        previousRank: 5,
        score: 1080,
        tasksCompleted: 40,
        avgRating: 4.8,
        streak: 8,
      },
      {
        id: '5',
        name: 'Vikram Singh',
        avatar: null,
        department: 'Water Supply',
        rank: 5,
        previousRank: 4,
        score: 1050,
        tasksCompleted: 38,
        avgRating: 4.6,
        streak: 7,
      },
      // ... more employees
      {
        id: 'current',
        name: 'Amit Singh',
        avatar: null,
        department: 'Water Supply',
        rank: 12,
        previousRank: 14,
        score: 850,
        tasksCompleted: 28,
        avgRating: 4.5,
        streak: 8,
        isCurrentUser: true,
      },
    ];
    
    // Add more mock employees
    for (let i = 6; i < 12; i++) {
      mockEmployees.push({
        id: i.toString(),
        name: `Employee ${i}`,
        avatar: null,
        department: 'Various',
        rank: i,
        previousRank: i + (Math.random() > 0.5 ? 1 : -1),
        score: 1000 - (i * 50),
        tasksCompleted: 35 - i,
        avgRating: 4.5 - (i * 0.05),
        streak: Math.max(1, 10 - i),
      });
    }
    
    setEmployees(mockEmployees);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadLeaderboard();
    setRefreshing(false);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const getRankChange = (current: number, previous: number) => {
    const diff = previous - current;
    if (diff > 0) return { icon: TrendingUp, color: '#22c55e', text: `+${diff}` };
    if (diff < 0) return { icon: TrendingDown, color: '#ef4444', text: `${diff}` };
    return { icon: Minus, color: '#6b7280', text: '0' };
  };

  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return { bg: 'bg-yellow-400', text: 'text-yellow-900', gradient: ['#fbbf24', '#f59e0b'] };
      case 2:
        return { bg: 'bg-gray-300', text: 'text-gray-700', gradient: ['#d1d5db', '#9ca3af'] };
      case 3:
        return { bg: 'bg-orange-400', text: 'text-orange-900', gradient: ['#fb923c', '#ea580c'] };
      default:
        return null;
    }
  };

  const renderTopThree = () => {
    const topThree = employees.filter(e => e.rank <= 3).sort((a, b) => a.rank - b.rank);
    const orderMap = [1, 0, 2]; // Display order: 2nd, 1st, 3rd
    
    return (
      <View className="flex-row items-end justify-center px-4 pb-6">
        {orderMap.map((orderIndex, displayIndex) => {
          const employee = topThree[orderIndex];
          if (!employee) return null;
          
          const medalColor = getMedalColor(employee.rank)!;
          const isFirst = employee.rank === 1;
          
          return (
            <Animated.View
              key={employee.id}
              entering={FadeInDown.delay(displayIndex * 200).springify()}
              className={`items-center ${isFirst ? 'mx-4' : ''}`}
              style={{ width: isFirst ? 110 : 90 }}
            >
              {/* Crown for 1st place */}
              {isFirst && (
                <View className="mb-2">
                  <Crown size={28} color="#fbbf24" fill="#fbbf24" />
                </View>
              )}
              
              {/* Avatar */}
              <View
                className={`rounded-full ${isFirst ? 'w-20 h-20' : 'w-16 h-16'} items-center justify-center mb-2`}
                style={{
                  backgroundColor: medalColor.gradient[0],
                  borderWidth: 3,
                  borderColor: '#fff',
                }}
              >
                <Text className={`${medalColor.text} font-bold ${isFirst ? 'text-2xl' : 'text-xl'}`}>
                  {employee.name.charAt(0)}
                </Text>
              </View>
              
              {/* Medal Badge */}
              <View
                className={`w-8 h-8 rounded-full ${medalColor.bg} items-center justify-center -mt-4 mb-2 border-2 border-white`}
              >
                <Text className={`${medalColor.text} font-bold text-sm`}>
                  {employee.rank}
                </Text>
              </View>
              
              {/* Name */}
              <Text
                className={`text-white font-semibold text-center ${isFirst ? 'text-base' : 'text-sm'}`}
                numberOfLines={1}
              >
                {employee.name}
              </Text>
              
              {/* Score */}
              <Text className="text-white/70 text-xs">{employee.score} pts</Text>
              
              {/* Podium */}
              <View
                className={`w-full rounded-t-xl mt-2 items-center justify-center`}
                style={{
                  height: isFirst ? 80 : employee.rank === 2 ? 60 : 40,
                  backgroundColor: medalColor.gradient[1],
                }}
              >
                <Star size={isFirst ? 24 : 18} color="#fff" fill="#fff" />
              </View>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  const renderEmployeeRow = (employee: Employee, index: number) => {
    const rankChange = getRankChange(employee.rank, employee.previousRank);
    const RankIcon = rankChange.icon;
    
    return (
      <Animated.View
        key={employee.id}
        entering={FadeInLeft.delay(index * 50).springify()}
      >
        <TouchableOpacity
          className={`flex-row items-center p-4 ${
            employee.isCurrentUser ? 'bg-blue-50' : 'bg-white'
          } ${index !== employees.length - 1 ? 'border-b border-gray-100' : ''}`}
          activeOpacity={0.7}
        >
          {/* Rank */}
          <View className="w-12 items-center">
            <Text
              className={`font-bold text-lg ${
                employee.isCurrentUser ? 'text-blue-600' : 'text-gray-900'
              }`}
            >
              {employee.rank}
            </Text>
            <View className="flex-row items-center">
              <RankIcon size={12} color={rankChange.color} />
              <Text className="text-xs ml-0.5" style={{ color: rankChange.color }}>
                {rankChange.text}
              </Text>
            </View>
          </View>
          
          {/* Avatar & Name */}
          <View className="flex-row items-center flex-1 ml-2">
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                employee.isCurrentUser ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <Text
                className={`font-bold ${
                  employee.isCurrentUser ? 'text-white' : 'text-gray-600'
                }`}
              >
                {employee.name.charAt(0)}
              </Text>
            </View>
            
            <View className="ml-3 flex-1">
              <View className="flex-row items-center">
                <Text
                  className={`font-semibold ${
                    employee.isCurrentUser ? 'text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {employee.name}
                </Text>
                {employee.isCurrentUser && (
                  <View className="bg-blue-500 px-2 py-0.5 rounded ml-2">
                    <Text className="text-white text-xs font-medium">You</Text>
                  </View>
                )}
              </View>
              <Text className="text-gray-500 text-xs">{employee.department}</Text>
            </View>
          </View>
          
          {/* Stats */}
          <View className="items-end">
            <View className="flex-row items-center">
              <Zap size={14} color="#f59e0b" />
              <Text className="text-gray-900 font-bold ml-1">{employee.score}</Text>
            </View>
            <View className="flex-row items-center mt-1">
              <Star size={12} color="#fbbf24" fill="#fbbf24" />
              <Text className="text-gray-500 text-xs ml-1">{employee.avgRating.toFixed(1)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const TIME_FILTERS: { key: TimeFilter; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'all-time', label: 'All Time' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      {/* Header with Top 3 */}
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View className="pt-12 pb-4 px-4">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            >
              <ArrowLeft size={20} color="#fff" />
            </TouchableOpacity>
            
            <View className="flex-row items-center">
              <Trophy size={24} color="#fbbf24" />
              <Text className="text-white text-lg font-bold ml-2">Leaderboard</Text>
            </View>
            
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              onPress={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Time Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row gap-2">
              {TIME_FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  className={`px-4 py-2 rounded-full ${
                    timeFilter === filter.key ? 'bg-white' : 'bg-white/20'
                  }`}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTimeFilter(filter.key);
                  }}
                >
                  <Text
                    className={`font-medium ${
                      timeFilter === filter.key ? 'text-purple-600' : 'text-white'
                    }`}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Top 3 Podium */}
        {!loading && renderTopThree()}
      </LinearGradient>

      {/* Current User Stats Card */}
      {!loading && (
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="mx-4 -mt-4 bg-white rounded-2xl p-4 shadow-lg mb-4"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center">
                <Text className="text-white font-bold text-lg">
                  {currentUser.name.charAt(0)}
                </Text>
              </View>
              <View className="ml-3">
                <Text className="text-gray-900 font-bold">Your Ranking</Text>
                <Text className="text-gray-500 text-sm">{currentUser.name}</Text>
              </View>
            </View>
            
            <View className="items-end">
              <View className="flex-row items-center">
                <Award size={18} color="#8b5cf6" />
                <Text className="text-purple-600 font-bold text-xl ml-1">
                  {getOrdinal(currentUser.rank)}
                </Text>
              </View>
              <Text className="text-gray-500 text-sm">{currentUser.score} points</Text>
            </View>
          </View>
          
          {/* Progress to next rank */}
          <View className="mt-4">
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-500 text-xs">Progress to #{currentUser.rank - 1}</Text>
              <Text className="text-gray-500 text-xs">50 pts to go</Text>
            </View>
            <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <View
                className="h-full bg-purple-500 rounded-full"
                style={{ width: '75%' }}
              />
            </View>
          </View>
        </Animated.View>
      )}

      {/* Full Rankings List */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
      >
        <View className="px-4 mb-4">
          <Text className="text-gray-900 font-bold text-lg">All Rankings</Text>
        </View>
        
        <View className="mx-4 bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {loading ? (
            <View className="p-8 items-center">
              <Trophy size={48} color="#8b5cf6" />
              <Text className="text-gray-500 mt-4">Loading leaderboard...</Text>
            </View>
          ) : (
            employees
              .filter(e => e.rank > 3)
              .map((employee, index) => renderEmployeeRow(employee, index))
          )}
        </View>

        {/* How Points Work */}
        <View className="mx-4 bg-purple-50 rounded-2xl p-4 mb-6">
          <View className="flex-row items-center mb-3">
            <Target size={18} color="#8b5cf6" />
            <Text className="text-purple-700 font-bold ml-2">How Points Work</Text>
          </View>
          
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-purple-600">Complete a task</Text>
              <Text className="text-purple-700 font-medium">+10 pts</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-purple-600">5-star rating</Text>
              <Text className="text-purple-700 font-medium">+5 pts</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-purple-600">Critical task completed</Text>
              <Text className="text-purple-700 font-medium">+20 pts</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-purple-600">Day streak bonus</Text>
              <Text className="text-purple-700 font-medium">+2 pts/day</Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
