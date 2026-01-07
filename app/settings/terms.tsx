import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, FileText } from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

interface TermsSectionProps {
  title: string;
  content: string | string[];
}

const TermsSection: React.FC<TermsSectionProps> = ({ title, content }) => {
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

export default function TermsOfServiceScreen() {
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
            <FileText size={24} color="#3b82f6" />
            <Text
              className={`text-xl font-bold ml-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              Terms of Service
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
          <TermsSection
            title="1. Acceptance of Terms"
            content="By accessing or using the Municipal Corporation Citizen Services App, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms constitute a legally binding agreement between you and the Municipal Corporation."
          />

          <TermsSection
            title="2. Eligibility"
            content={[
              'You must be at least 18 years old to use this app',
              'You must be a resident of the municipal jurisdiction',
              'You must provide accurate and complete registration information',
              'You are responsible for maintaining the confidentiality of your account',
            ]}
          />

          <TermsSection
            title="3. User Account"
            content="You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. The Municipal Corporation reserves the right to suspend or terminate accounts that violate these terms."
          />

          <TermsSection
            title="4. Acceptable Use"
            content={[
              'Use the app only for legitimate civic complaint purposes',
              'Provide accurate and truthful information in complaints',
              'Do not submit false, misleading, or fraudulent complaints',
              'Do not use the app for harassment or intimidation',
              'Do not attempt to interfere with app security or functionality',
              'Respect the privacy and rights of other users',
            ]}
          />

          <TermsSection
            title="5. Prohibited Activities"
            content={[
              'Filing false or malicious complaints',
              'Impersonating other individuals or officials',
              'Uploading inappropriate, offensive, or illegal content',
              'Attempting to access unauthorized areas of the system',
              'Using automated systems to interact with the app',
              'Violating any applicable laws or regulations',
            ]}
          />

          <TermsSection
            title="6. Complaint Submission"
            content="When submitting a complaint, you represent that the information provided is accurate to the best of your knowledge. The Municipal Corporation will make reasonable efforts to address valid complaints but does not guarantee resolution times. Priority and handling of complaints are at the discretion of relevant departments."
          />

          <TermsSection
            title="7. Intellectual Property"
            content="The app and its original content, features, and functionality are owned by the Municipal Corporation and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without prior written consent."
          />

          <TermsSection
            title="8. Content You Submit"
            content="By submitting content (photos, descriptions, feedback), you grant the Municipal Corporation a non-exclusive, royalty-free license to use, reproduce, and display such content for purposes of complaint resolution, service improvement, and public reporting (with personal information anonymized where appropriate)."
          />

          <TermsSection
            title="9. Service Availability"
            content="We strive to maintain continuous service but do not guarantee uninterrupted access. The app may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. We reserve the right to modify or discontinue features with or without notice."
          />

          <TermsSection
            title="10. Disclaimer of Warranties"
            content="The app is provided 'as is' without warranties of any kind. We do not warrant that the app will be error-free, secure, or continuously available. We are not responsible for any delays in complaint resolution or actions taken by third-party departments."
          />

          <TermsSection
            title="11. Limitation of Liability"
            content="To the maximum extent permitted by law, the Municipal Corporation shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the app. Our total liability shall not exceed the amount you paid for using the service (if any)."
          />

          <TermsSection
            title="12. Indemnification"
            content="You agree to indemnify and hold harmless the Municipal Corporation, its officers, employees, and agents from any claims, damages, losses, or expenses arising from your use of the app, violation of these terms, or infringement of any third-party rights."
          />

          <TermsSection
            title="13. Governing Law"
            content="These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in the municipal jurisdiction."
          />

          <TermsSection
            title="14. Changes to Terms"
            content="We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the modified terms. We will notify users of significant changes through the app or email."
          />

          <TermsSection
            title="15. Severability"
            content="If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect. The unenforceable provision shall be modified to reflect the parties' intentions as closely as possible."
          />

          <TermsSection
            title="16. Contact Information"
            content="For questions about these Terms of Service, please contact us at legal@municipalcorp.gov.in or visit our office at the Municipal Corporation Headquarters."
          />
        </View>

        <View className={`p-4 mt-4 rounded-xl ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
          <Text className={`text-center ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
            By using this app, you acknowledge that you have read, understood, and agree to
            be bound by these Terms of Service.
          </Text>
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
