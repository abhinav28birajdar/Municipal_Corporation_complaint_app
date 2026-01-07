import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Filter,
  Users,
  Star,
  TrendingUp,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
} from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

const mockTeamMembers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    role: 'Field Officer',
    phone: '+91 98765 43210',
    email: 'rajesh.k@muni.gov.in',
    zone: 'Zone A - Sector 1-5',
    status: 'active',
    avatar: null,
    stats: {
      resolvedToday: 8,
      pendingTasks: 2,
      avgRating: 4.5,
      responseTime: '15 min',
    },
    isOnline: true,
  },
  {
    id: '2',
    name: 'Amit Sharma',
    role: 'Senior Field Officer',
    phone: '+91 98765 43211',
    email: 'amit.s@muni.gov.in',
    zone: 'Zone B - Sector 6-10',
    status: 'active',
    avatar: null,
    stats: {
      resolvedToday: 6,
      pendingTasks: 3,
      avgRating: 4.2,
      responseTime: '20 min',
    },
    isOnline: true,
  },
  {
    id: '3',
    name: 'Priya Singh',
    role: 'Field Officer',
    phone: '+91 98765 43212',
    email: 'priya.s@muni.gov.in',
    zone: 'Zone A - Sector 1-5',
    status: 'active',
    avatar: null,
    stats: {
      resolvedToday: 7,
      pendingTasks: 1,
      avgRating: 4.7,
      responseTime: '12 min',
    },
    isOnline: false,
  },
  {
    id: '4',
    name: 'Suresh Patel',
    role: 'Field Officer',
    phone: '+91 98765 43213',
    email: 'suresh.p@muni.gov.in',
    zone: 'Zone C - Sector 11-15',
    status: 'on_leave',
    avatar: null,
    stats: {
      resolvedToday: 0,
      pendingTasks: 4,
      avgRating: 3.9,
      responseTime: '25 min',
    },
    isOnline: false,
  },
  {
    id: '5',
    name: 'Anita Verma',
    role: 'Supervisor',
    phone: '+91 98765 43214',
    email: 'anita.v@muni.gov.in',
    zone: 'All Zones',
    status: 'active',
    avatar: null,
    stats: {
      resolvedToday: 3,
      pendingTasks: 0,
      avgRating: 4.8,
      responseTime: '10 min',
    },
    isOnline: true,
  },
];

export default function TeamOverviewScreen() {
  const router = useRouter();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'on_leave'>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const filteredMembers = mockTeamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all' || member.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#22c55e';
      case 'on_leave':
        return '#f59e0b';
      case 'inactive':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const TeamMemberCard = ({ member }: { member: typeof mockTeamMembers[0] }) => (
    <TouchableOpacity
      onPress={() => router.push(`/head/team-member/${member.id}` as any)}
      className={`p-4 rounded-xl mb-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
    >
      <View className="flex-row items-start">
        {/* Avatar */}
        <View className="relative">
          <View
            className={`w-14 h-14 rounded-full items-center justify-center ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            {member.avatar ? (
              <Image
                source={{ uri: member.avatar }}
                className="w-14 h-14 rounded-full"
              />
            ) : (
              <Text className={`text-xl font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {member.name.charAt(0)}
              </Text>
            )}
          </View>
          {member.isOnline && (
            <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          )}
        </View>

        {/* Info */}
        <View className="flex-1 ml-4">
          <View className="flex-row items-center justify-between">
            <Text className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {member.name}
            </Text>
            <View
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: `${getStatusColor(member.status)}20` }}
            >
              <Text style={{ color: getStatusColor(member.status), fontSize: 10, fontWeight: '600' }}>
                {member.status === 'on_leave' ? 'On Leave' : 'Active'}
              </Text>
            </View>
          </View>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {member.role}
          </Text>
          <View className="flex-row items-center mt-1">
            <MapPin size={12} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className={`text-xs ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {member.zone}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View
        className={`flex-row mt-4 pt-4 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-100'
        }`}
      >
        <View className="flex-1 items-center">
          <View className="flex-row items-center">
            <CheckCircle2 size={14} color="#22c55e" />
            <Text className={`ml-1 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {member.stats.resolvedToday}
            </Text>
          </View>
          <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Resolved
          </Text>
        </View>
        <View className="flex-1 items-center">
          <View className="flex-row items-center">
            <Clock size={14} color="#f59e0b" />
            <Text className={`ml-1 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {member.stats.pendingTasks}
            </Text>
          </View>
          <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Pending
          </Text>
        </View>
        <View className="flex-1 items-center">
          <View className="flex-row items-center">
            <Star size={14} color="#eab308" fill="#eab308" />
            <Text className={`ml-1 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {member.stats.avgRating}
            </Text>
          </View>
          <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Rating
          </Text>
        </View>
        <View className="flex-1 items-center">
          <View className="flex-row items-center">
            <TrendingUp size={14} color="#3b82f6" />
            <Text className={`ml-1 font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {member.stats.responseTime}
            </Text>
          </View>
          <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Avg Time
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="flex-row mt-3 pt-3 border-t border-gray-100">
        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-2 mr-2 rounded-lg ${
            isDark ? 'bg-gray-700' : 'bg-gray-50'
          }`}
        >
          <Phone size={16} color="#3b82f6" />
          <Text className="ml-2 text-blue-500 font-medium text-sm">Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-2 rounded-lg ${
            isDark ? 'bg-gray-700' : 'bg-gray-50'
          }`}
        >
          <Mail size={16} color="#8b5cf6" />
          <Text className="ml-2 text-purple-500 font-medium text-sm">Email</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color={isDark ? '#fff' : '#1f2937'} />
          </TouchableOpacity>
          <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Team Overview
          </Text>
        </View>

        {/* Search */}
        <View
          className={`flex-row items-center px-4 py-3 rounded-xl ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}
        >
          <Search size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search team members..."
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            className={`flex-1 ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
          />
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        >
          {[
            { key: 'all', label: 'All Members' },
            { key: 'active', label: 'Active' },
            { key: 'on_leave', label: 'On Leave' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key as any)}
              className={`px-4 py-2 mr-2 rounded-full ${
                selectedFilter === filter.key
                  ? 'bg-blue-500'
                  : isDark
                  ? 'bg-gray-800'
                  : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedFilter === filter.key
                    ? 'text-white'
                    : isDark
                    ? 'text-gray-300'
                    : 'text-gray-700'
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Summary */}
      <View className="flex-row p-4">
        <View
          className={`flex-1 p-3 rounded-xl mr-2 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {mockTeamMembers.filter((m) => m.status === 'active').length}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Active Today
          </Text>
        </View>
        <View
          className={`flex-1 p-3 rounded-xl mr-2 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {mockTeamMembers.filter((m) => m.isOnline).length}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Online Now
          </Text>
        </View>
        <View
          className={`flex-1 p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {mockTeamMembers.reduce((sum, m) => sum + m.stats.resolvedToday, 0)}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Resolved
          </Text>
        </View>
      </View>

      {/* Team List */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredMembers.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}

        {filteredMembers.length === 0 && (
          <View className="items-center justify-center py-12">
            <Users size={48} color={isDark ? '#4b5563' : '#9ca3af'} />
            <Text
              className={`mt-4 text-lg font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              No team members found
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
