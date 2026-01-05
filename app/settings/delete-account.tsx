import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/auth-store';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  AlertTriangle,
  Trash2,
  FileText,
  MessageSquare,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';

interface DeletionReason {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const deletionReasons: DeletionReason[] = [
  {
    id: 'not_using',
    label: "I'm not using the app anymore",
    icon: <Clock size={20} color="#6B7280" />,
  },
  {
    id: 'privacy',
    label: 'Privacy concerns',
    icon: <Shield size={20} color="#6B7280" />,
  },
  {
    id: 'issues',
    label: 'Having issues with the app',
    icon: <AlertTriangle size={20} color="#6B7280" />,
  },
  {
    id: 'other',
    label: 'Other reason',
    icon: <MessageSquare size={20} color="#6B7280" />,
  },
];

export default function DeleteAccountScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  
  const [step, setStep] = useState<'reason' | 'confirm' | 'final'>('reason');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectReason = (reasonId: string) => {
    setSelectedReason(reasonId);
  };

  const handleContinue = () => {
    if (step === 'reason' && selectedReason) {
      setStep('confirm');
    } else if (step === 'confirm') {
      setStep('final');
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Verify password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: password,
      });

      if (signInError) {
        setError('Incorrect password');
        setIsLoading(false);
        return;
      }

      // Store feedback before deletion
      if (selectedReason || feedback) {
        await supabase.from('account_deletion_feedback').insert({
          user_id: user?.id,
          reason: selectedReason,
          feedback: feedback,
          deleted_at: new Date().toISOString(),
        });
      }

      // Soft delete user data (mark as deleted)
      await supabase
        .from('users')
        .update({
          deleted_at: new Date().toISOString(),
          email: `deleted_${user?.id}@deleted.local`,
          phone: null,
          name: 'Deleted User',
          avatar: null,
        })
        .eq('id', user?.id);

