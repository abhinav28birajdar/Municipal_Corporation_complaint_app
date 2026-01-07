import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Share,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle,
  Copy,
  Share2,
  Home,
  FileText,
  Bell,
  MessageSquare,
  Clock,
  MapPin,
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ComplaintConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ complaintId: string }>();
  
  const confettiRef = useRef<LottieView>(null);
  
  // Animations
  const checkScale = useSharedValue(0);
  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(1);

  useEffect(() => {
    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Animations
    checkScale.value = withDelay(
      300,
      withSequence(
        withTiming(1.2, { duration: 300, easing: Easing.bezier(0.34, 1.56, 0.64, 1) }),
        withTiming(1, { duration: 200 })
      )
    );

    // Ring animation
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 1000, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 0 })
      ),
      3
    );

    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1000 }),
        withTiming(1, { duration: 0 })
      ),
      3
    );

    // Play confetti
    if (confettiRef.current) {
      confettiRef.current.play();
    }
  }, []);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const complaintNumber = `MC-${Date.now().toString().slice(-8)}`;
  const estimatedTime = '3-5 business days';

  const handleCopyId = async () => {
    // Copy to clipboard
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Clipboard.setString(complaintNumber);
    // Show toast
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I've submitted a complaint to Municipal Corporation.\n\nComplaint ID: ${complaintNumber}\n\nYou can track the status using this ID on the MuniServe app.`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleTrackComplaint = () => {
    router.push({
      pathname: '/complaints/track',
      params: { id: params.complaintId || complaintNumber },
    });
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Confetti Animation */}
      {/* <LottieView
        ref={confettiRef}
        source={require('@/assets/animations/confetti.json')}
        autoPlay={false}
        loop={false}
        style={styles.confetti}
      /> */}

      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successContainer}>
          <Animated.View style={[styles.successRing, ringAnimatedStyle]} />
          <Animated.View style={[styles.successIcon, checkAnimatedStyle]}>
            <View style={styles.successCircle}>
              <CheckCircle size={48} color="#FFFFFF" fill="#22C55E" />
            </View>
          </Animated.View>
        </View>

        {/* Success Message */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)}>
          <Text style={styles.title}>Complaint Submitted!</Text>
          <Text style={styles.subtitle}>
            Your complaint has been successfully registered and assigned to the relevant department.
          </Text>
        </Animated.View>

        {/* Complaint ID Card */}
        <Animated.View entering={FadeInDown.delay(700).duration(400)}>
          <Card style={styles.idCard}>
            <Text style={styles.idLabel}>Complaint Reference Number</Text>
            <View style={styles.idContainer}>
              <Text style={styles.idNumber}>{complaintNumber}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyId}>
                <Copy size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.idHint}>
              Save this number to track your complaint status
            </Text>
          </Card>
        </Animated.View>

        {/* Status Info */}
        <Animated.View entering={FadeInDown.delay(900).duration(400)}>
          <Card style={styles.statusCard}>
            <View style={styles.statusItem}>
              <View style={[styles.statusIcon, { backgroundColor: '#ECFDF5' }]}>
                <Clock size={20} color="#10B981" />
              </View>
              <View style={styles.statusText}>
                <Text style={styles.statusLabel}>Estimated Resolution</Text>
                <Text style={styles.statusValue}>{estimatedTime}</Text>
              </View>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <View style={[styles.statusIcon, { backgroundColor: '#EFF6FF' }]}>
                <Bell size={20} color={colors.primary} />
              </View>
              <View style={styles.statusText}>
                <Text style={styles.statusLabel}>Notifications</Text>
                <Text style={styles.statusValue}>Enabled for updates</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* What's Next */}
        <Animated.View entering={FadeInDown.delay(1100).duration(400)}>
          <Text style={styles.sectionTitle}>What happens next?</Text>
          <View style={styles.timeline}>
            <TimelineItem
              step={1}
              title="Review"
              description="Your complaint is being reviewed by the concerned department"
              isActive
            />
            <TimelineItem
              step={2}
              title="Assignment"
              description="A field officer will be assigned to address your issue"
            />
            <TimelineItem
              step={3}
              title="Resolution"
              description="The issue will be resolved and you'll be notified"
            />
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <Animated.View 
        entering={FadeInUp.delay(1300).duration(400)}
        style={styles.actionsContainer}
      >
        <Button
          title="Track Complaint"
          onPress={handleTrackComplaint}
          leftIcon={<FileText size={18} color="#FFFFFF" />}
        />
        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
            <Share2 size={20} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
            <Home size={20} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

interface TimelineItemProps {
  step: number;
  title: string;
  description: string;
  isActive?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  step,
  title,
  description,
  isActive,
}) => (
  <View style={styles.timelineItem}>
    <View style={styles.timelineLeft}>
      <View style={[styles.timelineStep, isActive && styles.timelineStepActive]}>
        <Text style={[styles.timelineStepText, isActive && styles.timelineStepTextActive]}>
          {step}
        </Text>
      </View>
      {step < 3 && <View style={[styles.timelineLine, isActive && styles.timelineLineActive]} />}
    </View>
    <View style={styles.timelineContent}>
      <Text style={[styles.timelineTitle, isActive && styles.timelineTitleActive]}>
        {title}
      </Text>
      <Text style={styles.timelineDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: 'none',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  successContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#22C55E',
  },
  successIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  idCard: {
    width: SCREEN_WIDTH - 48,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  idLabel: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  idNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  copyButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  idHint: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
  },
  statusCard: {
    width: SCREEN_WIDTH - 48,
    padding: 16,
    marginBottom: 24,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusText: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 2,
  },
  statusDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  timeline: {
    width: '100%',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineStepActive: {
    backgroundColor: colors.primary,
  },
  timelineStepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  timelineStepTextActive: {
    color: '#FFFFFF',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
  },
  timelineLineActive: {
    backgroundColor: colors.primary,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  timelineTitleActive: {
    color: colors.primary,
  },
  timelineDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  actionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginTop: 16,
  },
  secondaryButton: {
    alignItems: 'center',
    gap: 4,
  },
  secondaryButtonText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
});
