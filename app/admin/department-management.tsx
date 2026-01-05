import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StatusBar,
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
  Building2,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Settings,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Edit,
  UserPlus,
  Star,
  Calendar,
  X,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Department {
  id: string;
  name: string;
  head: {
    name: string;
    email: string;
    phone: string;
  };
  employees: number;
  activeComplaints: number;
  resolvedThisMonth: number;
  avgResolutionTime: string;
  efficiency: number;
  rating: number;
  budget: {
    allocated: number;
    spent: number;
  };
  categories: string[];
  recentActivity: Array<{
    type: string;
    description: string;
    time: string;
  }>;
}

export default function DepartmentManagementScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const stats = {
    totalDepartments: 8,
    totalEmployees: 520,
    avgEfficiency: 85,
    activeComplaints: 422,
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockDepartments: Department[] = [
      {
        id: '1',
        name: 'Water Supply',
        head: {
          name: 'Dr. Ramesh Patel',
          email: 'ramesh.patel@municipal.gov',
          phone: '+91 98765 43210',
        },
        employees: 85,
        activeComplaints: 35,
        resolvedThisMonth: 285,
        avgResolutionTime: '2.1 days',
        efficiency: 92,
        rating: 4.5,
        budget: {
          allocated: 5000000,
          spent: 3200000,
        },
        categories: ['Water Leakage', 'No Water Supply', 'Water Quality', 'Pipeline Issues'],
        recentActivity: [
          { type: 'resolved', description: 'Major pipeline repair completed', time: '2 hours ago' },
          { type: 'assigned', description: 'Emergency task assigned', time: '4 hours ago' },
        ],
      },
      {
        id: '2',
        name: 'Sanitation',
        head: {
          name: 'Mrs. Priya Sharma',
          email: 'priya.sharma@municipal.gov',
          phone: '+91 87654 32109',
        },
        employees: 120,
        activeComplaints: 30,
        resolvedThisMonth: 250,
        avgResolutionTime: '1.8 days',
        efficiency: 95,
        rating: 4.7,
        budget: {
          allocated: 8000000,
          spent: 5500000,
        },
        categories: ['Garbage Collection', 'Street Cleaning', 'Drain Cleaning', 'Public Toilets'],
        recentActivity: [
          { type: 'resolved', description: 'Zone 5 cleaning completed', time: '1 hour ago' },
          { type: 'new', description: 'New complaint received', time: '3 hours ago' },
        ],
      },
      {
        id: '3',
        name: 'Roads & Infrastructure',
        head: {
          name: 'Mr. Vikram Singh',
          email: 'vikram.singh@municipal.gov',
          phone: '+91 76543 21098',
        },
        employees: 95,
        activeComplaints: 65,
        resolvedThisMonth: 180,
        avgResolutionTime: '3.5 days',
        efficiency: 73,
        rating: 4.0,
        budget: {
          allocated: 15000000,
          spent: 12000000,
        },
        categories: ['Potholes', 'Road Repair', 'Footpath', 'Traffic Signs'],
        recentActivity: [
          { type: 'in_progress', description: 'Main road resurfacing', time: '5 hours ago' },
          { type: 'assigned', description: 'Pothole repair assigned', time: '6 hours ago' },
        ],
      },
      {
        id: '4',
        name: 'Electrical',
        head: {
          name: 'Mr. Sunil Kumar',
          email: 'sunil.kumar@municipal.gov',
          phone: '+91 65432 10987',
        },
        employees: 60,
        activeComplaints: 20,
        resolvedThisMonth: 160,
        avgResolutionTime: '2.2 days',
        efficiency: 88,
        rating: 4.3,
        budget: {
          allocated: 4000000,
          spent: 2800000,
        },
        categories: ['Street Lighting', 'Power Outage', 'Electrical Hazards'],
        recentActivity: [
          { type: 'resolved', description: 'Street light repair completed', time: '30 mins ago' },
        ],
      },
      {
        id: '5',
        name: 'Building & Planning',
        head: {
          name: 'Mr. Anil Mehta',
          email: 'anil.mehta@municipal.gov',
          phone: '+91 54321 09876',
        },
        employees: 45,
        activeComplaints: 15,
        resolvedThisMonth: 95,
        avgResolutionTime: '5.0 days',
        efficiency: 78,
        rating: 4.1,
        budget: {
          allocated: 3000000,
          spent: 1800000,
        },
        categories: ['Building Permits', 'Illegal Construction', 'Building Safety'],
        recentActivity: [
          { type: 'new', description: 'Building inspection scheduled', time: '2 hours ago' },
        ],
      },
    ];

    setDepartments(mockDepartments);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadDepartments();
    setRefreshing(false);
  }, []);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return '#22c55e';
    if (efficiency >= 75) return '#f59e0b';
    return '#ef4444';
  };

  const formatBudget = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const renderDepartmentCard = (department: Department, index: number) => (
    <Animated.View
      key={department.id}
      entering={FadeInDown.delay(index * 100).springify()}
    >
      <TouchableOpacity
        className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        onPress={() => {
          setSelectedDepartment(department);
          setShowDetailsModal(true);
        }}
      >
        {/* Header */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 rounded-xl bg-blue-100 items-center justify-center mr-3">
              <Building2 size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-lg">{department.name}</Text>
              <Text className="text-gray-500 text-sm">Head: {department.head.name}</Text>
            </View>
          </View>

          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: getEfficiencyColor(department.efficiency) + '20' }}
          >
            <Text style={{ color: getEfficiencyColor(department.efficiency) }} className="font-bold">
              {department.efficiency}%
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between mb-3">
          <View className="items-center">
            <Text className="text-gray-500 text-xs">Employees</Text>
            <Text className="text-gray-900 font-bold">{department.employees}</Text>
          </View>

          <View className="items-center">
            <Text className="text-gray-500 text-xs">Active</Text>
            <Text className="text-amber-600 font-bold">{department.activeComplaints}</Text>
          </View>

          <View className="items-center">
            <Text className="text-gray-500 text-xs">Resolved</Text>
            <Text className="text-green-600 font-bold">{department.resolvedThisMonth}</Text>
          </View>

          <View className="items-center">
            <Text className="text-gray-500 text-xs">Avg Time</Text>
            <Text className="text-gray-900 font-bold">{department.avgResolutionTime}</Text>
          </View>
        </View>

        {/* Rating */}
        <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
          <View className="flex-row items-center">
            <Star size={16} color="#f59e0b" fill="#f59e0b" />
            <Text className="text-gray-700 font-medium ml-1">{department.rating}</Text>
            <Text className="text-gray-400 text-sm ml-1">rating</Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text-gray-500 text-sm">
              Budget: {formatBudget(department.budget.spent)} / {formatBudget(department.budget.allocated)}
            </Text>
          </View>
        </View>

        {/* Recent Activity */}
        {department.recentActivity.length > 0 && (
          <View className="mt-3 pt-3 border-t border-gray-100">
            <Text className="text-gray-500 text-xs mb-2">Recent Activity</Text>
            <Text className="text-gray-600 text-sm">
              {department.recentActivity[0].description}
              <Text className="text-gray-400"> • {department.recentActivity[0].time}</Text>
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['#0284c7', '#0ea5e9']}
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

          <Text className="text-white text-lg font-semibold">Departments</Text>

          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            onPress={() => router.push('/admin/add-department')}
          >
            <UserPlus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between">
          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mb-1">
              <Building2 size={18} color="#fff" />
            </View>
            <Text className="text-white font-bold">{stats.totalDepartments}</Text>
            <Text className="text-white/70 text-xs">Departments</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mb-1">
              <Users size={18} color="#fff" />
            </View>
            <Text className="text-white font-bold">{stats.totalEmployees}</Text>
            <Text className="text-white/70 text-xs">Employees</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-green-400/30 items-center justify-center mb-1">
              <TrendingUp size={18} color="#86efac" />
            </View>
            <Text className="text-white font-bold">{stats.avgEfficiency}%</Text>
            <Text className="text-white/70 text-xs">Efficiency</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-amber-400/30 items-center justify-center mb-1">
              <FileText size={18} color="#fcd34d" />
            </View>
            <Text className="text-white font-bold">{stats.activeComplaints}</Text>
            <Text className="text-white/70 text-xs">Active</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {loading ? (
          <View className="items-center py-10">
            <Building2 size={48} color="#0284c7" />
            <Text className="text-gray-500 mt-4">Loading departments...</Text>
          </View>
        ) : (
          departments.map((dept, index) => renderDepartmentCard(dept, index))
        )}
      </ScrollView>

      {/* Department Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          {selectedDepartment && (
            <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-gray-900 font-bold text-xl">{selectedDepartment.name}</Text>
                <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Efficiency Badge */}
                <View className="items-center mb-6">
                  <View
                    className="w-24 h-24 rounded-full items-center justify-center"
                    style={{ backgroundColor: getEfficiencyColor(selectedDepartment.efficiency) + '20' }}
                  >
                    <Text
                      style={{ color: getEfficiencyColor(selectedDepartment.efficiency) }}
                      className="font-bold text-3xl"
                    >
                      {selectedDepartment.efficiency}%
                    </Text>
                  </View>
                  <Text className="text-gray-500 mt-2">Efficiency Rating</Text>

                  <View className="flex-row items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        color="#f59e0b"
                        fill={star <= Math.floor(selectedDepartment.rating) ? '#f59e0b' : 'transparent'}
                      />
                    ))}
                    <Text className="text-gray-600 ml-2">{selectedDepartment.rating}</Text>
                  </View>
                </View>

                {/* Department Head */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <Text className="text-gray-700 font-medium mb-3">Department Head</Text>
                  <View className="flex-row items-center mb-2">
                    <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                      <Text className="text-blue-600 font-bold">
                        {selectedDepartment.head.name.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-gray-900 font-medium">{selectedDepartment.head.name}</Text>
                      <Text className="text-gray-500 text-sm">{selectedDepartment.head.email}</Text>
                    </View>
                  </View>

                  <View className="flex-row gap-2 mt-3">
                    <TouchableOpacity className="flex-1 bg-blue-100 py-2 rounded-xl flex-row items-center justify-center">
                      <Phone size={16} color="#3b82f6" />
                      <Text className="text-blue-600 font-medium ml-2">Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-1 bg-green-100 py-2 rounded-xl flex-row items-center justify-center">
                      <Mail size={16} color="#22c55e" />
                      <Text className="text-green-600 font-medium ml-2">Email</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Statistics */}
                <View className="flex-row flex-wrap gap-3 mb-4">
                  <View className="bg-blue-50 rounded-xl p-3 flex-1 min-w-[45%]">
                    <Users size={20} color="#3b82f6" />
                    <Text className="text-blue-700 font-bold text-xl mt-2">
                      {selectedDepartment.employees}
                    </Text>
                    <Text className="text-blue-600 text-sm">Employees</Text>
                  </View>

                  <View className="bg-amber-50 rounded-xl p-3 flex-1 min-w-[45%]">
                    <FileText size={20} color="#f59e0b" />
                    <Text className="text-amber-700 font-bold text-xl mt-2">
                      {selectedDepartment.activeComplaints}
                    </Text>
                    <Text className="text-amber-600 text-sm">Active Complaints</Text>
                  </View>

                  <View className="bg-green-50 rounded-xl p-3 flex-1 min-w-[45%]">
                    <CheckCircle size={20} color="#22c55e" />
                    <Text className="text-green-700 font-bold text-xl mt-2">
                      {selectedDepartment.resolvedThisMonth}
                    </Text>
                    <Text className="text-green-600 text-sm">Resolved This Month</Text>
                  </View>

                  <View className="bg-purple-50 rounded-xl p-3 flex-1 min-w-[45%]">
                    <Clock size={20} color="#8b5cf6" />
                    <Text className="text-purple-700 font-bold text-xl mt-2">
                      {selectedDepartment.avgResolutionTime}
                    </Text>
                    <Text className="text-purple-600 text-sm">Avg Resolution</Text>
                  </View>
                </View>

                {/* Budget */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <Text className="text-gray-700 font-medium mb-3">Budget Utilization</Text>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">
                      Spent: {formatBudget(selectedDepartment.budget.spent)}
                    </Text>
                    <Text className="text-gray-600">
                      Total: {formatBudget(selectedDepartment.budget.allocated)}
                    </Text>
                  </View>
                  <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(selectedDepartment.budget.spent / selectedDepartment.budget.allocated) * 100}%`,
                      }}
                    />
                  </View>
                  <Text className="text-gray-500 text-sm mt-2 text-center">
                    {Math.round((selectedDepartment.budget.spent / selectedDepartment.budget.allocated) * 100)}% utilized
                  </Text>
                </View>

                {/* Categories */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <Text className="text-gray-700 font-medium mb-3">Handled Categories</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {selectedDepartment.categories.map((category) => (
                      <View key={category} className="bg-white px-3 py-1.5 rounded-full border border-gray-200">
                        <Text className="text-gray-600 text-sm">{category}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Recent Activity */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <Text className="text-gray-700 font-medium mb-3">Recent Activity</Text>
                  {selectedDepartment.recentActivity.map((activity, index) => (
                    <View
                      key={index}
                      className={`flex-row items-start ${
                        index < selectedDepartment.recentActivity.length - 1 ? 'mb-3 pb-3 border-b border-gray-200' : ''
                      }`}
                    >
                      <View
                        className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                          activity.type === 'resolved'
                            ? 'bg-green-500'
                            : activity.type === 'assigned'
                            ? 'bg-blue-500'
                            : activity.type === 'in_progress'
                            ? 'bg-purple-500'
                            : 'bg-amber-500'
                        }`}
                      />
                      <View className="flex-1">
                        <Text className="text-gray-600">{activity.description}</Text>
                        <Text className="text-gray-400 text-sm">{activity.time}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Actions */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 bg-gray-100 rounded-xl py-4 flex-row items-center justify-center"
                    onPress={() => {
                      setShowDetailsModal(false);
                      router.push({
                        pathname: '/admin/edit-department',
                        params: { id: selectedDepartment.id },
                      });
                    }}
                  >
                    <Edit size={18} color="#6b7280" />
                    <Text className="text-gray-700 font-semibold ml-2">Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 bg-blue-500 rounded-xl py-4 flex-row items-center justify-center"
                    onPress={() => {
                      setShowDetailsModal(false);
                      router.push({
                        pathname: '/admin/department-analytics',
                        params: { id: selectedDepartment.id },
                      });
                    }}
                  >
                    <BarChart3 size={18} color="#fff" />
                    <Text className="text-white font-semibold ml-2">Analytics</Text>
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