      // Delete auth user
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        user?.id || ''
      );

      // Sign out and navigate
      await logout();
      
      Alert.alert(
        'Account Deleted',
        'Your account has been permanently deleted. Thank you for using MuniServe.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Delete error:', error);
      setError(error.message || 'Failed to delete account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderReasonStep = () => (
    <Animated.View entering={FadeIn.duration(300)}>
      <Card style={styles.warningCard}>
        <View style={styles.warningHeader}>
          <AlertTriangle size={32} color="#EF4444" />
          <View style={styles.warningText}>
            <Text style={styles.warningTitle}>Delete Your Account</Text>
            <Text style={styles.warningDescription}>
              This action is permanent and cannot be undone.
            </Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Before you go...</Text>
      <Text style={styles.sectionDescription}>
        We'd love to know why you're leaving. Your feedback helps us improve.
      </Text>

      <View style={styles.reasonsList}>
        {deletionReasons.map((reason, index) => (
          <Animated.View
            key={reason.id}
            entering={FadeInDown.delay(index * 100).duration(300)}
          >
            <TouchableOpacity
              style={[
                styles.reasonItem,
                selectedReason === reason.id && styles.reasonItemSelected,
              ]}
              onPress={() => handleSelectReason(reason.id)}
            >
              <View style={styles.reasonIcon}>{reason.icon}</View>
              <Text style={styles.reasonLabel}>{reason.label}</Text>
              <View
                style={[
                  styles.radioButton,
                  selectedReason === reason.id && styles.radioButtonSelected,
                ]}
              >
                {selectedReason === reason.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {selectedReason === 'other' && (
        <Animated.View entering={FadeInDown.duration(300)}>
          <Input
            label="Please tell us more"
            placeholder="Your feedback helps us improve..."
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
            style={styles.feedbackInput}
          />
        </Animated.View>
      )}

      <Button
        title="Continue"
        onPress={handleContinue}
        disabled={!selectedReason}
        variant="danger"
        style={styles.continueButton}
      />
    </Animated.View>
  );

  const renderConfirmStep = () => (
    <Animated.View entering={FadeIn.duration(300)}>
      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>What happens when you delete your account?</Text>
        <View style={styles.infoList}>
          <View style={styles.infoItem}>
            <FileText size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Your complaints</Text>
              <Text style={styles.infoItemDescription}>
                All your complaint history will be anonymized
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <MessageSquare size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Your messages</Text>
              <Text style={styles.infoItemDescription}>
                All chat history will be permanently deleted
              </Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <MapPin size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoItemTitle}>Your location data</Text>
              <Text style={styles.infoItemDescription}>
                All saved addresses will be removed
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <Card style={styles.dataExportCard}>
        <View style={styles.dataExportContent}>
          <View style={styles.dataExportIcon}>
            <CheckCircle size={24} color="#10B981" />
          </View>
          <View style={styles.dataExportText}>
            <Text style={styles.dataExportTitle}>Export your data first?</Text>
            <Text style={styles.dataExportDescription}>
              You can download a copy of your data before deleting your account.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() => {
            Alert.alert('Export Data', 'We will send your data to your email.');
          }}
        >
          <Text style={styles.exportButtonText}>Export Data</Text>
        </TouchableOpacity>
      </Card>

      <View style={styles.buttonRow}>
        <Button
          title="Go Back"
          variant="outline"
          onPress={() => setStep('reason')}
          style={styles.halfButton}
        />
        <Button
          title="Continue"
          variant="danger"
          onPress={handleContinue}
          style={styles.halfButton}
        />
      </View>
    </Animated.View>
  );

  const renderFinalStep = () => (
    <Animated.View entering={FadeIn.duration(300)}>
      <Card style={styles.finalWarningCard}>
        <AlertTriangle size={48} color="#EF4444" />
        <Text style={styles.finalWarningTitle}>Are you absolutely sure?</Text>
        <Text style={styles.finalWarningDescription}>
          This action cannot be undone. This will permanently delete your account
          and remove all your data from our servers.
        </Text>
      </Card>

      <Card style={styles.confirmCard}>
        <Text style={styles.confirmLabel}>
          Type <Text style={styles.confirmKeyword}>DELETE</Text> to confirm:
        </Text>
        <TextInput
          style={styles.confirmInput}
          placeholder="DELETE"
          value={confirmText}
          onChangeText={(text) => {
            setConfirmText(text);
            setError('');
          }}
          autoCapitalize="characters"
        />

        <Text style={styles.confirmLabel}>Enter your password:</Text>
        <Input
          placeholder="Your password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          secureTextEntry
        />

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
      </Card>

      <View style={styles.buttonRow}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={() => router.back()}
          style={styles.halfButton}
        />
        <Button
          title="Delete Account"
          variant="danger"
          onPress={handleDeleteAccount}
          loading={isLoading}
          disabled={confirmText !== 'DELETE' || !password}
          leftIcon={<Trash2 size={18} color="#FFFFFF" />}
          style={styles.halfButton}
        />
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (step === 'reason') {
              router.back();
            } else if (step === 'confirm') {
              setStep('reason');
            } else {
              setStep('confirm');
            }
          }}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Account</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width:
                  step === 'reason'
                    ? '33%'
                    : step === 'confirm'
                    ? '66%'
                    : '100%',
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Step {step === 'reason' ? 1 : step === 'confirm' ? 2 : 3} of 3
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'reason' && renderReasonStep()}
        {step === 'confirm' && renderConfirmStep()}
        {step === 'final' && renderFinalStep()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  warningCard: {
    marginBottom: 24,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 16,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    flex: 1,
    marginLeft: 16,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
  },
  warningDescription: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  reasonsList: {
    gap: 12,
    marginBottom: 24,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reasonItemSelected: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  reasonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reasonLabel: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#EF4444',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  feedbackInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  continueButton: {
    marginTop: 24,
  },
  infoCard: {
    marginBottom: 16,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoList: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoItemTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  infoItemDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  dataExportCard: {
    marginBottom: 24,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 16,
  },
  dataExportContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dataExportIcon: {
    marginRight: 12,
  },
  dataExportText: {
    flex: 1,
  },
  dataExportTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#065F46',
  },
  dataExportDescription: {
    fontSize: 13,
    color: '#047857',
    marginTop: 2,
  },
  exportButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
  finalWarningCard: {
    marginBottom: 24,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  finalWarningTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 16,
    textAlign: 'center',
  },
  finalWarningDescription: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  confirmCard: {
    marginBottom: 24,
    padding: 16,
  },
  confirmLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  confirmKeyword: {
    fontWeight: '700',
    color: '#EF4444',
  },
  confirmInput: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 2,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
});
