import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  StatusBar,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  Play,
  Pause,
  Square,
  Camera,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  FileText,
  Upload,
  X,
  Plus,
  Navigation,
  Phone,
  MessageCircle,
  Timer,
  Zap,
  Send,
  ChevronRight,
  Image as ImageIcon,
  Mic,
  Video,
  Wrench,
  Box,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

interface Photo {
  id: string;
  uri: string;
  type: 'before' | 'during' | 'after';
  caption: string;
  timestamp: string;
}

type WorkStatus = 'not-started' | 'in-progress' | 'paused' | 'completed';

export default function WorkSessionScreen() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  
  const [workStatus, setWorkStatus] = useState<WorkStatus>('not-started');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [notes, setNotes] = useState('');
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [currentPhotoType, setCurrentPhotoType] = useState<'before' | 'during' | 'after'>('before');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useSharedValue(1);
  
  // Material form state
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    quantity: '',
    unit: 'pieces',
  });

  // Task data (would come from API)
  const task = {
    id: taskId,
    complaintId: 'CMP-2024-0892',
    title: 'Water pipe burst on Main Street',
    category: 'Water Supply',
    categoryEmoji: '💧',
    priority: 'critical',
    location: {
      address: '123 Main Street, Ward 5',
      coordinates: { lat: 23.0225, lng: 72.5714 },
    },
    citizen: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
    },
  };

  useEffect(() => {
    // Get current location
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      }
    })();
  }, []);

  useEffect(() => {
    if (workStatus === 'in-progress') {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      // Pulse animation for active state
      pulseAnim.value = withRepeat(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      pulseAnim.value = withTiming(1);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [workStatus]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWork = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (photos.filter(p => p.type === 'before').length === 0) {
      Alert.alert(
        'Before Photo Required',
        'Please take at least one "Before" photo before starting work.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setWorkStatus('in-progress');
  };

  const handlePauseWork = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setWorkStatus('paused');
  };

  const handleResumeWork = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setWorkStatus('in-progress');
  };

  const handleCompleteWork = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (photos.filter(p => p.type === 'after').length === 0) {
      Alert.alert(
        'After Photo Required',
        'Please take at least one "After" photo to complete the work.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setShowCompletionModal(true);
  };

  const handleTakePhoto = async (type: 'before' | 'during' | 'after') => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newPhoto: Photo = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        type,
        caption: '',
        timestamp: new Date().toISOString(),
      };
      setPhotos(prev => [...prev, newPhoto]);
    }
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.quantity) {
      Alert.alert('Error', 'Please fill in all material details');
      return;
    }

    const material: Material = {
      id: Date.now().toString(),
      name: newMaterial.name,
      quantity: parseInt(newMaterial.quantity),
      unit: newMaterial.unit,
    };

    setMaterials(prev => [...prev, material]);
    setNewMaterial({ name: '', quantity: '', unit: 'pieces' });
    setShowMaterialModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmitCompletion = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Submit work completion data
    const completionData = {
      taskId,
      elapsedTime,
      photos,
      materials,
      notes,
      location,
      completedAt: new Date().toISOString(),
    };
    
    console.log('Submitting completion:', completionData);
    
    setShowCompletionModal(false);
    setWorkStatus('completed');
    
    // Navigate to confirmation
    router.replace({
      pathname: '/employee/task-completed',
      params: { taskId },
    });
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const getStatusColor = () => {
    switch (workStatus) {
      case 'not-started':
        return '#f59e0b';
      case 'in-progress':
        return '#22c55e';
      case 'paused':
        return '#3b82f6';
      case 'completed':
        return '#8b5cf6';
    }
  };

  const getStatusLabel = () => {
    switch (workStatus) {
      case 'not-started':
        return 'Ready to Start';
      case 'in-progress':
        return 'Work in Progress';
      case 'paused':
        return 'Paused';
      case 'completed':
        return 'Completed';
    }
  };

  const renderPhotoSection = (type: 'before' | 'during' | 'after', title: string) => {
    const typePhotos = photos.filter(p => p.type === type);
    const isRequired = type === 'before' || type === 'after';
    const canTake = 
      type === 'before' ? workStatus === 'not-started' :
      type === 'during' ? workStatus === 'in-progress' :
      workStatus === 'in-progress' || workStatus === 'paused';

    return (
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Text className="text-gray-900 font-semibold">{title}</Text>
            {isRequired && (
              <View className="bg-red-100 px-2 py-0.5 rounded ml-2">
                <Text className="text-red-600 text-xs">Required</Text>
              </View>
            )}
          </View>
          <Text className="text-gray-500 text-sm">{typePhotos.length} photos</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            {typePhotos.map((photo, index) => (
              <View key={photo.id} className="relative">
                <Image
                  source={{ uri: photo.uri }}
                  className="w-24 h-24 rounded-xl"
                  contentFit="cover"
                />
                <TouchableOpacity
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                  onPress={() => handleRemovePhoto(photo.id)}
                >
                  <X size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            
            {canTake && (
              <TouchableOpacity
                className="w-24 h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 items-center justify-center"
                onPress={() => handleTakePhoto(type)}
              >
                <Camera size={24} color="#6b7280" />
                <Text className="text-gray-500 text-xs mt-1">Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={[getStatusColor(), getStatusColor()]}
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
          
          <View className="flex-row items-center">
            <View className="bg-white/20 px-3 py-1.5 rounded-full">
              <Text className="text-white text-sm font-medium">
                {getStatusLabel()}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            onPress={() => {/* Open options */}}
          >
            <MessageCircle size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Task Info */}
        <View className="bg-white/20 rounded-2xl p-4 mb-4">
          <View className="flex-row items-center mb-2">
            <Text className="text-3xl mr-3">{task.categoryEmoji}</Text>
            <View className="flex-1">
              <Text className="text-white/70 text-sm">{task.complaintId}</Text>
              <Text className="text-white font-semibold text-lg" numberOfLines={2}>
                {task.title}
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center">
            <MapPin size={14} color="rgba(255,255,255,0.7)" />
            <Text className="text-white/70 text-sm ml-1 flex-1" numberOfLines={1}>
              {task.location.address}
            </Text>
          </View>
        </View>

        {/* Timer */}
        <Animated.View 
          style={workStatus === 'in-progress' ? pulseStyle : {}}
          className="items-center"
        >
          <View className="bg-white rounded-3xl px-8 py-4 shadow-lg">
            <View className="flex-row items-center justify-center">
              <Timer size={24} color={getStatusColor()} />
              <Text 
                className="text-4xl font-bold ml-3"
                style={{ color: getStatusColor() }}
              >
                {formatTime(elapsedTime)}
              </Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        {/* Control Buttons */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          className="flex-row gap-3 mb-6"
        >
          {workStatus === 'not-started' && (
            <TouchableOpacity
              className="flex-1 bg-green-500 rounded-2xl py-4 flex-row items-center justify-center"
              onPress={handleStartWork}
            >
              <Play size={24} color="#fff" fill="#fff" />
              <Text className="text-white font-bold text-lg ml-2">Start Work</Text>
            </TouchableOpacity>
          )}
          
          {workStatus === 'in-progress' && (
            <>
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-2xl py-4 flex-row items-center justify-center"
                onPress={handlePauseWork}
              >
                <Pause size={24} color="#fff" />
                <Text className="text-white font-bold text-lg ml-2">Pause</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-1 bg-green-500 rounded-2xl py-4 flex-row items-center justify-center"
                onPress={handleCompleteWork}
              >
                <CheckCircle size={24} color="#fff" />
                <Text className="text-white font-bold text-lg ml-2">Complete</Text>
              </TouchableOpacity>
            </>
          )}
          
          {workStatus === 'paused' && (
            <>
              <TouchableOpacity
                className="flex-1 bg-green-500 rounded-2xl py-4 flex-row items-center justify-center"
                onPress={handleResumeWork}
              >
                <Play size={24} color="#fff" fill="#fff" />
                <Text className="text-white font-bold text-lg ml-2">Resume</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-1 bg-purple-500 rounded-2xl py-4 flex-row items-center justify-center"
                onPress={handleCompleteWork}
              >
                <CheckCircle size={24} color="#fff" />
                <Text className="text-white font-bold text-lg ml-2">Complete</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>

        {/* Photo Documentation */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center mb-4">
            <Camera size={20} color="#3b82f6" />
            <Text className="text-gray-900 font-bold text-lg ml-2">Photo Documentation</Text>
          </View>
          
          {renderPhotoSection('before', 'Before Work')}
          {renderPhotoSection('during', 'During Work')}
          {renderPhotoSection('after', 'After Work')}
        </Animated.View>

        {/* Materials Used */}
        <Animated.View 
          entering={FadeInDown.delay(300).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Package size={20} color="#f59e0b" />
              <Text className="text-gray-900 font-bold text-lg ml-2">Materials Used</Text>
            </View>
            
            <TouchableOpacity
              className="flex-row items-center bg-amber-100 px-3 py-1.5 rounded-full"
              onPress={() => setShowMaterialModal(true)}
            >
              <Plus size={16} color="#f59e0b" />
              <Text className="text-amber-600 font-medium text-sm ml-1">Add</Text>
            </TouchableOpacity>
          </View>

          {materials.length === 0 ? (
            <View className="bg-gray-50 rounded-xl p-4 items-center">
              <Box size={32} color="#9ca3af" />
              <Text className="text-gray-500 text-sm mt-2">No materials added yet</Text>
            </View>
          ) : (
            <View className="gap-2">
              {materials.map((material, index) => (
                <View
                  key={material.id}
                  className="flex-row items-center justify-between bg-gray-50 rounded-xl p-3"
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-amber-100 items-center justify-center">
                      <Wrench size={18} color="#f59e0b" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-gray-900 font-medium">{material.name}</Text>
                      <Text className="text-gray-500 text-sm">
                        {material.quantity} {material.unit}
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => handleRemoveMaterial(material.id)}
                  >
                    <X size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Work Notes */}
        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center mb-4">
            <FileText size={20} color="#8b5cf6" />
            <Text className="text-gray-900 font-bold text-lg ml-2">Work Notes</Text>
          </View>
          
          <TextInput
            className="bg-gray-50 rounded-xl p-4 text-gray-900 min-h-[120px]"
            placeholder="Add notes about the work performed, issues encountered, etc."
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          entering={FadeInDown.delay(500).springify()}
          className="flex-row gap-3"
        >
          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl p-4 shadow-sm items-center"
            onPress={() => router.push('/map-view')}
          >
            <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-2">
              <Navigation size={24} color="#3b82f6" />
            </View>
            <Text className="text-gray-900 font-medium">Navigate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl p-4 shadow-sm items-center"
            onPress={() => {/* Call citizen */}}
          >
            <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mb-2">
              <Phone size={24} color="#22c55e" />
            </View>
            <Text className="text-gray-900 font-medium">Call Citizen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-white rounded-2xl p-4 shadow-sm items-center"
            onPress={() => router.push('/chat')}
          >
            <View className="w-12 h-12 rounded-full bg-purple-100 items-center justify-center mb-2">
              <MessageCircle size={24} color="#8b5cf6" />
            </View>
            <Text className="text-gray-900 font-medium">Message</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Material Modal */}
      <Modal
        visible={showMaterialModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMaterialModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-900 font-bold text-xl">Add Material</Text>
              <TouchableOpacity onPress={() => setShowMaterialModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Material Name</Text>
              <TextInput
                className="bg-gray-100 rounded-xl p-4 text-gray-900"
                placeholder="e.g., PVC Pipe, Cement, etc."
                placeholderTextColor="#9ca3af"
                value={newMaterial.name}
                onChangeText={(text) => setNewMaterial(prev => ({ ...prev, name: text }))}
              />
            </View>

            <View className="flex-row gap-3 mb-6">
              <View className="flex-1">
                <Text className="text-gray-700 font-medium mb-2">Quantity</Text>
                <TextInput
                  className="bg-gray-100 rounded-xl p-4 text-gray-900"
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  value={newMaterial.quantity}
                  onChangeText={(text) => setNewMaterial(prev => ({ ...prev, quantity: text }))}
                />
              </View>
              
              <View className="flex-1">
                <Text className="text-gray-700 font-medium mb-2">Unit</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {['pieces', 'meters', 'kg', 'liters', 'bags'].map((unit) => (
                      <TouchableOpacity
                        key={unit}
                        className={`px-4 py-3 rounded-xl ${
                          newMaterial.unit === unit ? 'bg-blue-500' : 'bg-gray-100'
                        }`}
                        onPress={() => setNewMaterial(prev => ({ ...prev, unit }))}
                      >
                        <Text className={newMaterial.unit === unit ? 'text-white' : 'text-gray-700'}>
                          {unit}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity
              className="bg-blue-500 rounded-xl py-4 items-center"
              onPress={handleAddMaterial}
            >
              <Text className="text-white font-bold text-lg">Add Material</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Completion Modal */}
      <Modal
        visible={showCompletionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="items-center mb-6">
              <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-4">
                <CheckCircle size={40} color="#22c55e" />
              </View>
              <Text className="text-gray-900 font-bold text-2xl">Complete Task?</Text>
              <Text className="text-gray-500 text-center mt-2">
                You're about to mark this task as completed. Make sure all work is done.
              </Text>
            </View>

            {/* Summary */}
            <View className="bg-gray-50 rounded-2xl p-4 mb-6">
              <Text className="text-gray-900 font-semibold mb-3">Work Summary</Text>
              
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600">Time Spent</Text>
                <Text className="text-gray-900 font-medium">{formatTime(elapsedTime)}</Text>
              </View>
              
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600">Photos Taken</Text>
                <Text className="text-gray-900 font-medium">{photos.length}</Text>
              </View>
              
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600">Materials Used</Text>
                <Text className="text-gray-900 font-medium">{materials.length}</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600">Notes Added</Text>
                <Text className="text-gray-900 font-medium">{notes ? 'Yes' : 'No'}</Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
                onPress={() => setShowCompletionModal(false)}
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-1 bg-green-500 rounded-xl py-4 items-center"
                onPress={handleSubmitCompletion}
              >
                <Text className="text-white font-semibold">Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
