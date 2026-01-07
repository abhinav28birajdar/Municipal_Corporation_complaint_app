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
  PieChart,
  BarChart3,
  Calendar,
  ChevronDown,
  Download,
  Share2,
  Filter,
  MapPin,
} from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

const { width } = Dimensions.get('window');

const mockAnalytics = {
  summary: {
    totalComplaints: 1245,
    resolved: 1087,
    pending: 98,
    inProgress: 60,
    resolutionRate: 87.3,
    avgResolutionTime: 4.2,
  },
  trends: {
    complaintsChange: +12,
    resolutionChange: +8,
    timeChange: -15,
  },
  byCategory: [
    { name: 'Road Damage', count: 324, percentage: 26, color: '#3b82f6' },
    { name: 'Sanitation', count: 287, percentage: 23, color: '#22c55e' },
    { name: 'Water Supply', count: 224, percentage: 18, color: '#f59e0b' },
    { name: 'Electricity', count: 199, percentage: 16, color: '#8b5cf6' },
    { name: 'Drainage', count: 124, percentage: 10, color: '#ec4899' },
    { name: 'Others', count: 87, percentage: 7, color: '#6b7280' },
  ],
  byWard: [
    { name: 'Ward 1', count: 156 },
    { name: 'Ward 2', count: 198 },
    { name: 'Ward 3', count: 145 },
    { name: 'Ward 4', count: 167 },
    { name: 'Ward 5', count: 212 },
    { name: 'Ward 6', count: 178 },
    { name: 'Ward 7', count: 134 },
    { name: 'Ward 8', count: 55 },
  ],
  byPriority: [
    { name: 'Critical', count: 45, color: '#dc2626' },
    { name: 'Urgent', count: 156, color: '#ef4444' },
    { name: 'High', count: 324, color: '#f59e0b' },
    { name: 'Normal', count: 567, color: '#3b82f6' },
    { name: 'Low', count: 153, color: '#22c55e' },
  ],
  monthlyTrend: [
    { month: 'Aug', complaints: 180, resolved: 165 },
    { month: 'Sep', complaints: 210, resolved: 195 },
    { month: 'Oct', complaints: 195, resolved: 188 },
    { month: 'Nov', complaints: 225, resolved: 210 },
    { month: 'Dec', complaints: 240, resolved: 220 },
    { month: 'Jan', complaints: 195, resolved: 178 },
  ],
  peakHours: [
    { hour: '6 AM', count: 12 },
    { hour: '8 AM', count: 45 },
    { hour: '10 AM', count: 67 },
    { hour: '12 PM', count: 54 },
    { hour: '2 PM', count: 48 },
    { hour: '4 PM', count: 62 },
    { hour: '6 PM', count: 78 },
    { hour: '8 PM', count: 42 },
  ],
};

