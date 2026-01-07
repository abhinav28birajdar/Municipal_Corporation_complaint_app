import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

interface PolicySectionProps {
  title: string;
  content: string | string[];
}

const PolicySection: React.FC<PolicySectionProps> = ({ title, content }) => {
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';

  return (
    <View className="mb-6">
      <Text
        className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
      >
        {title}
      </Text>
      {Array.isArray(content) ? (
        content.map((item, index) => (
          <View key={index} className="flex-row mb-2">
            <Text className={`mr-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>•</Text>
            <Text className={`flex-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {item}
            </Text>
          </View>
        ))
      ) : (
        <Text className={`leading-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {content}
        </Text>
      )}
    </View>
  );
};

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';

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
          <View className="flex-row items-center flex-1">
            <Shield size={24} color="#3b82f6" />
            <Text
              className={`text-xl font-bold ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Privacy Policy
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        <View className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Last updated: January 1, 2024
          </Text>
        </View>

        <View className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <PolicySection
            title="1. Introduction"
            content="Welcome to the Municipal Corporation Citizen Services App. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application."
          />

          <PolicySection
            title="2. Information We Collect"
            content={[
              'Personal identification information (Name, email address, phone number)',
              'Government-issued ID details (Aadhaar number for verification)',
              'Location data (for complaint geolocation)',
              'Photos and media (for complaint documentation)',
              'Device information (for app functionality)',
              'Usage data (to improve our services)',
            ]}
          />

          <PolicySection
            title="3. How We Use Your Information"
            content={[
              'To process and track your civic complaints',
              'To communicate with you regarding complaint status',
              'To verify your identity as a citizen',
              'To send important notifications and updates',
              'To improve our services and user experience',
              'To comply with legal obligations',
            ]}
          />

          <PolicySection
            title="4. Information Sharing"
            content="We may share your information with relevant municipal departments and authorized government agencies solely for the purpose of resolving your complaints and providing civic services. We do not sell, trade, or rent your personal information to third parties for marketing purposes."
          />

          <PolicySection
            title="5. Data Security"
            content="We implement appropriate technical and organizational security measures to protect your personal information. This includes encryption, secure servers, and access controls. However, no electronic transmission over the internet can be guaranteed to be 100% secure."
          />

          <PolicySection
            title="6. Data Retention"
            content="We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. Complaint records may be retained for a period as mandated by government regulations."
          />

          <PolicySection
            title="7. Your Rights"
            content={[
              'Access your personal data',
              'Correct inaccurate information',
              'Request deletion of your data (subject to legal requirements)',
              'Withdraw consent for data processing',
              'Lodge a complaint with supervisory authorities',
            ]}
          />

          <PolicySection
            title="8. Location Services"
            content="The app uses location services to automatically detect complaint locations and provide nearby civic services. You can control location permissions through your device settings. Disabling location may limit certain app features."
          />

          <PolicySection
            title="9. Camera and Photo Access"
            content="We request camera access to allow you to capture photos of civic issues when filing complaints. These photos are used solely for complaint documentation and resolution. You can manage camera permissions in your device settings."
          />

          <PolicySection
            title="10. Push Notifications"
            content="We send push notifications to keep you updated on complaint status, important announcements, and civic alerts. You can opt out of notifications through the app settings or your device settings."
          />

          <PolicySection
            title="11. Children's Privacy"
            content="Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a minor, please contact us immediately."
          />

          <PolicySection
            title="12. Changes to This Policy"
            content="We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date. We encourage you to review this policy periodically."
          />

          <PolicySection
            title="13. Contact Us"
            content="If you have questions or concerns about this Privacy Policy or our data practices, please contact us at privacy@municipalcorp.gov.in or call our helpline at +91 1234-567-890."
          />
        </View>

        <View className="items-center py-6">
          <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            © 2024 Municipal Corporation. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
