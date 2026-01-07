import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  ChevronDown,
  Download,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
} from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

const { width } = Dimensions.get('window');

const mockCitizenAnalytics = {
  myComplaints: {
    total: 12,
    resolved: 9,
    pending: 2,
    inProgress: 1,
    avgResolutionTime: '3.5 days',
  },
  comparison: {
    myAvgTime: 3.5,
    cityAvgTime: 4.2,
    mySatisfaction: 4.2,
    citySatisfaction: 3.8,
  },
  byCategory: [
    { name: 'Road Damage', count: 4, resolved: 3 },
    { name: 'Sanitation', count: 3, resolved: 2 },
    { name: 'Water Supply', count: 2, resolved: 2 },
    { name: 'Electricity', count: 2, resolved: 1 },
    { name: 'Others', count: 1, resolved: 1 },
  ],
  timeline: [
    { month: 'Aug', submitted: 2, resolved: 1 },
    { month: 'Sep', submitted: 1, resolved: 2 },
    { month: 'Oct', submitted: 3, resolved: 2 },
    { month: 'Nov', submitted: 2, resolved: 2 },
    { month: 'Dec', submitted: 2, resolved: 1 },
    { month: 'Jan', submitted: 2, resolved: 1 },
  ],
  cityStats: {
    totalComplaints: 15420,
    resolvedThisMonth: 2345,
    avgResolutionTime: '4.2 days',
    citizenSatisfaction: 4.1,
  },
  topIssuesInArea: [
    { issue: 'Road Potholes', count: 145, trend: '+12%' },
    { issue: 'Garbage Collection', count: 98, trend: '-5%' },
    { issue: 'Street Lights', count: 76, trend: '+8%' },
    { issue: 'Water Supply', count: 54, trend: '-2%' },
  ],
};

