import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  Bell,
  X,
  Settings,
  CheckCheck,
  Trash2,
  ChevronRight,
} from 'lucide-react-native';
import NotificationItem from './NotificationItem';

const { height } = Dimensions.get('window');

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  category?: 'complaint' | 'event' | 'system' | 'user' | 'general';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationBellProps {
  notifications?: Notification[];
  onNotificationRead?: (id: string) => void;
  onNotificationDismiss?: (id: string) => void;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
}

export default function NotificationBell({
  notifications: externalNotifications,
  onNotificationRead,
  onNotificationDismiss,
  onMarkAllRead,
  onClearAll,
}: NotificationBellProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (externalNotifications) {
      setNotifications(externalNotifications);
    } else {
      // Default mock notifications
      setNotifications([
        {
          id: '1',
          title: 'Complaint Resolved',
          message: 'Your complaint #MC-2024-0125 regarding road damage has been resolved.',
          type: 'success',
          category: 'complaint',
          timestamp: '2 min ago',
          isRead: false,
          actionUrl: '/complaints/MC-2024-0125',
          actionLabel: 'View Details',
        },
        {
          id: '2',
          title: 'New Event',
          message: 'Community cleanup drive scheduled for January 20th. Register now!',
          type: 'info',
          category: 'event',
          timestamp: '1 hour ago',
          isRead: false,
          actionUrl: '/events/123',
        },
        {
          id: '3',
          title: 'Payment Reminder',
          message: 'Your property tax payment is due in 5 days. Avoid late fees!',
          type: 'warning',
          category: 'system',
          timestamp: '3 hours ago',
          isRead: false,
        },
        {
          id: '4',
          title: 'Status Update',
          message: 'Complaint #MC-2024-0120 status changed to "In Progress".',
          type: 'info',
          category: 'complaint',
          timestamp: 'Yesterday',
          isRead: true,
          actionUrl: '/complaints/MC-2024-0120',
        },
      ]);
    }
  }, [externalNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleBellPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    if (onNotificationRead) {
      onNotificationRead(id);
    }
  };

  const handleNotificationDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (onNotificationDismiss) {
      onNotificationDismiss(id);
    }
  };

  const handleMarkAllRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    if (onMarkAllRead) {
      onMarkAllRead();
    }
  };

  const handleClearAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setNotifications([]);
    if (onClearAll) {
      onClearAll();
    }
    setShowModal(false);
  };

  const handleViewAll = () => {
    setShowModal(false);
    router.push('/notifications');
  };

  const handleSettings = () => {
    setShowModal(false);
    router.push('/settings');
  };

  return (
    <>
      {/* Bell Icon */}
      <TouchableOpacity
        className="relative w-10 h-10 items-center justify-center"
        onPress={handleBellPress}
      >
        <Bell size={24} color="#374151" />
        {unreadCount > 0 && (
          <Animated.View
            entering={FadeIn}
            className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1"
          >
            <Text className="text-white text-[10px] font-bold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </Animated.View>
        )}
      </TouchableOpacity>

      {/* Notification Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View className="flex-1 bg-black/50">
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={handleClose}
          />

          <Animated.View
            entering={SlideInRight.springify()}
            className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[400px] bg-white"
          >
            {/* Header */}
            <View className="pt-12 px-4 pb-4 border-b border-gray-100">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-gray-900 font-bold text-xl">Notifications</Text>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center"
                    onPress={handleSettings}
                  >
                    <Settings size={18} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center"
                    onPress={handleClose}
                  >
                    <X size={18} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Actions */}
              {notifications.length > 0 && (
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2"
                    onPress={handleMarkAllRead}
                  >
                    <CheckCheck size={14} color="#6b7280" />
                    <Text className="text-gray-600 text-sm font-medium ml-1">Mark all read</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2"
                    onPress={handleClearAll}
                  >
                    <Trash2 size={14} color="#6b7280" />
                    <Text className="text-gray-600 text-sm font-medium ml-1">Clear all</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Notifications List */}
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ padding: 16 }}
            >
              {notifications.length === 0 ? (
                <View className="items-center py-16">
                  <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                    <Bell size={32} color="#d1d5db" />
                  </View>
                  <Text className="text-gray-500 text-center">
                    No notifications yet
                  </Text>
                  <Text className="text-gray-400 text-sm text-center mt-1">
                    We'll notify you when something important happens
                  </Text>
                </View>
              ) : (
                notifications.map((notification, index) => (
                  <NotificationItem
                    key={notification.id}
                    {...notification}
                    onRead={handleNotificationRead}
                    onDismiss={handleNotificationDismiss}
                    index={index}
                  />
                ))
              )}
            </ScrollView>

            {/* Footer */}
            {notifications.length > 0 && (
              <View className="p-4 border-t border-gray-100">
                <TouchableOpacity
                  className="flex-row items-center justify-center bg-purple-50 rounded-xl py-3"
                  onPress={handleViewAll}
                >
                  <Text className="text-purple-600 font-semibold mr-1">View All Notifications</Text>
                  <ChevronRight size={18} color="#7c3aed" />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
