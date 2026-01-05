import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Dimensions,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreVertical,
  MapPin,
  User,
  Calendar,
  Eye,
  UserPlus,
  Send,
  Trash2,
  X,
  ChevronDown,
  FileText,
  Building2,
  ArrowUpDown,
  Flag,
  MessageSquare,
  Phone,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Complaint {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  ward: string;
  citizen: {
    name: string;
    phone: string;
  };
  assignedTo?: {
    name: string;
    department: string;
  };
  createdAt: string;
  lastUpdated: string;
  imagesCount: number;
}

type StatusFilter = 'all' | 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';
type PriorityFilter = 'all' | 'low' | 'medium' | 'high' | 'critical';
type SortOption = 'newest' | 'oldest' | 'priority' | 'status';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#f59e0b', bgColor: 'bg-amber-100', icon: Clock },
  assigned: { label: 'Assigned', color: '#3b82f6', bgColor: 'bg-blue-100', icon: UserPlus },
  in_progress: { label: 'In Progress', color: '#8b5cf6', bgColor: 'bg-purple-100', icon: Clock },
  resolved: { label: 'Resolved', color: '#22c55e', bgColor: 'bg-green-100', icon: CheckCircle },
  rejected: { label: 'Rejected', color: '#ef4444', bgColor: 'bg-red-100', icon: X },
};

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#22c55e', bgColor: 'bg-green-100' },
  medium: { label: 'Medium', color: '#f59e0b', bgColor: 'bg-amber-100' },
  high: { label: 'High', color: '#f97316', bgColor: 'bg-orange-100' },
  critical: { label: 'Critical', color: '#ef4444', bgColor: 'bg-red-100' },
};

