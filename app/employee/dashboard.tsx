import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Clock, CheckCircle, AlertCircle, TrendingUp, MapPin, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBadge } from '@/components/ui/StatusBadge';

const mockStats = {
  assigned: 5,
  inProgress: 3,
  completed: 24,
  todayTasks: 8,
};

const mockTasks = [
  {
    id: 'CMP-12345678',
    category: 'Road Damage',
    priority: 'urgent',
    location: 'MG Road, Sector 14',
    distance: '1.2 km',
    assignedAt: '2026-01-01T09:00:00',
    deadline: '2026-01-02',
  },
  {
    id: 'CMP-12345679',
    category: 'Garbage Issue',
    priority: 'normal',
    location: 'Park Street, Block A',
    distance: '2.5 km',
    assignedAt: '2026-01-01T08:30:00',
    deadline: '2026-01-03',
  },
];

export default function EmployeeDashboardScreen() {
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
        colors={['#059669', '#047857']}
        className="pt-12 pb-6 px-6"
      >
        <Text className="text-white text-3xl font-bold mb-2">
          Field Worker Dashboard
        </Text>
        <Text className="text-white/80 text-base">
          Welcome back! You have {mockStats.assigned} tasks assigned
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
              <View className="bg-yellow-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
                <Clock size={20} color="#d97706" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {mockStats.assigned}
              </Text>
              <Text className="text-gray-600 text-sm">Pending Tasks</Text>
            </View>

            <View className="w-[48%] bg-white rounded-xl p-4 mb-3 border border-gray-200">
              <View className="bg-blue-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
                <AlertCircle size={20} color="#2563eb" />
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

            <View className="w-[48%] bg-white rounded-xl p-4 mb-3 border border-gray-200">
              <View className="bg-purple-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
                <TrendingUp size={20} color="#7c3aed" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">
                {mockStats.todayTasks}
              </Text>
              <Text className="text-gray-600 text-sm">Today's Tasks</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-4">
          <View className="bg-white rounded-xl p-4 border border-gray-200">
            <Text className="text-gray-900 text-lg font-bold mb-3">
              Quick Actions
            </Text>
            <View className="flex-row flex-wrap">
              <TouchableOpacity
                onPress={() => router.push('/employee/assigned-tasks')}
                className="w-[48%] bg-blue-50 p-3 rounded-lg mr-2 mb-2"
              >
                <Text className="text-3xl mb-1">📋</Text>
                <Text className="text-blue-900 font-semibold text-sm">
                  View Tasks
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/employee/schedule')}
                className="w-[48%] bg-green-50 p-3 rounded-lg mb-2"
              >
                <Text className="text-3xl mb-1">📅</Text>
                <Text className="text-green-900 font-semibold text-sm">
                  My Schedule
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/employee/route')}
                className="w-[48%] bg-purple-50 p-3 rounded-lg mr-2"
              >
                <Text className="text-3xl mb-1">🗺️</Text>
                <Text className="text-purple-900 font-semibold text-sm">
                  Route Map
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/employee/performance')}
                className="w-[48%] bg-orange-50 p-3 rounded-lg"
              >
                <Text className="text-3xl mb-1">📊</Text>
                <Text className="text-orange-900 font-semibold text-sm">
                  Performance
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Assigned Tasks */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-900 text-xl font-bold">
              Today's Tasks
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/employee/assigned-tasks')}
            >
              <Text className="text-blue-600 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          {mockTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              onPress={() => router.push(`/employee/task/${task.id}`)}
              className="bg-white rounded-xl p-4 mb-3 border border-gray-200"
            >
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-gray-900 text-lg font-bold mb-1">
                    {task.category}
                  </Text>
                  <Text className="text-gray-500 text-sm">{task.id}</Text>
                </View>
                {task.priority === 'urgent' && (
                  <View className="bg-red-100 px-3 py-1 rounded-full">
                    <Text className="text-red-600 text-xs font-semibold">
                      URGENT
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-row items-center mb-2">
                <MapPin size={16} color="#6b7280" />
                <Text className="text-gray-600 text-sm ml-2 flex-1">
                  {task.location}
                </Text>
                <Text className="text-blue-600 text-sm font-semibold">
                  {task.distance}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Calendar size={16} color="#6b7280" />
                  <Text className="text-gray-600 text-sm ml-2">
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View className="mt-3 flex-row">
                <TouchableOpacity className="flex-1 bg-green-600 py-2 rounded-lg mr-2">
                  <Text className="text-white text-center font-semibold">
                    Accept
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-gray-200 py-2 rounded-lg">
                  <Text className="text-gray-700 text-center font-semibold">
                    View Details
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
