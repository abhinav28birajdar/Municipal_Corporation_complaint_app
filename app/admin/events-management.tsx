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
  CalendarDays,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  MapPin,
  Users,
  Calendar,
  X,
  Image,
  CheckCircle,
  AlertTriangle,
  Star,
  Bell,
  Share2,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Event {
  id: string;
  title: string;
  description: string;
  type: 'meeting' | 'event' | 'announcement' | 'program' | 'campaign';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  date: string;
  time: string;
  duration: string;
  location: string;
  organizer: string;
  department: string;
  attendees: number;
  maxAttendees?: number;
  isFeatured: boolean;
  imageCount: number;
}

type TypeFilter = 'all' | 'meeting' | 'event' | 'announcement' | 'program' | 'campaign';
type StatusFilter = 'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

const TYPE_CONFIG = {
  meeting: { label: 'Meeting', color: '#3b82f6', bgColor: 'bg-blue-100' },
  event: { label: 'Event', color: '#22c55e', bgColor: 'bg-green-100' },
  announcement: { label: 'Announcement', color: '#f59e0b', bgColor: 'bg-amber-100' },
  program: { label: 'Program', color: '#8b5cf6', bgColor: 'bg-purple-100' },
  campaign: { label: 'Campaign', color: '#ec4899', bgColor: 'bg-pink-100' },
};

const STATUS_CONFIG = {
  upcoming: { label: 'Upcoming', color: '#3b82f6', bgColor: 'bg-blue-100' },
  ongoing: { label: 'Ongoing', color: '#22c55e', bgColor: 'bg-green-100' },
  completed: { label: 'Completed', color: '#6b7280', bgColor: 'bg-gray-100' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bgColor: 'bg-red-100' },
};

