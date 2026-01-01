import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Users, Clock, CheckCircle, TrendingUp, FileText, Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const mockStats = {
  totalComplaints: 156,
  assigned: 24,
  inProgress: 18,
  completed: 98,
  employees: 12,
  avgResolutionTime: '2.5 days',
};

export default function DepartmentDashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={['#7c3aed', '#6d28d9']}
        className="pt-12 pb-6 px-6"
      >
        <Text className="text-white text-3xl font-bold mb-2">
          Department Dashboard
        </Text>
        <Text className="text-white/80 text-base">
          Public Works Department
        </Text>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Grid */}
        <View className="p-4">
          <View className="flex-row flex-wrap justify-between mb-4">
            <View className="w-[48%] bg-white rounded-xl p-4 mb-3 border border-gray-200">
              <View className="bg-blue-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
                <FileText size={20} color="#2563eb" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {mockStats.totalComplaints}
              </Text>
              <Text className="text-gray-600 text-sm">Total Complaints</Text>
            </View>

            <View className="w-[48%] bg-white rounded-xl p-4 mb-3 border border-gray-200">
              <View className="bg-yellow-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
                <Clock size={20} color="#d97706" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {mockStats.assigned}
              </Text>
              <Text className="text-gray-600 text-sm">To be Assigned</Text>
            </View>

            <View className="w-[48%] bg-white rounded-xl p-4 mb-3 border border-gray-200">
              <View className="bg-purple-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
                <TrendingUp size={20} color="#7c3aed" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {mockStats.inProgress}
              </Text>
              <Text className="text-gray-600 text-sm">In Progress</Text>
            </View>

            <View className="w-[48%] bg-white rounded-xl p-4 mb-3 border border-gray-200">
              <View className="bg-green-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
                <CheckCircle size={20} color="#16a34a" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {mockStats.completed}
              </Text>
              <Text className="text-gray-600 text-sm">Completed</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-4">
          <Text className="text-gray-900 text-xl font-bold mb-3">
            Quick Actions
          </Text>
          <View className="bg-white rounded-xl p-4 border border-gray-200">
            <TouchableOpacity
              onPress={() => router.push('/department/assign-complaints')}
              className="flex-row items-center py-3 border-b border-gray-100"
            >
              <View className="bg-purple-100 p-2 rounded-lg mr-3">
                <Text className="text-2xl">📋</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-base">
                  Assign Complaints
                </Text>
                <Text className="text-gray-600 text-sm">
                  {mockStats.assigned} unassigned complaints
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/department/employees')}
              className="flex-row items-center py-3 border-b border-gray-100"
            >
              <View className="bg-blue-100 p-2 rounded-lg mr-3">
                <Text className="text-2xl">👥</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-base">
                  Manage Employees
                </Text>
                <Text className="text-gray-600 text-sm">
                  {mockStats.employees} active field workers
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/department/reports')}
              className="flex-row items-center py-3 border-b border-gray-100"
            >
              <View className="bg-green-100 p-2 rounded-lg mr-3">
                <Text className="text-2xl">📊</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-base">
                  View Reports
                </Text>
                <Text className="text-gray-600 text-sm">
                  Performance and analytics
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/department/review')}
              className="flex-row items-center py-3"
            >
              <View className="bg-orange-100 p-2 rounded-lg mr-3">
                <Text className="text-2xl">✅</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-base">
                  Review Completed Tasks
                </Text>
                <Text className="text-gray-600 text-sm">
                  Verify and approve work
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Performance Summary */}
        <View className="px-4 mb-6">
          <Text className="text-gray-900 text-xl font-bold mb-3">
            Performance Overview
          </Text>
          <View className="bg-white rounded-xl p-4 border border-gray-200">
            <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <Text className="text-gray-600">Average Resolution Time</Text>
              <Text className="text-gray-900 font-bold">
                {mockStats.avgResolutionTime}
              </Text>
            </View>

            <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <Text className="text-gray-600">Completion Rate</Text>
              <Text className="text-green-600 font-bold">62.8%</Text>
            </View>

            <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <Text className="text-gray-600">Citizen Satisfaction</Text>
              <Text className="text-green-600 font-bold">4.3/5.0</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Active Employees</Text>
              <Text className="text-blue-600 font-bold">
                {mockStats.employees}/15
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
