import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, MapPin, Calendar, User } from 'lucide-react-native';

const mockComplaints = [
  {
    id: 'CMP-12345678',
    category: 'Road Damage',
    priority: 'urgent',
    location: 'MG Road, Sector 14',
    reportedBy: 'John Doe',
    reportedAt: '2026-01-01T09:00:00',
    description: 'Large pothole causing traffic issues',
  },
  {
    id: 'CMP-12345679',
    category: 'Garbage Issue',
    priority: 'normal',
    location: 'Park Street, Block A',
    reportedBy: 'Jane Smith',
    reportedAt: '2026-01-01T08:30:00',
    description: 'Overflowing garbage bins',
  },
];

const mockEmployees = [
  {
    id: 'EMP-001',
    name: 'Rajesh Kumar',
    assignedTasks: 3,
    availability: 'available',
    location: 'Zone A',
  },
  {
    id: 'EMP-002',
    name: 'Amit Sharma',
    assignedTasks: 2,
    availability: 'available',
    location: 'Zone B',
  },
  {
    id: 'EMP-003',
    name: 'Priya Singh',
    assignedTasks: 5,
    availability: 'busy',
    location: 'Zone A',
  },
];

export default function AssignComplaintsScreen() {
  const router = useRouter();
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAssign = () => {
    if (!selectedComplaint || !selectedEmployee) {
      Alert.alert('Error', 'Please select both a complaint and an employee');
      return;
    }

    Alert.alert(
      'Confirm Assignment',
      'Are you sure you want to assign this complaint?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Assign',
          onPress: () => {
            Alert.alert('Success', 'Complaint assigned successfully');
            setSelectedComplaint(null);
            setSelectedEmployee(null);
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-purple-600 pt-12 pb-4 px-6">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold flex-1">
            Assign Complaints
          </Text>
        </View>

        {/* Search */}
        <View className="bg-white/20 rounded-xl px-4 py-3 flex-row items-center">
          <Search size={20} color="white" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search complaints or employees..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            className="flex-1 ml-3 text-white"
          />
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Unassigned Complaints */}
        <View className="mb-6">
          <Text className="text-gray-900 text-xl font-bold mb-3">
            Unassigned Complaints
          </Text>
          {mockComplaints.map((complaint) => (
            <TouchableOpacity
              key={complaint.id}
              onPress={() => setSelectedComplaint(complaint.id)}
              className={`bg-white rounded-xl p-4 mb-3 border-2 ${
                selectedComplaint === complaint.id
                  ? 'border-purple-600'
                  : 'border-gray-200'
              }`}
            >
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-gray-900 text-lg font-bold mb-1">
                    {complaint.category}
                  </Text>
                  <Text className="text-gray-500 text-sm">{complaint.id}</Text>
                </View>
                {complaint.priority === 'urgent' && (
                  <View className="bg-red-100 px-3 py-1 rounded-full">
                    <Text className="text-red-600 text-xs font-semibold">
                      URGENT
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-gray-700 mb-2">{complaint.description}</Text>

              <View className="flex-row items-center mb-1">
                <MapPin size={14} color="#6b7280" />
                <Text className="text-gray-600 text-sm ml-2">
                  {complaint.location}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Calendar size={14} color="#6b7280" />
                <Text className="text-gray-600 text-sm ml-2">
                  {new Date(complaint.reportedAt).toLocaleString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Available Employees */}
        {selectedComplaint && (
          <View className="mb-6">
            <Text className="text-gray-900 text-xl font-bold mb-3">
              Select Employee
            </Text>
            {mockEmployees.map((employee) => (
              <TouchableOpacity
                key={employee.id}
                onPress={() => setSelectedEmployee(employee.id)}
                disabled={employee.availability !== 'available'}
                className={`bg-white rounded-xl p-4 mb-3 border-2 ${
                  selectedEmployee === employee.id
                    ? 'border-purple-600'
                    : 'border-gray-200'
                } ${employee.availability !== 'available' ? 'opacity-50' : ''}`}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-1">
                    <Text className="text-gray-900 text-lg font-bold mb-1">
                      {employee.name}
                    </Text>
                    <Text className="text-gray-500 text-sm">{employee.id}</Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${
                      employee.availability === 'available'
                        ? 'bg-green-100'
                        : 'bg-yellow-100'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        employee.availability === 'available'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {employee.availability === 'available' ? 'AVAILABLE' : 'BUSY'}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <MapPin size={14} color="#6b7280" />
                  <Text className="text-gray-600 text-sm ml-2">
                    {employee.location} • {employee.assignedTasks} active tasks
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Assign Button */}
        {selectedComplaint && selectedEmployee && (
          <TouchableOpacity
            onPress={handleAssign}
            className="bg-purple-600 py-4 rounded-xl mb-6"
          >
            <Text className="text-white text-center text-lg font-bold">
              Assign to Employee
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
