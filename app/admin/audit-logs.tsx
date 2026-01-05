import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  Search,
  Filter,
  FileText,
  User,
  Calendar,
  Clock,
  ChevronRight,
  Download,
  Eye,
  Edit,
  Trash2,
  Shield,
  Settings,
  Users,
  AlertTriangle,
  CheckCircle,
  X,
  Info,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface AuditLog {
  id: string;
  action: string;
  category: 'user' | 'complaint' | 'system' | 'security' | 'settings' | 'workflow';
  description: string;
  performedBy: {
    name: string;
    role: string;
  };
  targetEntity?: {
    type: string;
    id: string;
    name: string;
  };
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  metadata?: Record<string, any>;
}

type CategoryFilter = 'all' | 'user' | 'complaint' | 'system' | 'security' | 'settings' | 'workflow';
type StatusFilter = 'all' | 'success' | 'warning' | 'error';

const CATEGORY_CONFIG = {
  user: { label: 'User', color: '#3b82f6', icon: Users },
  complaint: { label: 'Complaint', color: '#22c55e', icon: FileText },
  system: { label: 'System', color: '#6b7280', icon: Settings },
  security: { label: 'Security', color: '#ef4444', icon: Shield },
  settings: { label: 'Settings', color: '#8b5cf6', icon: Settings },
  workflow: { label: 'Workflow', color: '#f59e0b', icon: CheckCircle },
};

const STATUS_CONFIG = {
  success: { label: 'Success', color: '#22c55e', bgColor: 'bg-green-100' },
  warning: { label: 'Warning', color: '#f59e0b', bgColor: 'bg-amber-100' },
  error: { label: 'Error', color: '#ef4444', bgColor: 'bg-red-100' },
};

