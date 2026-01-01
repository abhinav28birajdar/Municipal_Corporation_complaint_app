import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, Filter, MapPin, Clock, Calendar } from 'lucide-react-native';

const mockTasks = [
  {
    id: 'CMP-12345678',
    category: 'Road Damage',
    priority: 'urgent',
    status: 'assigned',
    location: 'MG Road, Sector 14',
    distance: '1.2 km',
    assignedAt: '2026-01-01T09:00:00',
    deadline: '2026-01-02',
    description: 'Large pothole causing traffic issues',
  },
  {
    id: 'CMP-12345679',
    category: 'Garbage Issue',
    priority: 'normal',
    status: 'in_progress',
    location: 'Park Street, Block A',
    distance: '2.5 km',
    assignedAt: '2026-01-01T08:30:00',
    deadline: '2026-01-03',
    description: 'Overflowing garbage bins',
  },
];

export default function AssignedTasksScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'assigned', label: 'Assigned' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'urgent', label: 'Urgent' },
  ];

  const handleAcceptTask = (taskId: string) => {
    Alert.alert(
      'Accept Task',
      'Are you sure you want to accept this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            Alert.alert('Success', 'Task accepted successfully');
          },
        },
      ]
    );
  };

  const handleStartTask = (taskId: string) => {
    router.push(`/employee/task/${taskId}/start`);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-600 pt-12 pb-4 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold flex-1">
            Assigned Tasks
          </Text>
          <TouchableOpacity>
            <Filter size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-6 py-4 bg-white border-b border-gray-200"
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => setSelectedFilter(filter.id)}
            className={`px-4 py-2 rounded-full mr-2 ${
              selectedFilter === filter.id ? 'bg-green-600' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`font-semibold ${
                selectedFilter === filter.id ? 'text-white' : 'text-gray-700'
              }`}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tasks List */}
      <ScrollView className="flex-1 p-4">
        {mockTasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            onPress={() => router.push(`/employee/task/${task.id}`)}
            className="bg-white rounded-xl p-4 mb-3 border border-gray-200"
          >
            {/* Header */}
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="text-gray-900 text-lg font-bold mb-1">
                  {task.category}
                </Text>
                <Text className="text-gray-500 text-sm">{task.id}</Text>
              </View>
              <View className="flex-row">
                {task.priority === 'urgent' && (
                  <View className="bg-red-100 px-3 py-1 rounded-full mr-2">
                    <Text className="text-red-600 text-xs font-semibold">
                      URGENT
                    </Text>
                  </View>
                )}
                <View
                  className={`px-3 py-1 rounded-full ${
                    task.status === 'assigned'
                      ? 'bg-yellow-100'
                      : 'bg-blue-100'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      task.status === 'assigned'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`}
                  >
                    {task.status === 'assigned' ? 'NEW' : 'IN PROGRESS'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <Text className="text-gray-700 mb-3">{task.description}</Text>

            {/* Location */}
            <View className="flex-row items-center mb-2">
              <MapPin size={16} color="#6b7280" />
              <Text className="text-gray-600 text-sm ml-2 flex-1">
                {task.location}
              </Text>
              <Text className="text-green-600 text-sm font-semibold">
                📍 {task.distance}
              </Text>
            </View>

            {/* Deadline */}
            <View className="flex-row items-center mb-3">
              <Calendar size={16} color="#6b7280" />
              <Text className="text-gray-600 text-sm ml-2">
                Deadline: {new Date(task.deadline).toLocaleDateString()}
              </Text>
            </View>

            {/* Actions */}
            <View className="flex-row">
              {task.status === 'assigned' ? (
                <>
                  <TouchableOpacity
                    onPress={() => handleAcceptTask(task.id)}
                    className="flex-1 bg-green-600 py-2 rounded-lg mr-2"
                  >
                    <Text className="text-white text-center font-semibold">
                      Accept Task
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-gray-200 py-2 rounded-lg">
                    <Text className="text-gray-700 text-center font-semibold">
                      Decline
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => handleStartTask(task.id)}
                    className="flex-1 bg-blue-600 py-2 rounded-lg mr-2"
                  >
                    <Text className="text-white text-center font-semibold">
                      Continue Work
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push(`/employee/task/${task.id}`)}
                    className="bg-gray-200 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-gray-700 text-center font-semibold">
                      Details
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty State */}
        {mockTasks.length === 0 && (
          <View className="items-center justify-center py-12">
            <Text className="text-6xl mb-4">✅</Text>
            <Text className="text-gray-900 text-xl font-bold mb-2">
              All Caught Up!
            </Text>
            <Text className="text-gray-600 text-center">
              No pending tasks at the moment
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