export default function ComplaintConsoleScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);

  const stats = {
    total: 1245,
    pending: 234,
    inProgress: 156,
    resolved: 823,
    critical: 32,
  };

  useEffect(() => {
    loadComplaints();
  }, [statusFilter, priorityFilter, sortBy]);

  const loadComplaints = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockComplaints: Complaint[] = [
      {
        id: 'CMP-2024-001',
        title: 'Water Leakage on Main Road',
        category: 'Water Supply',
        description: 'Major water leakage causing road damage and water wastage.',
        status: 'pending',
        priority: 'critical',
        location: 'MG Road, Near Bus Stand',
        ward: 'Ward 12',
        citizen: {
          name: 'Rajesh Kumar',
          phone: '+91 98765 43210',
        },
        createdAt: '2024-01-15',
        lastUpdated: '2 hours ago',
        imagesCount: 3,
      },
      {
        id: 'CMP-2024-002',
        title: 'Garbage Not Collected',
        category: 'Sanitation',
        description: 'Garbage has not been collected for 3 days in our area.',
        status: 'assigned',
        priority: 'high',
        location: 'Gandhi Nagar, Block A',
        ward: 'Ward 5',
        citizen: {
          name: 'Priya Sharma',
          phone: '+91 87654 32109',
        },
        assignedTo: {
          name: 'Amit Singh',
          department: 'Sanitation',
        },
        createdAt: '2024-01-14',
        lastUpdated: '1 day ago',
        imagesCount: 2,
      },
      {
        id: 'CMP-2024-003',
        title: 'Street Light Not Working',
        category: 'Street Lighting',
        description: 'Multiple street lights not working in the area causing safety concerns.',
        status: 'in_progress',
        priority: 'medium',
        location: 'Nehru Park Road',
        ward: 'Ward 8',
        citizen: {
          name: 'Suresh Mehta',
          phone: '+91 76543 21098',
        },
        assignedTo: {
          name: 'Vikram Patel',
          department: 'Electrical',
        },
        createdAt: '2024-01-13',
        lastUpdated: '3 hours ago',
        imagesCount: 4,
      },
      {
        id: 'CMP-2024-004',
        title: 'Pothole on Highway',
        category: 'Roads',
        description: 'Large pothole causing accidents on the highway.',
        status: 'resolved',
        priority: 'high',
        location: 'National Highway 48, KM 125',
        ward: 'Ward 15',
        citizen: {
          name: 'Anita Patel',
          phone: '+91 65432 10987',
        },
        assignedTo: {
          name: 'Rahul Verma',
          department: 'Roads',
        },
        createdAt: '2024-01-10',
        lastUpdated: '5 days ago',
        imagesCount: 5,
      },
      {
        id: 'CMP-2024-005',
        title: 'Illegal Construction',
        category: 'Building',
        description: 'Unauthorized construction without proper permits.',
        status: 'rejected',
        priority: 'low',
        location: 'Industrial Area, Plot 45',
        ward: 'Ward 20',
        citizen: {
          name: 'Mohan Lal',
          phone: '+91 54321 09876',
        },
        createdAt: '2024-01-08',
        lastUpdated: '1 week ago',
        imagesCount: 1,
      },
    ];

    let filteredComplaints = mockComplaints;

    if (statusFilter !== 'all') {
      filteredComplaints = filteredComplaints.filter(c => c.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filteredComplaints = filteredComplaints.filter(c => c.priority === priorityFilter);
    }

    if (searchQuery) {
      filteredComplaints = filteredComplaints.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filteredComplaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filteredComplaints.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'priority':
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        filteredComplaints.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
    }

    setComplaints(filteredComplaints);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadComplaints();
    setRefreshing(false);
  }, []);

  const handleComplaintAction = async (action: string, complaint: Complaint) => {
    switch (action) {
      case 'view':
        setSelectedComplaint(complaint);
        setShowDetailsModal(true);
        break;
      case 'assign':
        setSelectedComplaint(complaint);
        setShowAssignModal(true);
        break;
      case 'resolve':
        Alert.alert(
          'Mark as Resolved',
          `Mark complaint ${complaint.id} as resolved?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Resolve',
              onPress: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              },
            },
          ]
        );
        break;
      case 'reject':
        Alert.alert(
          'Reject Complaint',
          `Are you sure you want to reject complaint ${complaint.id}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Reject',
              style: 'destructive',
              onPress: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              },
            },
          ]
        );
        break;
    }
  };

  const toggleComplaintSelection = (id: string) => {
    if (selectedComplaints.includes(id)) {
      setSelectedComplaints(selectedComplaints.filter(c => c !== id));
    } else {
      setSelectedComplaints([...selectedComplaints, id]);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedComplaints.length === 0) return;

    Alert.alert(
      `${action} ${selectedComplaints.length} Complaints`,
      `Are you sure you want to ${action.toLowerCase()} ${selectedComplaints.length} complaints?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action,
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setSelectedComplaints([]);
            setBulkSelectMode(false);
          },
        },
      ]
    );
  };

  const renderComplaintCard = (complaint: Complaint, index: number) => {
    const statusConfig = STATUS_CONFIG[complaint.status];
    const priorityConfig = PRIORITY_CONFIG[complaint.priority];
    const StatusIcon = statusConfig.icon;

    const isSelected = selectedComplaints.includes(complaint.id);

    return (
      <Animated.View
        key={complaint.id}
        entering={FadeInDown.delay(index * 50).springify()}
      >
        <TouchableOpacity
          className={`bg-white rounded-2xl p-4 mb-3 shadow-sm ${isSelected ? 'border-2 border-blue-500' : ''}`}
          onPress={() => {
            if (bulkSelectMode) {
              toggleComplaintSelection(complaint.id);
            } else {
              setSelectedComplaint(complaint);
              setShowDetailsModal(true);
            }
          }}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setBulkSelectMode(true);
            toggleComplaintSelection(complaint.id);
          }}
        >
          {/* Header */}
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-gray-500 text-sm">{complaint.id}</Text>
                <View className={`ml-2 px-2 py-0.5 rounded-full ${priorityConfig.bgColor}`}>
                  <Text style={{ color: priorityConfig.color }} className="text-xs font-medium">
                    {priorityConfig.label}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-900 font-semibold" numberOfLines={1}>
                {complaint.title}
              </Text>
            </View>

            <View className={`px-2 py-1 rounded-full ${statusConfig.bgColor} flex-row items-center`}>
              <StatusIcon size={12} color={statusConfig.color} />
              <Text style={{ color: statusConfig.color }} className="text-xs font-medium ml-1">
                {statusConfig.label}
              </Text>
            </View>
          </View>

          {/* Category & Location */}
          <View className="flex-row items-center gap-3 mb-3">
            <View className="flex-row items-center">
              <Building2 size={14} color="#6b7280" />
              <Text className="text-gray-500 text-sm ml-1">{complaint.category}</Text>
            </View>

            <View className="flex-row items-center flex-1">
              <MapPin size={14} color="#6b7280" />
              <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
                {complaint.location}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            <View className="flex-row items-center">
              <User size={14} color="#6b7280" />
              <Text className="text-gray-500 text-sm ml-1">{complaint.citizen.name}</Text>
            </View>

            <View className="flex-row items-center">
              <Calendar size={14} color="#6b7280" />
              <Text className="text-gray-500 text-sm ml-1">{complaint.createdAt}</Text>
            </View>
          </View>

          {/* Assigned Info */}
          {complaint.assignedTo && (
            <View className="mt-3 pt-3 border-t border-gray-100 flex-row items-center">
              <UserPlus size={14} color="#3b82f6" />
              <Text className="text-blue-600 text-sm ml-1">
                Assigned to {complaint.assignedTo.name} ({complaint.assignedTo.department})
              </Text>
            </View>
          )}

          {/* Quick Actions */}
          {!bulkSelectMode && (
            <View className="flex-row justify-end gap-2 mt-3">
              {complaint.status === 'pending' && (
                <TouchableOpacity
                  className="bg-blue-100 px-3 py-1.5 rounded-lg"
                  onPress={() => handleComplaintAction('assign', complaint)}
                >
                  <Text className="text-blue-600 text-sm font-medium">Assign</Text>
                </TouchableOpacity>
              )}

              {(complaint.status === 'assigned' || complaint.status === 'in_progress') && (
                <TouchableOpacity
                  className="bg-green-100 px-3 py-1.5 rounded-lg"
                  onPress={() => handleComplaintAction('resolve', complaint)}
                >
                  <Text className="text-green-600 text-sm font-medium">Resolve</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                className="bg-gray-100 px-3 py-1.5 rounded-lg"
                onPress={() => handleComplaintAction('view', complaint)}
              >
                <Text className="text-gray-600 text-sm font-medium">Details</Text>
              </TouchableOpacity>
            </View>
          )}
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

          <Text className="text-white text-lg font-semibold">Complaint Console</Text>

          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            onPress={() => router.push('/admin/analytics')}
          >
            <FileText size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            <View className="bg-white/20 rounded-xl px-4 py-3 min-w-[100px]">
              <Text className="text-white/70 text-sm">Total</Text>
              <Text className="text-white font-bold text-xl">{stats.total}</Text>
            </View>

            <View className="bg-amber-400/30 rounded-xl px-4 py-3 min-w-[100px]">
              <Text className="text-amber-100 text-sm">Pending</Text>
              <Text className="text-white font-bold text-xl">{stats.pending}</Text>
            </View>

            <View className="bg-purple-400/30 rounded-xl px-4 py-3 min-w-[100px]">
              <Text className="text-purple-100 text-sm">In Progress</Text>
              <Text className="text-white font-bold text-xl">{stats.inProgress}</Text>
            </View>

            <View className="bg-green-400/30 rounded-xl px-4 py-3 min-w-[100px]">
              <Text className="text-green-100 text-sm">Resolved</Text>
              <Text className="text-white font-bold text-xl">{stats.resolved}</Text>
            </View>

            <View className="bg-red-400/30 rounded-xl px-4 py-3 min-w-[100px]">
              <Text className="text-red-100 text-sm">Critical</Text>
              <Text className="text-white font-bold text-xl">{stats.critical}</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Bulk Select Actions */}
      {bulkSelectMode && (
        <View className="bg-blue-50 px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                setBulkSelectMode(false);
                setSelectedComplaints([]);
              }}
            >
              <X size={20} color="#3b82f6" />
            </TouchableOpacity>
            <Text className="text-blue-600 font-medium ml-2">
              {selectedComplaints.length} selected
            </Text>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              className="bg-blue-500 px-3 py-1.5 rounded-lg"
              onPress={() => handleBulkAction('Assign')}
            >
              <Text className="text-white text-sm font-medium">Assign</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-green-500 px-3 py-1.5 rounded-lg"
              onPress={() => handleBulkAction('Resolve')}
            >
              <Text className="text-white text-sm font-medium">Resolve</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Search and Filter */}
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row gap-2">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4">
            <Search size={18} color="#6b7280" />
            <TextInput
              className="flex-1 py-3 px-2 text-gray-900"
              placeholder="Search complaints..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={loadComplaints}
            />
          </View>

          <TouchableOpacity
            className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center"
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center"
            onPress={() => setShowSortModal(true)}
          >
            <ArrowUpDown size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Active Filters */}
        {(statusFilter !== 'all' || priorityFilter !== 'all') && (
          <View className="flex-row items-center mt-3 gap-2">
            {statusFilter !== 'all' && (
              <TouchableOpacity
                className={`flex-row items-center ${STATUS_CONFIG[statusFilter].bgColor} px-3 py-1.5 rounded-full`}
                onPress={() => setStatusFilter('all')}
              >
                <Text style={{ color: STATUS_CONFIG[statusFilter].color }} className="text-sm">
                  {STATUS_CONFIG[statusFilter].label}
                </Text>
                <X size={14} color={STATUS_CONFIG[statusFilter].color} className="ml-1" />
              </TouchableOpacity>
            )}

            {priorityFilter !== 'all' && (
              <TouchableOpacity
                className={`flex-row items-center ${PRIORITY_CONFIG[priorityFilter].bgColor} px-3 py-1.5 rounded-full`}
                onPress={() => setPriorityFilter('all')}
              >
                <Text style={{ color: PRIORITY_CONFIG[priorityFilter].color }} className="text-sm">
                  {PRIORITY_CONFIG[priorityFilter].label} Priority
                </Text>
                <X size={14} color={PRIORITY_CONFIG[priorityFilter].color} className="ml-1" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
            >
              <Text className="text-gray-500 text-sm">Clear all</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Complaint List */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {loading ? (
          <View className="items-center py-10">
            <FileText size={48} color="#7c3aed" />
            <Text className="text-gray-500 mt-4">Loading complaints...</Text>
          </View>
        ) : complaints.length === 0 ? (
          <View className="items-center py-10">
            <CheckCircle size={48} color="#22c55e" />
            <Text className="text-gray-500 mt-4">No complaints found</Text>
            <Text className="text-gray-400 text-sm">Try adjusting your filters</Text>
          </View>
        ) : (
          complaints.map((complaint, index) => renderComplaintCard(complaint, index))
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-900 font-bold text-xl">Filter Complaints</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Status Filter */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-3">Status</Text>
              <View className="flex-row flex-wrap gap-2">
                {(['all', 'pending', 'assigned', 'in_progress', 'resolved', 'rejected'] as StatusFilter[]).map((status) => (
                  <TouchableOpacity
                    key={status}
                    className={`px-4 py-2 rounded-full ${
                      statusFilter === status ? 'bg-purple-500' : 'bg-gray-100'
                    }`}
                    onPress={() => setStatusFilter(status)}
                  >
                    <Text className={statusFilter === status ? 'text-white' : 'text-gray-700'}>
                      {status === 'all' ? 'All' : STATUS_CONFIG[status].label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Priority Filter */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-3">Priority</Text>
              <View className="flex-row flex-wrap gap-2">
                {(['all', 'low', 'medium', 'high', 'critical'] as PriorityFilter[]).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    className={`px-4 py-2 rounded-full ${
                      priorityFilter === priority ? 'bg-purple-500' : 'bg-gray-100'
                    }`}
                    onPress={() => setPriorityFilter(priority)}
                  >
                    <Text className={priorityFilter === priority ? 'text-white' : 'text-gray-700'}>
                      {priority === 'all' ? 'All' : PRIORITY_CONFIG[priority].label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
                onPress={() => {
                  setStatusFilter('all');
                  setPriorityFilter('all');
                }}
              >
                <Text className="text-gray-700 font-semibold">Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-purple-500 rounded-xl py-4 items-center"
                onPress={() => {
                  setShowFilterModal(false);
                  loadComplaints();
                }}
              >
                <Text className="text-white font-semibold">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-900 font-bold text-xl">Sort By</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'priority', label: 'Priority (High to Low)' },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`flex-row items-center justify-between py-4 border-b border-gray-100 ${
                  sortBy === option.value ? 'bg-purple-50 -mx-6 px-6' : ''
                }`}
                onPress={() => {
                  setSortBy(option.value as SortOption);
                  setShowSortModal(false);
                }}
              >
                <Text className={sortBy === option.value ? 'text-purple-600 font-medium' : 'text-gray-700'}>
                  {option.label}
                </Text>
                {sortBy === option.value && <CheckCircle size={20} color="#7c3aed" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Complaint Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          {selectedComplaint && (
            <View className="bg-white rounded-t-3xl p-6 max-h-[85%]">
              <View className="flex-row items-center justify-between mb-6">
                <View>
                  <Text className="text-gray-500 text-sm">{selectedComplaint.id}</Text>
                  <Text className="text-gray-900 font-bold text-xl">{selectedComplaint.title}</Text>
                </View>
                <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Status & Priority */}
                <View className="flex-row items-center gap-2 mb-4">
                  <View className={`px-3 py-1.5 rounded-full ${STATUS_CONFIG[selectedComplaint.status].bgColor}`}>
                    <Text style={{ color: STATUS_CONFIG[selectedComplaint.status].color }} className="font-medium">
                      {STATUS_CONFIG[selectedComplaint.status].label}
                    </Text>
                  </View>

                  <View className={`px-3 py-1.5 rounded-full ${PRIORITY_CONFIG[selectedComplaint.priority].bgColor}`}>
                    <Text style={{ color: PRIORITY_CONFIG[selectedComplaint.priority].color }} className="font-medium">
                      {PRIORITY_CONFIG[selectedComplaint.priority].label} Priority
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <Text className="text-gray-700 font-medium mb-2">Description</Text>
                  <Text className="text-gray-600">{selectedComplaint.description}</Text>
                </View>

                {/* Location */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <View className="flex-row items-center mb-2">
                    <MapPin size={18} color="#6b7280" />
                    <Text className="text-gray-700 font-medium ml-2">Location</Text>
                  </View>
                  <Text className="text-gray-600">{selectedComplaint.location}</Text>
                  <Text className="text-gray-500 text-sm mt-1">{selectedComplaint.ward}</Text>
                </View>

                {/* Citizen Info */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <Text className="text-gray-700 font-medium mb-3">Citizen Information</Text>
                  <View className="flex-row items-center mb-2">
                    <User size={16} color="#6b7280" />
                    <Text className="text-gray-600 ml-2">{selectedComplaint.citizen.name}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Phone size={16} color="#6b7280" />
                    <Text className="text-gray-600 ml-2">{selectedComplaint.citizen.phone}</Text>
                  </View>
                </View>

                {/* Assigned Info */}
                {selectedComplaint.assignedTo && (
                  <View className="bg-blue-50 rounded-2xl p-4 mb-4">
                    <Text className="text-blue-700 font-medium mb-2">Assigned To</Text>
                    <Text className="text-blue-600">{selectedComplaint.assignedTo.name}</Text>
                    <Text className="text-blue-500 text-sm">{selectedComplaint.assignedTo.department}</Text>
                  </View>
                )}

                {/* Timeline */}
                <View className="flex-row gap-3 mb-6">
                  <View className="flex-1 bg-gray-50 rounded-xl p-3 items-center">
                    <Text className="text-gray-500 text-sm">Created</Text>
                    <Text className="text-gray-900 font-medium">{selectedComplaint.createdAt}</Text>
                  </View>

                  <View className="flex-1 bg-gray-50 rounded-xl p-3 items-center">
                    <Text className="text-gray-500 text-sm">Last Updated</Text>
                    <Text className="text-gray-900 font-medium">{selectedComplaint.lastUpdated}</Text>
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row gap-3">
                  {selectedComplaint.status === 'pending' && (
                    <TouchableOpacity
                      className="flex-1 bg-blue-500 rounded-xl py-4 items-center"
                      onPress={() => {
                        setShowDetailsModal(false);
                        setShowAssignModal(true);
                      }}
                    >
                      <Text className="text-white font-semibold">Assign Employee</Text>
                    </TouchableOpacity>
                  )}

                  {(selectedComplaint.status === 'assigned' || selectedComplaint.status === 'in_progress') && (
                    <>
                      <TouchableOpacity
                        className="flex-1 bg-green-500 rounded-xl py-4 items-center"
                        onPress={() => {
                          setShowDetailsModal(false);
                          handleComplaintAction('resolve', selectedComplaint);
                        }}
                      >
                        <Text className="text-white font-semibold">Mark Resolved</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="flex-1 bg-red-500 rounded-xl py-4 items-center"
                        onPress={() => {
                          setShowDetailsModal(false);
                          handleComplaintAction('reject', selectedComplaint);
                        }}
                      >
                        <Text className="text-white font-semibold">Reject</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>

      {/* Assign Modal */}
      <Modal
        visible={showAssignModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-900 font-bold text-xl">Assign Employee</Text>
              <TouchableOpacity onPress={() => setShowAssignModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Employee List */}
            <ScrollView className="max-h-80" showsVerticalScrollIndicator={false}>
              {[
                { id: '1', name: 'Amit Singh', department: 'Water Supply', tasks: 5 },
                { id: '2', name: 'Vikram Patel', department: 'Electrical', tasks: 3 },
                { id: '3', name: 'Rahul Verma', department: 'Roads', tasks: 8 },
                { id: '4', name: 'Sunil Kumar', department: 'Sanitation', tasks: 2 },
              ].map((employee) => (
                <TouchableOpacity
                  key={employee.id}
                  className="flex-row items-center justify-between py-4 border-b border-gray-100"
                  onPress={() => {
                    Alert.alert(
                      'Assign Complaint',
                      `Assign ${selectedComplaint?.id} to ${employee.name}?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Assign',
                          onPress: () => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            setShowAssignModal(false);
                          },
                        },
                      ]
                    );
                  }}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                      <Text className="text-blue-600 font-bold">{employee.name.charAt(0)}</Text>
                    </View>
                    <View>
                      <Text className="text-gray-900 font-medium">{employee.name}</Text>
                      <Text className="text-gray-500 text-sm">{employee.department}</Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-gray-500 text-sm">{employee.tasks} tasks</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
