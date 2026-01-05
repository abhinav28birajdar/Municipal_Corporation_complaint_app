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
  Alert,
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
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Users,
  Bell,
  Send,
  X,
  Image,
  Link,
  CheckCircle,
  AlertTriangle,
  Info,
  Pin,
  ChevronDown,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  status: 'draft' | 'published' | 'scheduled' | 'expired';
  targetAudience: ('citizens' | 'employees' | 'department_heads' | 'all')[];
  isPinned: boolean;
  publishedAt?: string;
  scheduledFor?: string;
  expiresAt?: string;
  viewCount: number;
  createdBy: string;
  attachments: number;
}

type TypeFilter = 'all' | 'info' | 'warning' | 'success' | 'urgent';
type StatusFilter = 'all' | 'draft' | 'published' | 'scheduled' | 'expired';

const TYPE_CONFIG = {
  info: { label: 'Info', color: '#3b82f6', bgColor: 'bg-blue-100', icon: Info },
  warning: { label: 'Warning', color: '#f59e0b', bgColor: 'bg-amber-100', icon: AlertTriangle },
  success: { label: 'Success', color: '#22c55e', bgColor: 'bg-green-100', icon: CheckCircle },
  urgent: { label: 'Urgent', color: '#ef4444', bgColor: 'bg-red-100', icon: Bell },
};

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: '#6b7280', bgColor: 'bg-gray-100' },
  published: { label: 'Published', color: '#22c55e', bgColor: 'bg-green-100' },
  scheduled: { label: 'Scheduled', color: '#8b5cf6', bgColor: 'bg-purple-100' },
  expired: { label: 'Expired', color: '#ef4444', bgColor: 'bg-red-100' },
};

