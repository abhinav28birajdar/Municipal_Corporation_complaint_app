import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  Star,
  AlertCircle,
  ChevronRight,
} from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

const mockComplaint = {
  id: 'CMP-12345678',
  title: 'Large pothole on main road',
  category: 'Road Damage',
  priority: 'urgent',
  location: 'MG Road, Sector 14',
  description: 'There is a large pothole on the main road causing traffic issues and potential accidents.',
  reportedAt: '2026-01-07T09:00:00',
  slaDeadline: '2026-01-08T09:00:00',
};

const mockEmployees = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    role: 'Field Officer',
    zone: 'Zone A',
    activeTask: 2,
    maxTasks: 5,
    rating: 4.5,
    completedToday: 3,
    specializations: ['Road Repair', 'Drainage'],
    availability: 'available',
    currentLocation: 'Sector 12',
    distance: '1.2 km',
  },
  {
    id: '2',
    name: 'Amit Sharma',
    role: 'Senior Field Officer',
    zone: 'Zone B',
    activeTask: 1,
    maxTasks: 5,
    rating: 4.2,
    completedToday: 4,
    specializations: ['Road Repair', 'Street Lights'],
    availability: 'available',
    currentLocation: 'Sector 8',
    distance: '2.5 km',
  },
  {
    id: '3',
    name: 'Priya Singh',
    role: 'Field Officer',
    zone: 'Zone A',
    activeTask: 4,
    maxTasks: 5,
    rating: 4.7,
    completedToday: 5,
    specializations: ['Sanitation', 'Water Supply'],
    availability: 'busy',
    currentLocation: 'Sector 15',
    distance: '0.8 km',
  },
  {
    id: '4',
    name: 'Suresh Patel',
    role: 'Field Officer',
    zone: 'Zone C',
    activeTask: 0,
    maxTasks: 5,
    rating: 3.9,
    completedToday: 2,
    specializations: ['Road Repair', 'Infrastructure'],
    availability: 'available',
    currentLocation: 'Sector 20',
    distance: '4.0 km',
  },
];

