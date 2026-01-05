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
  TextInput,
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
  GitBranch,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  ArrowRight,
  Settings,
  Zap,
  X,
  Save,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface WorkflowStep {
  id: string;
  name: string;
  type: 'start' | 'action' | 'decision' | 'end';
  assignTo?: 'auto' | 'manual' | 'department_head';
  timeLimit?: number;
  escalateTo?: string;
  conditions?: Array<{
    field: string;
    operator: string;
    value: string;
    nextStep: string;
  }>;
  nextStep?: string;
}

interface Workflow {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  steps: WorkflowStep[];
  createdAt: string;
  lastModified: string;
  usageCount: number;
  avgCompletionTime: string;
}

export default function WorkflowManagementScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null);

  const stats = {
    totalWorkflows: 12,
    active: 8,
    avgCompletion: '2.3 days',
    automationRate: 78,
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockWorkflows: Workflow[] = [
      {
        id: '1',
        name: 'Standard Complaint Resolution',
        category: 'General',
        description: 'Default workflow for all general complaints with auto-assignment and escalation.',
        status: 'active',
        steps: [
          { id: 's1', name: 'Complaint Received', type: 'start', nextStep: 's2' },
          { id: 's2', name: 'Auto Assignment', type: 'action', assignTo: 'auto', timeLimit: 1, nextStep: 's3' },
          { id: 's3', name: 'Investigation', type: 'action', assignTo: 'manual', timeLimit: 24, nextStep: 's4' },
          { id: 's4', name: 'Resolution Check', type: 'decision', conditions: [
            { field: 'status', operator: 'equals', value: 'resolved', nextStep: 's5' },
            { field: 'status', operator: 'equals', value: 'escalate', nextStep: 's6' },
          ]},
          { id: 's5', name: 'Completed', type: 'end' },
          { id: 's6', name: 'Escalation', type: 'action', escalateTo: 'department_head', timeLimit: 12, nextStep: 's3' },
        ],
        createdAt: '2024-01-01',
        lastModified: '2024-01-10',
        usageCount: 856,
        avgCompletionTime: '2.1 days',
      },
      {
        id: '2',
        name: 'Emergency Response',
        category: 'Emergency',
        description: 'Fast-track workflow for critical and emergency complaints.',
        status: 'active',
        steps: [
          { id: 's1', name: 'Emergency Received', type: 'start', nextStep: 's2' },
          { id: 's2', name: 'Immediate Assignment', type: 'action', assignTo: 'manual', timeLimit: 0.5, nextStep: 's3' },
          { id: 's3', name: 'On-site Response', type: 'action', timeLimit: 2, nextStep: 's4' },
          { id: 's4', name: 'Resolution', type: 'action', timeLimit: 4, nextStep: 's5' },
          { id: 's5', name: 'Completed', type: 'end' },
        ],
        createdAt: '2024-01-05',
        lastModified: '2024-01-12',
        usageCount: 45,
        avgCompletionTime: '4.5 hours',
      },
      {
        id: '3',
        name: 'Building Permit Approval',
        category: 'Building',
        description: 'Multi-stage approval workflow for building permits.',
        status: 'active',
        steps: [
          { id: 's1', name: 'Application Received', type: 'start', nextStep: 's2' },
          { id: 's2', name: 'Document Verification', type: 'action', assignTo: 'manual', timeLimit: 48, nextStep: 's3' },
          { id: 's3', name: 'Site Inspection', type: 'action', timeLimit: 72, nextStep: 's4' },
          { id: 's4', name: 'Technical Review', type: 'action', assignTo: 'department_head', timeLimit: 48, nextStep: 's5' },
          { id: 's5', name: 'Approval Decision', type: 'decision', conditions: [
            { field: 'approved', operator: 'equals', value: 'yes', nextStep: 's6' },
            { field: 'approved', operator: 'equals', value: 'no', nextStep: 's7' },
          ]},
          { id: 's6', name: 'Permit Issued', type: 'end' },
          { id: 's7', name: 'Rejected', type: 'end' },
        ],
        createdAt: '2023-12-15',
        lastModified: '2024-01-08',
        usageCount: 120,
        avgCompletionTime: '5 days',
      },
      {
        id: '4',
        name: 'Water Connection Request',
        category: 'Water Supply',
        description: 'Workflow for new water connection applications.',
        status: 'inactive',
        steps: [
          { id: 's1', name: 'Request Received', type: 'start', nextStep: 's2' },
          { id: 's2', name: 'Document Check', type: 'action', timeLimit: 24, nextStep: 's3' },
          { id: 's3', name: 'Site Survey', type: 'action', timeLimit: 72, nextStep: 's4' },
          { id: 's4', name: 'Connection Installed', type: 'end' },
        ],
        createdAt: '2023-11-20',
        lastModified: '2024-01-02',
        usageCount: 89,
        avgCompletionTime: '4 days',
      },
      {
        id: '5',
        name: 'Road Repair Workflow',
        category: 'Roads',
        description: 'Comprehensive workflow for road repair complaints.',
        status: 'draft',
        steps: [
          { id: 's1', name: 'Complaint Logged', type: 'start', nextStep: 's2' },
          { id: 's2', name: 'Site Assessment', type: 'action', timeLimit: 48, nextStep: 's3' },
          { id: 's3', name: 'Work Order', type: 'action', timeLimit: 24, nextStep: 's4' },
          { id: 's4', name: 'Repair Complete', type: 'end' },
        ],
        createdAt: '2024-01-14',
        lastModified: '2024-01-14',
        usageCount: 0,
        avgCompletionTime: '-',
      },
    ];

    setWorkflows(mockWorkflows);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadWorkflows();
    setRefreshing(false);
  }, []);

  const getStatusConfig = (status: Workflow['status']) => {
    switch (status) {
      case 'active':
        return { label: 'Active', color: '#22c55e', bgColor: 'bg-green-100', icon: Play };
      case 'inactive':
        return { label: 'Inactive', color: '#6b7280', bgColor: 'bg-gray-100', icon: Pause };
      case 'draft':
        return { label: 'Draft', color: '#f59e0b', bgColor: 'bg-amber-100', icon: Edit };
    }
  };

  const getStepTypeConfig = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'start':
        return { color: '#22c55e', icon: Play };
      case 'action':
        return { color: '#3b82f6', icon: Zap };
      case 'decision':
        return { color: '#f59e0b', icon: GitBranch };
      case 'end':
        return { color: '#ef4444', icon: CheckCircle };
    }
  };

  const handleWorkflowAction = (action: string, workflow: Workflow) => {
    switch (action) {
      case 'activate':
        Alert.alert(
          'Activate Workflow',
          `Activate "${workflow.name}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Activate',
              onPress: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
            },
          ]
        );
        break;
      case 'deactivate':
        Alert.alert(
          'Deactivate Workflow',
          `Deactivate "${workflow.name}"? Active complaints using this workflow will continue with current steps.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Deactivate',
              onPress: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
            },
          ]
        );
        break;
      case 'delete':
        Alert.alert(
          'Delete Workflow',
          `Are you sure you want to delete "${workflow.name}"? This action cannot be undone.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
            },
          ]
        );
        break;
    }
  };

  const renderWorkflowCard = (workflow: Workflow, index: number) => {
    const statusConfig = getStatusConfig(workflow.status);
    const StatusIcon = statusConfig.icon;
    const isExpanded = expandedWorkflow === workflow.id;

    return (
      <Animated.View
        key={workflow.id}
        entering={FadeInDown.delay(index * 100).springify()}
      >
        <View className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden">
          {/* Header */}
          <TouchableOpacity
            className="p-4"
            onPress={() => setExpandedWorkflow(isExpanded ? null : workflow.id)}
          >
            <View className="flex-row items-start justify-between mb-2">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-xl bg-purple-100 items-center justify-center mr-3">
                  <GitBranch size={20} color="#8b5cf6" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold">{workflow.name}</Text>
                  <Text className="text-gray-500 text-sm">{workflow.category}</Text>
                </View>
              </View>

              <View className={`flex-row items-center px-2 py-1 rounded-full ${statusConfig.bgColor}`}>
                <StatusIcon size={12} color={statusConfig.color} />
                <Text style={{ color: statusConfig.color }} className="text-xs font-medium ml-1">
                  {statusConfig.label}
                </Text>
              </View>
            </View>

            <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
              {workflow.description}
            </Text>

            <View className="flex-row items-center justify-between">
              <View className="flex-row gap-4">
                <View className="flex-row items-center">
                  <Zap size={14} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-1">{workflow.steps.length} steps</Text>
                </View>
                <View className="flex-row items-center">
                  <Clock size={14} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-1">{workflow.avgCompletionTime}</Text>
                </View>
                <View className="flex-row items-center">
                  <Users size={14} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-1">{workflow.usageCount} uses</Text>
                </View>
              </View>

              {isExpanded ? (
                <ChevronDown size={20} color="#6b7280" />
              ) : (
                <ChevronRight size={20} color="#6b7280" />
              )}
            </View>
          </TouchableOpacity>

          {/* Expanded Content */}
          {isExpanded && (
            <View className="px-4 pb-4 border-t border-gray-100">
              {/* Workflow Steps */}
              <Text className="text-gray-700 font-medium mt-4 mb-3">Workflow Steps</Text>
              <View className="ml-2">
                {workflow.steps.map((step, stepIndex) => {
                  const stepConfig = getStepTypeConfig(step.type);
                  const StepIcon = stepConfig.icon;
                  const isLast = stepIndex === workflow.steps.length - 1;

                  return (
                    <View key={step.id} className="flex-row">
                      {/* Connector */}
                      <View className="items-center mr-3">
                        <View
                          className="w-8 h-8 rounded-full items-center justify-center"
                          style={{ backgroundColor: stepConfig.color + '20' }}
                        >
                          <StepIcon size={16} color={stepConfig.color} />
                        </View>
                        {!isLast && (
                          <View className="w-0.5 h-8 bg-gray-200" />
                        )}
                      </View>

                      {/* Step Details */}
                      <View className="flex-1 pb-4">
                        <Text className="text-gray-900 font-medium">{step.name}</Text>
                        {step.timeLimit && (
                          <Text className="text-gray-500 text-sm">
                            Time limit: {step.timeLimit}h
                          </Text>
                        )}
                        {step.assignTo && (
                          <Text className="text-gray-500 text-sm">
                            Assignment: {step.assignTo.replace('_', ' ')}
                          </Text>
                        )}
                        {step.escalateTo && (
                          <Text className="text-amber-600 text-sm">
                            Escalates to: {step.escalateTo.replace('_', ' ')}
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Actions */}
              <View className="flex-row gap-2 mt-4 pt-4 border-t border-gray-100">
                <TouchableOpacity
                  className="flex-1 bg-purple-100 py-3 rounded-xl flex-row items-center justify-center"
                  onPress={() => {
                    router.push({
                      pathname: '/admin/edit-workflow',
                      params: { id: workflow.id },
                    });
                  }}
                >
                  <Edit size={16} color="#8b5cf6" />
                  <Text className="text-purple-600 font-medium ml-2">Edit</Text>
                </TouchableOpacity>

                {workflow.status === 'active' ? (
                  <TouchableOpacity
                    className="flex-1 bg-gray-100 py-3 rounded-xl flex-row items-center justify-center"
                    onPress={() => handleWorkflowAction('deactivate', workflow)}
                  >
                    <Pause size={16} color="#6b7280" />
                    <Text className="text-gray-600 font-medium ml-2">Deactivate</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="flex-1 bg-green-100 py-3 rounded-xl flex-row items-center justify-center"
                    onPress={() => handleWorkflowAction('activate', workflow)}
                  >
                    <Play size={16} color="#22c55e" />
                    <Text className="text-green-600 font-medium ml-2">Activate</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  className="w-12 bg-red-100 py-3 rounded-xl items-center justify-center"
                  onPress={() => handleWorkflowAction('delete', workflow)}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
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
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>

          <Text className="text-white text-lg font-semibold">Workflows</Text>

          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between">
          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mb-1">
              <GitBranch size={18} color="#fff" />
            </View>
            <Text className="text-white font-bold">{stats.totalWorkflows}</Text>
            <Text className="text-white/70 text-xs">Total</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-green-400/30 items-center justify-center mb-1">
              <Play size={18} color="#86efac" />
            </View>
            <Text className="text-white font-bold">{stats.active}</Text>
            <Text className="text-white/70 text-xs">Active</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-blue-400/30 items-center justify-center mb-1">
              <Clock size={18} color="#93c5fd" />
            </View>
            <Text className="text-white font-bold">{stats.avgCompletion}</Text>
            <Text className="text-white/70 text-xs">Avg Time</Text>
          </View>

          <View className="items-center">
            <View className="w-10 h-10 rounded-full bg-amber-400/30 items-center justify-center mb-1">
              <Zap size={18} color="#fcd34d" />
            </View>
            <Text className="text-white font-bold">{stats.automationRate}%</Text>
            <Text className="text-white/70 text-xs">Automated</Text>
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
            <GitBranch size={48} color="#7c3aed" />
            <Text className="text-gray-500 mt-4">Loading workflows...</Text>
          </View>
        ) : (
          <>
            {/* Filter Chips */}
            <View className="flex-row gap-2 mb-4">
              <TouchableOpacity className="bg-purple-500 px-4 py-2 rounded-full">
                <Text className="text-white font-medium">All</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-white px-4 py-2 rounded-full">
                <Text className="text-gray-600">Active</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-white px-4 py-2 rounded-full">
                <Text className="text-gray-600">Inactive</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-white px-4 py-2 rounded-full">
                <Text className="text-gray-600">Draft</Text>
              </TouchableOpacity>
            </View>

            {workflows.map((workflow, index) => renderWorkflowCard(workflow, index))}
          </>
        )}
      </ScrollView>

      {/* Create Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-900 font-bold text-xl">Create Workflow</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Workflow Name</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                placeholder="Enter workflow name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Category</Text>
              <TouchableOpacity className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center justify-between">
                <Text className="text-gray-400">Select category</Text>
                <ChevronDown size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Description</Text>
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900"
                placeholder="Describe the workflow"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
                onPress={() => setShowCreateModal(false)}
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-purple-500 rounded-xl py-4 items-center"
                onPress={() => {
                  setShowCreateModal(false);
                  router.push('/admin/workflow-builder');
                }}
              >
                <Text className="text-white font-semibold">Create & Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