export default function CitizenAnalyticsScreen() {
  const router = useRouter();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('Last 6 Months');

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const maxCount = Math.max(...mockCitizenAnalytics.timeline.map((t) => t.submitted));

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    trend,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
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
              <TrendingUp size={12} color="#22c55e" />
            ) : (
              <TrendingDown size={12} color="#ef4444" />
            )}
            <Text
              className={`text-xs ml-1 ${trend.positive ? 'text-green-500' : 'text-red-500'}`}
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
      {subtitle && (
        <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {subtitle}
        </Text>
      )}
    </View>
  );

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
              Analytics
            </Text>
          </View>
          <TouchableOpacity
            className={`flex-row items-center px-3 py-2 rounded-lg ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <Calendar size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {timeRange}
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
        {/* My Complaints Overview */}
        <View className="p-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            My Complaints Overview
          </Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="mb-3">
              <StatCard
                title="Total Submitted"
                value={mockCitizenAnalytics.myComplaints.total}
                icon={BarChart3}
                color="#3b82f6"
              />
            </View>
            <View className="mb-3">
              <StatCard
                title="Resolved"
                value={mockCitizenAnalytics.myComplaints.resolved}
                icon={CheckCircle2}
                color="#22c55e"
                trend={{ value: '75%', positive: true }}
              />
            </View>
            <View className="mb-3">
              <StatCard
                title="Pending"
                value={mockCitizenAnalytics.myComplaints.pending}
                icon={Clock}
                color="#f59e0b"
              />
            </View>
            <View className="mb-3">
              <StatCard
                title="Avg Resolution"
                value={mockCitizenAnalytics.myComplaints.avgResolutionTime}
                icon={TrendingUp}
                color="#8b5cf6"
              />
            </View>
          </View>
        </View>

        {/* Comparison with City Average */}
        <View className="px-4 mb-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            How You Compare
          </Text>
          <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <View className="mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Your Avg Resolution Time
                </Text>
                <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {mockCitizenAnalytics.comparison.myAvgTime} days
                </Text>
              </View>
              <View className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <View
                  className="h-2 rounded-full bg-green-500"
                  style={{
                    width: `${(mockCitizenAnalytics.comparison.myAvgTime / 7) * 100}%`,
                  }}
                />
              </View>
              <Text className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                City average: {mockCitizenAnalytics.comparison.cityAvgTime} days
              </Text>
            </View>

            <View>
              <View className="flex-row justify-between mb-2">
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Your Satisfaction Rating
                </Text>
                <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {mockCitizenAnalytics.comparison.mySatisfaction}/5
                </Text>
              </View>
              <View className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <View
                  className="h-2 rounded-full bg-blue-500"
                  style={{
                    width: `${(mockCitizenAnalytics.comparison.mySatisfaction / 5) * 100}%`,
                  }}
                />
              </View>
              <Text className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                City average: {mockCitizenAnalytics.comparison.citySatisfaction}/5
              </Text>
            </View>
          </View>
        </View>

        {/* My Complaints by Category */}
        <View className="px-4 mb-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            By Category
          </Text>
          <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {mockCitizenAnalytics.byCategory.map((cat, index) => (
              <View key={index} className="mb-3 last:mb-0">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {cat.name}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {cat.resolved}/{cat.count} resolved
                  </Text>
                </View>
                <View className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <View
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${(cat.resolved / cat.count) * 100}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Timeline Chart */}
        <View className="px-4 mb-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            My Activity
          </Text>
          <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <View className="flex-row items-end justify-between h-32">
              {mockCitizenAnalytics.timeline.map((month, index) => (
                <View key={index} className="items-center flex-1">
                  <View className="flex-row items-end h-24">
                    <View
                      className="w-4 rounded-t mr-0.5"
                      style={{
                        height: `${(month.submitted / maxCount) * 100}%`,
                        backgroundColor: '#3b82f6',
                        minHeight: 4,
                      }}
                    />
                    <View
                      className="w-4 rounded-t"
                      style={{
                        height: `${(month.resolved / maxCount) * 100}%`,
                        backgroundColor: '#22c55e',
                        minHeight: 4,
                      }}
                    />
                  </View>
                  <Text className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {month.month}
                  </Text>
                </View>
              ))}
            </View>
            <View className="flex-row justify-center mt-4">
              <View className="flex-row items-center mr-4">
                <View className="w-3 h-3 rounded bg-blue-500 mr-2" />
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Submitted
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

        {/* City-wide Stats */}
        <View className="px-4 mb-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            City Statistics
          </Text>
          <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <View className="flex-row justify-between mb-4">
              <View className="items-center flex-1">
                <Text
                  className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {mockCitizenAnalytics.cityStats.totalComplaints.toLocaleString()}
                </Text>
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total Complaints
                </Text>
              </View>
              <View className={`w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <View className="items-center flex-1">
                <Text
                  className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {mockCitizenAnalytics.cityStats.resolvedThisMonth.toLocaleString()}
                </Text>
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Resolved (Month)
                </Text>
              </View>
              <View className={`w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <View className="items-center flex-1">
                <Text
                  className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {mockCitizenAnalytics.cityStats.citizenSatisfaction}
                </Text>
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Satisfaction
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Top Issues in Your Area */}
        <View className="px-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Top Issues in Your Area
          </Text>
          <View className={`rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {mockCitizenAnalytics.topIssuesInArea.map((issue, index) => (
              <View
                key={index}
                className={`flex-row items-center p-4 ${
                  index !== mockCitizenAnalytics.topIssuesInArea.length - 1
                    ? `border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`
                    : ''
                }`}
              >
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <Text className={`font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {index + 1}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {issue.issue}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {issue.count} complaints
                  </Text>
                </View>
                <View className="flex-row items-center">
                  {issue.trend.startsWith('+') ? (
                    <TrendingUp size={14} color="#ef4444" />
                  ) : (
                    <TrendingDown size={14} color="#22c55e" />
                  )}
                  <Text
                    className={`text-sm ml-1 ${
                      issue.trend.startsWith('+') ? 'text-red-500' : 'text-green-500'
                    }`}
                  >
                    {issue.trend}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
