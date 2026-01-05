import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { CheckCheck, Check, Clock, Camera, FileText } from 'lucide-react-native';

interface ChatListItemProps {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  isOnline?: boolean;
  messageType?: 'text' | 'image' | 'file' | 'audio';
  messageStatus?: 'sending' | 'sent' | 'delivered' | 'read';
  isSentByMe?: boolean;
  index?: number;
}

export default function ChatListItem({
  id,
  name,
  avatar,
  lastMessage,
  lastMessageTime,
  unreadCount = 0,
  isOnline = false,
  messageType = 'text',
  messageStatus,
  isSentByMe = false,
  index = 0,
}: ChatListItemProps) {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/chat',
      params: {
        id,
        name,
        subtitle: isOnline ? 'Online' : 'Last seen recently',
        avatar: avatar || '',
      },
    });
  };

  const getStatusIcon = () => {
    if (!isSentByMe || !messageStatus) return null;

    switch (messageStatus) {
      case 'sending':
        return <Clock size={14} color="#9ca3af" />;
      case 'sent':
        return <Check size={14} color="#9ca3af" />;
      case 'delivered':
        return <CheckCheck size={14} color="#9ca3af" />;
      case 'read':
        return <CheckCheck size={14} color="#3b82f6" />;
    }
  };

  const getMessagePreview = () => {
    switch (messageType) {
      case 'image':
        return (
          <View className="flex-row items-center">
            <Camera size={14} color="#6b7280" />
            <Text className="text-gray-500 text-sm ml-1">Photo</Text>
          </View>
        );
      case 'file':
        return (
          <View className="flex-row items-center">
            <FileText size={14} color="#6b7280" />
            <Text className="text-gray-500 text-sm ml-1">Document</Text>
          </View>
        );
      default:
        return (
          <Text
            className={`text-sm ${unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}
            numberOfLines={1}
          >
            {lastMessage}
          </Text>
        );
    }
  };

  return (
    <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
      <TouchableOpacity
        className="flex-row items-center bg-white p-4 border-b border-gray-100"
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {/* Avatar */}
        <View className="relative mr-3">
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
              <Text className="text-purple-600 font-semibold text-lg">
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          
          {/* Online indicator */}
          {isOnline && (
            <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
          )}
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-gray-900 font-semibold flex-1 mr-2" numberOfLines={1}>
              {name}
            </Text>
            <Text className={`text-xs ${unreadCount > 0 ? 'text-purple-600 font-medium' : 'text-gray-400'}`}>
              {lastMessageTime}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-2">
              {isSentByMe && (
                <View className="mr-1">
                  {getStatusIcon()}
                </View>
              )}
              {getMessagePreview()}
            </View>

            {unreadCount > 0 && (
              <View className="bg-purple-500 rounded-full min-w-[20px] h-5 items-center justify-center px-1.5">
                <Text className="text-white text-xs font-semibold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
