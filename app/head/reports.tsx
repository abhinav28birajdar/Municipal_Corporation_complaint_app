import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  ChevronDown,
  Filter,
  Share2,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Clock,
} from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

const mockReports = [
  {
    id: '1',
    title: 'Weekly Performance Report',
    type: 'performance',
    period: 'Jan 1 - Jan 7, 2026',
    generatedAt: '2026-01-07T10:00:00',
    status: 'ready',
  },
  {
    id: '2',
    title: 'Monthly Complaint Summary',
    type: 'complaints',
    period: 'December 2025',
    generatedAt: '2026-01-01T09:00:00',
    status: 'ready',
  },
  {
    id: '3',
    title: 'Team Attendance Report',
    type: 'attendance',
    period: 'January 2026',
    generatedAt: '2026-01-07T08:00:00',
    status: 'generating',
  },
  {
    id: '4',
    title: 'SLA Compliance Report',
    type: 'sla',
    period: 'Q4 2025',
    generatedAt: '2025-12-31T18:00:00',
    status: 'ready',
  },
];

const reportTemplates = [
  {
    id: 'performance',
    title: 'Performance Report',
    description: 'Team performance metrics and KPIs',
    icon: TrendingUp,
    color: '#3b82f6',
  },
  {
    id: 'complaints',
    title: 'Complaint Analysis',
    description: 'Detailed complaint statistics',
    icon: BarChart3,
    color: '#22c55e',
  },
  {
    id: 'attendance',
    title: 'Attendance Report',
    description: 'Team attendance and work hours',
    icon: Users,
    color: '#8b5cf6',
  },
  {
    id: 'sla',
    title: 'SLA Report',
    description: 'SLA compliance analysis',
    icon: Clock,
    color: '#f59e0b',
  },
];

export default function ReportsScreen() {
  const router = useRouter();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'recent' | 'generate'>('recent');

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return TrendingUp;
      case 'complaints':
        return BarChart3;
      case 'attendance':
        return Users;
      case 'sla':
        return Clock;
      default:
        return FileText;
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'performance':
        return '#3b82f6';
      case 'complaints':
        return '#22c55e';
      case 'attendance':
        return '#8b5cf6';
      case 'sla':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const handleGenerateReport = (templateId: string) => {
    Alert.alert(
      'Generate Report',
      'Select the time period for this report',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'This Week',
          onPress: () => {
            Alert.alert('Generating', 'Your report is being generated...');
          },
        },
        {
          text: 'This Month',
          onPress: () => {
            Alert.alert('Generating', 'Your report is being generated...');
          },
        },
      ]
    );
  };

  const handleDownload = (reportId: string) => {
    Alert.alert('Downloading', 'Report download started...');
  };

  const handleShare = (reportId: string) => {
    Alert.alert('Share Report', 'Share options...');
  };

  const ReportCard = ({ report }: { report: typeof mockReports[0] }) => {
    const Icon = getReportTypeIcon(report.type);
    const color = getReportTypeColor(report.type);

    return (
      <View
        className={`p-4 rounded-xl mb-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      >
        <View className="flex-row items-start">
          <View
            className="w-12 h-12 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={24} color={color} />
          </View>
          <View className="flex-1">
            <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {report.title}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {report.period}
            </Text>
            <View className="flex-row items-center mt-1">
              <Calendar size={12} color={isDark ? '#9ca3af' : '#6b7280'} />
              <Text className={`text-xs ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Generated: {new Date(report.generatedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          {report.status === 'generating' ? (
            <View className="bg-yellow-500/20 px-3 py-1 rounded-full">
              <Text className="text-yellow-500 text-xs font-medium">Generating</Text>
            </View>
          ) : (
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => handleDownload(report.id)}
                className={`p-2 rounded-lg mr-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                <Download size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleShare(report.id)}
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                <Share2 size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const TemplateCard = ({ template }: { template: typeof reportTemplates[0] }) => {
    const Icon = template.icon;

    return (
      <TouchableOpacity
        onPress={() => handleGenerateReport(template.id)}
        className={`p-4 rounded-xl mb-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      >
        <View className="flex-row items-center">
          <View
            className="w-12 h-12 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: `${template.color}20` }}
          >
            <Icon size={24} color={template.color} />
          </View>
          <View className="flex-1">
            <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {template.title}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {template.description}
            </Text>
          </View>
          <View
            className="px-3 py-2 rounded-lg"
            style={{ backgroundColor: `${template.color}20` }}
          >
            <Text style={{ color: template.color, fontSize: 12, fontWeight: '600' }}>
              Generate
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      edges={['top']}
    >
      {/* Header */}
      <View
        className={`px-6 py-4 ${isDark ? 'bg-gray-900' : 'bg-white'} border-b ${
          isDark ? 'border-gray-800' : 'border-gray-100'
        }`}
      >
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color={isDark ? '#fff' : '#1f2937'} />
          </TouchableOpacity>
          <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Reports
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setSelectedTab('recent')}
            className={`flex-1 py-3 rounded-lg mr-2 ${
              selectedTab === 'recent'
                ? 'bg-blue-500'
                : isDark
                ? 'bg-gray-800'
                : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                selectedTab === 'recent'
                  ? 'text-white'
                  : isDark
                  ? 'text-gray-300'
                  : 'text-gray-700'
              }`}
            >
              Recent Reports
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedTab('generate')}
            className={`flex-1 py-3 rounded-lg ${
              selectedTab === 'generate'
                ? 'bg-blue-500'
                : isDark
                ? 'bg-gray-800'
                : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                selectedTab === 'generate'
                  ? 'text-white'
                  : isDark
                  ? 'text-gray-300'
                  : 'text-gray-700'
              }`}
            >
              Generate New
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 p-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {selectedTab === 'recent' ? (
          <>
            <Text className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {mockReports.length} reports generated
            </Text>
            {mockReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </>
        ) : (
          <>
            <Text className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Select a report template to generate
            </Text>
            {reportTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}

            {/* Custom Report */}
            <View className="mt-4">
              <Text className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Custom Report
              </Text>
              <View
                className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              >
                <Text className={`mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Create a custom report with specific parameters
                </Text>
                <TouchableOpacity
                  className="bg-blue-500 py-3 rounded-lg items-center"
                >
                  <Text className="text-white font-medium">
                    Create Custom Report
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
