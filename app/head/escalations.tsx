import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  MapPin,
  User,
  ChevronRight,
  Phone,
  MessageSquare,
  ArrowUp,
  Filter,
} from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

const mockEscalations = [
  {
    id: 'ESC-001',
    complaintId: 'CMP-12345676',
    title: 'Sewage overflow in residential area',
    category: 'Sanitation',
    priority: 'urgent',
    escalationLevel: 2,
    reason: 'SLA Breach - 48 hours overdue',
    escalatedAt: '2026-01-07T06:00:00',
    originalDeadline: '2026-01-05T06:00:00',
    location: 'Sector 7, Block C',
    reportedBy: 'Rahul Verma',
    assignedTo: 'Amit Sharma',
    status: 'unresolved',
    overdueHours: 48,
  },
  {
    id: 'ESC-002',
    complaintId: 'CMP-12345675',
    title: 'Major road cave-in blocking traffic',
    category: 'Road Damage',
    priority: 'critical',
    escalationLevel: 3,
    reason: 'Critical infrastructure issue',
    escalatedAt: '2026-01-07T04:00:00',
    originalDeadline: '2026-01-06T12:00:00',
    location: 'Main Highway, KM 12',
    reportedBy: 'Traffic Police',
    assignedTo: 'Rajesh Kumar',
    status: 'in_progress',
    overdueHours: 24,
  },
  {
    id: 'ESC-003',
    complaintId: 'CMP-12345674',
    title: 'Water supply cut for 3 days',
    category: 'Water Supply',
    priority: 'urgent',
    escalationLevel: 1,
    reason: 'Multiple citizen complaints',
    escalatedAt: '2026-01-07T08:00:00',
    originalDeadline: '2026-01-07T10:00:00',
    location: 'Civil Lines, Ward 8',
    reportedBy: 'Area Residents',
    assignedTo: null,
    status: 'pending',
    overdueHours: 2,
  },
];

export default function EscalationsScreen() {
  const router = useRouter();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getEscalationLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return '#f59e0b';
      case 2:
        return '#f97316';
      case 3:
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getEscalationLevelLabel = (level: number) => {
    switch (level) {
      case 1:
        return 'Level 1';
      case 2:
        return 'Level 2';
      case 3:
        return 'Critical';
      default:
        return 'Unknown';
    }
  };

  const filteredEscalations = mockEscalations.filter(
    (esc) => selectedLevel === 'all' || esc.escalationLevel === selectedLevel
  );

  const EscalationCard = ({ escalation }: { escalation: typeof mockEscalations[0] }) => {
    const levelColor = getEscalationLevelColor(escalation.escalationLevel);

    return (
      <TouchableOpacity
        onPress={() => router.push(`/complaints/${escalation.complaintId}` as any)}
        className={`p-4 rounded-xl mb-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        style={{ borderLeftWidth: 4, borderLeftColor: levelColor }}
      >
        {/* Header */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <View
                className="px-2 py-0.5 rounded mr-2"
                style={{ backgroundColor: `${levelColor}20` }}
              >
                <Text style={{ color: levelColor, fontSize: 10, fontWeight: '700' }}>
                  {getEscalationLevelLabel(escalation.escalationLevel)}
                </Text>
              </View>
              <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {escalation.complaintId}
              </Text>
            </View>
            <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {escalation.title}
            </Text>
          </View>
          <View className="bg-red-500/20 p-2 rounded-lg">
            <AlertTriangle size={18} color="#ef4444" />
          </View>
        </View>

        {/* Reason */}
        <View className="bg-red-500/10 p-3 rounded-lg mb-3">
          <Text className="text-red-500 text-sm font-medium">
            {escalation.reason}
          </Text>
          <Text className="text-red-400 text-xs mt-1">
            {escalation.overdueHours} hours overdue
          </Text>
        </View>

        {/* Details */}
        <View className="mb-3">
          <View className="flex-row items-center mb-2">
            <MapPin size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className={`text-sm ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {escalation.location}
            </Text>
          </View>
          <View className="flex-row items-center">
            <User size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
            <Text className={`text-sm ml-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {escalation.assignedTo || 'Unassigned'}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row pt-3 border-t border-gray-100">
          <TouchableOpacity
            className={`flex-1 flex-row items-center justify-center py-2 mr-2 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <Phone size={16} color="#3b82f6" />
            <Text className="ml-2 text-blue-500 font-medium text-sm">Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 flex-row items-center justify-center py-2 mr-2 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <MessageSquare size={16} color="#8b5cf6" />
            <Text className="ml-2 text-purple-500 font-medium text-sm">Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/head/assign-task?complaintId=${escalation.complaintId}` as any)}
            className="flex-1 flex-row items-center justify-center py-2 rounded-lg bg-blue-500"
          >
            <ArrowUp size={16} color="#fff" />
            <Text className="ml-2 text-white font-medium text-sm">Reassign</Text>
          </TouchableOpacity>
        </View>
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
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeft size={24} color={isDark ? '#fff' : '#1f2937'} />
            </TouchableOpacity>
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Escalations
            </Text>
          </View>
          <View className="bg-red-500 px-3 py-1 rounded-full">
            <Text className="text-white font-semibold text-sm">
              {mockEscalations.length}
            </Text>
          </View>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => setSelectedLevel('all')}
            className={`px-4 py-2 mr-2 rounded-full ${
              selectedLevel === 'all'
                ? 'bg-blue-500'
                : isDark
                ? 'bg-gray-800'
                : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedLevel === 'all'
                  ? 'text-white'
                  : isDark
                  ? 'text-gray-300'
                  : 'text-gray-700'
              }`}
            >
              All
            </Text>
          </TouchableOpacity>
          {[1, 2, 3].map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => setSelectedLevel(level)}
              className={`px-4 py-2 mr-2 rounded-full ${
                selectedLevel === level
                  ? ''
                  : isDark
                  ? 'bg-gray-800'
                  : 'bg-gray-100'
              }`}
              style={
                selectedLevel === level
                  ? { backgroundColor: getEscalationLevelColor(level) }
                  : {}
              }
            >
              <Text
                className={`text-sm font-medium ${
                  selectedLevel === level
                    ? 'text-white'
                    : isDark
                    ? 'text-gray-300'
                    : 'text-gray-700'
                }`}
              >
                {getEscalationLevelLabel(level)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Summary Alert */}
      <View className="p-4">
        <View className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
          <View className="flex-row items-center mb-2">
            <AlertTriangle size={20} color="#ef4444" />
            <Text className="text-red-500 font-semibold ml-2">
              Immediate Attention Required
            </Text>
          </View>
          <Text className={`text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>
            {mockEscalations.filter((e) => e.escalationLevel >= 2).length} critical
            escalations need immediate resolution to maintain SLA compliance.
          </Text>
        </View>
      </View>

      {/* Escalations List */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {filteredEscalations.map((escalation) => (
          <EscalationCard key={escalation.id} escalation={escalation} />
        ))}

        {filteredEscalations.length === 0 && (
          <View className="items-center justify-center py-12">
            <AlertTriangle size={48} color={isDark ? '#4b5563' : '#9ca3af'} />
            <Text
              className={`mt-4 text-lg font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              No escalations found
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
