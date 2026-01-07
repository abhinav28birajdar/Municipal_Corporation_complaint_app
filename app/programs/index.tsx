import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  Clock,
  Heart,
  Share2,
  Building2,
} from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

const mockPrograms = [
  {
    id: '1',
    title: 'Swachh Bharat Abhiyan',
    category: 'Cleanliness',
    description: 'National cleanliness campaign to clean streets, roads and infrastructure.',
    image: 'https://via.placeholder.com/400x200?text=Swachh+Bharat',
    startDate: '2025-10-02',
    endDate: '2026-10-02',
    status: 'active',
    department: 'Sanitation',
    beneficiaries: 50000,
    progress: 65,
  },
  {
    id: '2',
    title: 'Digital India Initiative',
    category: 'Technology',
    description: 'E-governance services and digital infrastructure development.',
    image: 'https://via.placeholder.com/400x200?text=Digital+India',
    startDate: '2025-07-01',
    endDate: '2026-12-31',
    status: 'active',
    department: 'IT',
    beneficiaries: 100000,
    progress: 45,
  },
  {
    id: '3',
    title: 'Road Safety Week',
    category: 'Safety',
    description: 'Awareness campaign for road safety and traffic rules.',
    image: 'https://via.placeholder.com/400x200?text=Road+Safety',
    startDate: '2026-01-11',
    endDate: '2026-01-17',
    status: 'upcoming',
    department: 'Transport',
    beneficiaries: 25000,
    progress: 0,
  },
  {
    id: '4',
    title: 'Green City Project',
    category: 'Environment',
    description: 'Tree plantation and urban forestry initiative.',
    image: 'https://via.placeholder.com/400x200?text=Green+City',
    startDate: '2025-06-05',
    endDate: '2025-12-31',
    status: 'completed',
    department: 'Environment',
    beneficiaries: 35000,
    progress: 100,
  },
  {
    id: '5',
    title: 'Senior Citizen Welfare',
    category: 'Social',
    description: 'Healthcare and pension benefits for senior citizens.',
    image: 'https://via.placeholder.com/400x200?text=Senior+Welfare',
    startDate: '2025-01-01',
    endDate: '2026-12-31',
    status: 'active',
    department: 'Social Welfare',
    beneficiaries: 15000,
    progress: 72,
  },
];

const categories = ['All', 'Cleanliness', 'Technology', 'Safety', 'Environment', 'Social'];

export default function ProgramsScreen() {
  const router = useRouter();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const filteredPrograms = mockPrograms.filter((program) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || program.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#22c55e';
      case 'upcoming':
        return '#3b82f6';
      case 'completed':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Cleanliness':
        return '#22c55e';
      case 'Technology':
        return '#3b82f6';
      case 'Safety':
        return '#f59e0b';
      case 'Environment':
        return '#10b981';
      case 'Social':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const ProgramCard = ({ program }: { program: typeof mockPrograms[0] }) => (
    <TouchableOpacity
      onPress={() => router.push(`/programs/${program.id}` as any)}
      className={`rounded-xl mb-4 overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
    >
      {/* Image */}
      <View className="h-40 bg-gray-300">
        <Image
          source={{ uri: program.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute top-3 right-3">
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: getStatusColor(program.status) }}
          >
            <Text className="text-white text-xs font-semibold capitalize">
              {program.status}
            </Text>
          </View>
        </View>
        <View className="absolute top-3 left-3">
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: `${getCategoryColor(program.category)}` }}
          >
            <Text className="text-white text-xs font-semibold">
              {program.category}
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        <Text className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {program.title}
        </Text>
        <Text
          className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          numberOfLines={2}
        >
          {program.description}
        </Text>

        {/* Details */}
        <View className="flex-row flex-wrap mb-3">
          <View className="flex-row items-center mr-4 mb-2">
            <Calendar size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date(program.startDate).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
              })} - {new Date(program.endDate).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
          <View className="flex-row items-center mr-4 mb-2">
            <Building2 size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {program.department}
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Users size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className={`text-xs ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {program.beneficiaries.toLocaleString()} beneficiaries
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        {program.status !== 'upcoming' && (
          <View>
            <View className="flex-row items-center justify-between mb-1">
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Progress
              </Text>
              <Text className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {program.progress}%
              </Text>
            </View>
            <View className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <View
                className="h-2 rounded-full"
                style={{
                  width: `${program.progress}%`,
                  backgroundColor: getStatusColor(program.status),
                }}
              />
            </View>
          </View>
        )}
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
            Government Programs
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
            placeholder="Search programs..."
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            className={`flex-1 ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
          />
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-4 py-2 mr-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-blue-500'
                  : isDark
                  ? 'bg-gray-800'
                  : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedCategory === category
                    ? 'text-white'
                    : isDark
                    ? 'text-gray-300'
                    : 'text-gray-700'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats */}
      <View className="flex-row p-4">
        <View
          className={`flex-1 p-3 rounded-xl mr-2 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <Text className="text-green-500 text-2xl font-bold">
            {mockPrograms.filter((p) => p.status === 'active').length}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Active Programs
          </Text>
        </View>
        <View
          className={`flex-1 p-3 rounded-xl mr-2 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <Text className="text-blue-500 text-2xl font-bold">
            {mockPrograms.filter((p) => p.status === 'upcoming').length}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Upcoming
          </Text>
        </View>
        <View
          className={`flex-1 p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {mockPrograms.reduce((sum, p) => sum + p.beneficiaries, 0).toLocaleString()}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Beneficiaries
          </Text>
        </View>
      </View>

      {/* Programs List */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredPrograms.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}

        {filteredPrograms.length === 0 && (
          <View className="items-center justify-center py-12">
            <Building2 size={48} color={isDark ? '#4b5563' : '#9ca3af'} />
            <Text
              className={`mt-4 text-lg font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              No programs found
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
