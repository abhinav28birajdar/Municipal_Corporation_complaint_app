import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  MapPin,
  Search,
  Plus,
  Edit,
  Trash2,
  Users,
  AlertCircle,
  CheckCircle,
  Building2,
  ChevronRight,
  BarChart3,
  X,
  Map,
  Phone,
  Mail,
} from 'lucide-react-native';

interface Ward {
  id: string;
  name: string;
  code: string;
  area: string;
  population: number;
  councilor: {
    name: string;
    phone: string;
    email: string;
  };
  stats: {
    totalComplaints: number;
    pendingComplaints: number;
    resolvedComplaints: number;
    avgResolutionTime: string;
  };
  boundaries?: {
    north: string;
    south: string;
    east: string;
    west: string;
  };
  facilities: string[];
  status: 'active' | 'inactive';
}

export default function WardManagementScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wards, setWards] = useState<Ward[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadWards();
  }, []);

  const loadWards = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockWards: Ward[] = [
      {
        id: '1',
        name: 'Ward 1 - Central',
        code: 'W001',
        area: '5.2 sq km',
        population: 45000,
        councilor: {
          name: 'Rajesh Kumar',
          phone: '+91 98765 43210',
          email: 'rajesh.kumar@municipality.gov',
        },
        stats: {
          totalComplaints: 245,
          pendingComplaints: 32,
          resolvedComplaints: 213,
          avgResolutionTime: '2.5 days',
        },
        boundaries: {
          north: 'Railway Line',
          south: 'Main Highway',
          east: 'River Bank',
          west: 'Ward 2',
        },
        facilities: ['Hospital', 'School', 'Park', 'Community Hall'],
        status: 'active',
      },
      {
        id: '2',
        name: 'Ward 2 - North Zone',
        code: 'W002',
        area: '6.8 sq km',
        population: 52000,
        councilor: {
          name: 'Priya Sharma',
          phone: '+91 98765 43211',
          email: 'priya.sharma@municipality.gov',
        },
        stats: {
          totalComplaints: 312,
          pendingComplaints: 45,
          resolvedComplaints: 267,
          avgResolutionTime: '3.1 days',
        },
        boundaries: {
          north: 'City Limits',
          south: 'Ward 1',
          east: 'Industrial Area',
          west: 'Agricultural Land',
        },
        facilities: ['School', 'Market', 'Stadium'],
        status: 'active',
      },
      {
        id: '3',
        name: 'Ward 3 - East Zone',
        code: 'W003',
        area: '4.5 sq km',
        population: 38000,
        councilor: {
          name: 'Amit Patel',
          phone: '+91 98765 43212',
          email: 'amit.patel@municipality.gov',
        },
        stats: {
          totalComplaints: 189,
          pendingComplaints: 28,
          resolvedComplaints: 161,
          avgResolutionTime: '2.8 days',
        },
        boundaries: {
          north: 'Ward 4',
          south: 'Highway',
          east: 'City Limits',
          west: 'Ward 1',
        },
        facilities: ['College', 'Hospital', 'Fire Station'],
        status: 'active',
      },
      {
        id: '4',
        name: 'Ward 4 - South Zone',
        code: 'W004',
        area: '7.2 sq km',
        population: 61000,
        councilor: {
          name: 'Sunita Devi',
          phone: '+91 98765 43213',
          email: 'sunita.devi@municipality.gov',
        },
        stats: {
          totalComplaints: 425,
          pendingComplaints: 78,
          resolvedComplaints: 347,
          avgResolutionTime: '3.8 days',
        },
        boundaries: {
          north: 'Industrial Area',
          south: 'City Limits',
          east: 'Ward 3',
          west: 'Ward 5',
        },
        facilities: ['Bus Terminal', 'Government Office', 'Police Station'],
        status: 'active',
      },
      {
        id: '5',
        name: 'Ward 5 - West Zone',
        code: 'W005',
        area: '5.8 sq km',
        population: 42000,
        councilor: {
          name: 'Mohammed Ali',
          phone: '+91 98765 43214',
          email: 'mohammed.ali@municipality.gov',
        },
        stats: {
          totalComplaints: 178,
          pendingComplaints: 15,
          resolvedComplaints: 163,
          avgResolutionTime: '2.2 days',
        },
        boundaries: {
          north: 'Agricultural Land',
          south: 'Ward 4',
          east: 'Ward 1',
          west: 'City Limits',
        },
        facilities: ['Library', 'Temple', 'Mosque', 'Church'],
        status: 'active',
      },
    ];

    setWards(mockWards);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadWards();
    setRefreshing(false);
  }, []);

  const handleViewWard = (ward: Ward) => {
    setSelectedWard(ward);
    setShowDetailsModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleEditWard = (ward: Ward) => {
    Alert.alert('Edit Ward', `Editing ${ward.name}`);
  };

  const handleDeleteWard = (ward: Ward) => {
    Alert.alert(
      'Delete Ward',
      `Are you sure you want to delete ${ward.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setWards(prev => prev.filter(w => w.id !== ward.id));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const filteredWards = wards.filter(
    ward =>
      ward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ward.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ward.councilor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStats = wards.reduce(
    (acc, ward) => ({
      totalComplaints: acc.totalComplaints + ward.stats.totalComplaints,
      pendingComplaints: acc.pendingComplaints + ward.stats.pendingComplaints,
      resolvedComplaints: acc.resolvedComplaints + ward.stats.resolvedComplaints,
      totalPopulation: acc.totalPopulation + ward.population,
    }),
    { totalComplaints: 0, pendingComplaints: 0, resolvedComplaints: 0, totalPopulation: 0 }
  );

  const renderWardCard = (ward: Ward, index: number) => {
    const resolutionRate = Math.round((ward.stats.resolvedComplaints / ward.stats.totalComplaints) * 100);

    return (
      <Animated.View
        key={ward.id}
        entering={FadeInDown.delay(index * 100).springify()}
      >
        <TouchableOpacity
          className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
          onPress={() => handleViewWard(ward)}
          activeOpacity={0.7}
        >
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                <View className="bg-purple-100 px-2 py-0.5 rounded-full">
                  <Text className="text-purple-600 text-xs font-medium">{ward.code}</Text>
                </View>
                <View className={`px-2 py-0.5 rounded-full ${
                  ward.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    ward.status === 'active' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {ward.status === 'active' ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-900 font-semibold text-lg">{ward.name}</Text>
            </View>

            <View className="w-12 h-12 bg-purple-100 rounded-xl items-center justify-center">
              <MapPin size={24} color="#7c3aed" />
            </View>
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1 bg-gray-50 rounded-xl p-3">
              <Text className="text-gray-500 text-xs">Area</Text>
              <Text className="text-gray-900 font-semibold">{ward.area}</Text>
            </View>
            <View className="flex-1 bg-gray-50 rounded-xl p-3">
              <Text className="text-gray-500 text-xs">Population</Text>
              <Text className="text-gray-900 font-semibold">{ward.population.toLocaleString()}</Text>
            </View>
            <View className="flex-1 bg-gray-50 rounded-xl p-3">
              <Text className="text-gray-500 text-xs">Resolution</Text>
              <Text className="text-gray-900 font-semibold">{resolutionRate}%</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-2">
                <Users size={16} color="#3b82f6" />
              </View>
              <View>
                <Text className="text-gray-500 text-xs">Councilor</Text>
                <Text className="text-gray-900 font-medium">{ward.councilor.name}</Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="items-center">
                <Text className="text-amber-600 font-bold">{ward.stats.pendingComplaints}</Text>
                <Text className="text-gray-400 text-xs">Pending</Text>
              </View>
              <View className="items-center">
                <Text className="text-green-600 font-bold">{ward.stats.resolvedComplaints}</Text>
                <Text className="text-gray-400 text-xs">Resolved</Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            <View className="flex-row items-center">
              <MapPin size={14} color="#6b7280" />
              <Text className="text-gray-500 text-sm ml-1">Avg: {ward.stats.avgResolutionTime}</Text>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center"
                onPress={() => handleEditWard(ward)}
              >
                <Edit size={14} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center bg-purple-100 rounded-lg px-3 py-1.5"
                onPress={() => handleViewWard(ward)}
              >
                <Text className="text-purple-600 text-sm font-medium mr-1">View</Text>
                <ChevronRight size={14} color="#7c3aed" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['#7c3aed', '#a855f7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>

          <Text className="text-white text-lg font-semibold">Ward Management</Text>

          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 mt-2">
          <View className="flex-1 bg-white/10 rounded-xl p-3">
            <Text className="text-white/70 text-xs">Total Wards</Text>
            <Text className="text-white font-bold text-xl">{wards.length}</Text>
          </View>
          <View className="flex-1 bg-white/10 rounded-xl p-3">
            <Text className="text-white/70 text-xs">Population</Text>
            <Text className="text-white font-bold text-xl">
              {(totalStats.totalPopulation / 1000).toFixed(0)}K
            </Text>
          </View>
          <View className="flex-1 bg-white/10 rounded-xl p-3">
            <Text className="text-white/70 text-xs">Pending</Text>
            <Text className="text-white font-bold text-xl">{totalStats.pendingComplaints}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Search */}
      <View className="px-4 py-3">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
          <Search size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-3 text-gray-900"
            placeholder="Search wards..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
      >
        {loading ? (
          <View className="items-center py-10">
            <MapPin size={48} color="#7c3aed" />
            <Text className="text-gray-500 mt-4">Loading wards...</Text>
          </View>
        ) : filteredWards.length === 0 ? (
          <View className="items-center py-10">
            <MapPin size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4">No wards found</Text>
          </View>
        ) : (
          filteredWards.map((ward, index) => renderWardCard(ward, index))
        )}
      </ScrollView>

      {/* Ward Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[85%]">
            <View className="p-6 border-b border-gray-100">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-900 font-bold text-xl">Ward Details</Text>
                <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            {selectedWard && (
              <ScrollView className="p-6">
                {/* Header */}
                <View className="flex-row items-center mb-6">
                  <View className="w-16 h-16 bg-purple-100 rounded-2xl items-center justify-center mr-4">
                    <MapPin size={32} color="#7c3aed" />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <View className="bg-purple-100 px-2 py-0.5 rounded-full">
                        <Text className="text-purple-600 text-xs font-medium">{selectedWard.code}</Text>
                      </View>
                    </View>
                    <Text className="text-gray-900 font-bold text-xl">{selectedWard.name}</Text>
                  </View>
                </View>

                {/* Stats Grid */}
                <View className="flex-row flex-wrap gap-3 mb-6">
                  <View className="w-[47%] bg-blue-50 rounded-xl p-4">
                    <BarChart3 size={20} color="#3b82f6" />
                    <Text className="text-gray-500 text-xs mt-2">Total Complaints</Text>
                    <Text className="text-gray-900 font-bold text-lg">{selectedWard.stats.totalComplaints}</Text>
                  </View>
                  <View className="w-[47%] bg-amber-50 rounded-xl p-4">
                    <AlertCircle size={20} color="#f59e0b" />
                    <Text className="text-gray-500 text-xs mt-2">Pending</Text>
                    <Text className="text-gray-900 font-bold text-lg">{selectedWard.stats.pendingComplaints}</Text>
                  </View>
                  <View className="w-[47%] bg-green-50 rounded-xl p-4">
                    <CheckCircle size={20} color="#22c55e" />
                    <Text className="text-gray-500 text-xs mt-2">Resolved</Text>
                    <Text className="text-gray-900 font-bold text-lg">{selectedWard.stats.resolvedComplaints}</Text>
                  </View>
                  <View className="w-[47%] bg-purple-50 rounded-xl p-4">
                    <Users size={20} color="#8b5cf6" />
                    <Text className="text-gray-500 text-xs mt-2">Population</Text>
                    <Text className="text-gray-900 font-bold text-lg">{selectedWard.population.toLocaleString()}</Text>
                  </View>
                </View>

                {/* Councilor */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <Text className="text-gray-700 font-semibold mb-3">Ward Councilor</Text>
                  <View className="flex-row items-center mb-3">
                    <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3">
                      <Users size={24} color="#3b82f6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-semibold">{selectedWard.councilor.name}</Text>
                      <Text className="text-gray-500 text-sm">Ward Councilor</Text>
                    </View>
                  </View>
                  <View className="flex-row gap-3">
                    <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-green-100 rounded-xl py-3">
                      <Phone size={16} color="#22c55e" />
                      <Text className="text-green-600 font-medium ml-2">Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-blue-100 rounded-xl py-3">
                      <Mail size={16} color="#3b82f6" />
                      <Text className="text-blue-600 font-medium ml-2">Email</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Boundaries */}
                {selectedWard.boundaries && (
                  <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                    <Text className="text-gray-700 font-semibold mb-3">Boundaries</Text>
                    <View className="gap-2">
                      <View className="flex-row justify-between">
                        <Text className="text-gray-500">North</Text>
                        <Text className="text-gray-900">{selectedWard.boundaries.north}</Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-gray-500">South</Text>
                        <Text className="text-gray-900">{selectedWard.boundaries.south}</Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-gray-500">East</Text>
                        <Text className="text-gray-900">{selectedWard.boundaries.east}</Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-gray-500">West</Text>
                        <Text className="text-gray-900">{selectedWard.boundaries.west}</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Facilities */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <Text className="text-gray-700 font-semibold mb-3">Key Facilities</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {selectedWard.facilities.map((facility, index) => (
                      <View key={index} className="bg-white px-3 py-1.5 rounded-full border border-gray-200">
                        <Text className="text-gray-700">{facility}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row gap-3 mb-8">
                  <TouchableOpacity
                    className="flex-1 bg-gray-100 rounded-xl py-4 flex-row items-center justify-center"
                    onPress={() => {
                      setShowDetailsModal(false);
                      handleDeleteWard(selectedWard);
                    }}
                  >
                    <Trash2 size={18} color="#ef4444" />
                    <Text className="text-red-500 font-semibold ml-2">Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 bg-purple-500 rounded-xl py-4 flex-row items-center justify-center"
                    onPress={() => {
                      setShowDetailsModal(false);
                      handleEditWard(selectedWard);
                    }}
                  >
                    <Edit size={18} color="#fff" />
                    <Text className="text-white font-semibold ml-2">Edit Ward</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Ward Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-900 font-bold text-xl">Add New Ward</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="gap-4 mb-6">
              <View>
                <Text className="text-gray-700 font-medium mb-2">Ward Name</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900"
                  placeholder="Enter ward name..."
                />
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-2">Ward Code</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900"
                  placeholder="e.g., W006"
                />
              </View>

              <View>
                <Text className="text-gray-700 font-medium mb-2">Councilor Name</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900"
                  placeholder="Enter councilor name..."
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
                onPress={() => setShowAddModal(false)}
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-purple-500 rounded-xl py-4 items-center"
                onPress={() => {
                  setShowAddModal(false);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  Alert.alert('Success', 'Ward added successfully');
                }}
              >
                <Text className="text-white font-semibold">Add Ward</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