export default function AssignTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [priority, setPriority] = useState<'urgent' | 'high' | 'normal'>('normal');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const complaintId = params.complaintId as string;

  const filteredEmployees = mockEmployees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return '#22c55e';
      case 'busy':
        return '#f59e0b';
      case 'offline':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const handleAssign = async () => {
    if (!selectedEmployee) {
      Alert.alert('Error', 'Please select an employee to assign');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const employee = mockEmployees.find((e) => e.id === selectedEmployee);
      Alert.alert(
        'Task Assigned',
        `Complaint ${complaintId || mockComplaint.id} has been assigned to ${employee?.name}`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to assign task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const EmployeeCard = ({ employee }: { employee: typeof mockEmployees[0] }) => {
    const isSelected = selectedEmployee === employee.id;
    const isOverloaded = employee.activeTask >= employee.maxTasks;

    return (
      <TouchableOpacity
        onPress={() => !isOverloaded && setSelectedEmployee(employee.id)}
        disabled={isOverloaded}
        className={`p-4 rounded-xl mb-3 border-2 ${
          isSelected
            ? 'border-blue-500'
            : isDark
            ? 'border-gray-700 bg-gray-800'
            : 'border-gray-200 bg-white'
        } ${isOverloaded ? 'opacity-50' : ''}`}
      >
        <View className="flex-row items-start">
          {/* Avatar */}
          <View
            className={`w-12 h-12 rounded-full items-center justify-center ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <Text className={`text-lg font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {employee.name.charAt(0)}
            </Text>
            <View
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
              style={{ backgroundColor: getAvailabilityColor(employee.availability) }}
            />
          </View>

          {/* Info */}
          <View className="flex-1 ml-3">
            <View className="flex-row items-center justify-between">
              <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {employee.name}
              </Text>
              {isSelected && (
                <View className="bg-blue-500 rounded-full p-1">
                  <CheckCircle2 size={16} color="#fff" />
                </View>
              )}
            </View>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {employee.role} • {employee.zone}
            </Text>

            {/* Specializations */}
            <View className="flex-row flex-wrap mt-2">
              {employee.specializations.slice(0, 2).map((spec, index) => (
                <View
                  key={index}
                  className={`px-2 py-1 rounded mr-1 mb-1 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <Text className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {spec}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View
          className={`flex-row mt-3 pt-3 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-100'
          }`}
        >
          <View className="flex-1 flex-row items-center">
            <Clock size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {employee.activeTask}/{employee.maxTasks} tasks
            </Text>
          </View>
          <View className="flex-1 flex-row items-center">
            <Star size={14} color="#eab308" fill="#eab308" />
            <Text className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {employee.rating}
            </Text>
          </View>
          <View className="flex-1 flex-row items-center">
            <MapPin size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {employee.distance}
            </Text>
          </View>
        </View>

        {isOverloaded && (
          <View className="flex-row items-center mt-2 p-2 bg-yellow-500/10 rounded-lg">
            <AlertCircle size={14} color="#f59e0b" />
            <Text className="text-xs text-yellow-600 ml-1">
              At maximum task capacity
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

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
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color={isDark ? '#fff' : '#1f2937'} />
          </TouchableOpacity>
          <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Assign Task
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Complaint Info */}
        <View className="p-4">
          <View
            className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {complaintId || mockComplaint.id}
              </Text>
              <View className="px-2 py-1 rounded bg-red-500/20">
                <Text className="text-red-500 text-xs font-semibold">
                  {mockComplaint.priority.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text className={`font-semibold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {mockComplaint.title}
            </Text>
            <View className="flex-row items-center mb-1">
              <MapPin size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
              <Text className={`text-sm ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {mockComplaint.location}
              </Text>
            </View>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {mockComplaint.category}
            </Text>
          </View>
        </View>

        {/* Search Employees */}
        <View className="px-4">
          <Text className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Select Employee
          </Text>
          <View
            className={`flex-row items-center px-4 py-3 rounded-xl mb-4 ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <Search size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by name or zone..."
              placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
              className={`flex-1 ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
            />
          </View>

          {/* Employees List */}
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </View>

        {/* Additional Notes */}
        <View className="p-4">
          <Text className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Additional Notes
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add instructions or notes for the employee..."
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            multiline
            numberOfLines={4}
            className={`p-4 rounded-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
            style={{ textAlignVertical: 'top', minHeight: 100 }}
          />
        </View>

        {/* Priority Selection */}
        <View className="px-4">
          <Text className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Task Priority
          </Text>
          <View className="flex-row">
            {[
              { key: 'urgent', label: 'Urgent', color: '#ef4444' },
              { key: 'high', label: 'High', color: '#f59e0b' },
              { key: 'normal', label: 'Normal', color: '#3b82f6' },
            ].map((p) => (
              <TouchableOpacity
                key={p.key}
                onPress={() => setPriority(p.key as any)}
                className={`flex-1 py-3 mr-2 rounded-xl items-center ${
                  priority === p.key
                    ? ''
                    : isDark
                    ? 'bg-gray-800'
                    : 'bg-white'
                }`}
                style={priority === p.key ? { backgroundColor: `${p.color}20` } : {}}
              >
                <Text
                  style={{
                    color: priority === p.key ? p.color : isDark ? '#9ca3af' : '#6b7280',
                    fontWeight: priority === p.key ? '600' : '400',
                  }}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Assign Button */}
      <View
        className={`absolute bottom-0 left-0 right-0 p-4 ${
          isDark ? 'bg-gray-900' : 'bg-white'
        } border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}
      >
        <TouchableOpacity
          onPress={handleAssign}
          disabled={loading || !selectedEmployee}
          className={`py-4 rounded-xl items-center ${
            selectedEmployee ? 'bg-blue-500' : isDark ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          <Text
            className={`font-semibold ${
              selectedEmployee ? 'text-white' : isDark ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            {loading ? 'Assigning...' : 'Assign Task'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
