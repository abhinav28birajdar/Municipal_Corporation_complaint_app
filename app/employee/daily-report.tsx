import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Dimensions,
  StatusBar,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
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
  FileText,
  CheckCircle,
  Clock,
  MapPin,
  Camera,
  AlertTriangle,
  Send,
  Plus,
  X,
  ChevronDown,
  Calendar,
  Package,
  Wrench,
  Timer,
  User,
  Car,
  Fuel,
  AlertCircle,
  MessageSquare,
  Save,
  History,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface CompletedTask {
  id: string;
  title: string;
  category: string;
  emoji: string;
  timeSpent: string;
  location: string;
  status: 'completed' | 'partial' | 'cancelled';
}

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

interface Issue {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export default function DailyReportScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  
  // Report data
  const [date] = useState(new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }));
  
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([
    {
      id: '1',
      title: 'Water pipe burst repair',
      category: 'Water Supply',
      emoji: '💧',
      timeSpent: '2h 30m',
      location: '123 Main Street',
      status: 'completed',
    },
    {
      id: '2',
      title: 'Street light installation',
      category: 'Street Lighting',
      emoji: '💡',
      timeSpent: '1h 15m',
      location: 'Gandhi Nagar',
      status: 'completed',
    },
    {
      id: '3',
      title: 'Drainage cleaning',
      category: 'Drainage',
      emoji: '🚿',
      timeSpent: '45m',
      location: 'Sector 21',
      status: 'partial',
    },
  ]);
  
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', name: 'PVC Pipe (2 inch)', quantity: 3, unit: 'meters' },
    { id: '2', name: 'LED Bulb (100W)', quantity: 2, unit: 'pieces' },
  ]);
  
  const [issues, setIssues] = useState<Issue[]>([
    { id: '1', description: 'Need additional equipment for drainage work', severity: 'medium' },
  ]);
  
  const [notes, setNotes] = useState('');
  const [vehicleKm, setVehicleKm] = useState({ start: '12450', end: '12485' });
  const [fuelUsed, setFuelUsed] = useState('');
  
  // Modal form state
  const [newMaterial, setNewMaterial] = useState({ name: '', quantity: '', unit: 'pieces' });
  const [newIssue, setNewIssue] = useState({ description: '', severity: 'medium' as 'low' | 'medium' | 'high' });

  const stats = {
    totalTasks: completedTasks.length,
    completedCount: completedTasks.filter(t => t.status === 'completed').length,
    totalTime: '4h 30m',
    kmTraveled: parseInt(vehicleKm.end) - parseInt(vehicleKm.start) || 0,
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

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

  const handleAddIssue = () => {
    if (!newIssue.description) {
      Alert.alert('Error', 'Please describe the issue');
      return;
    }

    const issue: Issue = {
      id: Date.now().toString(),
      description: newIssue.description,
      severity: newIssue.severity,
    };

    setIssues(prev => [...prev, issue]);
    setNewIssue({ description: '', severity: 'medium' });
    setShowIssueModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleRemoveIssue = (id: string) => {
    setIssues(prev => prev.filter(i => i.id !== id));
  };

  const handleSaveDraft = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Saved', 'Your report has been saved as a draft.');
  };

  const handleSubmitReport = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const reportData = {
      date,
      completedTasks,
      materials,
      issues,
      notes,
      vehicleKm,
      fuelUsed,
      submittedAt: new Date().toISOString(),
    };
    
    console.log('Submitting report:', reportData);
    
    Alert.alert(
      'Report Submitted',
      'Your daily report has been submitted successfully.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return { bg: 'bg-red-100', text: 'text-red-600' };
      case 'medium':
        return { bg: 'bg-amber-100', text: 'text-amber-600' };
      default:
        return { bg: 'bg-blue-100', text: 'text-blue-600' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'partial':
        return { bg: 'bg-amber-100', text: 'text-amber-600' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
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
          
          <Text className="text-white text-lg font-semibold">Daily Report</Text>
          
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            onPress={() => router.push('/employee/report-history')}
          >
            <History size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Date */}
        <View className="flex-row items-center justify-center">
          <Calendar size={18} color="rgba(255,255,255,0.8)" />
          <Text className="text-white/80 text-sm ml-2">{date}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        {/* Summary Stats */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="flex-row gap-3 mb-6"
        >
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm items-center">
            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mb-2">
              <CheckCircle size={20} color="#22c55e" />
            </View>
            <Text className="text-gray-900 text-xl font-bold">{stats.completedCount}</Text>
            <Text className="text-gray-500 text-xs">Completed</Text>
          </View>
          
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm items-center">
            <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mb-2">
              <Timer size={20} color="#3b82f6" />
            </View>
            <Text className="text-gray-900 text-xl font-bold">{stats.totalTime}</Text>
            <Text className="text-gray-500 text-xs">Work Time</Text>
          </View>
          
          <View className="flex-1 bg-white rounded-2xl p-4 shadow-sm items-center">
            <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mb-2">
              <Car size={20} color="#8b5cf6" />
            </View>
            <Text className="text-gray-900 text-xl font-bold">{stats.kmTraveled}</Text>
            <Text className="text-gray-500 text-xs">KM Traveled</Text>
          </View>
        </Animated.View>

        {/* Completed Tasks */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <CheckCircle size={20} color="#22c55e" />
              <Text className="text-gray-900 font-bold text-lg ml-2">Tasks Completed</Text>
            </View>
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-600 font-medium text-sm">
                {stats.completedCount}/{stats.totalTasks}
              </Text>
            </View>
          </View>

          {completedTasks.map((task, index) => {
            const statusStyle = getStatusColor(task.status);
            return (
              <View
                key={task.id}
                className={`flex-row items-start p-3 rounded-xl bg-gray-50 ${
                  index !== completedTasks.length - 1 ? 'mb-3' : ''
                }`}
              >
                <View className="w-10 h-10 rounded-xl bg-white items-center justify-center mr-3">
                  <Text className="text-xl">{task.emoji}</Text>
                </View>
                
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium" numberOfLines={1}>
                    {task.title}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <MapPin size={12} color="#6b7280" />
                    <Text className="text-gray-500 text-xs ml-1">{task.location}</Text>
                    <Text className="text-gray-300 mx-2">•</Text>
                    <Clock size={12} color="#6b7280" />
                    <Text className="text-gray-500 text-xs ml-1">{task.timeSpent}</Text>
                  </View>
                </View>
                
                <View className={`px-2 py-1 rounded-full ${statusStyle.bg}`}>
                  <Text className={`text-xs font-medium capitalize ${statusStyle.text}`}>
                    {task.status}
                  </Text>
                </View>
              </View>
            );
          })}
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
              <Wrench size={32} color="#9ca3af" />
              <Text className="text-gray-500 text-sm mt-2">No materials added</Text>
            </View>
          ) : (
            materials.map((material, index) => (
              <View
                key={material.id}
                className={`flex-row items-center justify-between p-3 bg-gray-50 rounded-xl ${
                  index !== materials.length - 1 ? 'mb-2' : ''
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center">
                    <Wrench size={16} color="#f59e0b" />
                  </View>
                  <View className="ml-3">
                    <Text className="text-gray-900 font-medium">{material.name}</Text>
                    <Text className="text-gray-500 text-xs">
                      {material.quantity} {material.unit}
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  className="p-2"
                  onPress={() => handleRemoveMaterial(material.id)}
                >
                  <X size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </Animated.View>

        {/* Issues/Challenges */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <AlertTriangle size={20} color="#ef4444" />
              <Text className="text-gray-900 font-bold text-lg ml-2">Issues Faced</Text>
            </View>
            
            <TouchableOpacity
              className="flex-row items-center bg-red-100 px-3 py-1.5 rounded-full"
              onPress={() => setShowIssueModal(true)}
            >
              <Plus size={16} color="#ef4444" />
              <Text className="text-red-600 font-medium text-sm ml-1">Add</Text>
            </TouchableOpacity>
          </View>

          {issues.length === 0 ? (
            <View className="bg-gray-50 rounded-xl p-4 items-center">
              <CheckCircle size={32} color="#22c55e" />
              <Text className="text-gray-500 text-sm mt-2">No issues reported</Text>
            </View>
          ) : (
            issues.map((issue, index) => {
              const severityStyle = getSeverityColor(issue.severity);
              return (
                <View
                  key={issue.id}
                  className={`flex-row items-start justify-between p-3 bg-gray-50 rounded-xl ${
                    index !== issues.length - 1 ? 'mb-2' : ''
                  }`}
                >
                  <View className="flex-row items-start flex-1">
                    <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mt-0.5">
                      <AlertCircle size={16} color="#ef4444" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-gray-900 font-medium">{issue.description}</Text>
                      <View className={`self-start px-2 py-0.5 rounded-full mt-1 ${severityStyle.bg}`}>
                        <Text className={`text-xs font-medium capitalize ${severityStyle.text}`}>
                          {issue.severity}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    className="p-2"
                    onPress={() => handleRemoveIssue(issue.id)}
                  >
                    <X size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </Animated.View>

        {/* Vehicle & Fuel */}
        <Animated.View
          entering={FadeInDown.delay(500).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center mb-4">
            <Car size={20} color="#8b5cf6" />
            <Text className="text-gray-900 font-bold text-lg ml-2">Vehicle Usage</Text>
          </View>

          <View className="flex-row gap-3 mb-3">
            <View className="flex-1">
              <Text className="text-gray-700 font-medium text-sm mb-2">Starting KM</Text>
              <TextInput
                className="bg-gray-100 rounded-xl p-3 text-gray-900"
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={vehicleKm.start}
                onChangeText={(text) => setVehicleKm(prev => ({ ...prev, start: text }))}
              />
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-700 font-medium text-sm mb-2">Ending KM</Text>
              <TextInput
                className="bg-gray-100 rounded-xl p-3 text-gray-900"
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
                value={vehicleKm.end}
                onChangeText={(text) => setVehicleKm(prev => ({ ...prev, end: text }))}
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-700 font-medium text-sm mb-2">Fuel Used (Liters)</Text>
            <View className="flex-row items-center">
              <TextInput
                className="flex-1 bg-gray-100 rounded-xl p-3 text-gray-900"
                placeholder="0.0"
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
                value={fuelUsed}
                onChangeText={setFuelUsed}
              />
              <View className="ml-3">
                <Fuel size={24} color="#8b5cf6" />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Additional Notes */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        >
          <View className="flex-row items-center mb-4">
            <MessageSquare size={20} color="#3b82f6" />
            <Text className="text-gray-900 font-bold text-lg ml-2">Additional Notes</Text>
          </View>

          <TextInput
            className="bg-gray-100 rounded-xl p-4 text-gray-900 min-h-[100px]"
            placeholder="Add any additional observations, suggestions, or comments..."
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4">
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 bg-gray-100 rounded-xl py-4 flex-row items-center justify-center"
            onPress={handleSaveDraft}
          >
            <Save size={20} color="#6b7280" />
            <Text className="text-gray-700 font-semibold ml-2">Save Draft</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="flex-1 bg-purple-500 rounded-xl py-4 flex-row items-center justify-center"
            onPress={handleSubmitReport}
          >
            <Send size={20} color="#fff" />
            <Text className="text-white font-semibold ml-2">Submit Report</Text>
          </TouchableOpacity>
        </View>
      </View>

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
                    {['pieces', 'meters', 'kg', 'liters'].map((unit) => (
                      <TouchableOpacity
                        key={unit}
                        className={`px-4 py-3 rounded-xl ${
                          newMaterial.unit === unit ? 'bg-amber-500' : 'bg-gray-100'
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
              className="bg-amber-500 rounded-xl py-4 items-center"
              onPress={handleAddMaterial}
            >
              <Text className="text-white font-bold text-lg">Add Material</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Issue Modal */}
      <Modal
        visible={showIssueModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIssueModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-900 font-bold text-xl">Report Issue</Text>
              <TouchableOpacity onPress={() => setShowIssueModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Description</Text>
              <TextInput
                className="bg-gray-100 rounded-xl p-4 text-gray-900 min-h-[100px]"
                placeholder="Describe the issue or challenge faced..."
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="top"
                value={newIssue.description}
                onChangeText={(text) => setNewIssue(prev => ({ ...prev, description: text }))}
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Severity</Text>
              <View className="flex-row gap-3">
                {(['low', 'medium', 'high'] as const).map((severity) => {
                  const style = getSeverityColor(severity);
                  return (
                    <TouchableOpacity
                      key={severity}
                      className={`flex-1 py-3 rounded-xl items-center ${
                        newIssue.severity === severity ? style.bg : 'bg-gray-100'
                      }`}
                      onPress={() => setNewIssue(prev => ({ ...prev, severity }))}
                    >
                      <Text
                        className={`font-medium capitalize ${
                          newIssue.severity === severity ? style.text : 'text-gray-700'
                        }`}
                      >
                        {severity}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity
              className="bg-red-500 rounded-xl py-4 items-center"
              onPress={handleAddIssue}
            >
              <Text className="text-white font-bold text-lg">Add Issue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
