import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Filter,
  Clock,
  MapPin,
  AlertTriangle,
  ChevronRight,
  User,
  Calendar,
  CheckCircle2,
} from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

const mockComplaints = [
  {
    id: 'CMP-12345678',
    title: 'Large pothole on main road',
    category: 'Road Damage',
    subcategory: 'Pothole',
    priority: 'urgent',
    status: 'pending',
    location: 'MG Road, Sector 14',
    ward: 'Ward 5',
    reportedBy: 'John Doe',
    reportedAt: '2026-01-07T09:00:00',
    slaDeadline: '2026-01-08T09:00:00',
    assignedTo: null,
  },
  {
    id: 'CMP-12345679',
    title: 'Street light not working',
    category: 'Electricity',
    subcategory: 'Street Light',
    priority: 'high',
    status: 'pending',
    location: 'Park Street, Block A',
    ward: 'Ward 3',
    reportedBy: 'Jane Smith',
    reportedAt: '2026-01-07T08:30:00',
    slaDeadline: '2026-01-09T08:30:00',
    assignedTo: null,
  },
  {
    id: 'CMP-12345680',
    title: 'Garbage not collected',
    category: 'Sanitation',
    subcategory: 'Garbage Collection',
    priority: 'normal',
    status: 'in_progress',
    location: 'Main Market, Lane 3',
    ward: 'Ward 5',
    reportedBy: 'Amit Kumar',
    reportedAt: '2026-01-06T14:00:00',
    slaDeadline: '2026-01-07T14:00:00',
    assignedTo: 'Rajesh Kumar',
  },
  {
    id: 'CMP-12345681',
    title: 'Water pipeline leak',
    category: 'Water Supply',
    subcategory: 'Pipeline Leak',
    priority: 'urgent',
    status: 'pending',
    location: 'Civil Lines, Plot 45',
    ward: 'Ward 8',
    reportedBy: 'Priya Sharma',
    reportedAt: '2026-01-07T07:15:00',
    slaDeadline: '2026-01-07T19:15:00',
    assignedTo: null,
  },
];

const mockEmployees = [
  { id: '1', name: 'Rajesh Kumar', activeTask: 2, zone: 'Zone A' },
  { id: '2', name: 'Amit Sharma', activeTask: 1, zone: 'Zone B' },
  { id: '3', name: 'Priya Singh', activeTask: 3, zone: 'Zone A' },
  { id: '4', name: 'Suresh Patel', activeTask: 0, zone: 'Zone C' },
];

type PriorityType = 'urgent' | 'high' | 'normal' | 'low';
type StatusType = 'pending' | 'in_progress' | 'resolved';

