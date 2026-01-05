import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  Bell,
  Send,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  User,
  Building2,
  Target,
  ChevronDown,
  X,
  Smartphone,
  Mail,
  MessageSquare,
  Volume2,
} from 'lucide-react-native';

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  type: 'push' | 'email' | 'sms';
  target: 'all' | 'citizens' | 'employees' | 'department_heads' | 'custom';
  createdAt: string;
  usageCount: number;
}

interface ScheduledNotification {
  id: string;
  templateId: string;
  templateName: string;
  scheduledFor: string;
  status: 'pending' | 'sent' | 'failed';
  targetCount: number;
  sentCount?: number;
  failedCount?: number;
}

interface SentNotification {
  id: string;
  title: string;
  body: string;
  type: 'push' | 'email' | 'sms';
  sentAt: string;
  targetCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
}

type TabType = 'compose' | 'templates' | 'scheduled' | 'history';

const TYPE_CONFIG = {
  push: { label: 'Push', icon: Bell, color: '#3b82f6' },
  email: { label: 'Email', icon: Mail, color: '#22c55e' },
  sms: { label: 'SMS', icon: MessageSquare, color: '#f59e0b' },
};

const TARGET_CONFIG = {
  all: { label: 'All Users', icon: Users, color: '#8b5cf6' },
  citizens: { label: 'Citizens', icon: User, color: '#3b82f6' },
  employees: { label: 'Employees', icon: Building2, color: '#22c55e' },
  department_heads: { label: 'Dept. Heads', icon: Target, color: '#f59e0b' },
  custom: { label: 'Custom', icon: Filter, color: '#6b7280' },
};

