import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Image as ImageIcon,
  Camera,
  Mic,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
  Check,
  Clock,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'audio' | 'file';
  sender: 'user' | 'other';
  senderName?: string;
  senderAvatar?: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  imageUrl?: string;
  fileName?: string;
}

interface ChatScreenProps {
  chatId?: string;
  chatTitle?: string;
  chatSubtitle?: string;
  chatAvatar?: string;
  isOnline?: boolean;
}

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    subtitle: string;
    avatar: string;
  }>();

  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const chatTitle = params.name || 'Chat';
  const chatSubtitle = params.subtitle || 'Online';

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const loadMessages = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockMessages: Message[] = [
      {
        id: '1',
        content: 'Hello! I am assigned to resolve your complaint regarding road damage.',
        type: 'text',
        sender: 'other',
        senderName: 'Municipal Worker',
        timestamp: '10:30 AM',
        status: 'read',
      },
      {
        id: '2',
        content: 'Can you please share the exact location?',
        type: 'text',
        sender: 'other',
        senderName: 'Municipal Worker',
        timestamp: '10:31 AM',
        status: 'read',
      },
      {
        id: '3',
        content: 'Yes, it\'s near the main market entrance, about 50 meters from the traffic signal.',
        type: 'text',
        sender: 'user',
        timestamp: '10:35 AM',
        status: 'read',
      },
      {
        id: '4',
        content: 'Here\'s a photo of the damaged road',
        type: 'text',
        sender: 'user',
        timestamp: '10:36 AM',
        status: 'read',
      },
      {
        id: '5',
        content: '',
        type: 'image',
        sender: 'user',
        timestamp: '10:36 AM',
        status: 'read',
        imageUrl: 'https://example.com/road-damage.jpg',
      },
      {
        id: '6',
        content: 'Thank you for the details. I will visit the location today afternoon.',
        type: 'text',
        sender: 'other',
        senderName: 'Municipal Worker',
        timestamp: '10:40 AM',
        status: 'read',
      },
      {
        id: '7',
        content: 'Estimated time for repair is 2-3 days after inspection.',
        type: 'text',
        sender: 'other',
        senderName: 'Municipal Worker',
        timestamp: '10:41 AM',
        status: 'delivered',
      },
    ];

    setMessages(mockMessages);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMessages();
    setRefreshing(false);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputText.trim(),
      type: 'text',
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m =>
          m.id === newMessage.id ? { ...m, status: 'sent' as const } : m
        )
      );
    }, 500);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(m =>
          m.id === newMessage.id ? { ...m, status: 'delivered' as const } : m
        )
      );
    }, 1000);

    // Simulate typing indicator and response
    setTimeout(() => setIsTyping(true), 1500);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thank you for your message. I will get back to you shortly.',
        type: 'text',
        sender: 'other',
        senderName: 'Municipal Worker',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
      };
      setMessages(prev => [...prev, response]);
    }, 3000);
  };

  const handleAttachImage = async () => {
    setShowAttachmentMenu(false);
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        content: '',
        type: 'image',
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sending',
        imageUrl: result.assets[0].uri,
      };

      setMessages(prev => [...prev, newMessage]);

      setTimeout(() => {
        setMessages(prev =>
          prev.map(m =>
            m.id === newMessage.id ? { ...m, status: 'sent' as const } : m
          )
        );
      }, 1000);
    }
  };

  const handleTakePhoto = async () => {
    setShowAttachmentMenu(false);
    
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        content: '',
        type: 'image',
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sending',
        imageUrl: result.assets[0].uri,
      };

      setMessages(prev => [...prev, newMessage]);
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock size={12} color="#9ca3af" />;
      case 'sent':
        return <Check size={12} color="#9ca3af" />;
      case 'delivered':
        return <CheckCheck size={12} color="#9ca3af" />;
      case 'read':
        return <CheckCheck size={12} color="#3b82f6" />;
    }
  };

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.sender === 'user';
    const showAvatar = !isUser && (index === 0 || messages[index - 1]?.sender === 'user');

    return (
      <Animated.View
        key={message.id}
        entering={FadeInUp.delay(index * 50).springify()}
        className={`flex-row mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        {/* Avatar */}
        {!isUser && (
          <View className="w-8 mr-2">
            {showAvatar && (
              <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center">
                <Text className="text-purple-600 font-semibold text-xs">
                  {message.senderName?.charAt(0) || 'M'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Message Bubble */}
        <View
          className={`max-w-[75%] ${
            isUser
              ? 'bg-purple-500 rounded-2xl rounded-br-md'
              : 'bg-white rounded-2xl rounded-bl-md'
          } ${message.type === 'image' ? 'p-1' : 'px-4 py-3'} shadow-sm`}
        >
          {message.type === 'image' ? (
            <View className="rounded-xl overflow-hidden">
              <View className="w-48 h-48 bg-gray-200 rounded-xl items-center justify-center">
                <ImageIcon size={32} color="#9ca3af" />
                <Text className="text-gray-400 text-xs mt-1">Image</Text>
              </View>
            </View>
          ) : (
            <Text className={isUser ? 'text-white' : 'text-gray-900'}>
              {message.content}
            </Text>
          )}

          <View className={`flex-row items-center justify-end mt-1 gap-1`}>
            <Text className={`text-xs ${isUser ? 'text-white/70' : 'text-gray-400'}`}>
              {message.timestamp}
            </Text>
            {isUser && getStatusIcon(message.status)}
          </View>
        </View>
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
        className="pt-12 pb-4 px-4"
      >
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
          >
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>

          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
              <Text className="text-white font-semibold text-lg">
                {chatTitle.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-lg">{chatTitle}</Text>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-400 rounded-full mr-1" />
                <Text className="text-white/70 text-sm">{chatSubtitle}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-2">
            <Phone size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
            <MoreVertical size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollViewRef}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
        >
          {messages.map((message, index) => renderMessage(message, index))}

          {/* Typing Indicator */}
          {isTyping && (
            <Animated.View
              entering={FadeInUp.springify()}
              className="flex-row items-center"
            >
              <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-2">
                <Text className="text-purple-600 font-semibold text-xs">M</Text>
              </View>
              <View className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <View className="flex-row gap-1">
                  <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                  <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                  <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                </View>
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Attachment Menu */}
        {showAttachmentMenu && (
          <Animated.View
            entering={FadeInUp.springify()}
            className="absolute bottom-20 left-4 bg-white rounded-2xl shadow-lg p-2"
          >
            <TouchableOpacity
              className="flex-row items-center px-4 py-3"
              onPress={handleTakePhoto}
            >
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Camera size={20} color="#3b82f6" />
              </View>
              <Text className="text-gray-900 font-medium">Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center px-4 py-3"
              onPress={handleAttachImage}
            >
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-3">
                <ImageIcon size={20} color="#22c55e" />
              </View>
              <Text className="text-gray-900 font-medium">Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center px-4 py-3">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Paperclip size={20} color="#8b5cf6" />
              </View>
              <Text className="text-gray-900 font-medium">Document</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Input */}
        <View className="p-4 bg-white border-t border-gray-100">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
              onPress={() => setShowAttachmentMenu(!showAttachmentMenu)}
            >
              <Paperclip size={20} color="#6b7280" />
            </TouchableOpacity>

            <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2">
              <TextInput
                className="flex-1 text-gray-900"
                placeholder="Type a message..."
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={1000}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {inputText.trim() ? (
              <TouchableOpacity
                className="w-10 h-10 bg-purple-500 rounded-full items-center justify-center"
                onPress={handleSend}
              >
                <Send size={18} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                <Mic size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
