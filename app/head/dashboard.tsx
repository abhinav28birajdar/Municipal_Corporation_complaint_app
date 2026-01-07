import React, { useState, useEffect } from 'react';
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
  Users,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  Calendar,
  ChevronRight,
  Bell,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';
import { StatCard, StatsGrid, SummaryCard } from '@/components/home/StatCard';

const { width } = Dimensions.get('window');

// Mock data for department head dashboard
const mockDashboardData = {
  teamStats: {
    totalEmployees: 24,
    presentToday: 21,
    onLeave: 2,
    onTask: 18,
  },
  complaintStats: {
    pending: 45,
    inProgress: 32,
    resolvedToday: 18,
    escalated: 5,
    overdueComplaints: 8,
  },
  performance: {
    avgResolutionTime: '4.2 hrs',
    slaCompliance: 87,
    citizenSatisfaction: 4.3,
    weeklyResolved: 124,
  },
  trends: {
    complaints: '+12%',
    resolution: '+8%',
    satisfaction: '+5%',
  },
};

const mockRecentActivities = [
  {
    id: '1',
    type: 'assignment',
    message: 'Rajesh assigned to CMP-12345678',
    time: '5 min ago',
  },
  {
    id: '2',
    type: 'completion',
    message: 'CMP-12345677 marked as resolved',
    time: '15 min ago',
  },
  {
    id: '3',
    type: 'escalation',
    message: 'CMP-12345676 escalated - SLA breach',
    time: '30 min ago',
  },
  {
    id: '4',
    type: 'checkin',
    message: 'Amit checked in at Zone B',
    time: '1 hour ago',
  },
];

const mockTeamPerformance = [
  { id: '1', name: 'Rajesh Kumar', resolved: 8, pending: 2, rating: 4.5 },
  { id: '2', name: 'Amit Sharma', resolved: 6, pending: 3, rating: 4.2 },
  { id: '3', name: 'Priya Singh', resolved: 7, pending: 1, rating: 4.7 },
  { id: '4', name: 'Suresh Patel', resolved: 5, pending: 4, rating: 3.9 },
];

