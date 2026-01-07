import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Twitter,
  Facebook,
  MessageCircle,
  Star,
  Heart,
  Shield,
  Award,
  Users,
  Building2,
} from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

interface FeatureItemProps {
  icon: any;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, title, description }) => {
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';

  return (
    <View className="flex-row items-start mb-4">
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
          isDark ? 'bg-blue-900/30' : 'bg-blue-50'
        }`}
      >
        <Icon size={20} color="#3b82f6" />
      </View>
      <View className="flex-1">
        <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </Text>
        <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </Text>
      </View>
    </View>
  );
};

export default function AboutScreen() {
  const router = useRouter();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@municipalcorp.gov.in');
  };

  const handlePhone = () => {
    Linking.openURL('tel:+911234567890');
  };

  const handleRateApp = () => {
    // Would open app store
    Linking.openURL('https://play.google.com/store');
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      edges={['top']}
    >
      {/* Header */}
      <View
        className={`px-6 py-4 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${
          isDark ? 'border-gray-700' : 'border-gray-100'
        }`}
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color={isDark ? '#fff' : '#1f2937'} />
          </TouchableOpacity>
          <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            About
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* App Logo & Info */}
        <View className="items-center py-8">
          <View
            className={`w-24 h-24 rounded-3xl items-center justify-center mb-4 ${
              isDark ? 'bg-blue-600' : 'bg-blue-500'
            }`}
          >
            <Building2 size={48} color="#fff" />
          </View>
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Municipal Corporation
          </Text>
          <Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Citizen Services App
          </Text>
          <View
            className={`mt-2 px-3 py-1 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
          >
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Version 1.0.0 (Build 1)
            </Text>
          </View>
        </View>

        {/* Description */}
        <View className={`mx-4 p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <Text className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Empowering citizens with a seamless platform to report civic issues, track
            complaints, and stay connected with local government services. Together, we
            build a better community.
          </Text>
        </View>

        {/* Features */}
        <View className="px-4 mt-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Features
          </Text>
          <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <FeatureItem
              icon={MessageCircle}
              title="Easy Complaint Filing"
              description="Report civic issues in just a few taps with photos and location"
            />
            <FeatureItem
              icon={MapPin}
              title="Real-time Tracking"
              description="Track your complaint status with live updates and notifications"
            />
            <FeatureItem
              icon={Users}
              title="Community Engagement"
              description="Stay informed about local events and government programs"
            />
            <FeatureItem
              icon={Shield}
              title="Secure & Private"
              description="Your data is protected with enterprise-grade security"
            />
          </View>
        </View>

        {/* Statistics */}
        <View className="px-4 mt-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Impact
          </Text>
          <View className="flex-row">
            <View
              className={`flex-1 p-4 rounded-xl mr-2 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <Text className={`text-2xl font-bold text-blue-500`}>50K+</Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Complaints Resolved
              </Text>
            </View>
            <View
              className={`flex-1 p-4 rounded-xl ml-2 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <Text className={`text-2xl font-bold text-green-500`}>25K+</Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Active Citizens
              </Text>
            </View>
          </View>
          <View className="flex-row mt-3">
            <View
              className={`flex-1 p-4 rounded-xl mr-2 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <Text className={`text-2xl font-bold text-purple-500`}>4.5★</Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                User Rating
              </Text>
            </View>
            <View
              className={`flex-1 p-4 rounded-xl ml-2 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <Text className={`text-2xl font-bold text-amber-500`}>98%</Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Satisfaction Rate
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Us */}
        <View className="px-4 mt-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Contact Us
          </Text>
          <View className={`rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <TouchableOpacity
              onPress={handleEmail}
              className={`flex-row items-center p-4 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-100'
              }`}
            >
              <Mail size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              <Text className={`flex-1 ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                support@municipalcorp.gov.in
              </Text>
              <ExternalLink size={16} color={isDark ? '#6b7280' : '#9ca3af'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePhone}
              className={`flex-row items-center p-4 border-b ${
                isDark ? 'border-gray-700' : 'border-gray-100'
              }`}
            >
              <Phone size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              <Text className={`flex-1 ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                +91 1234-567-890
              </Text>
              <ExternalLink size={16} color={isDark ? '#6b7280' : '#9ca3af'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleOpenLink('https://maps.google.com')}
              className="flex-row items-center p-4"
            >
              <MapPin size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
              <Text className={`flex-1 ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Municipal Corporation Office{'\n'}
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Main Road, City Center
                </Text>
              </Text>
              <ExternalLink size={16} color={isDark ? '#6b7280' : '#9ca3af'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Links */}
        <View className="px-4 mt-6">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Follow Us
          </Text>
          <View className="flex-row justify-center">
            <TouchableOpacity
              onPress={() => handleOpenLink('https://twitter.com')}
              className={`w-12 h-12 rounded-full items-center justify-center mx-2 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <Twitter size={24} color="#1da1f2" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleOpenLink('https://facebook.com')}
              className={`w-12 h-12 rounded-full items-center justify-center mx-2 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <Facebook size={24} color="#1877f2" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleOpenLink('https://municipalcorp.gov.in')}
              className={`w-12 h-12 rounded-full items-center justify-center mx-2 ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <Globe size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Rate App */}
        <View className="px-4 mt-6">
          <TouchableOpacity
            onPress={handleRateApp}
            className="bg-blue-500 flex-row items-center justify-center p-4 rounded-xl"
          >
            <Star size={20} color="#fff" />
            <Text className="text-white font-semibold ml-2">Rate this App</Text>
          </TouchableOpacity>
        </View>

        {/* Credits */}
        <View className="items-center mt-8">
          <View className="flex-row items-center">
            <Text className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Made with
            </Text>
            <Heart size={14} color="#ef4444" style={{ marginHorizontal: 4 }} />
            <Text className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              for our city
            </Text>
          </View>
          <Text className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
            © 2024 Municipal Corporation. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
