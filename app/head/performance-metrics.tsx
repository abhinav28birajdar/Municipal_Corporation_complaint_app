import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle2,
  Star,
  Target,
  Award,
  Calendar,
  ChevronDown,
} from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

const { width } = Dimensions.get('window');

const mockMetrics = {
  overview: {
    totalComplaints: 456,
    resolved: 398,
    avgResolutionTime: '4.2 hrs',
    slaCompliance: 87,
    citizenSatisfaction: 4.3,
  },
  trends: {
    complaints: { value: '+12%', positive: false },
    resolution: { value: '+18%', positive: true },
    satisfaction: { value: '+5%', positive: true },
    sla: { value: '-3%', positive: false },
  },
  teamPerformance: [
    { name: 'Rajesh Kumar', resolved: 45, rating: 4.5, sla: 92 },
    { name: 'Amit Sharma', resolved: 38, rating: 4.2, sla: 88 },
    { name: 'Priya Singh', resolved: 52, rating: 4.7, sla: 95 },
    { name: 'Suresh Patel', resolved: 28, rating: 3.9, sla: 78 },
    { name: 'Anita Verma', resolved: 41, rating: 4.4, sla: 90 },
  ],
  categoryBreakdown: [
    { name: 'Road Damage', count: 124, percentage: 27 },
    { name: 'Sanitation', count: 98, percentage: 21 },
    { name: 'Water Supply', count: 87, percentage: 19 },
    { name: 'Electricity', count: 76, percentage: 17 },
    { name: 'Others', count: 71, percentage: 16 },
  ],
  weeklyTrend: [
    { day: 'Mon', complaints: 18, resolved: 15 },
    { day: 'Tue', complaints: 22, resolved: 20 },
    { day: 'Wed', complaints: 16, resolved: 18 },
    { day: 'Thu', complaints: 24, resolved: 22 },
    { day: 'Fri', complaints: 20, resolved: 19 },
    { day: 'Sat', complaints: 12, resolved: 14 },
    { day: 'Sun', complaints: 8, resolved: 10 },
  ],
};

