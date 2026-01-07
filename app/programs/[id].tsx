import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Building2,
  ExternalLink,
  Share2,
  Heart,
  FileText,
  CheckCircle2,
  Phone,
  Globe,
  ChevronRight,
} from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

const mockProgram = {
  id: '1',
  title: 'Swachh Bharat Abhiyan',
  category: 'Cleanliness',
  description:
    'Swachh Bharat Abhiyan is a national cleanliness campaign to clean streets, roads and infrastructure of the country. The campaign aims to make India clean and free of open defecation by 2025.',
  image: 'https://via.placeholder.com/800x400?text=Swachh+Bharat',
  startDate: '2025-10-02',
  endDate: '2026-10-02',
  status: 'active',
  department: 'Sanitation Department',
  departmentContact: '+91 1800 123 4567',
  website: 'https://swachhbharatmission.gov.in',
  beneficiaries: 50000,
  progress: 65,
  budget: '₹50 Crore',
  objectives: [
    'Eliminate open defecation',
    'Convert insanitary toilets to pour-flush toilets',
    'Eradicate manual scavenging',
    'Complete solid waste management',
    'Create public awareness about sanitation',
  ],
  eligibility: [
    'All residents of the municipal area',
    'Households without access to toilets',
    'BPL families (priority)',
    'Institutions and public places',
  ],
  documents: [
    { name: 'Application Form', url: '#' },
    { name: 'Guidelines', url: '#' },
    { name: 'FAQ Document', url: '#' },
  ],
  milestones: [
    { title: 'Phase 1 - Survey', status: 'completed', date: 'Oct 2025' },
    { title: 'Phase 2 - Implementation', status: 'in_progress', date: 'Jan 2026' },
    { title: 'Phase 3 - Monitoring', status: 'pending', date: 'Jul 2026' },
    { title: 'Phase 4 - Completion', status: 'pending', date: 'Oct 2026' },
  ],
  contact: {
    office: 'Municipal Corporation Office, Sector 1',
    phone: '+91 1800 123 4567',
    email: 'swachh@municipality.gov.in',
    timings: 'Mon-Sat, 10 AM - 5 PM',
  },
};

