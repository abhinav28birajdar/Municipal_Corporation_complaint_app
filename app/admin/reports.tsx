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
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Clock,
  Filter,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Users,
  Building2,
  MapPin,
  TrendingUp,
  X,
  FileSpreadsheet,
  Mail,
  Share2,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Report {
  id: string;
  title: string;
  type: 'complaints' | 'performance' | 'department' | 'ward' | 'employee' | 'financial';
  description: string;
  generatedAt: string;
  period: string;
  status: 'ready' | 'generating' | 'failed';
  format: 'pdf' | 'excel' | 'csv';
  size: string;
  downloadCount: number;
}

interface ReportTemplate {
  id: string;
  name: string;
  type: Report['type'];
  description: string;
  icon: any;
  color: string;
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: '1',
    name: 'Complaints Summary',
    type: 'complaints',
    description: 'Overview of all complaints with status breakdown',
    icon: FileText,
    color: '#3b82f6',
  },
  {
    id: '2',
    name: 'Department Performance',
    type: 'department',
    description: 'Performance metrics for all departments',
    icon: Building2,
    color: '#22c55e',
  },
  {
    id: '3',
    name: 'Employee Analytics',
    type: 'employee',
    description: 'Individual employee performance report',
    icon: Users,
    color: '#8b5cf6',
  },
  {
    id: '4',
    name: 'Ward-wise Analysis',
    type: 'ward',
    description: 'Complaints distribution by ward',
    icon: MapPin,
    color: '#f59e0b',
  },
  {
    id: '5',
    name: 'Performance Trends',
    type: 'performance',
    description: 'Overall system performance trends',
    icon: TrendingUp,
    color: '#ec4899',
  },
  {
    id: '6',
    name: 'Financial Report',
    type: 'financial',
    description: 'Budget and expenditure analysis',
    icon: BarChart3,
    color: '#06b6d4',
  },
];

const TYPE_CONFIG = {
  complaints: { label: 'Complaints', color: '#3b82f6' },
  performance: { label: 'Performance', color: '#ec4899' },
  department: { label: 'Department', color: '#22c55e' },
  ward: { label: 'Ward', color: '#f59e0b' },
  employee: { label: 'Employee', color: '#8b5cf6' },
  financial: { label: 'Financial', color: '#06b6d4' },
};

