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
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  MapPin,
  Building2,
  Download,
  Share2,
  Filter,
  ChevronRight,
  Award,
  Target,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface AnalyticsData {
  overview: {
    totalComplaints: number;
    resolved: number;
    pending: number;
    avgResolutionTime: string;
    citizenSatisfaction: number;
    monthlyGrowth: number;
  };
  categoryBreakdown: Array<{
    category: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  departmentPerformance: Array<{
    department: string;
    resolved: number;
    pending: number;
    efficiency: number;
    avgTime: string;
  }>;
  wardDistribution: Array<{
    ward: string;
    complaints: number;
    resolved: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    received: number;
    resolved: number;
  }>;
  topEmployees: Array<{
    name: string;
    department: string;
    tasksCompleted: number;
    rating: number;
  }>;
}

type PeriodFilter = 'today' | 'week' | 'month' | 'quarter' | 'year';

export default function AnalyticsDashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodFilter>('month');
  const [data, setData] = useState<AnalyticsData | null>(null);

  const progressWidth = useSharedValue(0);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  useEffect(() => {
    if (data) {
      progressWidth.value = withSpring(data.overview.citizenSatisfaction / 100);
    }
  }, [data]);

  const loadAnalytics = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockData: AnalyticsData = {
      overview: {
        totalComplaints: 1245,
        resolved: 823,
        pending: 422,
        avgResolutionTime: '2.5 days',
        citizenSatisfaction: 87,
        monthlyGrowth: 12.5,
      },
      categoryBreakdown: [
        { category: 'Water Supply', count: 320, percentage: 25.7, color: '#3b82f6' },
        { category: 'Sanitation', count: 280, percentage: 22.5, color: '#22c55e' },
        { category: 'Roads', count: 245, percentage: 19.7, color: '#f59e0b' },
        { category: 'Street Lighting', count: 180, percentage: 14.5, color: '#8b5cf6' },
        { category: 'Building', count: 120, percentage: 9.6, color: '#ec4899' },
        { category: 'Others', count: 100, percentage: 8.0, color: '#6b7280' },
      ],
      departmentPerformance: [
        { department: 'Water Supply', resolved: 285, pending: 35, efficiency: 89, avgTime: '2.1 days' },
        { department: 'Sanitation', resolved: 250, pending: 30, efficiency: 92, avgTime: '1.8 days' },
        { department: 'Roads', resolved: 180, pending: 65, efficiency: 73, avgTime: '3.5 days' },
        { department: 'Electrical', resolved: 160, pending: 20, efficiency: 88, avgTime: '2.2 days' },
      ],
      wardDistribution: [
        { ward: 'Ward 1', complaints: 120, resolved: 95 },
        { ward: 'Ward 2', complaints: 98, resolved: 82 },
        { ward: 'Ward 3', complaints: 145, resolved: 110 },
        { ward: 'Ward 4', complaints: 87, resolved: 75 },
        { ward: 'Ward 5', complaints: 112, resolved: 88 },
      ],
      monthlyTrends: [
        { month: 'Jul', received: 180, resolved: 165 },
        { month: 'Aug', received: 210, resolved: 195 },
        { month: 'Sep', received: 190, resolved: 188 },
        { month: 'Oct', received: 225, resolved: 210 },
        { month: 'Nov', received: 240, resolved: 220 },
        { month: 'Dec', received: 200, resolved: 190 },
      ],
      topEmployees: [
        { name: 'Amit Singh', department: 'Water Supply', tasksCompleted: 145, rating: 4.8 },
        { name: 'Vikram Patel', department: 'Electrical', tasksCompleted: 132, rating: 4.7 },
        { name: 'Rahul Verma', department: 'Roads', tasksCompleted: 128, rating: 4.6 },
        { name: 'Sunil Kumar', department: 'Sanitation', tasksCompleted: 119, rating: 4.5 },
      ],
    };

    setData(mockData);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadAnalytics();
    setRefreshing(false);
  }, []);

  const satisfactionAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const renderOverviewCard = (
    title: string,
    value: string | number,
    icon: any,
    color: string,
    trend?: number
  ) => (
    <View className="bg-white rounded-2xl p-4 shadow-sm" style={{ width: (width - 48) / 2 }}>
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mb-3"
        style={{ backgroundColor: color + '20' }}
      >
        {React.createElement(icon, { size: 20, color })}
      </View>
      <Text className="text-gray-500 text-sm">{title}</Text>
      <View className="flex-row items-end justify-between mt-1">
        <Text className="text-gray-900 font-bold text-xl">{value}</Text>
        {trend !== undefined && (
          <View className={`flex-row items-center ${trend >= 0 ? 'bg-green-100' : 'bg-red-100'} px-2 py-0.5 rounded-full`}>
            {trend >= 0 ? (
              <TrendingUp size={12} color="#22c55e" />
            ) : (
              <TrendingDown size={12} color="#ef4444" />
            )}
            <Text className={`text-xs ml-1 ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderBarChart = () => {
    if (!data) return null;

    const maxValue = Math.max(...data.monthlyTrends.map(t => Math.max(t.received, t.resolved)));

    return (
      <View className="flex-row items-end justify-between h-32">
        {data.monthlyTrends.map((item, index) => (
          <Animated.View
            key={item.month}
            entering={FadeInDown.delay(index * 100).springify()}
            className="items-center flex-1"
          >
            <View className="flex-row items-end gap-0.5 h-24 mb-2">
              <View
                className="w-3 rounded-t-sm bg-blue-200"
                style={{ height: (item.received / maxValue) * 96 }}
              />
              <View
                className="w-3 rounded-t-sm bg-green-500"
                style={{ height: (item.resolved / maxValue) * 96 }}
              />
            </View>
            <Text className="text-gray-500 text-xs">{item.month}</Text>
          </Animated.View>
        ))}
      </View>
    );
  };

  const renderCategoryBar = (category: AnalyticsData['categoryBreakdown'][0], index: number) => (
    <Animated.View
      key={category.category}
      entering={FadeInRight.delay(index * 50).springify()}
      className="mb-3"
    >
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-gray-700 text-sm">{category.category}</Text>
        <Text className="text-gray-500 text-sm">{category.count}</Text>
      </View>
      <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{
            width: `${category.percentage}%`,
            backgroundColor: category.color,
          }}
        />
      </View>
    </Animated.View>
  );

  if (loading || !data) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <BarChart3 size={48} color="#3b82f6" />
        <Text className="text-gray-500 mt-4">Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['#059669', '#10b981']}
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

          <Text className="text-white text-lg font-semibold">Analytics</Text>

          <View className="flex-row gap-2">
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              onPress={() => {}}
            >
              <Download size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              onPress={() => {}}
            >
              <Share2 size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Period Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {(['today', 'week', 'month', 'quarter', 'year'] as PeriodFilter[]).map((p) => (
              <TouchableOpacity
                key={p}
                className={`px-4 py-2 rounded-full ${
                  period === p ? 'bg-white' : 'bg-white/20'
                }`}
                onPress={() => setPeriod(p)}
              >
                <Text className={period === p ? 'text-green-600 font-medium' : 'text-white'}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {/* Overview Cards */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="flex-row flex-wrap gap-3 mb-6"
        >
          {renderOverviewCard('Total Complaints', data.overview.totalComplaints, FileText, '#3b82f6', data.overview.monthlyGrowth)}
          {renderOverviewCard('Resolved', data.overview.resolved, CheckCircle, '#22c55e')}
          {renderOverviewCard('Pending', data.overview.pending, Clock, '#f59e0b')}
          {renderOverviewCard('Avg. Resolution', data.overview.avgResolutionTime, Clock, '#8b5cf6')}
        </Animated.View>

        {/* Citizen Satisfaction */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-900 font-semibold">Citizen Satisfaction</Text>
            <View className="flex-row items-center">
              <Target size={16} color="#22c55e" />
              <Text className="text-green-600 font-bold ml-1">{data.overview.citizenSatisfaction}%</Text>
            </View>
          </View>

          <View className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <Animated.View
              style={satisfactionAnimatedStyle}
              className="h-full bg-green-500 rounded-full"
            />
          </View>

          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-400 text-xs">0%</Text>
            <Text className="text-gray-400 text-xs">50%</Text>
            <Text className="text-gray-400 text-xs">100%</Text>
          </View>
        </Animated.View>

        {/* Monthly Trends Chart */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 font-semibold">Monthly Trends</Text>
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-sm bg-blue-200 mr-1" />
                <Text className="text-gray-500 text-xs">Received</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded-sm bg-green-500 mr-1" />
                <Text className="text-gray-500 text-xs">Resolved</Text>
              </View>
            </View>
          </View>

          {renderBarChart()}
        </Animated.View>

        {/* Category Breakdown */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 font-semibold">Complaints by Category</Text>
            <TouchableOpacity onPress={() => router.push('/admin/category-analytics')}>
              <Text className="text-blue-500 text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          {data.categoryBreakdown.map((category, index) => renderCategoryBar(category, index))}
        </Animated.View>

        {/* Department Performance */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 font-semibold">Department Performance</Text>
            <TouchableOpacity onPress={() => router.push('/admin/department-analytics')}>
              <ChevronRight size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {data.departmentPerformance.map((dept, index) => (
            <Animated.View
              key={dept.department}
              entering={FadeInRight.delay(index * 50).springify()}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
            >
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">{dept.department}</Text>
                <Text className="text-gray-500 text-sm">
                  {dept.resolved} resolved • {dept.pending} pending
                </Text>
              </View>

              <View className="items-end">
                <View
                  className={`px-2 py-1 rounded-full ${
                    dept.efficiency >= 85
                      ? 'bg-green-100'
                      : dept.efficiency >= 70
                      ? 'bg-amber-100'
                      : 'bg-red-100'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      dept.efficiency >= 85
                        ? 'text-green-600'
                        : dept.efficiency >= 70
                        ? 'text-amber-600'
                        : 'text-red-500'
                    }`}
                  >
                    {dept.efficiency}%
                  </Text>
                </View>
                <Text className="text-gray-400 text-xs mt-1">{dept.avgTime}</Text>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Top Performing Employees */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Award size={20} color="#f59e0b" />
              <Text className="text-gray-900 font-semibold ml-2">Top Employees</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/admin/employee-performance')}>
              <Text className="text-blue-500 text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          {data.topEmployees.map((employee, index) => (
            <Animated.View
              key={employee.name}
              entering={FadeInRight.delay(index * 50).springify()}
              className="flex-row items-center py-3 border-b border-gray-100"
            >
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                  index === 0
                    ? 'bg-amber-100'
                    : index === 1
                    ? 'bg-gray-200'
                    : index === 2
                    ? 'bg-orange-100'
                    : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`font-bold ${
                    index === 0
                      ? 'text-amber-600'
                      : index === 1
                      ? 'text-gray-600'
                      : index === 2
                      ? 'text-orange-600'
                      : 'text-gray-500'
                  }`}
                >
                  {index + 1}
                </Text>
              </View>

              <View className="flex-1">
                <Text className="text-gray-900 font-medium">{employee.name}</Text>
                <Text className="text-gray-500 text-sm">{employee.department}</Text>
              </View>

              <View className="items-end">
                <Text className="text-gray-900 font-bold">{employee.tasksCompleted}</Text>
                <View className="flex-row items-center">
                  <Text className="text-amber-500 text-sm">★ {employee.rating}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Ward Distribution */}
        <Animated.View
          entering={FadeInDown.delay(700).springify()}
          className="bg-white rounded-2xl p-4 shadow-sm"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <MapPin size={20} color="#8b5cf6" />
              <Text className="text-gray-900 font-semibold ml-2">Complaints by Ward</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/admin/ward-analytics')}>
              <Text className="text-blue-500 text-sm">View Map</Text>
            </TouchableOpacity>
          </View>

          {data.wardDistribution.map((ward, index) => {
            const resolvedPercentage = (ward.resolved / ward.complaints) * 100;
            return (
              <View key={ward.ward} className="mb-3">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-gray-700 text-sm">{ward.ward}</Text>
                  <Text className="text-gray-500 text-sm">
                    {ward.resolved}/{ward.complaints}
                  </Text>
                </View>
                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${resolvedPercentage}%` }}
                  />
                </View>
              </View>
            );
          })}
        </Animated.View>
      </ScrollView>
    </View>
  );
}