export default function ProgramDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const [isLiked, setIsLiked] = useState(false);

  const programId = params.id as string;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this government program: ${mockProgram.title}\n\n${mockProgram.description}`,
        title: mockProgram.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCall = () => {
    Linking.openURL(`tel:${mockProgram.departmentContact}`);
  };

  const handleWebsite = () => {
    Linking.openURL(mockProgram.website);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'in_progress':
        return '#3b82f6';
      case 'pending':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      edges={['top']}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View className="relative">
          <Image
            source={{ uri: mockProgram.image }}
            className="w-full h-56"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30" />
          
          {/* Header Overlay */}
          <View className="absolute top-0 left-0 right-0 px-4 py-3 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
            >
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setIsLiked(!isLiked)}
                className="w-10 h-10 rounded-full bg-black/30 items-center justify-center mr-2"
              >
                <Heart
                  size={20}
                  color={isLiked ? '#ef4444' : '#fff'}
                  fill={isLiked ? '#ef4444' : 'transparent'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
              >
                <Share2 size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status Badge */}
          <View className="absolute bottom-4 left-4">
            <View className="bg-green-500 px-4 py-2 rounded-full">
              <Text className="text-white font-semibold capitalize">
                {mockProgram.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="p-4">
          {/* Title Section */}
          <View
            className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <Text className="text-blue-500 text-sm font-medium mb-1">
              {mockProgram.category}
            </Text>
            <Text
              className={`text-2xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {mockProgram.title}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {mockProgram.description}
            </Text>

            {/* Quick Stats */}
            <View
              className={`flex-row mt-4 pt-4 border-t ${
                isDark ? 'border-gray-700' : 'border-gray-100'
              }`}
            >
              <View className="flex-1 items-center">
                <Text
                  className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {mockProgram.beneficiaries.toLocaleString()}
                </Text>
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Beneficiaries
                </Text>
              </View>
              <View
                className={`w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
              />
              <View className="flex-1 items-center">
                <Text
                  className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {mockProgram.budget}
                </Text>
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Budget
                </Text>
              </View>
              <View
                className={`w-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
              />
              <View className="flex-1 items-center">
                <Text
                  className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {mockProgram.progress}%
                </Text>
                <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Progress
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="mt-3">
              <View
                className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                <View
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${mockProgram.progress}%` }}
                />
              </View>
            </View>
          </View>

          {/* Timeline */}
          <View
            className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <Text
              className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Timeline
            </Text>
            <View className="flex-row items-center mb-4">
              <Calendar size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
              <Text className={`ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {new Date(mockProgram.startDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                -{' '}
                {new Date(mockProgram.endDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>

            {/* Milestones */}
            {mockProgram.milestones.map((milestone, index) => (
              <View key={index} className="flex-row mb-3 last:mb-0">
                <View className="items-center mr-3">
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${getStatusColor(milestone.status)}20` }}
                  >
                    <CheckCircle2
                      size={14}
                      color={getStatusColor(milestone.status)}
                    />
                  </View>
                  {index < mockProgram.milestones.length - 1 && (
                    <View
                      className={`w-0.5 flex-1 mt-1 ${
                        isDark ? 'bg-gray-700' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </View>
                <View className="flex-1 pb-4">
                  <Text
                    className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
                  >
                    {milestone.title}
                  </Text>
                  <Text
                    className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    {milestone.date}
                  </Text>
                </View>
                <View
                  className="px-2 py-1 rounded-full h-6"
                  style={{ backgroundColor: `${getStatusColor(milestone.status)}20` }}
                >
                  <Text
                    style={{
                      color: getStatusColor(milestone.status),
                      fontSize: 10,
                      fontWeight: '600',
                    }}
                  >
                    {milestone.status.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Objectives */}
          <View
            className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <Text
              className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Objectives
            </Text>
            {mockProgram.objectives.map((objective, index) => (
              <View key={index} className="flex-row items-start mb-2">
                <View className="w-6 h-6 rounded-full bg-blue-500/20 items-center justify-center mr-3 mt-0.5">
                  <CheckCircle2 size={14} color="#3b82f6" />
                </View>
                <Text
                  className={`flex-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {objective}
                </Text>
              </View>
            ))}
          </View>

          {/* Eligibility */}
          <View
            className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <Text
              className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Eligibility
            </Text>
            {mockProgram.eligibility.map((item, index) => (
              <View key={index} className="flex-row items-start mb-2">
                <Text className="text-blue-500 mr-2">•</Text>
                <Text
                  className={`flex-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {/* Documents */}
          <View
            className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <Text
              className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Documents
            </Text>
            {mockProgram.documents.map((doc, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center py-3 ${
                  index !== mockProgram.documents.length - 1
                    ? `border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`
                    : ''
                }`}
              >
                <View className="w-10 h-10 rounded-lg bg-blue-500/20 items-center justify-center mr-3">
                  <FileText size={20} color="#3b82f6" />
                </View>
                <Text
                  className={`flex-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {doc.name}
                </Text>
                <ExternalLink size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Contact */}
          <View
            className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <Text
              className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Contact Information
            </Text>
            <View className="flex-row items-center mb-3">
              <Building2 size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
              <Text className={`ml-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {mockProgram.contact.office}
              </Text>
            </View>
            <View className="flex-row items-center mb-3">
              <Phone size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
              <Text className={`ml-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {mockProgram.contact.phone}
              </Text>
            </View>
            <View className="flex-row items-center mb-3">
              <Calendar size={16} color={isDark ? '#9ca3af' : '#6b7280'} />
              <Text className={`ml-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {mockProgram.contact.timings}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View
        className={`p-4 border-t ${isDark ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}
      >
        <View className="flex-row">
          <TouchableOpacity
            onPress={handleCall}
            className={`flex-1 flex-row items-center justify-center py-3 mr-2 rounded-xl ${
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          >
            <Phone size={20} color="#3b82f6" />
            <Text className="text-blue-500 font-medium ml-2">Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleWebsite}
            className="flex-1 flex-row items-center justify-center py-3 bg-blue-500 rounded-xl"
          >
            <Globe size={20} color="#fff" />
            <Text className="text-white font-medium ml-2">Visit Website</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