export default function NotificationsManagementScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('compose');
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [sentNotifications, setSentNotifications] = useState<SentNotification[]>([]);

  // Compose state
  const [composeTitle, setComposeTitle] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composeType, setComposeType] = useState<'push' | 'email' | 'sms'>('push');
  const [composeTarget, setComposeTarget] = useState<keyof typeof TARGET_CONFIG>('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockTemplates: NotificationTemplate[] = [
      {
        id: '1',
        name: 'Complaint Resolved',
        title: 'Your complaint has been resolved',
        body: 'Dear citizen, your complaint #{complaint_id} has been successfully resolved. Thank you for your patience.',
        type: 'push',
        target: 'citizens',
        createdAt: '2024-01-10',
        usageCount: 245,
      },
      {
        id: '2',
        name: 'New Task Assigned',
        title: 'New task assigned to you',
        body: 'You have been assigned a new task: {task_title}. Please complete it by {due_date}.',
        type: 'push',
        target: 'employees',
        createdAt: '2024-01-08',
        usageCount: 189,
      },
      {
        id: '3',
        name: 'System Maintenance',
        title: 'Scheduled Maintenance Notice',
        body: 'The system will undergo maintenance on {date} from {start_time} to {end_time}. Some services may be unavailable.',
        type: 'email',
        target: 'all',
        createdAt: '2024-01-05',
        usageCount: 12,
      },
      {
        id: '4',
        name: 'Payment Reminder',
        title: 'Property Tax Payment Reminder',
        body: 'Your property tax payment of ₹{amount} is due on {due_date}. Please pay to avoid late fees.',
        type: 'sms',
        target: 'citizens',
        createdAt: '2024-01-03',
        usageCount: 1500,
      },
    ];

    const mockScheduled: ScheduledNotification[] = [
      {
        id: '1',
        templateId: '3',
        templateName: 'System Maintenance',
        scheduledFor: '2024-01-20 02:00',
        status: 'pending',
        targetCount: 15420,
      },
      {
        id: '2',
        templateId: '4',
        templateName: 'Payment Reminder',
        scheduledFor: '2024-01-25 09:00',
        status: 'pending',
        targetCount: 8500,
      },
    ];

    const mockSent: SentNotification[] = [
      {
        id: '1',
        title: 'New Feature Announcement',
        body: 'We have launched a new complaint tracking feature...',
        type: 'push',
        sentAt: '2024-01-16 10:00',
        targetCount: 12500,
        deliveredCount: 12350,
        openedCount: 8920,
        clickedCount: 3450,
      },
      {
        id: '2',
        title: 'Weekly Digest',
        body: 'Your weekly activity summary...',
        type: 'email',
        sentAt: '2024-01-15 08:00',
        targetCount: 5200,
        deliveredCount: 5180,
        openedCount: 2840,
        clickedCount: 1250,
      },
      {
        id: '3',
        title: 'Holiday Notice',
        body: 'Office will remain closed on...',
        type: 'push',
        sentAt: '2024-01-14 16:00',
        targetCount: 15420,
        deliveredCount: 15200,
        openedCount: 9800,
        clickedCount: 0,
      },
    ];

    setTemplates(mockTemplates);
    setScheduledNotifications(mockScheduled);
    setSentNotifications(mockSent);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadData();
    setRefreshing(false);
  }, []);

  const handleSendNow = () => {
    if (!composeTitle.trim() || !composeBody.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Send Notification',
      `Send this ${composeType} notification to ${TARGET_CONFIG[composeTarget].label}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Notification sent successfully!');
            setComposeTitle('');
            setComposeBody('');
          },
        },
      ]
    );
  };

  const handleSchedule = () => {
    setShowScheduleModal(true);
  };

  const handleSaveAsTemplate = () => {
    if (!composeTitle.trim() || !composeBody.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setShowTemplateModal(true);
  };

  const handleUseTemplate = (template: NotificationTemplate) => {
    setComposeTitle(template.title);
    setComposeBody(template.body);
    setComposeType(template.type);
    setComposeTarget(template.target);
    setActiveTab('compose');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDeleteTemplate = (templateId: string) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this template?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTemplates(prev => prev.filter(t => t.id !== templateId));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const handleCancelScheduled = (notificationId: string) => {
    Alert.alert(
      'Cancel Notification',
      'Are you sure you want to cancel this scheduled notification?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setScheduledNotifications(prev => prev.filter(n => n.id !== notificationId));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const renderComposeTab = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Notification Type */}
        <Animated.View entering={FadeInDown.delay(100)} className="mb-6">
          <Text className="text-gray-700 font-medium mb-3">Notification Type</Text>
          <View className="flex-row gap-3">
            {Object.entries(TYPE_CONFIG).map(([key, config]) => {
              const TypeIcon = config.icon;
              return (
                <TouchableOpacity
                  key={key}
                  className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
                    composeType === key ? '' : 'bg-gray-100'
                  }`}
                  style={composeType === key ? { backgroundColor: config.color + '20' } : {}}
                  onPress={() => setComposeType(key as any)}
                >
                  <TypeIcon size={18} color={composeType === key ? config.color : '#6b7280'} />
                  <Text
                    className="font-medium ml-2"
                    style={{ color: composeType === key ? config.color : '#6b7280' }}
                  >
                    {config.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Target Audience */}
        <Animated.View entering={FadeInDown.delay(200)} className="mb-6">
          <Text className="text-gray-700 font-medium mb-3">Target Audience</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2">
              {Object.entries(TARGET_CONFIG).map(([key, config]) => {
                const TargetIcon = config.icon;
                return (
                  <TouchableOpacity
                    key={key}
                    className={`px-4 py-2.5 rounded-xl flex-row items-center ${
                      composeTarget === key ? '' : 'bg-gray-100'
                    }`}
                    style={composeTarget === key ? { backgroundColor: config.color + '20' } : {}}
                    onPress={() => setComposeTarget(key as any)}
                  >
                    <TargetIcon size={16} color={composeTarget === key ? config.color : '#6b7280'} />
                    <Text
                      className="font-medium ml-2"
                      style={{ color: composeTarget === key ? config.color : '#6b7280' }}
                    >
                      {config.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.delay(300)} className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Title</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl p-4 text-gray-900"
            placeholder="Notification title..."
            value={composeTitle}
            onChangeText={setComposeTitle}
          />
        </Animated.View>

        {/* Body */}
        <Animated.View entering={FadeInDown.delay(400)} className="mb-6">
          <Text className="text-gray-700 font-medium mb-2">Message</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl p-4 text-gray-900"
            placeholder="Notification message..."
            value={composeBody}
            onChangeText={setComposeBody}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={{ minHeight: 120 }}
          />
          <Text className="text-gray-400 text-sm mt-2">
            Use {'{variable}'} for dynamic content
          </Text>
        </Animated.View>

        {/* Preview */}
        <Animated.View entering={FadeInDown.delay(500)} className="mb-6">
          <Text className="text-gray-700 font-medium mb-3">Preview</Text>
          <View className="bg-white rounded-xl p-4 border border-gray-200">
            <View className="flex-row items-start gap-3">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: TYPE_CONFIG[composeType].color + '20' }}
              >
                {React.createElement(TYPE_CONFIG[composeType].icon, {
                  size: 20,
                  color: TYPE_CONFIG[composeType].color,
                })}
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold">
                  {composeTitle || 'Notification Title'}
                </Text>
                <Text className="text-gray-500 mt-1">
                  {composeBody || 'Notification message will appear here...'}
                </Text>
                <Text className="text-gray-400 text-xs mt-2">Just now</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInDown.delay(600)} className="gap-3">
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-gray-100 rounded-xl py-4 flex-row items-center justify-center"
              onPress={handleSchedule}
            >
              <Clock size={18} color="#6b7280" />
              <Text className="text-gray-700 font-semibold ml-2">Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-purple-500 rounded-xl py-4 flex-row items-center justify-center"
              onPress={handleSendNow}
            >
              <Send size={18} color="#fff" />
              <Text className="text-white font-semibold ml-2">Send Now</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-white border border-gray-200 rounded-xl py-4 flex-row items-center justify-center"
            onPress={handleSaveAsTemplate}
          >
            <Plus size={18} color="#7c3aed" />
            <Text className="text-purple-600 font-semibold ml-2">Save as Template</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderTemplatesTab = () => (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className="flex-1"
      contentContainerStyle={{ padding: 16 }}
    >
      {templates.map((template, index) => {
        const typeConfig = TYPE_CONFIG[template.type];
        const targetConfig = TARGET_CONFIG[template.target];
        const TypeIcon = typeConfig.icon;

        return (
          <Animated.View
            key={template.id}
            entering={FadeInDown.delay(index * 100)}
          >
            <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center gap-2 mb-1">
                    <View
                      className="px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: typeConfig.color + '20' }}
                    >
                      <Text style={{ color: typeConfig.color }} className="text-xs font-medium">
                        {typeConfig.label}
                      </Text>
                    </View>
                    <View
                      className="px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: targetConfig.color + '20' }}
                    >
                      <Text style={{ color: targetConfig.color }} className="text-xs font-medium">
                        {targetConfig.label}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-900 font-semibold">{template.name}</Text>
                </View>

                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{ backgroundColor: typeConfig.color + '20' }}
                >
                  <TypeIcon size={20} color={typeConfig.color} />
                </View>
              </View>

              <View className="bg-gray-50 rounded-xl p-3 mb-3">
                <Text className="text-gray-900 font-medium">{template.title}</Text>
                <Text className="text-gray-500 text-sm mt-1" numberOfLines={2}>
                  {template.body}
                </Text>
              </View>

              <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                <Text className="text-gray-500 text-sm">
                  Used {template.usageCount} times
                </Text>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="w-9 h-9 bg-gray-100 rounded-lg items-center justify-center"
                    onPress={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-9 h-9 bg-gray-100 rounded-lg items-center justify-center"
                    onPress={() => {}}
                  >
                    <Edit size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-purple-500 rounded-lg px-4 py-2 flex-row items-center"
                    onPress={() => handleUseTemplate(template)}
                  >
                    <Text className="text-white font-medium">Use</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        );
      })}
    </ScrollView>
  );

  const renderScheduledTab = () => (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className="flex-1"
      contentContainerStyle={{ padding: 16 }}
    >
      {scheduledNotifications.length === 0 ? (
        <View className="items-center py-10">
          <Clock size={48} color="#d1d5db" />
          <Text className="text-gray-500 mt-4">No scheduled notifications</Text>
        </View>
      ) : (
        scheduledNotifications.map((notification, index) => (
          <Animated.View
            key={notification.id}
            entering={FadeInDown.delay(index * 100)}
          >
            <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
              <View className="flex-row items-start justify-between mb-3">
                <View>
                  <Text className="text-gray-900 font-semibold">
                    {notification.templateName}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Clock size={14} color="#6b7280" />
                    <Text className="text-gray-500 text-sm ml-1">
                      {notification.scheduledFor}
                    </Text>
                  </View>
                </View>

                <View
                  className={`px-3 py-1 rounded-full ${
                    notification.status === 'pending'
                      ? 'bg-amber-100'
                      : notification.status === 'sent'
                      ? 'bg-green-100'
                      : 'bg-red-100'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      notification.status === 'pending'
                        ? 'text-amber-600'
                        : notification.status === 'sent'
                        ? 'text-green-600'
                        : 'text-red-500'
                    }`}
                  >
                    {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                <View className="flex-row items-center">
                  <Users size={14} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-1">
                    {notification.targetCount.toLocaleString()} recipients
                  </Text>
                </View>

                {notification.status === 'pending' && (
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      className="bg-gray-100 rounded-lg px-3 py-1.5"
                      onPress={() => handleCancelScheduled(notification.id)}
                    >
                      <Text className="text-gray-600 font-medium">Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-purple-500 rounded-lg px-3 py-1.5">
                      <Text className="text-white font-medium">Edit</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>
        ))
      )}
    </ScrollView>
  );

  const renderHistoryTab = () => (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      className="flex-1"
      contentContainerStyle={{ padding: 16 }}
    >
      {sentNotifications.map((notification, index) => {
        const typeConfig = TYPE_CONFIG[notification.type];
        const deliveryRate = Math.round((notification.deliveredCount / notification.targetCount) * 100);
        const openRate = Math.round((notification.openedCount / notification.deliveredCount) * 100);

        return (
          <Animated.View
            key={notification.id}
            entering={FadeInDown.delay(index * 100)}
          >
            <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center gap-2 mb-1">
                    <View
                      className="px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: typeConfig.color + '20' }}
                    >
                      <Text style={{ color: typeConfig.color }} className="text-xs font-medium">
                        {typeConfig.label}
                      </Text>
                    </View>
                    <View className="bg-green-100 px-2 py-0.5 rounded-full">
                      <Text className="text-green-600 text-xs font-medium">Sent</Text>
                    </View>
                  </View>
                  <Text className="text-gray-900 font-semibold">{notification.title}</Text>
                  <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
                    {notification.body}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-3 mb-3">
                <View className="flex-1 bg-blue-50 rounded-xl p-3 items-center">
                  <Text className="text-blue-600 font-bold text-lg">{deliveryRate}%</Text>
                  <Text className="text-blue-600 text-xs">Delivered</Text>
                </View>
                <View className="flex-1 bg-green-50 rounded-xl p-3 items-center">
                  <Text className="text-green-600 font-bold text-lg">{openRate}%</Text>
                  <Text className="text-green-600 text-xs">Opened</Text>
                </View>
                <View className="flex-1 bg-purple-50 rounded-xl p-3 items-center">
                  <Text className="text-purple-600 font-bold text-lg">
                    {notification.clickedCount.toLocaleString()}
                  </Text>
                  <Text className="text-purple-600 text-xs">Clicks</Text>
                </View>
              </View>

              <View className="flex-row items-center pt-3 border-t border-gray-100">
                <Clock size={14} color="#6b7280" />
                <Text className="text-gray-500 text-sm ml-1">{notification.sentAt}</Text>
                <Text className="text-gray-300 mx-2">•</Text>
                <Users size={14} color="#6b7280" />
                <Text className="text-gray-500 text-sm ml-1">
                  {notification.targetCount.toLocaleString()} recipients
                </Text>
              </View>
            </View>
          </Animated.View>
        );
      })}
    </ScrollView>
  );

  const tabs = [
    { id: 'compose', label: 'Compose', icon: Edit },
    { id: 'templates', label: 'Templates', icon: Bell },
    { id: 'scheduled', label: 'Scheduled', icon: Clock },
    { id: 'history', label: 'History', icon: CheckCircle },
  ];

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

          <Text className="text-white text-lg font-semibold">Notifications</Text>

          <View className="w-10 h-10" />
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <TouchableOpacity
                  key={tab.id}
                  className={`px-4 py-2.5 rounded-xl flex-row items-center ${
                    activeTab === tab.id ? 'bg-white' : 'bg-white/20'
                  }`}
                  onPress={() => setActiveTab(tab.id as TabType)}
                >
                  <TabIcon
                    size={16}
                    color={activeTab === tab.id ? '#7c3aed' : '#fff'}
                  />
                  <Text
                    className={`font-medium ml-2 ${
                      activeTab === tab.id ? 'text-purple-600' : 'text-white'
                    }`}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Content */}
      {activeTab === 'compose' && renderComposeTab()}
      {activeTab === 'templates' && renderTemplatesTab()}
      {activeTab === 'scheduled' && renderScheduledTab()}
      {activeTab === 'history' && renderHistoryTab()}

      {/* Schedule Modal */}
      <Modal
        visible={showScheduleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowScheduleModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-900 font-bold text-xl">Schedule Notification</Text>
              <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 mb-6">
              Choose when to send this notification
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
                onPress={() => setShowScheduleModal(false)}
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-purple-500 rounded-xl py-4 items-center"
                onPress={() => {
                  setShowScheduleModal(false);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  Alert.alert('Scheduled', 'Notification has been scheduled');
                }}
              >
                <Text className="text-white font-semibold">Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Save Template Modal */}
      <Modal
        visible={showTemplateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTemplateModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-900 font-bold text-xl">Save as Template</Text>
              <TouchableOpacity onPress={() => setShowTemplateModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 mb-6"
              placeholder="Template name..."
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
                onPress={() => setShowTemplateModal(false)}
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-purple-500 rounded-xl py-4 items-center"
                onPress={() => {
                  setShowTemplateModal(false);
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  Alert.alert('Saved', 'Template has been saved');
                }}
              >
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