export default function HeadDashboard() {
  const router = useRouter();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(mockDashboardData);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate data refresh
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const QuickActionCard = ({
    icon: Icon,
    title,
    subtitle,
    color,
    onPress,
  }: {
    icon: any;
    title: string;
    subtitle: string;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 p-4 rounded-xl mr-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      style={{ borderLeftWidth: 4, borderLeftColor: color }}
    >
      <Icon size={24} color={color} />
      <Text
        className={`mt-2 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}
      >
        {title}
      </Text>
      <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );

  const ActivityItem = ({
    type,
    message,
    time,
  }: {
    type: string;
    message: string;
    time: string;
  }) => {
    const getActivityIcon = () => {
      switch (type) {
        case 'assignment':
          return <Users size={16} color="#3b82f6" />;
        case 'completion':
          return <CheckCircle2 size={16} color="#22c55e" />;
        case 'escalation':
          return <AlertTriangle size={16} color="#ef4444" />;
        case 'checkin':
          return <Clock size={16} color="#8b5cf6" />;
        default:
          return <ClipboardList size={16} color="#6b7280" />;
      }
    };

    return (
      <View
        className={`flex-row items-center p-3 rounded-lg mb-2 ${
          isDark ? 'bg-gray-800' : 'bg-gray-50'
        }`}
      >
        <View
          className={`w-8 h-8 rounded-full items-center justify-center ${
            isDark ? 'bg-gray-700' : 'bg-white'
          }`}
        >
          {getActivityIcon()}
        </View>
        <View className="flex-1 ml-3">
          <Text
            className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
          >
            {message}
          </Text>
          <Text
            className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
          >
            {time}
          </Text>
        </View>
      </View>
    );
  };

  const TeamMemberRow = ({
    name,
    resolved,
    pending,
    rating,
  }: {
    name: string;
    resolved: number;
    pending: number;
    rating: number;
  }) => (
    <View
      className={`flex-row items-center justify-between py-3 border-b ${
        isDark ? 'border-gray-700' : 'border-gray-100'
      }`}
    >
      <View className="flex-1">
        <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {name}
        </Text>
        <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {resolved} resolved • {pending} pending
        </Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-yellow-500 font-semibold mr-1">★</Text>
        <Text className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {rating}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      edges={['top']}
    >
      {/* Header */}
      <View
        className={`px-6 py-4 flex-row items-center justify-between ${
          isDark ? 'bg-gray-900' : 'bg-white'
        } border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}
      >
        <View>
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Department Head
          </Text>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Roads & Infrastructure
          </Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            className={`w-10 h-10 rounded-full items-center justify-center mr-2 ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <Bell size={20} color={isDark ? '#9ca3af' : '#4b5563'} />
            <View className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <Settings size={20} color={isDark ? '#9ca3af' : '#4b5563'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Team Overview */}
        <View className="p-6">
          <Text
            className={`text-lg font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Team Overview
          </Text>
          <View className="flex-row flex-wrap -mx-1">
            <View className="w-1/2 p-1">
              <View
                className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="w-10 h-10 rounded-full bg-blue-500/20 items-center justify-center">
                    <Users size={20} color="#3b82f6" />
                  </View>
                  <Text className="text-green-500 text-xs font-medium">Active</Text>
                </View>
                <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {data.teamStats.presentToday}/{data.teamStats.totalEmployees}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Team Present
                </Text>
              </View>
            </View>
            <View className="w-1/2 p-1">
              <View
                className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="w-10 h-10 rounded-full bg-green-500/20 items-center justify-center">
                    <ClipboardList size={20} color="#22c55e" />
                  </View>
                  <View className="flex-row items-center">
                    <ArrowUpRight size={14} color="#22c55e" />
                    <Text className="text-green-500 text-xs font-medium">+8%</Text>
                  </View>
                </View>
                <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {data.teamStats.onTask}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  On Active Tasks
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Complaint Statistics */}
        <View className="px-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Complaints Today
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/head/complaint-queue')}
              className="flex-row items-center"
            >
              <Text className="text-blue-500 text-sm mr-1">View All</Text>
              <ChevronRight size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              className={`p-4 rounded-xl mr-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              style={{ width: width * 0.35 }}
            >
              <View className="w-10 h-10 rounded-full bg-yellow-500/20 items-center justify-center mb-2">
                <Clock size={20} color="#eab308" />
              </View>
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {data.complaintStats.pending}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Pending
              </Text>
            </View>

            <View
              className={`p-4 rounded-xl mr-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              style={{ width: width * 0.35 }}
            >
              <View className="w-10 h-10 rounded-full bg-blue-500/20 items-center justify-center mb-2">
                <TrendingUp size={20} color="#3b82f6" />
              </View>
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {data.complaintStats.inProgress}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                In Progress
              </Text>
            </View>

            <View
              className={`p-4 rounded-xl mr-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              style={{ width: width * 0.35 }}
            >
              <View className="w-10 h-10 rounded-full bg-green-500/20 items-center justify-center mb-2">
                <CheckCircle2 size={20} color="#22c55e" />
              </View>
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {data.complaintStats.resolvedToday}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Resolved
              </Text>
            </View>

            <View
              className={`p-4 rounded-xl mr-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              style={{ width: width * 0.35 }}
            >
              <View className="w-10 h-10 rounded-full bg-red-500/20 items-center justify-center mb-2">
                <AlertTriangle size={20} color="#ef4444" />
              </View>
              <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {data.complaintStats.escalated}
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Escalated
              </Text>
            </View>
          </ScrollView>

          {/* Overdue Alert */}
          {data.complaintStats.overdueComplaints > 0 && (
            <TouchableOpacity
              onPress={() => router.push('/head/escalations')}
              className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex-row items-center"
            >
              <View className="w-10 h-10 rounded-full bg-red-500/20 items-center justify-center mr-3">
                <XCircle size={20} color="#ef4444" />
              </View>
              <View className="flex-1">
                <Text className="text-red-500 font-semibold">
                  {data.complaintStats.overdueComplaints} Overdue Complaints
                </Text>
                <Text className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  Immediate attention required
                </Text>
              </View>
              <ChevronRight size={20} color="#ef4444" />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Actions */}
        <View className="p-6">
          <Text
            className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Quick Actions
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <QuickActionCard
              icon={Users}
              title="Assign Task"
              subtitle="Assign to team"
              color="#3b82f6"
              onPress={() => router.push('/head/assign-task')}
            />
            <QuickActionCard
              icon={BarChart3}
              title="Analytics"
              subtitle="View reports"
              color="#8b5cf6"
              onPress={() => router.push('/head/analytics')}
            />
            <QuickActionCard
              icon={Calendar}
              title="Schedule"
              subtitle="Team calendar"
              color="#22c55e"
              onPress={() => router.push('/head/team-schedule')}
            />
          </ScrollView>
        </View>

        {/* Performance Metrics */}
        <View className="px-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Performance Metrics
            </Text>
            <TouchableOpacity onPress={() => router.push('/head/performance-metrics')}>
              <Text className="text-blue-500 text-sm">Details</Text>
            </TouchableOpacity>
          </View>

          <View
            className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <View className="flex-row justify-between mb-4">
              <View className="items-center flex-1">
                <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {data.performance.avgResolutionTime}
                </Text>
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                  Avg Resolution
                </Text>
              </View>
              <View className={`w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <View className="items-center flex-1">
                <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {data.performance.slaCompliance}%
                </Text>
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                  SLA Compliance
                </Text>
              </View>
              <View className={`w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
              <View className="items-center flex-1">
                <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {data.performance.citizenSatisfaction}
                </Text>
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                  Satisfaction
                </Text>
              </View>
            </View>

            <View className={`h-1 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <View
                className="h-1 rounded-full bg-blue-500"
                style={{ width: `${data.performance.slaCompliance}%` }}
              />
            </View>
          </View>
        </View>

        {/* Team Performance */}
        <View className="p-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text
              className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Team Performance
            </Text>
            <TouchableOpacity onPress={() => router.push('/head/team-overview')}>
              <Text className="text-blue-500 text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          <View
            className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            {mockTeamPerformance.map((member) => (
              <TeamMemberRow
                key={member.id}
                name={member.name}
                resolved={member.resolved}
                pending={member.pending}
                rating={member.rating}
              />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-6 pb-6">
          <Text
            className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            Recent Activity
          </Text>
          {mockRecentActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              type={activity.type}
              message={activity.message}
              time={activity.time}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
