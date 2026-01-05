import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  TextInput,
  FlatList,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  ChevronRight,
  User,
  FileText,
  Truck,
  Wrench,
  Phone,
  MessageSquare,
  Star,
  Share2,
  X,
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { STATUS_CONFIG, COMPLAINT_CATEGORIES } from '@/constants/complaint-types';
import { Complaint, ComplaintStatus, ComplaintStatusHistory } from '@/types/complaint';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TimelineEvent {
  id: string;
  status: ComplaintStatus;
  timestamp: string;
  description: string;
  user?: {
    name: string;
    role: string;
  };
}

export default function TrackComplaintScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  
  const [searchQuery, setSearchQuery] = useState(params.id || '');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [assignedEmployee, setAssignedEmployee] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(!params.id);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchComplaint(params.id);
    }
  }, [params.id]);

  const fetchComplaint = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch complaint details
      const { data: complaintData, error: complaintError } = await supabase
        .from('complaints')
        .select('*, users(*), assigned_employee:employees(*)')
        .eq('id', id)
        .single();

      if (complaintError) throw complaintError;

      if (!complaintData) {
        setError('Complaint not found');
        setIsLoading(false);
        return;
      }

      setComplaint(complaintData);
      setAssignedEmployee(complaintData.assigned_employee);

      // Fetch timeline/status history
      const { data: historyData, error: historyError } = await supabase
        .from('complaint_status_history')
        .select('*, changed_by:users(name, role)')
        .eq('complaint_id', id)
        .order('created_at', { ascending: true });

      if (historyData) {
        setTimeline(
          historyData.map((h) => ({
            id: h.id,
            status: h.status,
            timestamp: h.created_at,
            description: h.notes || getStatusDescription(h.status),
            user: h.changed_by,
          }))
        );
      }

      setIsSearching(false);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch complaint');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError('Please enter a complaint ID');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fetchComplaint(searchQuery.trim());
  };

  const handleRefresh = () => {
    if (complaint) {
      setRefreshing(true);
      fetchComplaint(complaint.id);
    }
  };

  const getStatusDescription = (status: ComplaintStatus): string => {
    const descriptions: Record<ComplaintStatus, string> = {
      draft: 'Complaint saved as draft',
      pending: 'Complaint submitted and pending review',
      under_review: 'Being reviewed by concerned department',
      assigned: 'Assigned to field officer for resolution',
      in_progress: 'Work in progress to resolve the issue',
      on_hold: 'Work temporarily paused',
      escalated: 'Escalated to higher authorities',
      resolved: 'Issue has been resolved',
      closed: 'Complaint closed after resolution',
      rejected: 'Complaint was rejected',
      reopened: 'Complaint reopened for further action',
    };
    return descriptions[status] || 'Status updated';
  };

  const getStatusIcon = (status: ComplaintStatus) => {
    const config = STATUS_CONFIG[status];
    switch (status) {
      case 'pending':
        return <Clock size={20} color={config.color} />;
      case 'resolved':
      case 'closed':
        return <CheckCircle size={20} color={config.color} />;
      case 'rejected':
      case 'escalated':
        return <AlertCircle size={20} color={config.color} />;
      case 'in_progress':
        return <Wrench size={20} color={config.color} />;
      case 'assigned':
        return <User size={20} color={config.color} />;
      default:
        return <FileText size={20} color={config.color} />;
    }
  };

  const renderSearchView = () => (
    <Animated.View entering={FadeIn.duration(300)} style={styles.searchContainer}>
      <View style={styles.searchIllustration}>
        <Search size={64} color="#D1D5DB" />
      </View>
      <Text style={styles.searchTitle}>Track Your Complaint</Text>
      <Text style={styles.searchDescription}>
        Enter your complaint reference number to check the current status
      </Text>

      <View style={styles.searchInputContainer}>
        <Search size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Enter Complaint ID (e.g., MC-12345678)"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setError(null);
          }}
          autoCapitalize="characters"
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Animated.View entering={FadeInDown.duration(200)}>
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}

      <Button
        title="Track Complaint"
        onPress={handleSearch}
        loading={isLoading}
        style={styles.searchButton}
      />

      <Text style={styles.orText}>— OR —</Text>

      <TouchableOpacity
        style={styles.myComplaintsButton}
        onPress={() => router.push('/(tabs)/complaints')}
      >
        <FileText size={20} color={colors.primary} />
        <Text style={styles.myComplaintsText}>View All My Complaints</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderComplaintDetails = () => (
    <ScrollView
      style={styles.detailsContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Status Card */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIconLarge}>
              {getStatusIcon(complaint!.status)}
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>Current Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: STATUS_CONFIG[complaint!.status].backgroundColor },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    { color: STATUS_CONFIG[complaint!.status].color },
                  ]}
                >
                  {STATUS_CONFIG[complaint!.status].label}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.statusDescription}>
            {getStatusDescription(complaint!.status)}
          </Text>
        </Card>
      </Animated.View>

      {/* Complaint Summary */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryEmoji}>
                {COMPLAINT_CATEGORIES.find((c) => c.id === complaint?.category)?.icon || '📋'}
              </Text>
              <Text style={styles.categoryText}>
                {COMPLAINT_CATEGORIES.find((c) => c.id === complaint?.category)?.name}
              </Text>
            </View>
            <Text style={styles.complaintId}>#{complaint?.id?.slice(-8).toUpperCase()}</Text>
          </View>

          <Text style={styles.complaintTitle}>{complaint?.title}</Text>
          <Text style={styles.complaintDescription}>{complaint?.description}</Text>

          <View style={styles.summaryMeta}>
            <View style={styles.metaItem}>
              <Calendar size={14} color="#6B7280" />
              <Text style={styles.metaText}>
                {new Date(complaint?.created_at || '').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
            {complaint?.location && (
              <View style={styles.metaItem}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.metaText} numberOfLines={1}>
                  {typeof complaint.location === 'object'
                    ? complaint.location.address
                    : complaint.location}
                </Text>
              </View>
            )}
          </View>
        </Card>
      </Animated.View>

      {/* Assigned Employee */}
      {assignedEmployee && (
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Card style={styles.employeeCard}>
            <Text style={styles.sectionTitle}>Assigned Officer</Text>
            <View style={styles.employeeInfo}>
              <View style={styles.employeeAvatar}>
                <User size={24} color="#FFFFFF" />
              </View>
              <View style={styles.employeeDetails}>
                <Text style={styles.employeeName}>{assignedEmployee.name}</Text>
                <Text style={styles.employeeRole}>{assignedEmployee.designation}</Text>
              </View>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => {
                  // Open chat or call
                }}
              >
                <MessageSquare size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </Card>
        </Animated.View>
      )}

      {/* Timeline */}
      <Animated.View entering={FadeInDown.delay(400).duration(400)}>
        <Text style={styles.sectionTitle}>Progress Timeline</Text>
        <Card style={styles.timelineCard}>
          {timeline.length > 0 ? (
            timeline.map((event, index) => (
              <View key={event.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      { backgroundColor: STATUS_CONFIG[event.status].color },
                    ]}
                  />
                  {index < timeline.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timelineStatus}>
                      {STATUS_CONFIG[event.status].label}
                    </Text>
                    <Text style={styles.timelineTime}>
                      {new Date(event.timestamp).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <Text style={styles.timelineDescription}>{event.description}</Text>
                  {event.user && (
                    <Text style={styles.timelineUser}>
                      by {event.user.name} ({event.user.role})
                    </Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noTimeline}>
              <Clock size={32} color="#D1D5DB" />
              <Text style={styles.noTimelineText}>Timeline will appear here</Text>
            </View>
          )}
        </Card>
      </Animated.View>

      {/* Action Buttons */}
      {complaint?.status === 'resolved' && (
        <Animated.View entering={FadeInUp.delay(500).duration(400)}>
          <Card style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>Was the issue resolved satisfactorily?</Text>
            <View style={styles.feedbackButtons}>
              <TouchableOpacity
                style={styles.feedbackButton}
                onPress={() => router.push(`/complaints/${complaint.id}/feedback`)}
              >
                <Star size={20} color="#F59E0B" />
                <Text style={styles.feedbackButtonText}>Rate & Review</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.feedbackButton, styles.reopenButton]}
                onPress={() => {
                  // Reopen complaint
                }}
              >
                <AlertCircle size={20} color="#EF4444" />
                <Text style={[styles.feedbackButtonText, styles.reopenText]}>
                  Not Resolved
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </Animated.View>
      )}

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Share complaint
          }}
        >
          <Share2 size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/complaints/${complaint?.id}`)}
        >
          <FileText size={20} color={colors.primary} />
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (complaint && !params.id) {
              setComplaint(null);
              setIsSearching(true);
            } else {
              router.back();
            }
          }}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Complaint</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      {isLoading && !complaint ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Fetching complaint details...</Text>
        </View>
      ) : isSearching || !complaint ? (
        renderSearchView()
      ) : (
        renderComplaintDetails()
      )}
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  searchContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIllustration: {
    marginBottom: 24,
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  searchDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    width: '100%',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 16,
  },
  searchButton: {
    width: '100%',
    marginBottom: 24,
  },
  orText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  myComplaintsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  myComplaintsText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIconLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  summaryCard: {
    marginBottom: 16,
    padding: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  complaintId: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  complaintTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  complaintDescription: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  summaryMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  employeeCard: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  employeeDetails: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  employeeRole: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineCard: {
    marginBottom: 16,
    padding: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  timelineTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  timelineDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  timelineUser: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontStyle: 'italic',
  },
  noTimeline: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noTimelineText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9CA3AF',
  },
  feedbackCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 16,
    textAlign: 'center',
  },
  feedbackButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  feedbackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
  },
  reopenButton: {
    backgroundColor: '#FEE2E2',
  },
  feedbackButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#92400E',
  },
  reopenText: {
    color: '#991B1B',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginTop: 8,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
});
