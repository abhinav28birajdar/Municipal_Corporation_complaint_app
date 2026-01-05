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
  Modal,
  Alert,
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
  Search,
  Filter,
  Plus,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  MoreVertical,
  Mail,
  Phone,
  Building2,
  Shield,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  CheckCircle,
  X,
  Download,
  Upload,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'citizen' | 'employee' | 'department_head' | 'admin';
  department?: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar: string | null;
  joinedAt: string;
  lastActive: string;
  complaintsCount?: number;
  tasksCompleted?: number;
}

type RoleFilter = 'all' | 'citizen' | 'employee' | 'department_head' | 'admin';
type StatusFilter = 'all' | 'active' | 'inactive' | 'suspended';

const ROLE_CONFIG = {
  citizen: { label: 'Citizen', color: '#3b82f6', bgColor: 'bg-blue-100' },
  employee: { label: 'Employee', color: '#22c55e', bgColor: 'bg-green-100' },
  department_head: { label: 'Dept. Head', color: '#8b5cf6', bgColor: 'bg-purple-100' },
  admin: { label: 'Admin', color: '#ef4444', bgColor: 'bg-red-100' },
};

const STATUS_CONFIG = {
  active: { label: 'Active', color: '#22c55e', bgColor: 'bg-green-100' },
  inactive: { label: 'Inactive', color: '#6b7280', bgColor: 'bg-gray-100' },
  suspended: { label: 'Suspended', color: '#ef4444', bgColor: 'bg-red-100' },
};