export default function ComplaintQueueScreen() {
  const router = useRouter();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<PriorityType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusType | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'normal':
        return '#3b82f6';
      case 'low':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'in_progress':
        return '#3b82f6';
      case 'resolved':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours >= 24) {
      return `${Math.floor(diffHours / 24)}d ago`;
    } else if (diffHours >= 1) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMins}m ago`;
    }
  };

  const getSLAStatus = (deadline: string) => {
    const now = new Date();
    const sla = new Date(deadline);
    const diffMs = sla.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 0) {
      return { text: 'Overdue', color: '#ef4444', isOverdue: true };
    } else if (diffHours < 4) {
      return { text: `${diffHours}h left`, color: '#ef4444', isOverdue: false };
    } else if (diffHours < 24) {
      return { text: `${diffHours}h left`, color: '#f59e0b', isOverdue: false };
    } else {
      return { text: `${Math.floor(diffHours / 24)}d left`, color: '#22c55e', isOverdue: false };
    }
  };

  const filteredComplaints = mockComplaints.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority =
      selectedPriority === 'all' || complaint.priority === selectedPriority;
    const matchesStatus =
      selectedStatus === 'all' || complaint.status === selectedStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleAssign = (complaintId: string) => {
    router.push(`/head/assign-task?complaintId=${complaintId}` as any);
  };

  const ComplaintCard = ({ complaint }: { complaint: typeof mockComplaints[0] }) => {
    const slaStatus = getSLAStatus(complaint.slaDeadline);

    return (
      <TouchableOpacity
        onPress={() => setSelectedComplaint(
          selectedComplaint === complaint.id ? null : complaint.id
        )}
        className={`p-4 rounded-xl mb-3 ${isDark ? 'bg-gray-800' : 'bg-white'} ${
          selectedComplaint === complaint.id ? 'border-2 border-blue-500' : ''
        }`}
      >
        {/* Header */}
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <View
                className="px-2 py-0.5 rounded mr-2"
                style={{ backgroundColor: `${getPriorityColor(complaint.priority)}20` }}
              >
                <Text
                  style={{ color: getPriorityColor(complaint.priority), fontSize: 10, fontWeight: '600' }}
                >
                  {complaint.priority.toUpperCase()}
                </Text>
              </View>
              <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {complaint.id}
              </Text>
            </View>
            <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {complaint.title}
            </Text>
          </View>
          {slaStatus.isOverdue && (
            <View className="bg-red-500/20 p-2 rounded-lg">
              <AlertTriangle size={16} color="#ef4444" />
            </View>
          )}
        </View>

        {/* Details */}
        <View className="flex-row items-center mb-2">
          <View
            className="px-2 py-1 rounded-full mr-2"
            style={{ backgroundColor: `${getStatusColor(complaint.status)}20` }}
          >
            <Text style={{ color: getStatusColor(complaint.status), fontSize: 11, fontWeight: '500' }}>
              {complaint.status === 'in_progress' ? 'In Progress' : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
            </Text>
          </View>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {complaint.category}
          </Text>
        </View>

        <View className="flex-row items-center mb-2">
          <MapPin size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text className={`text-sm ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {complaint.location}
          </Text>
        </View>

        {/* Footer */}
        <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
          <View className="flex-row items-center">
            <Clock size={14} color={slaStatus.color} />
            <Text style={{ color: slaStatus.color, fontSize: 12, marginLeft: 4, fontWeight: '500' }}>
              {slaStatus.text}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Calendar size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className={`text-xs ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {formatTimeAgo(complaint.reportedAt)}
            </Text>
          </View>
        </View>

        {/* Assigned Info or Assign Button */}
        {complaint.assignedTo ? (
          <View
            className={`flex-row items-center mt-3 p-2 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <User size={14} color="#3b82f6" />
            <Text className={`text-sm ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Assigned to: {complaint.assignedTo}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => handleAssign(complaint.id)}
            className="mt-3 bg-blue-500 py-2 rounded-lg flex-row items-center justify-center"
          >
            <User size={16} color="#fff" />
            <Text className="text-white font-medium ml-2">Assign Task</Text>
          </TouchableOpacity>
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
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color={isDark ? '#fff' : '#1f2937'} />
          </TouchableOpacity>
          <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Complaint Queue
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
            placeholder="Search complaints..."
            placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
            className={`flex-1 ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
          />
          <TouchableOpacity>
            <Filter size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          </TouchableOpacity>
        </View>

        {/* Priority Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
        >
          {[
            { key: 'all', label: 'All' },
            { key: 'urgent', label: 'Urgent', color: '#ef4444' },
            { key: 'high', label: 'High', color: '#f59e0b' },
            { key: 'normal', label: 'Normal', color: '#3b82f6' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setSelectedPriority(filter.key as any)}
              className={`px-4 py-2 mr-2 rounded-full ${
                selectedPriority === filter.key
                  ? 'bg-blue-500'
                  : isDark
                  ? 'bg-gray-800'
                  : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedPriority === filter.key
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
          <Text className={`text-2xl font-bold text-yellow-500`}>
            {mockComplaints.filter((c) => c.status === 'pending').length}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Pending
          </Text>
        </View>
        <View
          className={`flex-1 p-3 rounded-xl mr-2 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <Text className={`text-2xl font-bold text-blue-500`}>
            {mockComplaints.filter((c) => c.status === 'in_progress').length}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            In Progress
          </Text>
        </View>
        <View
          className={`flex-1 p-3 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <Text className={`text-2xl font-bold text-red-500`}>
            {mockComplaints.filter((c) => getSLAStatus(c.slaDeadline).isOverdue).length}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Overdue
          </Text>
        </View>
      </View>

      {/* Complaints List */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredComplaints.map((complaint) => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}

        {filteredComplaints.length === 0 && (
          <View className="items-center justify-center py-12">
            <CheckCircle2 size={48} color={isDark ? '#4b5563' : '#9ca3af'} />
            <Text
              className={`mt-4 text-lg font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              No complaints found
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