export default function PerformanceMetricsScreen() {
  const router = useRouter();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    trend?: { value: string; positive: boolean };
  }) => (
    <View
      className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      style={{ width: (width - 48) / 2 }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={20} color={color} />
        </View>
        {trend && (
          <View className="flex-row items-center">
            {trend.positive ? (
              <TrendingUp size={14} color="#22c55e" />
            ) : (
              <TrendingDown size={14} color="#ef4444" />
            )}
            <Text
              className={`text-xs ml-1 font-medium ${
                trend.positive ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {trend.value}
            </Text>
          </View>
        )}
      </View>
      <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </Text>
      <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {title}
      </Text>
    </View>
  );

  const ProgressBar = ({
    value,
    maxValue = 100,
    color,
  }: {
    value: number;
    maxValue?: number;
    color: string;
  }) => (
    <View className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
      <View
        className="h-2 rounded-full"
        style={{
          width: `${(value / maxValue) * 100}%`,
          backgroundColor: color,
        }}
      />
    </View>
  );

  const maxResolved = Math.max(...mockMetrics.weeklyTrend.map((d) => d.complaints));

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      edges={['top']}
    >
      {/* Header */}
      <View
        className={`px-6 py-4 ${isDark ? 'bg-gray-900' : 'bg-white'} border-b ${
          isDark ? 'border-gray-800' : 'border-gray-100'
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeft size={24} color={isDark ? '#fff' : '#1f2937'} />
            </TouchableOpacity>
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Performance Metrics
            </Text>
          </View>
          <TouchableOpacity
            className={`flex-row items-center px-3 py-2 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <Calendar size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              This Week
            </Text>
            <ChevronDown size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Overview Cards */}
        <View className="p-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Overview
          </Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="mb-3">
              <MetricCard
                title="Total Complaints"
                value={mockMetrics.overview.totalComplaints}
                icon={Target}
                color="#3b82f6"
                trend={mockMetrics.trends.complaints}
              />
            </View>
            <View className="mb-3">
              <MetricCard
                title="Resolved"
                value={mockMetrics.overview.resolved}
                icon={CheckCircle2}
                color="#22c55e"
                trend={mockMetrics.trends.resolution}
              />
            </View>
            <View className="mb-3">
              <MetricCard
                title="Avg Resolution"
                value={mockMetrics.overview.avgResolutionTime}
                icon={Clock}
                color="#8b5cf6"
              />
            </View>
            <View className="mb-3">
              <MetricCard
                title="SLA Compliance"
                value={`${mockMetrics.overview.slaCompliance}%`}
                icon={Award}
                color="#f59e0b"
                trend={mockMetrics.trends.sla}
              />
            </View>
          </View>
        </View>

        {/* Weekly Trend Chart */}
        <View className="px-4 mb-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Weekly Trend
          </Text>
          <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <View className="flex-row items-end justify-between h-40">
              {mockMetrics.weeklyTrend.map((day, index) => (
                <View key={index} className="items-center flex-1">
                  <View className="flex-row items-end h-28">
                    <View
                      className="w-3 rounded-t mr-0.5"
                      style={{
                        height: `${(day.complaints / maxResolved) * 100}%`,
                        backgroundColor: '#3b82f6',
                      }}
                    />
                    <View
                      className="w-3 rounded-t"
                      style={{
                        height: `${(day.resolved / maxResolved) * 100}%`,
                        backgroundColor: '#22c55e',
                      }}
                    />
                  </View>
                  <Text
                    className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                  >
                    {day.day}
                  </Text>
                </View>
              ))}
            </View>
            <View className="flex-row justify-center mt-4">
              <View className="flex-row items-center mr-4">
                <View className="w-3 h-3 rounded bg-blue-500 mr-2" />
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Received
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 rounded bg-green-500 mr-2" />
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Resolved
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <View className="px-4 mb-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Category Breakdown
          </Text>
          <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {mockMetrics.categoryBreakdown.map((category, index) => (
              <View key={index} className="mb-4 last:mb-0">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {category.name}
                  </Text>
                  <Text className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {category.count} ({category.percentage}%)
                  </Text>
                </View>
                <ProgressBar
                  value={category.percentage}
                  color={
                    ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#6b7280'][index]
                  }
                />
              </View>
            ))}
          </View>
        </View>

        {/* Team Leaderboard */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Team Leaderboard
            </Text>
            <TouchableOpacity onPress={() => router.push('/head/team-overview')}>
              <Text className="text-blue-500 text-sm">View All</Text>
            </TouchableOpacity>
          </View>
          <View className={`rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {mockMetrics.teamPerformance.map((member, index) => (
              <View
                key={index}
                className={`flex-row items-center p-4 ${
                  index !== mockMetrics.teamPerformance.length - 1
                    ? `border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`
                    : ''
                }`}
              >
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                    index < 3 ? 'bg-yellow-500/20' : isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <Text
                    className={`font-bold ${
                      index < 3
                        ? 'text-yellow-500'
                        : isDark
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {member.name}
                  </Text>
                  <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {member.resolved} resolved • {member.sla}% SLA
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Star size={14} color="#eab308" fill="#eab308" />
                  <Text className={`ml-1 font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {member.rating}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Citizen Satisfaction */}
        <View className="px-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Citizen Satisfaction
          </Text>
          <View
            className={`p-6 rounded-xl items-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <View className="flex-row items-center mb-2">
              <Text className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {mockMetrics.overview.citizenSatisfaction}
              </Text>
              <Text className={`text-2xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                /5
              </Text>
            </View>
            <View className="flex-row mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  color="#eab308"
                  fill={star <= Math.round(mockMetrics.overview.citizenSatisfaction) ? '#eab308' : 'transparent'}
                />
              ))}
            </View>
            <View className="flex-row items-center">
              <TrendingUp size={14} color="#22c55e" />
              <Text className="text-green-500 text-sm ml-1 font-medium">
                +5% from last week
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