export default function UserManagementScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  
  const stats = {
    total: 15420,
    citizens: 14850,
    employees: 520,
    admins: 50,
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter, statusFilter]);

  const loadUsers = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        phone: '+91 98765 43210',
        role: 'citizen',
        status: 'active',
        avatar: null,
        joinedAt: '2024-01-10',
        lastActive: '5 mins ago',
        complaintsCount: 12,
      },
      {
        id: '2',
        name: 'Amit Singh',
        email: 'amit.singh@municipal.gov',
        phone: '+91 87654 32109',
        role: 'employee',
        department: 'Water Supply',
        status: 'active',
        avatar: null,
        joinedAt: '2023-06-15',
        lastActive: '2 hours ago',
        tasksCompleted: 245,
      },
      {
        id: '3',
        name: 'Priya Sharma',
        email: 'priya.sharma@municipal.gov',
        phone: '+91 76543 21098',
        role: 'department_head',
        department: 'Sanitation',
        status: 'active',
        avatar: null,
        joinedAt: '2022-03-20',
        lastActive: '1 hour ago',
      },
      {
        id: '4',
        name: 'Dr. Ramesh Patel',
        email: 'ramesh.patel@municipal.gov',
        phone: '+91 65432 10987',
        role: 'admin',
        status: 'active',
        avatar: null,
        joinedAt: '2021-01-01',
        lastActive: 'Just now',
      },
      {
        id: '5',
        name: 'Suresh Mehta',
        email: 'suresh.mehta@email.com',
        phone: '+91 54321 09876',
        role: 'citizen',
        status: 'suspended',
        avatar: null,
        joinedAt: '2023-08-25',
        lastActive: '3 days ago',
        complaintsCount: 3,
      },
      {
        id: '6',
        name: 'Anita Patel',
        email: 'anita.patel@municipal.gov',
        phone: '+91 43210 98765',
        role: 'employee',
        department: 'Roads',
        status: 'inactive',
        avatar: null,
        joinedAt: '2023-02-10',
        lastActive: '1 week ago',
        tasksCompleted: 89,
      },
    ];
    
    let filteredUsers = mockUsers;
    
    if (roleFilter !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.role === roleFilter);
    }
    
    if (statusFilter !== 'all') {
      filteredUsers = filteredUsers.filter(u => u.status === statusFilter);
    }
    
    if (searchQuery) {
      filteredUsers = filteredUsers.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setUsers(filteredUsers);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadUsers();
    setRefreshing(false);
  }, []);

  const handleUserAction = async (action: string, user: User) => {
    setShowActionMenu(null);
    
    switch (action) {
      case 'view':
        setSelectedUser(user);
        setShowUserModal(true);
        break;
      case 'edit':
        router.push({
          pathname: '/admin/edit-user',
          params: { id: user.id },
        });
        break;
      case 'suspend':
        Alert.alert(
          'Suspend User',
          `Are you sure you want to suspend ${user.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Suspend',
              style: 'destructive',
              onPress: () => {
                // Handle suspension
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              },
            },
          ]
        );
        break;
      case 'delete':
        Alert.alert(
          'Delete User',
          `Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                // Handle deletion
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              },
            },
          ]
        );
        break;
      case 'activate':
        // Handle activation
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
    }
  };

  const renderUserCard = (user: User, index: number) => {
    const roleConfig = ROLE_CONFIG[user.role];
    const statusConfig = STATUS_CONFIG[user.status];
    
    return (
      <Animated.View
        key={user.id}
        entering={FadeInDown.delay(index * 50).springify()}
      >
        <TouchableOpacity
          className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
          onPress={() => {
            setSelectedUser(user);
            setShowUserModal(true);
          }}
        >
          <View className="flex-row items-start">
            {/* Avatar */}
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: roleConfig.color + '20' }}
            >
              <Text style={{ color: roleConfig.color }} className="font-bold text-lg">
                {user.name.charAt(0)}
              </Text>
            </View>
            
            {/* User Info */}
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-gray-900 font-semibold flex-1" numberOfLines={1}>
                  {user.name}
                </Text>
                
                <TouchableOpacity
                  className="p-1"
                  onPress={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                >
                  <MoreVertical size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>
              
              <Text className="text-gray-500 text-sm mb-2">{user.email}</Text>
              
              <View className="flex-row items-center gap-2">
                <View className={`px-2 py-1 rounded-full ${roleConfig.bgColor}`}>
                  <Text style={{ color: roleConfig.color }} className="text-xs font-medium">
                    {roleConfig.label}
                  </Text>
                </View>
                
                <View className={`px-2 py-1 rounded-full ${statusConfig.bgColor}`}>
                  <Text style={{ color: statusConfig.color }} className="text-xs font-medium">
                    {statusConfig.label}
                  </Text>
                </View>
                
                {user.department && (
                  <View className="flex-row items-center">
                    <Building2 size={12} color="#6b7280" />
                    <Text className="text-gray-500 text-xs ml-1">{user.department}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          
          {/* Action Menu */}
          {showActionMenu === user.id && (
            <View className="absolute right-4 top-12 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
              <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b border-gray-100"
                onPress={() => handleUserAction('view', user)}
              >
                <Eye size={16} color="#3b82f6" />
                <Text className="text-gray-700 ml-2">View Details</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-b border-gray-100"
                onPress={() => handleUserAction('edit', user)}
              >
                <Edit size={16} color="#6b7280" />
                <Text className="text-gray-700 ml-2">Edit User</Text>
              </TouchableOpacity>
              
              {user.status === 'active' ? (
                <TouchableOpacity
                  className="flex-row items-center px-4 py-3 border-b border-gray-100"
                  onPress={() => handleUserAction('suspend', user)}
                >
                  <UserX size={16} color="#f59e0b" />
                  <Text className="text-amber-600 ml-2">Suspend</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  className="flex-row items-center px-4 py-3 border-b border-gray-100"
                  onPress={() => handleUserAction('activate', user)}
                >
                  <UserCheck size={16} color="#22c55e" />
                  <Text className="text-green-600 ml-2">Activate</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                className="flex-row items-center px-4 py-3"
                onPress={() => handleUserAction('delete', user)}
              >
                <Trash2 size={16} color="#ef4444" />
                <Text className="text-red-500 ml-2">Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1e3a8a', '#1d4ed8']}
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
          
          <Text className="text-white text-lg font-semibold">User Management</Text>
          
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            onPress={() => router.push('/admin/add-user')}
          >
            <UserPlus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between">
          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mb-1">
              <Users size={18} color="#fff" />
            </View>
            <Text className="text-white font-bold">{stats.total}</Text>
            <Text className="text-white/70 text-xs">Total</Text>
          </View>
          
          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-blue-400/30 items-center justify-center mb-1">
              <Users size={18} color="#93c5fd" />
            </View>
            <Text className="text-white font-bold">{stats.citizens}</Text>
            <Text className="text-white/70 text-xs">Citizens</Text>
          </View>
          
          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-green-400/30 items-center justify-center mb-1">
              <UserCheck size={18} color="#86efac" />
            </View>
            <Text className="text-white font-bold">{stats.employees}</Text>
            <Text className="text-white/70 text-xs">Employees</Text>
          </View>
          
          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-red-400/30 items-center justify-center mb-1">
              <Shield size={18} color="#fca5a5" />
            </View>
            <Text className="text-white font-bold">{stats.admins}</Text>
            <Text className="text-white/70 text-xs">Admins</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Search and Filter */}
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex-row gap-3">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4">
            <Search size={18} color="#6b7280" />
            <TextInput
              className="flex-1 py-3 px-2 text-gray-900"
              placeholder="Search users..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={loadUsers}
            />
          </View>
          
          <TouchableOpacity
            className="w-12 h-12 bg-blue-500 rounded-xl items-center justify-center"
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Active Filters */}
        {(roleFilter !== 'all' || statusFilter !== 'all') && (
          <View className="flex-row items-center mt-3 gap-2">
            {roleFilter !== 'all' && (
              <TouchableOpacity
                className="flex-row items-center bg-blue-100 px-3 py-1.5 rounded-full"
                onPress={() => setRoleFilter('all')}
              >
                <Text className="text-blue-600 text-sm">{ROLE_CONFIG[roleFilter].label}</Text>
                <X size={14} color="#3b82f6" className="ml-1" />
              </TouchableOpacity>
            )}
            
            {statusFilter !== 'all' && (
              <TouchableOpacity
                className="flex-row items-center bg-green-100 px-3 py-1.5 rounded-full"
                onPress={() => setStatusFilter('all')}
              >
                <Text className="text-green-600 text-sm">{STATUS_CONFIG[statusFilter].label}</Text>
                <X size={14} color="#22c55e" className="ml-1" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={() => {
                setRoleFilter('all');
                setStatusFilter('all');
              }}
            >
              <Text className="text-gray-500 text-sm">Clear all</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* User List */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        onScrollBeginDrag={() => setShowActionMenu(null)}
      >
        {loading ? (
          <View className="items-center py-10">
            <Users size={48} color="#3b82f6" />
            <Text className="text-gray-500 mt-4">Loading users...</Text>
          </View>
        ) : users.length === 0 ? (
          <View className="items-center py-10">
            <UserX size={48} color="#9ca3af" />
            <Text className="text-gray-500 mt-4">No users found</Text>
            <Text className="text-gray-400 text-sm">Try adjusting your filters</Text>
          </View>
        ) : (
          users.map((user, index) => renderUserCard(user, index))
        )}
      </ScrollView>

      {/* Export/Import Actions */}
      <View className="absolute bottom-6 left-6 right-6 flex-row gap-3">
        <TouchableOpacity
          className="flex-1 bg-white rounded-xl py-3 flex-row items-center justify-center shadow-sm border border-gray-200"
          onPress={() => {}}
        >
          <Download size={18} color="#6b7280" />
          <Text className="text-gray-700 font-medium ml-2">Export</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="flex-1 bg-blue-500 rounded-xl py-3 flex-row items-center justify-center"
          onPress={() => router.push('/admin/add-user')}
        >
          <UserPlus size={18} color="#fff" />
          <Text className="text-white font-medium ml-2">Add User</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-900 font-bold text-xl">Filter Users</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Role Filter */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-3">Role</Text>
              <View className="flex-row flex-wrap gap-2">
                {(['all', 'citizen', 'employee', 'department_head', 'admin'] as RoleFilter[]).map((role) => (
                  <TouchableOpacity
                    key={role}
                    className={`px-4 py-2 rounded-full ${
                      roleFilter === role ? 'bg-blue-500' : 'bg-gray-100'
                    }`}
                    onPress={() => setRoleFilter(role)}
                  >
                    <Text className={roleFilter === role ? 'text-white' : 'text-gray-700'}>
                      {role === 'all' ? 'All' : ROLE_CONFIG[role].label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Status Filter */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-3">Status</Text>
              <View className="flex-row flex-wrap gap-2">
                {(['all', 'active', 'inactive', 'suspended'] as StatusFilter[]).map((status) => (
                  <TouchableOpacity
                    key={status}
                    className={`px-4 py-2 rounded-full ${
                      statusFilter === status ? 'bg-blue-500' : 'bg-gray-100'
                    }`}
                    onPress={() => setStatusFilter(status)}
                  >
                    <Text className={statusFilter === status ? 'text-white' : 'text-gray-700'}>
                      {status === 'all' ? 'All' : STATUS_CONFIG[status].label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
                onPress={() => {
                  setRoleFilter('all');
                  setStatusFilter('all');
                }}
              >
                <Text className="text-gray-700 font-semibold">Reset</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-xl py-4 items-center"
                onPress={() => {
                  setShowFilterModal(false);
                  loadUsers();
                }}
              >
                <Text className="text-white font-semibold">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* User Details Modal */}
      <Modal
        visible={showUserModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUserModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          {selectedUser && (
            <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-gray-900 font-bold text-xl">User Details</Text>
                <TouchableOpacity onPress={() => setShowUserModal(false)}>
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Avatar and Name */}
                <View className="items-center mb-6">
                  <View
                    className="w-20 h-20 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: ROLE_CONFIG[selectedUser.role].color + '20' }}
                  >
                    <Text
                      style={{ color: ROLE_CONFIG[selectedUser.role].color }}
                      className="font-bold text-3xl"
                    >
                      {selectedUser.name.charAt(0)}
                    </Text>
                  </View>
                  <Text className="text-gray-900 font-bold text-xl">{selectedUser.name}</Text>
                  
                  <View className="flex-row items-center gap-2 mt-2">
                    <View className={`px-3 py-1 rounded-full ${ROLE_CONFIG[selectedUser.role].bgColor}`}>
                      <Text style={{ color: ROLE_CONFIG[selectedUser.role].color }} className="text-sm font-medium">
                        {ROLE_CONFIG[selectedUser.role].label}
                      </Text>
                    </View>
                    
                    <View className={`px-3 py-1 rounded-full ${STATUS_CONFIG[selectedUser.status].bgColor}`}>
                      <Text style={{ color: STATUS_CONFIG[selectedUser.status].color }} className="text-sm font-medium">
                        {STATUS_CONFIG[selectedUser.status].label}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Contact Info */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                  <View className="flex-row items-center mb-3">
                    <Mail size={18} color="#6b7280" />
                    <Text className="text-gray-600 ml-3">{selectedUser.email}</Text>
                  </View>
                  
                  <View className="flex-row items-center mb-3">
                    <Phone size={18} color="#6b7280" />
                    <Text className="text-gray-600 ml-3">{selectedUser.phone}</Text>
                  </View>
                  
                  {selectedUser.department && (
                    <View className="flex-row items-center">
                      <Building2 size={18} color="#6b7280" />
                      <Text className="text-gray-600 ml-3">{selectedUser.department}</Text>
                    </View>
                  )}
                </View>

                {/* Stats */}
                <View className="flex-row gap-3 mb-4">
                  <View className="flex-1 bg-gray-50 rounded-xl p-4 items-center">
                    <Text className="text-gray-500 text-sm">Joined</Text>
                    <Text className="text-gray-900 font-semibold">{selectedUser.joinedAt}</Text>
                  </View>
                  
                  <View className="flex-1 bg-gray-50 rounded-xl p-4 items-center">
                    <Text className="text-gray-500 text-sm">Last Active</Text>
                    <Text className="text-gray-900 font-semibold">{selectedUser.lastActive}</Text>
                  </View>
                </View>

                {selectedUser.role === 'citizen' && selectedUser.complaintsCount !== undefined && (
                  <View className="bg-blue-50 rounded-xl p-4 mb-4">
                    <Text className="text-blue-600 text-sm">Total Complaints</Text>
                    <Text className="text-blue-700 font-bold text-2xl">{selectedUser.complaintsCount}</Text>
                  </View>
                )}

                {selectedUser.role === 'employee' && selectedUser.tasksCompleted !== undefined && (
                  <View className="bg-green-50 rounded-xl p-4 mb-4">
                    <Text className="text-green-600 text-sm">Tasks Completed</Text>
                    <Text className="text-green-700 font-bold text-2xl">{selectedUser.tasksCompleted}</Text>
                  </View>
                )}

                {/* Actions */}
                <View className="flex-row gap-3 mb-6">
                  <TouchableOpacity
                    className="flex-1 bg-gray-100 rounded-xl py-3 flex-row items-center justify-center"
                    onPress={() => {
                      setShowUserModal(false);
                      handleUserAction('edit', selectedUser);
                    }}
                  >
                    <Edit size={18} color="#6b7280" />
                    <Text className="text-gray-700 font-medium ml-2">Edit</Text>
                  </TouchableOpacity>
                  
                  {selectedUser.status === 'active' ? (
                    <TouchableOpacity
                      className="flex-1 bg-amber-100 rounded-xl py-3 flex-row items-center justify-center"
                      onPress={() => {
                        setShowUserModal(false);
                        handleUserAction('suspend', selectedUser);
                      }}
                    >
                      <UserX size={18} color="#f59e0b" />
                      <Text className="text-amber-600 font-medium ml-2">Suspend</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      className="flex-1 bg-green-100 rounded-xl py-3 flex-row items-center justify-center"
                      onPress={() => {
                        setShowUserModal(false);
                        handleUserAction('activate', selectedUser);
                      }}
                    >
                      <UserCheck size={18} color="#22c55e" />
                      <Text className="text-green-600 font-medium ml-2">Activate</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
