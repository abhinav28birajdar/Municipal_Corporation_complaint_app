import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  X,
  ChevronRight,
  Calendar,
  FileText,
  User,
  Settings,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  category?: 'complaint' | 'event' | 'system' | 'user' | 'general';
  timestamp: string;
  isRead?: boolean;
  actionUrl?: string;
  actionLabel?: string;
  onDismiss?: (id: string) => void;
  onRead?: (id: string) => void;
  index?: number;
}

const TYPE_CONFIG = {
  info: {
    icon: Info,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  success: {
    icon: CheckCircle,
    color: '#22c55e',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  warning: {
    icon: AlertTriangle,
    color: '#f59e0b',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  error: {
    icon: AlertCircle,
    color: '#ef4444',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  system: {
    icon: Settings,
    color: '#6b7280',
    bgColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
};

const CATEGORY_CONFIG = {
  complaint: { icon: FileText, label: 'Complaint' },
  event: { icon: Calendar, label: 'Event' },
  system: { icon: Settings, label: 'System' },
  user: { icon: User, label: 'Account' },
  general: { icon: Bell, label: 'General' },
};

export default function NotificationItem({
  id,
  title,
  message,
  type,
  category = 'general',
  timestamp,
  isRead = false,
  actionUrl,
  actionLabel,
  onDismiss,
  onRead,
  index = 0,
}: NotificationItemProps) {
  const router = useRouter();
  const typeConfig = TYPE_CONFIG[type];
  const categoryConfig = CATEGORY_CONFIG[category];
  const TypeIcon = typeConfig.icon;
  const CategoryIcon = categoryConfig.icon;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (!isRead && onRead) {
      onRead(id);
    }

    if (actionUrl) {
      router.push(actionUrl as any);
    }
  };

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onDismiss) {
      onDismiss(id);
    }
  };

  return (
    <Animated.View entering={FadeIn.delay(index * 50)}>
      <TouchableOpacity
        className={`mb-3 rounded-2xl overflow-hidden ${!isRead ? 'shadow-sm' : ''}`}
        style={{
          backgroundColor: isRead ? '#f9fafb' : typeConfig.bgColor,
          borderWidth: isRead ? 0 : 1,
          borderColor: isRead ? 'transparent' : typeConfig.borderColor,
        }}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View className="p-4">
          <View className="flex-row items-start">
            {/* Icon */}
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: isRead ? '#e5e7eb' : typeConfig.color + '20' }}
            >
              <TypeIcon size={20} color={isRead ? '#9ca3af' : typeConfig.color} />
            </View>

            {/* Content */}
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center flex-1 mr-2">
                  <Text
                    className={`font-semibold ${isRead ? 'text-gray-500' : 'text-gray-900'}`}
                    numberOfLines={1}
                  >
                    {title}
                  </Text>
                  {!isRead && (
                    <View className="w-2 h-2 bg-purple-500 rounded-full ml-2" />
                  )}
                </View>

                {onDismiss && (
                  <TouchableOpacity
                    className="w-6 h-6 items-center justify-center"
                    onPress={handleDismiss}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <X size={16} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>

              <Text
                className={`text-sm mb-2 ${isRead ? 'text-gray-400' : 'text-gray-600'}`}
                numberOfLines={2}
              >
                {message}
              </Text>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="flex-row items-center">
                    <CategoryIcon size={12} color="#9ca3af" />
                    <Text className="text-gray-400 text-xs ml-1">
                      {categoryConfig.label}
                    </Text>
                  </View>
                  <Text className="text-gray-300">•</Text>
                  <Text className="text-gray-400 text-xs">{timestamp}</Text>
                </View>

                {actionUrl && (
                  <View className="flex-row items-center">
                    <Text className="text-purple-600 text-xs font-medium mr-1">
                      {actionLabel || 'View'}
                    </Text>
                    <ChevronRight size={14} color="#7c3aed" />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
