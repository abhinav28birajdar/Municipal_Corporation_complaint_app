import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Filter, MapPin, Clock } from 'lucide-react-native';
import { StatusBadge } from '@/components/ui/StatusBadge';

const mockComplaints = [
  {
    id: 'CMP-12345678',
    category: 'Road Damage',
    status: 'in_progress',
    location: 'MG Road, Sector 14',
    date: '2026-01-01',
    priority: 'urgent',
  },
  {
    id: 'CMP-12345679',
    category: 'Garbage Issue',
    status: 'assigned',
    location: 'Park Street, Block A',
    date: '2025-12-30',
    priority: 'normal',
  },
  {
    id: 'CMP-12345680',
    category: 'Water Supply',
    status: 'completed',
    location: 'Main Market, Ward 5',
    date: '2025-12-28',
    priority: 'urgent',
  },
];

export default function ComplaintTrackingScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New' },
    { id: 'assigned', label: 'Assigned' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-4 px-6">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold flex-1">
            Track Complaints
          </Text>
          <TouchableOpacity>
            <Filter size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-white/20 rounded-xl px-4 py-3 flex-row items-center">
          <Search size={20} color="white" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by ID or category..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            className="flex-1 ml-3 text-white"
          />
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
              selectedFilter === filter.id
                ? 'bg-blue-600'
                : 'bg-gray-100'
            }`}
          >
            <Text
              className={`font-semibold ${
                selectedFilter === filter.id
                  ? 'text-white'
                  : 'text-gray-700'
              }`}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Complaints List */}
      <ScrollView className="flex-1 p-4">
        {mockComplaints.map((complaint) => (
          <TouchableOpacity
            key={complaint.id}
            onPress={() => router.push(`/complaints/${complaint.id}`)}
            className="bg-white rounded-xl p-4 mb-3 border border-gray-200"
          >
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="text-gray-900 text-lg font-bold mb-1">
                  {complaint.category}
                </Text>
                <Text className="text-gray-500 text-sm">{complaint.id}</Text>
              </View>
              <StatusBadge status={complaint.status as any} />
            </View>

            <View className="flex-row items-center mb-2">
              <MapPin size={16} color="#6b7280" />
              <Text className="text-gray-600 text-sm ml-2 flex-1">
                {complaint.location}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Clock size={16} color="#6b7280" />
                <Text className="text-gray-600 text-sm ml-2">
                  {new Date(complaint.date).toLocaleDateString()}
                </Text>
              </View>
              {complaint.priority === 'urgent' && (
                <View className="bg-red-100 px-3 py-1 rounded-full">
                  <Text className="text-red-600 text-xs font-semibold">
                    URGENT
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty State */}
        {mockComplaints.length === 0 && (
          <View className="items-center justify-center py-12">
            <Text className="text-6xl mb-4">📋</Text>
            <Text className="text-gray-900 text-xl font-bold mb-2">
              No Complaints Found
            </Text>
            <Text className="text-gray-600 text-center">
              You haven't submitted any complaints yet
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