export default function ReportsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'>('month');
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockReports: Report[] = [
      {
        id: '1',
        title: 'Monthly Complaints Summary - January 2024',
        type: 'complaints',
        description: 'Complete overview of all complaints received in January 2024',
        generatedAt: '2024-01-16 10:30',
        period: 'January 2024',
        status: 'ready',
        format: 'pdf',
        size: '2.4 MB',
        downloadCount: 15,
      },
      {
        id: '2',
        title: 'Q4 2023 Department Performance',
        type: 'department',
        description: 'Quarterly performance analysis for all departments',
        generatedAt: '2024-01-10 09:15',
        period: 'Oct - Dec 2023',
        status: 'ready',
        format: 'excel',
        size: '1.8 MB',
        downloadCount: 28,
      },
      {
        id: '3',
        title: 'Employee Performance Report',
        type: 'employee',
        description: 'Individual employee metrics and rankings',
        generatedAt: '2024-01-15 14:00',
        period: 'January 2024',
        status: 'ready',
        format: 'pdf',
        size: '3.2 MB',
        downloadCount: 42,
      },
      {
        id: '4',
        title: 'Ward-wise Complaint Analysis',
        type: 'ward',
        description: 'Distribution of complaints across all wards',
        generatedAt: '2024-01-14 16:45',
        period: 'Last 30 days',
        status: 'generating',
        format: 'pdf',
        size: '-',
        downloadCount: 0,
      },
      {
        id: '5',
        title: 'Annual Performance Trends 2023',
        type: 'performance',
        description: 'Year-long performance trends and analysis',
        generatedAt: '2024-01-05 11:30',
        period: '2023',
        status: 'ready',
        format: 'excel',
        size: '5.6 MB',
        downloadCount: 65,
      },
    ];

    setReports(mockReports);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadReports();
    setRefreshing(false);
  }, []);

  const handleGenerateReport = () => {
    if (!selectedTemplate) return;

    setShowGenerateModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Report Generating',
      `Your ${selectedTemplate.name} report is being generated. You'll be notified when it's ready.`
    );
    setSelectedTemplate(null);
  };

  const handleDownload = (report: Report) => {
    if (report.status !== 'ready') return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Download Started',
      `Downloading ${report.title}...`
    );
  };

  const handleShare = (report: Report) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Share functionality
  };

  const handleEmail = (report: Report) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Email Report',
      'Enter email address to send the report',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send', onPress: () => {} },
      ]
    );
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return FileText;
      case 'excel':
      case 'csv':
        return FileSpreadsheet;
      default:
        return FileText;
    }
  };

  const renderTemplateCard = (template: ReportTemplate) => {
    const TemplateIcon = template.icon;
    
    return (
      <TouchableOpacity
        key={template.id}
        className="bg-white rounded-2xl p-4 shadow-sm"
        style={{ width: (width - 48) / 2 }}
        onPress={() => {
          setSelectedTemplate(template);
          setShowGenerateModal(true);
        }}
      >
        <View
          className="w-12 h-12 rounded-xl items-center justify-center mb-3"
          style={{ backgroundColor: template.color + '20' }}
        >
          <TemplateIcon size={24} color={template.color} />
        </View>
        <Text className="text-gray-900 font-semibold mb-1">{template.name}</Text>
        <Text className="text-gray-500 text-sm" numberOfLines={2}>
          {template.description}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderReportCard = (report: Report, index: number) => {
    const typeConfig = TYPE_CONFIG[report.type];
    const FormatIcon = getFormatIcon(report.format);

    return (
      <Animated.View
        key={report.id}
        entering={FadeInDown.delay(index * 100).springify()}
      >
        <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <View className="flex-row items-center gap-2 mb-1">
                <View
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: typeConfig.color + '20' }}
                >
                  <Text style={{ color: typeConfig.color }} className="text-xs font-medium">
                    {typeConfig.label}
                  </Text>
                </View>
                <View className={`px-2 py-0.5 rounded-full ${
                  report.status === 'ready'
                    ? 'bg-green-100'
                    : report.status === 'generating'
                    ? 'bg-amber-100'
                    : 'bg-red-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    report.status === 'ready'
                      ? 'text-green-600'
                      : report.status === 'generating'
                      ? 'text-amber-600'
                      : 'text-red-500'
                  }`}>
                    {report.status === 'ready' ? 'Ready' : report.status === 'generating' ? 'Generating...' : 'Failed'}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-900 font-semibold" numberOfLines={2}>
                {report.title}
              </Text>
            </View>

            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: report.format === 'pdf' ? '#ef4444' + '20' : '#22c55e' + '20' }}
            >
              <FormatIcon
                size={20}
                color={report.format === 'pdf' ? '#ef4444' : '#22c55e'}
              />
            </View>
          </View>

          <Text className="text-gray-500 text-sm mb-3" numberOfLines={1}>
            {report.description}
          </Text>

          <View className="flex-row items-center gap-4 mb-3">
            <View className="flex-row items-center">
              <Calendar size={14} color="#6b7280" />
              <Text className="text-gray-500 text-sm ml-1">{report.period}</Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={14} color="#6b7280" />
              <Text className="text-gray-500 text-sm ml-1">{report.generatedAt}</Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            <View className="flex-row items-center gap-3">
              <Text className="text-gray-500 text-sm">
                {report.size} • {report.downloadCount} downloads
              </Text>
            </View>

            {report.status === 'ready' && (
              <View className="flex-row gap-2">
                <TouchableOpacity
                  className="w-9 h-9 bg-gray-100 rounded-lg items-center justify-center"
                  onPress={() => handleEmail(report)}
                >
                  <Mail size={16} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-9 h-9 bg-gray-100 rounded-lg items-center justify-center"
                  onPress={() => handleShare(report)}
                >
                  <Share2 size={16} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-9 h-9 bg-blue-500 rounded-lg items-center justify-center"
                  onPress={() => handleDownload(report)}
                >
                  <Download size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
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
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>

          <Text className="text-white text-lg font-semibold">Reports</Text>

          <View className="w-10 h-10" />
        </View>

        <Text className="text-white/80 text-center">
          Generate and download detailed reports
        </Text>
      </LinearGradient>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {/* Report Templates */}
        <Text className="text-gray-900 font-bold text-lg mb-4">Generate New Report</Text>
        <View className="flex-row flex-wrap gap-3 mb-8">
          {REPORT_TEMPLATES.map((template) => renderTemplateCard(template))}
        </View>

        {/* Recent Reports */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-900 font-bold text-lg">Recent Reports</Text>
          <TouchableOpacity>
            <Text className="text-purple-600 font-medium">View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="items-center py-10">
            <FileText size={48} color="#7c3aed" />
            <Text className="text-gray-500 mt-4">Loading reports...</Text>
          </View>
        ) : (
          reports.map((report, index) => renderReportCard(report, index))
        )}
      </ScrollView>

      {/* Generate Report Modal */}
      <Modal
        visible={showGenerateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenerateModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-gray-900 font-bold text-xl">Generate Report</Text>
              <TouchableOpacity onPress={() => setShowGenerateModal(false)}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {selectedTemplate && (
              <>
                {/* Selected Template */}
                <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <View className="flex-row items-center">
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                      style={{ backgroundColor: selectedTemplate.color + '20' }}
                    >
                      {React.createElement(selectedTemplate.icon, {
                        size: 24,
                        color: selectedTemplate.color,
                      })}
                    </View>
                    <View>
                      <Text className="text-gray-900 font-semibold">{selectedTemplate.name}</Text>
                      <Text className="text-gray-500 text-sm">{selectedTemplate.description}</Text>
                    </View>
                  </View>
                </View>

                {/* Date Range */}
                <View className="mb-6">
                  <Text className="text-gray-700 font-medium mb-3">Date Range</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {[
                      { value: 'today', label: 'Today' },
                      { value: 'week', label: 'This Week' },
                      { value: 'month', label: 'This Month' },
                      { value: 'quarter', label: 'Quarter' },
                      { value: 'year', label: 'This Year' },
                      { value: 'custom', label: 'Custom' },
                    ].map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        className={`px-4 py-2 rounded-full ${
                          dateRange === option.value ? 'bg-purple-500' : 'bg-gray-100'
                        }`}
                        onPress={() => setDateRange(option.value as any)}
                      >
                        <Text className={dateRange === option.value ? 'text-white font-medium' : 'text-gray-600'}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Format */}
                <View className="mb-6">
                  <Text className="text-gray-700 font-medium mb-3">Format</Text>
                  <View className="flex-row gap-3">
                    {[
                      { value: 'pdf', label: 'PDF', icon: FileText, color: '#ef4444' },
                      { value: 'excel', label: 'Excel', icon: FileSpreadsheet, color: '#22c55e' },
                      { value: 'csv', label: 'CSV', icon: FileSpreadsheet, color: '#3b82f6' },
                    ].map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
                          format === option.value ? '' : 'bg-gray-100'
                        }`}
                        style={format === option.value ? { backgroundColor: option.color + '20' } : {}}
                        onPress={() => setFormat(option.value as any)}
                      >
                        {React.createElement(option.icon, {
                          size: 18,
                          color: format === option.value ? option.color : '#6b7280',
                        })}
                        <Text
                          className="font-medium ml-2"
                          style={{ color: format === option.value ? option.color : '#6b7280' }}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 bg-gray-100 rounded-xl py-4 items-center"
                    onPress={() => setShowGenerateModal(false)}
                  >
                    <Text className="text-gray-700 font-semibold">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 bg-purple-500 rounded-xl py-4 flex-row items-center justify-center"
                    onPress={handleGenerateReport}
                  >
                    <BarChart3 size={18} color="#fff" />
                    <Text className="text-white font-semibold ml-2">Generate</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