export default function EventsManagementScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'event' as Event['type'],
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    isFeatured: false,
  });

  const stats = {
    total: 45,
    upcoming: 12,
    ongoing: 3,
    totalAttendees: 2450,
  };

  useEffect(() => {
    loadEvents();
  }, [typeFilter, statusFilter]);

  const loadEvents = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Annual Budget Meeting',
        description: 'Discussion and approval of the annual municipal budget for 2024-25.',
        type: 'meeting',
        status: 'upcoming',
        date: '2024-01-25',
        time: '10:00 AM',
        duration: '3 hours',
        location: 'Municipal Corporation Hall, Conference Room A',
        organizer: 'Finance Department',
        department: 'Administration',
        attendees: 45,
        maxAttendees: 50,
        isFeatured: true,
        imageCount: 0,
      },
      {
        id: '2',
        title: 'Clean City Campaign',
        description: 'Month-long cleanliness drive across all wards. Join us in making our city cleaner.',
        type: 'campaign',
        status: 'ongoing',
        date: '2024-01-01',
        time: '6:00 AM',
        duration: '1 month',
        location: 'All Wards',
        organizer: 'Sanitation Department',
        department: 'Sanitation',
        attendees: 850,
        isFeatured: true,
        imageCount: 15,
      },
      {
        id: '3',
        title: 'Republic Day Celebration',
        description: 'Grand celebration of Republic Day with flag hoisting and cultural programs.',
        type: 'event',
        status: 'upcoming',
        date: '2024-01-26',
        time: '7:30 AM',
        duration: '4 hours',
        location: 'Municipal Stadium',
        organizer: 'Administration',
        department: 'Administration',
        attendees: 1200,
        maxAttendees: 2000,
        isFeatured: true,
        imageCount: 0,
      },
      {
        id: '4',
        title: 'Water Conservation Awareness Program',
        description: 'Educational program on water conservation techniques and practices.',
        type: 'program',
        status: 'upcoming',
        date: '2024-01-30',
        time: '9:00 AM',
        duration: '2 hours',
        location: 'Community Center, Ward 5',
        organizer: 'Water Supply Department',
        department: 'Water Supply',
        attendees: 120,
        maxAttendees: 150,
        isFeatured: false,
        imageCount: 3,
      },
      {
        id: '5',
        title: 'Road Safety Week',
        description: 'Week-long program focusing on road safety awareness and education.',
        type: 'campaign',
        status: 'completed',
        date: '2024-01-08',
        time: '8:00 AM',
        duration: '1 week',
        location: 'Various Locations',
        organizer: 'Traffic Department',
        department: 'Roads',
        attendees: 3200,
        isFeatured: false,
        imageCount: 25,
      },
      {
        id: '6',
        title: 'Department Heads Meeting',
        description: 'Monthly meeting of all department heads to discuss progress and issues.',
        type: 'meeting',
        status: 'cancelled',
        date: '2024-01-15',
        time: '2:00 PM',
        duration: '2 hours',
        location: 'Commissioner Office',
        organizer: 'Commissioner Office',
        department: 'Administration',
        attendees: 0,
        maxAttendees: 20,
        isFeatured: false,
        imageCount: 0,
      },
    ];

    let filtered = mockEvents;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(e => e.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === statusFilter);
    }

    setEvents(filtered);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadEvents();
    setRefreshing(false);
  }, []);

  const handleEventAction = (action: string, event: Event) => {
    switch (action) {
      case 'cancel':
        Alert.alert(
          'Cancel Event',
          `Are you sure you want to cancel "${event.title}"?`,
          [
            { text: 'No', style: 'cancel' },
            {
              text: 'Yes, Cancel',
              style: 'destructive',
              onPress: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              },
            },
          ]
        );
        break;
      case 'delete':
        Alert.alert(
          'Delete Event',
          `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
          [
            { text: 'No', style: 'cancel' },
            {
              text: 'Yes, Delete',
              style: 'destructive',
              onPress: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              },
            },
          ]
        );
        break;
      case 'notify':
        Alert.alert(
          'Send Notification',
          `Send reminder notification to all registered attendees for "${event.title}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Send',
              onPress: () => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              },
            },
          ]
        );
        break;
    }
  };

  const renderEventCard = (event: Event, index: number) => {
    const typeConfig = TYPE_CONFIG[event.type];
    const statusConfig = STATUS_CONFIG[event.status];

    return (
      <Animated.View
        key={event.id}
        entering={FadeInDown.delay(index * 100).springify()}
      >
        <TouchableOpacity
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
          onPress={() => {
            setSelectedEvent(event);
            setShowDetailsModal(true);
          }}
        >
          {/* Header */}
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <View className="flex-row items-center gap-2 mb-1">
                {event.isFeatured && (
                  <Star size={14} color="#f59e0b" fill="#f59e0b" />
                )}
                <View className={`px-2 py-0.5 rounded-full ${typeConfig.bgColor}`}>
                  <Text style={{ color: typeConfig.color }} className="text-xs font-medium">
                    {typeConfig.label}
                  </Text>
                </View>
                <View className={`px-2 py-0.5 rounded-full ${statusConfig.bgColor}`}>
                  <Text style={{ color: statusConfig.color }} className="text-xs font-medium">
                    {statusConfig.label}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-900 font-bold text-lg">{event.title}</Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
            {event.description}
          </Text>

          {/* Date & Time */}
          <View className="flex-row items-center gap-4 mb-3">
            <View className="flex-row items-center">
              <Calendar size={14} color="#6b7280" />
              <Text className="text-gray-600 text-sm ml-1">{event.date}</Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={14} color="#6b7280" />
              <Text className="text-gray-600 text-sm ml-1">{event.time}</Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={14} color="#6b7280" />
              <Text className="text-gray-600 text-sm ml-1">{event.duration}</Text>
            </View>
          </View>

          {/* Location */}
          <View className="flex-row items-center mb-3">
            <MapPin size={14} color="#6b7280" />
            <Text className="text-gray-600 text-sm ml-1" numberOfLines={1}>
              {event.location}
            </Text>
          </View>

          {/* Footer */}
          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            <View className="flex-row items-center">
              <Users size={14} color="#6b7280" />
              <Text className="text-gray-600 text-sm ml-1">
                {event.attendees}
                {event.maxAttendees && ` / ${event.maxAttendees}`} attendees
              </Text>
            </View>

            <View className="flex-row items-center">
              <Text className="text-gray-500 text-sm">{event.department}</Text>
            </View>
          </View>

          {/* Quick Actions */}
          {event.status === 'upcoming' && (
            <View className="flex-row gap-2 mt-3 pt-3 border-t border-gray-100">
              <TouchableOpacity
                className="flex-1 bg-blue-100 py-2 rounded-xl flex-row items-center justify-center"
                onPress={() => handleEventAction('notify', event)}
              >
                <Bell size={14} color="#3b82f6" />
                <Text className="text-blue-600 font-medium ml-1">Notify</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-gray-100 py-2 rounded-xl flex-row items-center justify-center"
                onPress={() => {
                  router.push({
                    pathname: '/admin/edit-event',
                    params: { id: event.id },
                  });
                }}
              >
                <Edit size={14} color="#6b7280" />
                <Text className="text-gray-600 font-medium ml-1">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-red-100 py-2 rounded-xl flex-row items-center justify-center"
                onPress={() => handleEventAction('cancel', event)}
              >
                <X size={14} color="#ef4444" />
                <Text className="text-red-500 font-medium ml-1">Cancel</Text>
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
        colors={['#0891b2', '#06b6d4']}
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

          <Text className="text-white text-lg font-semibold">Events & Programs</Text>

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
              <CalendarDays size={18} color="#fff" />
            </View>
            <Text className="text-white font-bold">{stats.total}</Text>
            <Text className="text-white/70 text-xs">Total</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-blue-400/30 items-center justify-center mb-1">
              <Clock size={18} color="#93c5fd" />
            </View>
            <Text className="text-white font-bold">{stats.upcoming}</Text>
            <Text className="text-white/70 text-xs">Upcoming</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-green-400/30 items-center justify-center mb-1">
              <CheckCircle size={18} color="#86efac" />
            </View>
            <Text className="text-white font-bold">{stats.ongoing}</Text>
            <Text className="text-white/70 text-xs">Ongoing</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-purple-400/30 items-center justify-center mb-1">
              <Users size={18} color="#c4b5fd" />
            </View>
            <Text className="text-white font-bold">{(stats.totalAttendees / 1000).toFixed(1)}K</Text>
            <Text className="text-white/70 text-xs">Attendees</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filters */}
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {(['all', 'meeting', 'event', 'program', 'campaign', 'announcement'] as TypeFilter[]).map((type) => (
              <TouchableOpacity
                key={type}
                className={`px-4 py-2 rounded-full ${
                  typeFilter === type ? 'bg-cyan-500' : 'bg-gray-100'
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
            {(['all', 'upcoming', 'ongoing', 'completed', 'cancelled'] as StatusFilter[]).map((status) => (
              <TouchableOpacity
                key={status}
                className={`px-4 py-2 rounded-full ${
                  statusFilter === status ? 'bg-cyan-500' : 'bg-gray-100'
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
            <CalendarDays size={48} color="#0891b2" />
            <Text className="text-gray-500 mt-4">Loading events...</Text>
          </View>
        ) : events.length === 0 ? (
          <View className="items-center py-10">
            <CalendarDays size={48} color="#9ca3af" />
            <Text className="text-gray-500 mt-4">No events found</Text>
            <Text className="text-gray-400 text-sm">Try adjusting your filters</Text>
          </View>
        ) : (
          events.map((event, index) => renderEventCard(event, index))
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
              <Text className="text-gray-900 font-bold text-xl">Create Event</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Title */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Event Title *</Text>
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                  placeholder="Enter event title"
                  placeholderTextColor="#9ca3af"
                  value={newEvent.title}
                  onChangeText={(text) => setNewEvent({ ...newEvent, title: text })}
                />
              </View>

              {/* Description */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Description *</Text>
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                  placeholder="Event description"
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={newEvent.description}
                  onChangeText={(text) => setNewEvent({ ...newEvent, description: text })}
                />
              </View>

              {/* Type */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Type</Text>
                <View className="flex-row flex-wrap gap-2">
                  {(['meeting', 'event', 'program', 'campaign', 'announcement'] as Event['type'][]).map((type) => {
                    const config = TYPE_CONFIG[type];
                    const isSelected = newEvent.type === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        className={`px-4 py-2 rounded-full ${isSelected ? '' : config.bgColor}`}
                        style={isSelected ? { backgroundColor: config.color } : {}}
                        onPress={() => setNewEvent({ ...newEvent, type })}
                      >
                        <Text style={{ color: isSelected ? '#fff' : config.color }} className="font-medium">
                          {config.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Date & Time */}
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-gray-700 font-medium mb-2">Date *</Text>
                  <TextInput
                    className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9ca3af"
                    value={newEvent.date}
                    onChangeText={(text) => setNewEvent({ ...newEvent, date: text })}
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-gray-700 font-medium mb-2">Time *</Text>
                  <TextInput
                    className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                    placeholder="HH:MM AM/PM"
                    placeholderTextColor="#9ca3af"
                    value={newEvent.time}
                    onChangeText={(text) => setNewEvent({ ...newEvent, time: text })}
                  />
                </View>
              </View>

              {/* Location */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Location *</Text>
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                  placeholder="Event location"
                  placeholderTextColor="#9ca3af"
                  value={newEvent.location}
                  onChangeText={(text) => setNewEvent({ ...newEvent, location: text })}
                />
              </View>

              {/* Max Attendees */}
              <View className="mb-4">
                <Text className="text-gray-700 font-medium mb-2">Max Attendees (optional)</Text>
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                  placeholder="Leave empty for unlimited"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  value={newEvent.maxAttendees}
                  onChangeText={(text) => setNewEvent({ ...newEvent, maxAttendees: text })}
                />
              </View>

              {/* Featured Toggle */}
              <TouchableOpacity
                className="flex-row items-center justify-between bg-gray-100 rounded-xl px-4 py-3 mb-6"
                onPress={() => setNewEvent({ ...newEvent, isFeatured: !newEvent.isFeatured })}
              >
                <View className="flex-row items-center">
                  <Star size={20} color={newEvent.isFeatured ? '#f59e0b' : '#6b7280'} fill={newEvent.isFeatured ? '#f59e0b' : 'none'} />
                  <Text className="text-gray-700 ml-2">Featured Event</Text>
                </View>
                <View className={`w-12 h-6 rounded-full ${newEvent.isFeatured ? 'bg-amber-500' : 'bg-gray-300'} justify-center`}>
                  <View className={`w-5 h-5 bg-white rounded-full ${newEvent.isFeatured ? 'ml-6' : 'ml-0.5'}`} />
                </View>
              </TouchableOpacity>

              {/* Actions */}
              <View className="flex-row gap-3 mb-4">
                <TouchableOpacity
                  className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
                  onPress={() => setShowCreateModal(false)}
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 bg-cyan-500 rounded-xl py-4 items-center"
                  onPress={() => {
                    setShowCreateModal(false);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  }}
                >
                  <Text className="text-white font-semibold">Create Event</Text>
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
          {selectedEvent && (
            <View className="bg-white rounded-t-3xl p-6 max-h-[85%]">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <View className={`px-2 py-1 rounded-full ${TYPE_CONFIG[selectedEvent.type].bgColor}`}>
                    <Text style={{ color: TYPE_CONFIG[selectedEvent.type].color }} className="text-sm font-medium">
                      {TYPE_CONFIG[selectedEvent.type].label}
                    </Text>
                  </View>
                  <View className={`px-2 py-1 rounded-full ${STATUS_CONFIG[selectedEvent.status].bgColor}`}>
                    <Text style={{ color: STATUS_CONFIG[selectedEvent.status].color }} className="text-sm font-medium">
                      {STATUS_CONFIG[selectedEvent.status].label}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedEvent.isFeatured && (
                  <View className="flex-row items-center mb-2">
                    <Star size={16} color="#f59e0b" fill="#f59e0b" />
                    <Text className="text-amber-600 font-medium ml-1">Featured Event</Text>
                  </View>
                )}

                <Text className="text-gray-900 font-bold text-2xl mb-3">{selectedEvent.title}</Text>
                <Text className="text-gray-600 mb-4">{selectedEvent.description}</Text>

                {/* Event Details */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <View className="flex-row items-center mb-3">
                    <Calendar size={18} color="#3b82f6" />
                    <Text className="text-gray-700 ml-3">{selectedEvent.date}</Text>
                  </View>

                  <View className="flex-row items-center mb-3">
                    <Clock size={18} color="#22c55e" />
                    <Text className="text-gray-700 ml-3">{selectedEvent.time} ({selectedEvent.duration})</Text>
                  </View>

                  <View className="flex-row items-center">
                    <MapPin size={18} color="#ef4444" />
                    <Text className="text-gray-700 ml-3">{selectedEvent.location}</Text>
                  </View>
                </View>

                {/* Organizer */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <Text className="text-gray-500 text-sm mb-1">Organized by</Text>
                  <Text className="text-gray-900 font-medium">{selectedEvent.organizer}</Text>
                  <Text className="text-gray-500 text-sm">{selectedEvent.department}</Text>
                </View>

                {/* Attendance */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-gray-500 text-sm">Attendees</Text>
                      <Text className="text-gray-900 font-bold text-2xl">
                        {selectedEvent.attendees}
                        {selectedEvent.maxAttendees && (
                          <Text className="text-gray-500 text-lg font-normal">
                            /{selectedEvent.maxAttendees}
                          </Text>
                        )}
                      </Text>
                    </View>

                    {selectedEvent.maxAttendees && (
                      <View className="items-end">
                        <Text className="text-gray-500 text-sm">Capacity</Text>
                        <Text className="text-gray-900 font-medium">
                          {Math.round((selectedEvent.attendees / selectedEvent.maxAttendees) * 100)}%
                        </Text>
                      </View>
                    )}
                  </View>

                  {selectedEvent.maxAttendees && (
                    <View className="h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                      <View
                        className="h-full bg-cyan-500 rounded-full"
                        style={{
                          width: `${(selectedEvent.attendees / selectedEvent.maxAttendees) * 100}%`,
                        }}
                      />
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
                        pathname: '/admin/edit-event',
                        params: { id: selectedEvent.id },
                      });
                    }}
                  >
                    <Edit size={18} color="#6b7280" />
                    <Text className="text-gray-700 font-semibold ml-2">Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 bg-cyan-500 rounded-xl py-4 flex-row items-center justify-center"
                    onPress={() => {}}
                  >
                    <Share2 size={18} color="#fff" />
                    <Text className="text-white font-semibold ml-2">Share</Text>
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