export default function AuditLogsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week');

  const stats = {
    totalLogs: 15420,
    todayLogs: 342,
    securityEvents: 12,
    systemErrors: 5,
  };

  useEffect(() => {
    loadAuditLogs();
  }, [categoryFilter, statusFilter, dateRange]);

  const loadAuditLogs = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockLogs: AuditLog[] = [
      {
        id: '1',
        action: 'User Login',
        category: 'security',
        description: 'User successfully logged in to the system',
        performedBy: {
          name: 'Rajesh Kumar',
          role: 'Admin',
        },
        ipAddress: '192.168.1.105',
        timestamp: '2024-01-16 14:32:15',
        status: 'success',
      },
      {
        id: '2',
        action: 'Complaint Updated',
        category: 'complaint',
        description: 'Complaint status changed from "Pending" to "Assigned"',
        performedBy: {
          name: 'Priya Sharma',
          role: 'Department Head',
        },
        targetEntity: {
          type: 'complaint',
          id: 'CMP-2024-001',
          name: 'Water Leakage on Main Road',
        },
        ipAddress: '192.168.1.110',
        timestamp: '2024-01-16 14:28:42',
        status: 'success',
      },
      {
        id: '3',
        action: 'User Created',
        category: 'user',
        description: 'New employee account created',
        performedBy: {
          name: 'Admin System',
          role: 'Admin',
        },
        targetEntity: {
          type: 'user',
          id: 'USR-520',
          name: 'Amit Singh',
        },
        ipAddress: '192.168.1.105',
        timestamp: '2024-01-16 14:15:00',
        status: 'success',
      },
      {
        id: '4',
        action: 'Failed Login Attempt',
        category: 'security',
        description: 'Multiple failed login attempts detected',
        performedBy: {
          name: 'Unknown',
          role: 'N/A',
        },
        ipAddress: '103.45.67.89',
        timestamp: '2024-01-16 13:45:22',
        status: 'warning',
        metadata: {
          attempts: 5,
          blocked: true,
        },
      },
      {
        id: '5',
        action: 'Workflow Modified',
        category: 'workflow',
        description: 'Emergency Response workflow updated',
        performedBy: {
          name: 'Dr. Ramesh Patel',
          role: 'Commissioner',
        },
        targetEntity: {
          type: 'workflow',
          id: 'WF-002',
          name: 'Emergency Response',
        },
        ipAddress: '192.168.1.100',
        timestamp: '2024-01-16 12:30:00',
        status: 'success',
      },
      {
        id: '6',
        action: 'System Backup',
        category: 'system',
        description: 'Automated daily backup completed',
        performedBy: {
          name: 'System',
          role: 'Automated',
        },
        ipAddress: 'localhost',
        timestamp: '2024-01-16 03:00:00',
        status: 'success',
        metadata: {
          size: '2.4 GB',
          duration: '15 mins',
        },
      },
      {
        id: '7',
        action: 'Settings Changed',
        category: 'settings',
        description: 'Notification settings updated',
        performedBy: {
          name: 'Rajesh Kumar',
          role: 'Admin',
        },
        ipAddress: '192.168.1.105',
        timestamp: '2024-01-16 11:20:30',
        status: 'success',
      },
      {
        id: '8',
        action: 'API Error',
        category: 'system',
        description: 'External SMS API returned error',
        performedBy: {
          name: 'System',
          role: 'Automated',
        },
        ipAddress: 'localhost',
        timestamp: '2024-01-16 10:15:45',
        status: 'error',
        metadata: {
          errorCode: 500,
          service: 'SMS Gateway',
        },
      },
      {
        id: '9',
        action: 'User Suspended',
        category: 'user',
        description: 'User account suspended due to policy violation',
        performedBy: {
          name: 'Rajesh Kumar',
          role: 'Admin',
        },
        targetEntity: {
          type: 'user',
          id: 'USR-145',
          name: 'Suresh Mehta',
        },
        ipAddress: '192.168.1.105',
        timestamp: '2024-01-16 09:45:00',
        status: 'warning',
      },
      {
        id: '10',
        action: 'Complaint Resolved',
        category: 'complaint',
        description: 'Complaint marked as resolved with citizen feedback',
        performedBy: {
          name: 'Vikram Patel',
          role: 'Employee',
        },
        targetEntity: {
          type: 'complaint',
          id: 'CMP-2024-004',
          name: 'Pothole on Highway',
        },
        ipAddress: '192.168.1.125',
        timestamp: '2024-01-16 09:00:00',
        status: 'success',
      },
    ];

    let filtered = mockLogs;

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(l => l.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(l => l.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(l =>
        l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.performedBy.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setLogs(filtered);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadAuditLogs();
    setRefreshing(false);
  }, []);

  const renderLogCard = (log: AuditLog, index: number) => {
    const categoryConfig = CATEGORY_CONFIG[log.category];
    const statusConfig = STATUS_CONFIG[log.status];
    const CategoryIcon = categoryConfig.icon;

    return (
      <Animated.View
        key={log.id}
        entering={FadeInDown.delay(index * 50).springify()}
      >
        <TouchableOpacity
          className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
          onPress={() => {
            setSelectedLog(log);
            setShowDetailsModal(true);
          }}
        >
          <View className="flex-row items-start">
            {/* Icon */}
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: categoryConfig.color + '20' }}
            >
              <CategoryIcon size={20} color={categoryConfig.color} />
            </View>

            {/* Content */}
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-gray-900 font-semibold">{log.action}</Text>
                <View className={`px-2 py-0.5 rounded-full ${statusConfig.bgColor}`}>
                  <Text style={{ color: statusConfig.color }} className="text-xs font-medium">
                    {statusConfig.label}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                {log.description}
              </Text>

              {/* Target Entity */}
              {log.targetEntity && (
                <View className="bg-gray-50 rounded-lg px-3 py-2 mb-2">
                  <Text className="text-gray-500 text-xs">
                    {log.targetEntity.type}: {log.targetEntity.id}
                  </Text>
                  <Text className="text-gray-700 text-sm">{log.targetEntity.name}</Text>
                </View>
              )}

              {/* Footer */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <User size={14} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-1">{log.performedBy.name}</Text>
                </View>
                <Text className="text-gray-400 text-xs">{log.timestamp}</Text>
              </View>
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
        colors={['#4b5563', '#6b7280']}
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

          <Text className="text-white text-lg font-semibold">Audit Logs</Text>

          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            onPress={() => {}}
          >
            <Download size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between">
          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mb-1">
              <FileText size={18} color="#fff" />
            </View>
            <Text className="text-white font-bold">{(stats.totalLogs / 1000).toFixed(1)}K</Text>
            <Text className="text-white/70 text-xs">Total</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-blue-400/30 items-center justify-center mb-1">
              <Clock size={18} color="#93c5fd" />
            </View>
            <Text className="text-white font-bold">{stats.todayLogs}</Text>
            <Text className="text-white/70 text-xs">Today</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-amber-400/30 items-center justify-center mb-1">
              <Shield size={18} color="#fcd34d" />
            </View>
            <Text className="text-white font-bold">{stats.securityEvents}</Text>
            <Text className="text-white/70 text-xs">Security</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-red-400/30 items-center justify-center mb-1">
              <AlertTriangle size={18} color="#fca5a5" />
            </View>
            <Text className="text-white font-bold">{stats.systemErrors}</Text>
            <Text className="text-white/70 text-xs">Errors</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Search and Filter */}
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row gap-3 mb-3">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4">
            <Search size={18} color="#6b7280" />
            <TextInput
              className="flex-1 py-3 px-2 text-gray-900"
              placeholder="Search logs..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={loadAuditLogs}
            />
          </View>

          <TouchableOpacity
            className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center"
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Date Range Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'all', label: 'All Time' },
            ].map((range) => (
              <TouchableOpacity
                key={range.value}
                className={`px-4 py-2 rounded-full ${
                  dateRange === range.value ? 'bg-gray-700' : 'bg-gray-100'
                }`}
                onPress={() => setDateRange(range.value as any)}
              >
                <Text className={dateRange === range.value ? 'text-white font-medium' : 'text-gray-600'}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
          <View className="flex-row gap-2">
            {(['all', 'user', 'complaint', 'system', 'security', 'settings', 'workflow'] as CategoryFilter[]).map((cat) => (
              <TouchableOpacity
                key={cat}
                className={`px-4 py-2 rounded-full ${
                  categoryFilter === cat ? 'bg-gray-700' : 'bg-gray-100'
                }`}
                onPress={() => setCategoryFilter(cat)}
              >
                <Text className={categoryFilter === cat ? 'text-white font-medium' : 'text-gray-600'}>
                  {cat === 'all' ? 'All' : CATEGORY_CONFIG[cat].label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {loading ? (
          <View className="items-center py-10">
            <FileText size={48} color="#6b7280" />
            <Text className="text-gray-500 mt-4">Loading audit logs...</Text>
          </View>
        ) : logs.length === 0 ? (
          <View className="items-center py-10">
            <FileText size={48} color="#9ca3af" />
            <Text className="text-gray-500 mt-4">No logs found</Text>
            <Text className="text-gray-400 text-sm">Try adjusting your filters</Text>
          </View>
        ) : (
          logs.map((log, index) => renderLogCard(log, index))
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
              <Text className="text-gray-900 font-bold text-xl">Filter Logs</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Status Filter */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-3">Status</Text>
              <View className="flex-row flex-wrap gap-2">
                {(['all', 'success', 'warning', 'error'] as StatusFilter[]).map((status) => (
                  <TouchableOpacity
                    key={status}
                    className={`px-4 py-2 rounded-full ${
                      statusFilter === status ? 'bg-gray-700' : 'bg-gray-100'
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

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
                onPress={() => {
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setDateRange('week');
                }}
              >
                <Text className="text-gray-700 font-semibold">Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-gray-700 rounded-xl py-4 items-center"
                onPress={() => {
                  setShowFilterModal(false);
                  loadAuditLogs();
                }}
              >
                <Text className="text-white font-semibold">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          {selectedLog && (
            <View className="bg-white rounded-t-3xl p-6 max-h-[85%]">
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-gray-900 font-bold text-xl">Log Details</Text>
                <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Action and Status */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <View
                      className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                      style={{ backgroundColor: CATEGORY_CONFIG[selectedLog.category].color + '20' }}
                    >
                      {React.createElement(CATEGORY_CONFIG[selectedLog.category].icon, {
                        size: 20,
                        color: CATEGORY_CONFIG[selectedLog.category].color,
                      })}
                    </View>
                    <View>
                      <Text className="text-gray-900 font-semibold">{selectedLog.action}</Text>
                      <Text className="text-gray-500 text-sm">{CATEGORY_CONFIG[selectedLog.category].label}</Text>
                    </View>
                  </View>

                  <View className={`px-3 py-1 rounded-full ${STATUS_CONFIG[selectedLog.status].bgColor}`}>
                    <Text style={{ color: STATUS_CONFIG[selectedLog.status].color }} className="font-medium">
                      {STATUS_CONFIG[selectedLog.status].label}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <Text className="text-gray-700 font-medium mb-2">Description</Text>
                  <Text className="text-gray-600">{selectedLog.description}</Text>
                </View>

                {/* Performed By */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <Text className="text-gray-700 font-medium mb-2">Performed By</Text>
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                      <User size={20} color="#3b82f6" />
                    </View>
                    <View>
                      <Text className="text-gray-900 font-medium">{selectedLog.performedBy.name}</Text>
                      <Text className="text-gray-500 text-sm">{selectedLog.performedBy.role}</Text>
                    </View>
                  </View>
                </View>

                {/* Target Entity */}
                {selectedLog.targetEntity && (
                  <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <Text className="text-gray-700 font-medium mb-2">Target Entity</Text>
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-gray-500">Type</Text>
                      <Text className="text-gray-900 capitalize">{selectedLog.targetEntity.type}</Text>
                    </View>
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-gray-500">ID</Text>
                      <Text className="text-gray-900">{selectedLog.targetEntity.id}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-500">Name</Text>
                      <Text className="text-gray-900">{selectedLog.targetEntity.name}</Text>
                    </View>
                  </View>
                )}

                {/* Technical Details */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <Text className="text-gray-700 font-medium mb-2">Technical Details</Text>
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-gray-500">IP Address</Text>
                    <Text className="text-gray-900">{selectedLog.ipAddress}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-500">Timestamp</Text>
                    <Text className="text-gray-900">{selectedLog.timestamp}</Text>
                  </View>
                </View>

                {/* Metadata */}
                {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                  <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <Text className="text-gray-700 font-medium mb-2">Additional Data</Text>
                    {Object.entries(selectedLog.metadata).map(([key, value]) => (
                      <View key={key} className="flex-row justify-between mb-1">
                        <Text className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</Text>
                        <Text className="text-gray-900">{String(value)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