export default function AnnouncementsManagementScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'info' as Announcement['type'],
    targetAudience: ['all'] as Announcement['targetAudience'],
    isPinned: false,
    scheduledFor: '',
    expiresAt: '',
  });

  const stats = {
    total: 45,
    published: 28,
    draft: 12,
    totalViews: 15420,
  };

  useEffect(() => {
    loadAnnouncements();
  }, [typeFilter, statusFilter]);

  const loadAnnouncements = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Water Supply Interruption Notice',
        content: 'Due to maintenance work, water supply will be interrupted in Wards 5, 6, and 7 from 10 AM to 4 PM on January 20th. Please store sufficient water.',
        type: 'warning',
        status: 'published',
        targetAudience: ['citizens'],
        isPinned: true,
        publishedAt: '2024-01-15 10:00',
        expiresAt: '2024-01-21',
        viewCount: 3450,
        createdBy: 'Admin',
        attachments: 1,
      },
      {
        id: '2',
        title: 'New Online Complaint Portal Launched',
        content: 'We are excited to announce the launch of our new online complaint portal. Citizens can now file and track complaints more easily.',
        type: 'info',
        status: 'published',
        targetAudience: ['all'],
        isPinned: false,
        publishedAt: '2024-01-10 09:00',
        viewCount: 5620,
        createdBy: 'Commissioner',
        attachments: 2,
      },
      {
        id: '3',
        title: 'Emergency: Road Closure on NH-48',
        content: 'Due to a major accident, NH-48 between KM 120-125 is closed. Please use alternative routes. Emergency services are on site.',
        type: 'urgent',
        status: 'published',
        targetAudience: ['citizens', 'employees'],
        isPinned: true,
        publishedAt: '2024-01-16 14:30',
        viewCount: 8920,
        createdBy: 'Traffic Control',
        attachments: 0,
      },
      {
        id: '4',
        title: 'Annual Property Tax Payment Deadline',
        content: 'This is a reminder that the deadline for annual property tax payment is January 31st. Pay online to avoid late fees.',
        type: 'info',
        status: 'scheduled',
        targetAudience: ['citizens'],
        isPinned: false,
        scheduledFor: '2024-01-20 08:00',
        expiresAt: '2024-02-01',
        viewCount: 0,
        createdBy: 'Tax Department',
        attachments: 1,
      },
      {
        id: '5',
        title: 'Employee Training Program Update',
        content: 'New mandatory training modules have been added. All employees must complete the training by month end.',
        type: 'info',
        status: 'published',
        targetAudience: ['employees', 'department_heads'],
        isPinned: false,
        publishedAt: '2024-01-12 11:00',
        viewCount: 420,
        createdBy: 'HR Department',
        attachments: 3,
      },
      {
        id: '6',
        title: 'Successful Completion of Road Project',
        content: 'We are pleased to announce the successful completion of the Main Road widening project ahead of schedule.',
        type: 'success',
        status: 'draft',
        targetAudience: ['all'],
        isPinned: false,
        viewCount: 0,
        createdBy: 'Roads Department',
        attachments: 5,
      },
    ];

    let filtered = mockAnnouncements;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(a => a.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    setAnnouncements(filtered);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadAnnouncements();
    setRefreshing(false);
  }, []);

  const handleAnnouncementAction = (action: string, announcement: Announcement) => {
    switch (action) {
      case 'publish':
        Alert.alert(
          'Publish Announcement',
          `Publish "${announcement.title}" now?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Publish',
              onPress: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              },
            },
          ]
        );
        break;
      case 'unpublish':
        Alert.alert(
          'Unpublish Announcement',
          `Move "${announcement.title}" back to draft?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Unpublish',
              onPress: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              },
            },
          ]
        );
        break;
      case 'delete':
        Alert.alert(
          'Delete Announcement',
          `Are you sure you want to delete "${announcement.title}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              },
            },
          ]
        );
        break;
      case 'pin':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
    }
  };

  const renderAnnouncementCard = (announcement: Announcement, index: number) => {
    const typeConfig = TYPE_CONFIG[announcement.type];
    const statusConfig = STATUS_CONFIG[announcement.status];
    const TypeIcon = typeConfig.icon;

    return (
      <Animated.View
        key={announcement.id}
        entering={FadeInDown.delay(index * 100).springify()}
      >
        <TouchableOpacity
          className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
          onPress={() => {
            setSelectedAnnouncement(announcement);
            setShowDetailsModal(true);
          }}
        >
          {/* Header */}
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-row items-center flex-1">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: typeConfig.color + '20' }}
              >
                <TypeIcon size={20} color={typeConfig.color} />
              </View>

              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                  {announcement.isPinned && (
                    <Pin size={14} color="#f59e0b" fill="#f59e0b" />
                  )}
                  <View className={`px-2 py-0.5 rounded-full ${statusConfig.bgColor}`}>
                    <Text style={{ color: statusConfig.color }} className="text-xs font-medium">
                      {statusConfig.label}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-900 font-semibold" numberOfLines={1}>
                  {announcement.title}
                </Text>
              </View>
            </View>
          </View>

          {/* Content Preview */}
          <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
            {announcement.content}
          </Text>

          {/* Meta Info */}
          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center">
                <Users size={14} color="#6b7280" />
                <Text className="text-gray-500 text-sm ml-1">
                  {announcement.targetAudience.includes('all')
                    ? 'All'
                    : announcement.targetAudience.length + ' groups'}
                </Text>
              </View>

              <View className="flex-row items-center">
                <Eye size={14} color="#6b7280" />
                <Text className="text-gray-500 text-sm ml-1">{announcement.viewCount}</Text>
              </View>

              {announcement.attachments > 0 && (
                <View className="flex-row items-center">
                  <Image size={14} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-1">{announcement.attachments}</Text>
                </View>
              )}
            </View>

            <Text className="text-gray-400 text-xs">
              {announcement.publishedAt || announcement.scheduledFor || 'Draft'}
            </Text>
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
        colors={['#ea580c', '#f97316']}
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

          <Text className="text-white text-lg font-semibold">Announcements</Text>

          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between">
          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mb-1">
              <Megaphone size={18} color="#fff" />
            </View>
            <Text className="text-white font-bold">{stats.total}</Text>
            <Text className="text-white/70 text-xs">Total</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-green-400/30 items-center justify-center mb-1">
              <CheckCircle size={18} color="#86efac" />
            </View>
            <Text className="text-white font-bold">{stats.published}</Text>
            <Text className="text-white/70 text-xs">Published</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-gray-400/30 items-center justify-center mb-1">
              <Edit size={18} color="#d1d5db" />
            </View>
            <Text className="text-white font-bold">{stats.draft}</Text>
            <Text className="text-white/70 text-xs">Drafts</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-blue-400/30 items-center justify-center mb-1">
              <Eye size={18} color="#93c5fd" />
            </View>
            <Text className="text-white font-bold">{(stats.totalViews / 1000).toFixed(1)}K</Text>
            <Text className="text-white/70 text-xs">Views</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filters */}
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {(['all', 'info', 'warning', 'success', 'urgent'] as TypeFilter[]).map((type) => (
              <TouchableOpacity
                key={type}
                className={`px-4 py-2 rounded-full ${
                  typeFilter === type ? 'bg-orange-500' : 'bg-gray-100'
                }`}
                onPress={() => setTypeFilter(type)}
              >
                <Text className={typeFilter === type ? 'text-white font-medium' : 'text-gray-600'}>
                  {type === 'all' ? 'All Types' : TYPE_CONFIG[type].label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-2">
          <View className="flex-row gap-2">
            {(['all', 'published', 'scheduled', 'draft', 'expired'] as StatusFilter[]).map((status) => (
              <TouchableOpacity
                key={status}
                className={`px-4 py-2 rounded-full ${
                  statusFilter === status ? 'bg-orange-500' : 'bg-gray-100'
                }`}
                onPress={() => setStatusFilter(status)}
              >
                <Text className={statusFilter === status ? 'text-white font-medium' : 'text-gray-600'}>
                  {status === 'all' ? 'All Status' : STATUS_CONFIG[status].label}
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
            <Megaphone size={48} color="#f97316" />
            <Text className="text-gray-500 mt-4">Loading announcements...</Text>
          </View>
        ) : announcements.length === 0 ? (
          <View className="items-center py-10">
            <Megaphone size={48} color="#9ca3af" />
            <Text className="text-gray-500 mt-4">No announcements found</Text>
            <Text className="text-gray-400 text-sm">Try adjusting your filters</Text>
          </View>
        ) : (
          announcements.map((announcement, index) => renderAnnouncementCard(announcement, index))
        )}
      </ScrollView>

      {/* Create Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-900 font-bold text-xl">Create Announcement</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Title */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Title *</Text>
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                  placeholder="Announcement title"
                  placeholderTextColor="#9ca3af"
                  value={newAnnouncement.title}
                  onChangeText={(text) => setNewAnnouncement({ ...newAnnouncement, title: text })}
                />
              </View>

              {/* Content */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Content *</Text>
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                  placeholder="Write your announcement..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={newAnnouncement.content}
                  onChangeText={(text) => setNewAnnouncement({ ...newAnnouncement, content: text })}
                />
              </View>

              {/* Type */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Type</Text>
                <View className="flex-row flex-wrap gap-2">
                  {(['info', 'warning', 'success', 'urgent'] as Announcement['type'][]).map((type) => {
                    const config = TYPE_CONFIG[type];
                    const isSelected = newAnnouncement.type === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        className={`px-4 py-2 rounded-full ${isSelected ? '' : config.bgColor}`}
                        style={isSelected ? { backgroundColor: config.color } : {}}
                        onPress={() => setNewAnnouncement({ ...newAnnouncement, type })}
                      >
                        <Text style={{ color: isSelected ? '#fff' : config.color }} className="font-medium">
                          {config.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Target Audience */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Target Audience</Text>
                <View className="flex-row flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'Everyone' },
                    { value: 'citizens', label: 'Citizens' },
                    { value: 'employees', label: 'Employees' },
                    { value: 'department_heads', label: 'Dept. Heads' },
                  ].map((audience) => {
                    const isSelected = newAnnouncement.targetAudience.includes(audience.value as any);
                    return (
                      <TouchableOpacity
                        key={audience.value}
                        className={`px-4 py-2 rounded-full ${isSelected ? 'bg-orange-500' : 'bg-gray-100'}`}
                        onPress={() => {
                          if (audience.value === 'all') {
                            setNewAnnouncement({ ...newAnnouncement, targetAudience: ['all'] });
                          } else {
                            const current = newAnnouncement.targetAudience.filter(a => a !== 'all');
                            if (isSelected) {
                              setNewAnnouncement({
                                ...newAnnouncement,
                                targetAudience: current.filter(a => a !== audience.value) as any,
                              });
                            } else {
                              setNewAnnouncement({
                                ...newAnnouncement,
                                targetAudience: [...current, audience.value] as any,
                              });
                            }
                          }
                        }}
                      >
                        <Text className={isSelected ? 'text-white font-medium' : 'text-gray-600'}>
                          {audience.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Pin Toggle */}
              <TouchableOpacity
                className="flex-row items-center justify-between bg-gray-100 rounded-xl px-4 py-3 mb-4"
                onPress={() => setNewAnnouncement({ ...newAnnouncement, isPinned: !newAnnouncement.isPinned })}
              >
                <View className="flex-row items-center">
                  <Pin size={20} color={newAnnouncement.isPinned ? '#f59e0b' : '#6b7280'} />
                  <Text className="text-gray-700 ml-2">Pin to top</Text>
                </View>
                <View className={`w-12 h-6 rounded-full ${newAnnouncement.isPinned ? 'bg-orange-500' : 'bg-gray-300'} justify-center`}>
                  <View className={`w-5 h-5 bg-white rounded-full ${newAnnouncement.isPinned ? 'ml-6' : 'ml-0.5'}`} />
                </View>
              </TouchableOpacity>

              {/* Attachments */}
              <TouchableOpacity className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6">
                <Image size={20} color="#6b7280" />
                <Text className="text-gray-600 ml-2">Add attachments</Text>
              </TouchableOpacity>

              {/* Actions */}
              <View className="flex-row gap-3 mb-4">
                <TouchableOpacity
                  className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
                  onPress={() => {
                    setShowCreateModal(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text className="text-gray-700 font-semibold">Save Draft</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-orange-500 rounded-xl py-4 flex-row items-center justify-center"
                  onPress={() => {
                    setShowCreateModal(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }}
                >
                  <Send size={18} color="#fff" />
                  <Text className="text-white font-semibold ml-2">Publish</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
          {selectedAnnouncement && (
            <View className="bg-white rounded-t-3xl p-6 max-h-[85%]">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <View className={`px-2 py-1 rounded-full ${TYPE_CONFIG[selectedAnnouncement.type].bgColor}`}>
                    <Text style={{ color: TYPE_CONFIG[selectedAnnouncement.type].color }} className="text-sm font-medium">
                      {TYPE_CONFIG[selectedAnnouncement.type].label}
                    </Text>
                  </View>
                  <View className={`px-2 py-1 rounded-full ${STATUS_CONFIG[selectedAnnouncement.status].bgColor}`}>
                    <Text style={{ color: STATUS_CONFIG[selectedAnnouncement.status].color }} className="text-sm font-medium">
                      {STATUS_CONFIG[selectedAnnouncement.status].label}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="text-gray-900 font-bold text-xl mb-3">{selectedAnnouncement.title}</Text>
                <Text className="text-gray-600 mb-4">{selectedAnnouncement.content}</Text>

                {/* Stats */}
                <View className="flex-row gap-3 mb-4">
                  <View className="flex-1 bg-gray-50 rounded-xl p-3 items-center">
                    <Eye size={20} color="#3b82f6" />
                    <Text className="text-gray-900 font-bold mt-1">{selectedAnnouncement.viewCount}</Text>
                    <Text className="text-gray-500 text-xs">Views</Text>
                  </View>

                  <View className="flex-1 bg-gray-50 rounded-xl p-3 items-center">
                    <Users size={20} color="#22c55e" />
                    <Text className="text-gray-900 font-bold mt-1">
                      {selectedAnnouncement.targetAudience.includes('all')
                        ? 'All'
                        : selectedAnnouncement.targetAudience.length}
                    </Text>
                    <Text className="text-gray-500 text-xs">Audience</Text>
                  </View>

                  <View className="flex-1 bg-gray-50 rounded-xl p-3 items-center">
                    <Image size={20} color="#8b5cf6" />
                    <Text className="text-gray-900 font-bold mt-1">{selectedAnnouncement.attachments}</Text>
                    <Text className="text-gray-500 text-xs">Files</Text>
                  </View>
                </View>

                {/* Meta Info */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-gray-500">Created by</Text>
                    <Text className="text-gray-900 font-medium">{selectedAnnouncement.createdBy}</Text>
                  </View>
                  {selectedAnnouncement.publishedAt && (
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-gray-500">Published at</Text>
                      <Text className="text-gray-900 font-medium">{selectedAnnouncement.publishedAt}</Text>
                    </View>
                  )}
                  {selectedAnnouncement.scheduledFor && (
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-gray-500">Scheduled for</Text>
                      <Text className="text-gray-900 font-medium">{selectedAnnouncement.scheduledFor}</Text>
                    </View>
                  )}
                  {selectedAnnouncement.expiresAt && (
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-500">Expires at</Text>
                      <Text className="text-gray-900 font-medium">{selectedAnnouncement.expiresAt}</Text>
                    </View>
                  )}
                </View>

                {/* Actions */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 bg-gray-100 rounded-xl py-4 flex-row items-center justify-center"
                    onPress={() => {
                      setShowDetailsModal(false);
                      router.push({
                        pathname: '/admin/edit-announcement',
                        params: { id: selectedAnnouncement.id },
                      });
                    }}
                  >
                    <Edit size={18} color="#6b7280" />
                    <Text className="text-gray-700 font-semibold ml-2">Edit</Text>
                  </TouchableOpacity>

                  {selectedAnnouncement.status === 'published' ? (
                    <TouchableOpacity
                      className="flex-1 bg-amber-100 rounded-xl py-4 flex-row items-center justify-center"
                      onPress={() => {
                        setShowDetailsModal(false);
                        handleAnnouncementAction('unpublish', selectedAnnouncement);
                      }}
                    >
                      <EyeOff size={18} color="#f59e0b" />
                      <Text className="text-amber-600 font-semibold ml-2">Unpublish</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      className="flex-1 bg-orange-500 rounded-xl py-4 flex-row items-center justify-center"
                      onPress={() => {
                        setShowDetailsModal(false);
                        handleAnnouncementAction('publish', selectedAnnouncement);
                      }}
                    >
                      <Send size={18} color="#fff" />
                      <Text className="text-white font-semibold ml-2">Publish</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    className="w-14 bg-red-100 rounded-xl py-4 items-center justify-center"
                    onPress={() => {
                      setShowDetailsModal(false);
                      handleAnnouncementAction('delete', selectedAnnouncement);
                    }}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