export default function AnalyticsScreen() {
  const router = useRouter();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('This Month');

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const maxWardCount = Math.max(...mockAnalytics.byWard.map((w) => w.count));
  const maxHourCount = Math.max(...mockAnalytics.peakHours.map((h) => h.count));
  const maxMonthCount = Math.max(...mockAnalytics.monthlyTrend.map((m) => m.complaints));

  const SummaryCard = ({
    title,
    value,
    change,
    suffix = '',
  }: {
    title: string;
    value: number | string;
    change?: number;
    suffix?: string;
  }) => (
    <View
      className={`p-4 rounded-xl flex-1 mr-2 last:mr-0 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
    >
      <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {title}
      </Text>
      <Text className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {value}{suffix}
      </Text>
      {change !== undefined && (
        <View className="flex-row items-center mt-1">
          {change >= 0 ? (
            <TrendingUp size={12} color="#22c55e" />
          ) : (
            <TrendingDown size={12} color="#ef4444" />
          )}
          <Text
            className={`text-xs ml-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {Math.abs(change)}%
          </Text>
        </View>
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
          <View className="flex-row">
            <TouchableOpacity
              className={`p-2 rounded-lg mr-2 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              <Download size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
            <TouchableOpacity
              className={`p-2 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
              <Share2 size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Range Selector */}
        <TouchableOpacity
          className={`flex-row items-center mt-4 px-4 py-2 rounded-lg self-start ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}
        >
          <Calendar size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text className={`mx-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {timeRange}
          </Text>
          <ChevronDown size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Summary Cards */}
        <View className="p-4">
          <View className="flex-row mb-3">
            <SummaryCard
              title="Total Complaints"
              value={mockAnalytics.summary.totalComplaints}
              change={mockAnalytics.trends.complaintsChange}
            />
            <SummaryCard
              title="Resolved"
              value={mockAnalytics.summary.resolved}
              change={mockAnalytics.trends.resolutionChange}
            />
          </View>
          <View className="flex-row">
            <SummaryCard
              title="Resolution Rate"
              value={mockAnalytics.summary.resolutionRate}
              suffix="%"
            />
            <SummaryCard
              title="Avg Time"
              value={mockAnalytics.summary.avgResolutionTime}
              suffix=" hrs"
              change={mockAnalytics.trends.timeChange}
            />
          </View>
        </View>

        {/* Monthly Trend */}
        <View className="px-4 mb-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Monthly Trend
          </Text>
          <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <View className="flex-row items-end justify-between h-40">
              {mockAnalytics.monthlyTrend.map((month, index) => (
                <View key={index} className="items-center flex-1">
                  <View className="flex-row items-end h-28">
                    <View
                      className="w-4 rounded-t mr-0.5"
                      style={{
                        height: `${(month.complaints / maxMonthCount) * 100}%`,
                        backgroundColor: '#3b82f6',
                      }}
                    />
                    <View
                      className="w-4 rounded-t"
                      style={{
                        height: `${(month.resolved / maxMonthCount) * 100}%`,
                        backgroundColor: '#22c55e',
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
            By Category
          </Text>
          <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Pie Chart Visual Representation */}
            <View className="flex-row items-center mb-4">
              <View
                className="w-24 h-24 rounded-full mr-4"
                style={{
                  backgroundColor: '#e5e7eb',
                  overflow: 'hidden',
                }}
              >
                {/* Simplified pie chart representation */}
                <View className="absolute w-full h-full">
                  {mockAnalytics.byCategory.map((cat, i) => (
                    <View
                      key={i}
                      className="absolute"
                      style={{
                        width: 48,
                        height: 48,
                        backgroundColor: cat.color,
                        top: i < 3 ? 0 : 48,
                        left: i % 3 === 0 ? 0 : i % 3 === 1 ? 32 : 64,
                        borderRadius: i === 0 ? 48 : 0,
                      }}
                    />
                  ))}
                </View>
              </View>
              <View className="flex-1">
                {mockAnalytics.byCategory.slice(0, 3).map((cat, index) => (
                  <View key={index} className="flex-row items-center mb-2">
                    <View
                      className="w-3 h-3 rounded mr-2"
                      style={{ backgroundColor: cat.color }}
                    />
                    <Text className={`text-sm flex-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {cat.name}
                    </Text>
                    <Text className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {cat.percentage}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* All Categories */}
            {mockAnalytics.byCategory.map((cat, index) => (
              <View key={index} className="mb-3 last:mb-0">
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row items-center">
                    <View
                      className="w-3 h-3 rounded mr-2"
                      style={{ backgroundColor: cat.color }}
                    />
                    <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {cat.name}
                    </Text>
                  </View>
                  <Text className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {cat.count}
                  </Text>
                </View>
                <View className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <View
                    className="h-2 rounded-full"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* By Ward */}
        <View className="px-4 mb-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            By Ward
          </Text>
          <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            {mockAnalytics.byWard.map((ward, index) => (
              <View key={index} className="mb-3 last:mb-0">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {ward.name}
                  </Text>
                  <Text className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {ward.count}
                  </Text>
                </View>
                <View className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <View
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${(ward.count / maxWardCount) * 100}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Priority Distribution */}
        <View className="px-4 mb-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            By Priority
          </Text>
          <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <View className="flex-row justify-between">
              {mockAnalytics.byPriority.map((priority, index) => (
                <View key={index} className="items-center flex-1">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: `${priority.color}20` }}
                  >
                    <Text style={{ color: priority.color, fontWeight: 'bold', fontSize: 12 }}>
                      {priority.count}
                    </Text>
                  </View>
                  <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {priority.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Peak Hours */}
        <View className="px-4 mb-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Peak Complaint Hours
          </Text>
          <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <View className="flex-row items-end justify-between h-32">
              {mockAnalytics.peakHours.map((hour, index) => (
                <View key={index} className="items-center flex-1">
                  <View
                    className="w-6 rounded-t"
                    style={{
                      height: `${(hour.count / maxHourCount) * 100}%`,
                      backgroundColor:
                        hour.count === maxHourCount ? '#3b82f6' : isDark ? '#4b5563' : '#d1d5db',
                    }}
                  />
                  <Text
                    className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
                    style={{ fontSize: 9 }}
                  >
                    {hour.hour.split(' ')[0]}
                  </Text>
                </View>
              ))}
            </View>
            <View className="mt-4 p-3 bg-blue-500/10 rounded-lg">
              <Text className="text-blue-500 text-sm text-center">
                Peak hours: 6 PM - 8 PM with 78 complaints on average
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
