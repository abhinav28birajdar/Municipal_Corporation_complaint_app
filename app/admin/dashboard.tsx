import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { BarChart3, Users, FileText, TrendingUp, Download, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const mockData = {
  totalUsers: 15234,
  totalComplaints: 8956,
  totalEmployees: 234,
  totalDepartments: 12,
  completionRate: 78.5,
  avgResolutionTime: '2.3 days',
  satisfactionScore: 4.2,
};

export default function AdminDashboardScreen() {
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
        colors={['#dc2626', '#b91c1c']}
        className="pt-12 pb-6 px-6"
      >
        <Text className="text-white text-3xl font-bold mb-2">
          Admin Dashboard
        </Text>
        <Text className="text-white/80 text-base">
          System-wide Overview & Management
        </Text>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Key Metrics */}
        <View className="p-4">
          <Text className="text-gray-900 text-xl font-bold mb-3">
            Key Metrics
          </Text>
          <View className="flex-row flex-wrap justify-between mb-4">
            <View className="w-[48%] bg-white rounded-xl p-4 mb-3 border border-gray-200">
              <View className="bg-blue-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
                <Users size={20} color="#2563eb" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {mockData.totalUsers.toLocaleString()}
              </Text>
              <Text className="text-gray-600 text-sm">Total Users</Text>
            </View>

            <View className="w-[48%] bg-white rounded-xl p-4 mb-3 border border-gray-200">
              <View className="bg-purple-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
                <FileText size={20} color="#7c3aed" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {mockData.totalComplaints.toLocaleString()}
              </Text>
              <Text className="text-gray-600 text-sm">Total Complaints</Text>
            </View>

            <View className="w-[48%] bg-white rounded-xl p-4 mb-3 border border-gray-200">
              <View className="bg-green-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
                <Users size={20} color="#16a34a" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {mockData.totalEmployees}
              </Text>
              <Text className="text-gray-600 text-sm">Employees</Text>
            </View>

            <View className="w-[48%] bg-white rounded-xl p-4 mb-3 border border-gray-200">
              <View className="bg-orange-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
                <TrendingUp size={20} color="#ea580c" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {mockData.totalDepartments}
              </Text>
              <Text className="text-gray-600 text-sm">Departments</Text>
            </View>
          </View>
        </View>

        {/* Management Sections */}
        <View className="px-4 mb-4">
          <Text className="text-gray-900 text-xl font-bold mb-3">
            Management
          </Text>
          <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <TouchableOpacity
              onPress={() => router.push('/admin/user-management')}
              className="flex-row items-center p-4 border-b border-gray-100"
            >
              <View className="bg-blue-100 p-3 rounded-lg mr-4">
                <Users size={24} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">
                  User Management
                </Text>
                <Text className="text-gray-600 text-sm">
                  View and manage all users
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/admin/employees')}
              className="flex-row items-center p-4 border-b border-gray-100"
            >
              <View className="bg-green-100 p-3 rounded-lg mr-4">
                <Users size={24} color="#16a34a" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">
                  Employee Management
                </Text>
                <Text className="text-gray-600 text-sm">
                  Add, edit, and manage employees
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/admin/departments')}
              className="flex-row items-center p-4 border-b border-gray-100"
            >
              <View className="bg-purple-100 p-3 rounded-lg mr-4">
                <TrendingUp size={24} color="#7c3aed" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">
                  Department Management
                </Text>
                <Text className="text-gray-600 text-sm">
                  Configure departments
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/admin/categories')}
              className="flex-row items-center p-4 border-b border-gray-100"
            >
              <View className="bg-yellow-100 p-3 rounded-lg mr-4">
                <FileText size={24} color="#d97706" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">
                  Category Management
                </Text>
                <Text className="text-gray-600 text-sm">
                  Manage complaint categories
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/analytics')}
              className="flex-row items-center p-4"
            >
              <View className="bg-red-100 p-3 rounded-lg mr-4">
                <BarChart3 size={24} color="#dc2626" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">
                  Analytics & Reports
                </Text>
                <Text className="text-gray-600 text-sm">
                  Detailed insights and reports
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* System Performance */}
        <View className="px-4 mb-6">
          <Text className="text-gray-900 text-xl font-bold mb-3">
            System Performance
          </Text>
          <View className="bg-white rounded-xl p-4 border border-gray-200">
            <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <Text className="text-gray-600">Completion Rate</Text>
              <Text className="text-green-600 font-bold">
                {mockData.completionRate}%
              </Text>
            </View>

            <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <Text className="text-gray-600">Avg Resolution Time</Text>
              <Text className="text-blue-600 font-bold">
                {mockData.avgResolutionTime}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Satisfaction Score</Text>
              <Text className="text-purple-600 font-bold">
                {mockData.satisfactionScore}/5.0
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Reports */}
        <View className="px-4 mb-6">
          <Text className="text-gray-900 text-xl font-bold mb-3">
            Quick Reports
          </Text>
          <View className="flex-row">
            <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 border border-gray-200 mr-2">
              <Calendar size={24} color="#2563eb" className="mb-2" />
              <Text className="text-gray-900 font-semibold">
                Monthly Report
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
              <Download size={24} color="#16a34a" className="mb-2" />
              <Text className="text-gray-900 font-semibold">
                Export Data
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
