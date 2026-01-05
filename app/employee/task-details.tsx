import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Timer,
  Navigation,
  Phone,
  MessageCircle,
  Camera,
  Calendar,
  User,
  FileText,
  Share2,
  ChevronRight,
  Play,
  Eye,
  Star,
  Package,
  History,
  Flag,
  MoreVertical,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface TaskDetails {
  id: string;
  complaintId: string;
  title: string;
  description: string;
  category: string;
  categoryEmoji: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  location: {
    address: string;
    landmark: string;
    coordinates: { lat: number; lng: number };
  };
  citizen: {
    name: string;
    phone: string;
    avatar: string | null;
    rating: number;
  };
  assignedAt: string;
  deadline: string;
  estimatedTime: string;
  instructions: string[];
  materials: string[];
  images: string[];
  history: {
    id: string;
    action: string;
    time: string;
    by: string;
  }[];
}

const PRIORITY_CONFIG = {
  low: { color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)', label: 'Low Priority' },
  medium: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', label: 'Medium Priority' },
  high: { color: '#f97316', bgColor: 'rgba(249, 115, 22, 0.1)', label: 'High Priority' },
  critical: { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', label: 'Critical Priority' },
};

const STATUS_CONFIG = {
  pending: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', label: 'Pending' },
  'in-progress': { color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', label: 'In Progress' },
  completed: { color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.1)', label: 'Completed' },
  cancelled: { color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.1)', label: 'Cancelled' },
};

export default function TaskDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<TaskDetails | null>(null);

  useEffect(() => {
    loadTaskDetails();
  }, [id]);

  const loadTaskDetails = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockTask: TaskDetails = {
      id: id || '1',
      complaintId: 'CMP-2024-0892',
      title: 'Water pipe burst on Main Street',
      description: 'Major water leakage causing road flooding. The pipe appears to be a main supply line and needs immediate attention. Water pressure is high and spreading to nearby shops.',
      category: 'Water Supply',
      categoryEmoji: '💧',
      priority: 'critical',
      status: 'pending',
      location: {
        address: '123 Main Street, Ward 5, Near Central Market',
        landmark: 'Opposite SBI Bank',
        coordinates: { lat: 23.0225, lng: 72.5714 },
      },
      citizen: {
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        avatar: null,
        rating: 4.5,
      },
      assignedAt: '2024-01-15T08:30:00',
      deadline: '2024-01-15T14:00:00',
      estimatedTime: '2 hours',
      instructions: [
        'Shut off main water supply valve first',
        'Clear area of debris and water',
        'Assess pipe damage and determine repair type',
        'Use appropriate pipe fittings for repair',
        'Test water pressure after repair',
        'Document before and after with photos',
      ],
      materials: [
        'PVC Pipe (2 inch) - 3 meters',
        'Pipe Joints - 4 pieces',
        'Pipe Wrench',
        'Sealant Tape',
        'Clamps - 2 pieces',
      ],
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
      ],
      history: [
        {
          id: '1',
          action: 'Assigned to you',
          time: '2 hours ago',
          by: 'Supervisor',
        },
        {
          id: '2',
          action: 'Complaint registered',
          time: '3 hours ago',
          by: 'Citizen',
        },
        {
          id: '3',
          action: 'Verified and categorized',
          time: '2.5 hours ago',
          by: 'System',
        },
      ],
    };
    
    setTask(mockTask);
    setLoading(false);
  };

  const handleCall = async () => {
    if (task?.citizen.phone) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Linking.openURL(`tel:${task.citizen.phone}`);
    }
  };

  const handleChat = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/chat',
      params: { taskId: task?.id },
    });
  };

  const handleNavigate = async () => {
    if (task) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push({
        pathname: '/map-view',
        params: {
          lat: task.location.coordinates.lat,
          lng: task.location.coordinates.lng,
          title: task.title,
        },
      });
    }
  };

  const handleStartWork = async () => {
    if (task) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      router.push({
        pathname: '/employee/work-session',
        params: { taskId: task.id },
      });
    }
  };

  const handleReportIssue = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Report Issue',
      'Select the type of issue you want to report:',
      [
        { text: 'Unable to Access Location', onPress: () => {} },
        { text: 'Need Additional Materials', onPress: () => {} },
        { text: 'Requires Specialist', onPress: () => {} },
        { text: 'Other Issue', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getTimeRemaining = () => {
    if (!task) return { text: '-', isOverdue: false };
    
    const now = new Date();
    const deadline = new Date(task.deadline);
    const diff = deadline.getTime() - now.getTime();
    
    if (diff < 0) return { text: 'Overdue', isOverdue: true };
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return { text: `${days}d ${hours % 24}h remaining`, isOverdue: false };
    }
    
    return { text: `${hours}h ${minutes}m remaining`, isOverdue: false };
  };

  if (loading || !task) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Timer size={48} color="#3b82f6" />
        <Text className="text-gray-500 mt-4">Loading task details...</Text>
      </View>
    );
  }

  const priorityConfig = PRIORITY_CONFIG[task.priority];
  const statusConfig = STATUS_CONFIG[task.status];
  const timeRemaining = getTimeRemaining();

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={[priorityConfig.color, priorityConfig.color]}
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
          
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              onPress={() => {}}
            >
              <Share2 size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              onPress={() => {}}
            >
              <MoreVertical size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Task Header */}
        <View className="flex-row items-start mb-4">
          <View className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center mr-4">
            <Text className="text-4xl">{task.categoryEmoji}</Text>
          </View>
          
          <View className="flex-1">
            <Text className="text-white/70 text-sm">{task.complaintId}</Text>
            <Text className="text-white font-bold text-xl" numberOfLines={2}>
              {task.title}
            </Text>
          </View>
        </View>

        {/* Status Badges */}
        <View className="flex-row items-center gap-2">
          <View
            className="px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <Text className="text-white text-sm font-medium">
              {statusConfig.label}
            </Text>
          </View>
          
          <View
            className="px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <Text className="text-white text-sm font-medium">
              {priorityConfig.label}
            </Text>
          </View>
          
          <View
            className={`px-3 py-1.5 rounded-full ${
              timeRemaining.isOverdue ? 'bg-red-500' : 'bg-white/20'
            }`}
          >
            <Text className="text-white text-sm font-medium">
              {timeRemaining.text}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        {/* Quick Actions */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="flex-row gap-3 mb-6"
        >
          <TouchableOpacity
            className="flex-1 bg-blue-500 rounded-2xl py-3 flex-row items-center justify-center"
            onPress={handleNavigate}
          >
            <Navigation size={18} color="#fff" />
            <Text className="text-white font-medium ml-2">Navigate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-green-500 rounded-2xl py-3 flex-row items-center justify-center"
            onPress={handleCall}
          >
            <Phone size={18} color="#fff" />
            <Text className="text-white font-medium ml-2">Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-purple-500 rounded-2xl py-3 flex-row items-center justify-center"
            onPress={handleChat}
          >
            <MessageCircle size={18} color="#fff" />
            <Text className="text-white font-medium ml-2">Chat</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Description */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center mb-3">
            <FileText size={20} color="#3b82f6" />
            <Text className="text-gray-900 font-bold text-lg ml-2">Description</Text>
          </View>
          <Text className="text-gray-600 leading-6">{task.description}</Text>
        </Animated.View>

        {/* Location */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center mb-3">
            <MapPin size={20} color="#ef4444" />
            <Text className="text-gray-900 font-bold text-lg ml-2">Location</Text>
          </View>
          
          <Text className="text-gray-700 font-medium">{task.location.address}</Text>
          <Text className="text-gray-500 text-sm mt-1">
            Landmark: {task.location.landmark}
          </Text>
          
          <TouchableOpacity
            className="mt-3 bg-gray-100 rounded-xl p-3 flex-row items-center justify-between"
            onPress={handleNavigate}
          >
            <View className="flex-row items-center">
              <Navigation size={18} color="#3b82f6" />
              <Text className="text-blue-500 font-medium ml-2">Get Directions</Text>
            </View>
            <ChevronRight size={18} color="#3b82f6" />
          </TouchableOpacity>
        </Animated.View>

        {/* Citizen Info */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center mb-3">
            <User size={20} color="#8b5cf6" />
            <Text className="text-gray-900 font-bold text-lg ml-2">Reported By</Text>
          </View>
          
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center">
              <Text className="text-purple-600 font-bold text-lg">
                {task.citizen.name.charAt(0)}
              </Text>
            </View>
            
            <View className="ml-3 flex-1">
              <Text className="text-gray-900 font-semibold">{task.citizen.name}</Text>
              <View className="flex-row items-center">
                <Star size={14} color="#fbbf24" fill="#fbbf24" />
                <Text className="text-gray-500 text-sm ml-1">{task.citizen.rating}</Text>
              </View>
            </View>
            
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-green-100 items-center justify-center"
                onPress={handleCall}
              >
                <Phone size={18} color="#22c55e" />
              </TouchableOpacity>
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center"
                onPress={handleChat}
              >
                <MessageCircle size={18} color="#8b5cf6" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Instructions */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center mb-3">
            <CheckCircle size={20} color="#22c55e" />
            <Text className="text-gray-900 font-bold text-lg ml-2">Instructions</Text>
          </View>
          
          {task.instructions.map((instruction, index) => (
            <View key={index} className="flex-row items-start mb-2">
              <View className="w-6 h-6 rounded-full bg-green-100 items-center justify-center mr-3 mt-0.5">
                <Text className="text-green-600 text-xs font-bold">{index + 1}</Text>
              </View>
              <Text className="text-gray-600 flex-1">{instruction}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Required Materials */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center mb-3">
            <Package size={20} color="#f59e0b" />
            <Text className="text-gray-900 font-bold text-lg ml-2">Required Materials</Text>
          </View>
          
          {task.materials.map((material, index) => (
            <View key={index} className="flex-row items-center py-2 border-b border-gray-100 last:border-0">
              <View className="w-2 h-2 rounded-full bg-amber-400 mr-3" />
              <Text className="text-gray-600">{material}</Text>
            </View>
          ))}
        </Animated.View>

        {/* History */}
        <Animated.View
          entering={FadeInDown.delay(700).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center mb-3">
            <History size={20} color="#6b7280" />
            <Text className="text-gray-900 font-bold text-lg ml-2">History</Text>
          </View>
          
          {task.history.map((item, index) => (
            <View key={item.id} className="flex-row items-start mb-3 last:mb-0">
              <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
                <Clock size={14} color="#6b7280" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">{item.action}</Text>
                <Text className="text-gray-500 text-sm">
                  {item.time} • by {item.by}
                </Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Report Issue Button */}
        <Animated.View
          entering={FadeInDown.delay(800).springify()}
        >
          <TouchableOpacity
            className="bg-red-50 rounded-2xl p-4 flex-row items-center justify-center"
            onPress={handleReportIssue}
          >
            <Flag size={18} color="#ef4444" />
            <Text className="text-red-500 font-medium ml-2">Report an Issue</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Start Work Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4">
        <TouchableOpacity
          className="bg-green-500 rounded-2xl py-4 flex-row items-center justify-center"
          onPress={handleStartWork}
        >
          <Play size={24} color="#fff" fill="#fff" />
          <Text className="text-white font-bold text-lg ml-2">
            {task.status === 'in-progress' ? 'Continue Work' : 'Start Work'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
