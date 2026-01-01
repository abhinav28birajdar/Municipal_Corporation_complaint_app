import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, Paperclip, Image as ImageIcon } from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';

const mockMessages = [
  {
    id: '1',
    senderId: 'employee-1',
    senderName: 'Rajesh Kumar',
    senderRole: 'employee',
    message: 'I have started working on your complaint. Expected completion by tomorrow.',
    timestamp: '2026-01-01T10:00:00',
  },
  {
    id: '2',
    senderId: 'user-1',
    senderName: 'You',
    senderRole: 'citizen',
    message: 'Thank you! Is there anything I need to provide?',
    timestamp: '2026-01-01T10:05:00',
  },
  {
    id: '3',
    senderId: 'employee-1',
    senderName: 'Rajesh Kumar',
    senderRole: 'employee',
    message: 'No, everything is fine. I will update you with photos once completed.',
    timestamp: '2026-01-01T10:07:00',
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        senderId: 'user-1',
        senderName: 'You',
        senderRole: 'citizen' as const,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-4 px-6">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Avatar name="Rajesh Kumar" size="sm" />
          <View className="flex-1 ml-3">
            <Text className="text-white font-bold text-lg">Rajesh Kumar</Text>
            <Text className="text-white/80 text-sm">Field Worker</Text>
          </View>
        </View>
        <Text className="text-white/70 text-xs mt-2">
          Complaint ID: {params.complaintId || 'CMP-12345678'}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 p-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((msg) => {
            const isOwnMessage = msg.senderRole === 'citizen';
            return (
              <View
                key={msg.id}
                className={`flex-row mb-4 ${
                  isOwnMessage ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isOwnMessage && (
                  <Avatar name={msg.senderName} size="sm" className="mr-2" />
                )}
                <View
                  className={`max-w-[75%] ${
                    isOwnMessage ? 'items-end' : 'items-start'
                  }`}
                >
                  {!isOwnMessage && (
                    <Text className="text-gray-600 text-xs mb-1 ml-2">
                      {msg.senderName}
                    </Text>
                  )}
                  <View
                    className={`rounded-2xl px-4 py-3 ${
                      isOwnMessage
                        ? 'bg-blue-600 rounded-br-sm'
                        : 'bg-white rounded-bl-sm border border-gray-200'
                    }`}
                  >
                    <Text
                      className={`${
                        isOwnMessage ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {msg.message}
                    </Text>
                  </View>
                  <Text className="text-gray-500 text-xs mt-1 mx-2">
                    {formatTime(msg.timestamp)}
                  </Text>
                </View>
                {isOwnMessage && (
                  <Avatar name={msg.senderName} size="sm" className="ml-2" />
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Input Area */}
        <View className="bg-white border-t border-gray-200 px-4 py-3">
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-3">
              <Paperclip size={24} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity className="mr-3">
              <ImageIcon size={24} color="#6b7280" />
            </TouchableOpacity>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              multiline
              maxLength={500}
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-3 max-h-24"
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!message.trim()}
              className={`p-3 rounded-full ${
                message.trim() ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <Send size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
