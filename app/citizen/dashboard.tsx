import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth-store';
import { useComplaintStore } from '@/store/complaint-store';
import { useNotificationStore } from '@/store/notification-store';
import { supabase } from '@/lib/supabase';
import {
  Bell,
  Plus,
  Search,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  TrendingUp,
  Flame,
  Award,
  MessageSquare,
  BarChart3,
  Zap,
  Shield,
  Users,
  Star,
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { COMPLAINT_CATEGORIES } from '@/constants/complaint-types';
import { Complaint, ComplaintStatus } from '@/types/complaint';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 100;

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

export default function CitizenDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { complaints, fetchComplaints } = useComplaintStore();
  const { unreadCount, notifications } = useNotificationStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    contributionScore: 450,
    rank: 'Silver',
  });

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      Extrapolation.CLAMP
    );

    return {
      height,
    };
  });

  const headerContentAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [1, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      // Fetch user's complaints
      const { data: complaintsData, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (complaintsData) {
        setRecentComplaints(complaintsData);
        
        // Calculate stats
        const total = complaintsData.length;
        const pending = complaintsData.filter(c => c.status === 'pending').length;
        const inProgress = complaintsData.filter(c => ['assigned', 'in_progress'].includes(c.status)).length;
        const resolved = complaintsData.filter(c => c.status === 'resolved').length;

        setStats(prev => ({
          ...prev,
          total,
          pending,
          inProgress,
          resolved,
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadData();
    setRefreshing(false);
  };

  const quickActions: QuickAction[] = [
    {
      id: 'new-complaint',
      title: 'New Complaint',
      icon: <Plus size={24} color="#FFFFFF" />,
      color: '#FFFFFF',
      backgroundColor: colors.primary,
      onPress: () => router.push('/complaints/wizard'),
    },
    {
      id: 'track',
      title: 'Track Status',
      icon: <Search size={24} color={colors.primary} />,
      color: colors.primary,
      backgroundColor: '#EFF6FF',
      onPress: () => router.push('/complaints/track'),
    },
    {
      id: 'my-complaints',
      title: 'My Complaints',
      icon: <FileText size={24} color="#10B981" />,
      color: '#10B981',
      backgroundColor: '#ECFDF5',
      onPress: () => router.push('/(tabs)/complaints'),
    },
    {
      id: 'community',
      title: 'Community',
      icon: <Users size={24} color="#F59E0B" />,
      color: '#F59E0B',
      backgroundColor: '#FFFBEB',
      onPress: () => router.push('/community'),
    },
  ];

  const statItems: StatItem[] = [
    {
      label: 'Total',
      value: stats.total,
      icon: <FileText size={16} color={colors.primary} />,
      color: colors.primary,
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: <Clock size={16} color="#F59E0B" />,
      color: '#F59E0B',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: <Zap size={16} color="#3B82F6" />,
      color: '#3B82F6',
    },
    {
      label: 'Resolved',
      value: stats.resolved,
      icon: <CheckCircle size={16} color="#10B981" />,
      color: '#10B981',
    },
  ];

  const getStatusColor = (status: ComplaintStatus) => {
    const colors: Record<ComplaintStatus, string> = {
      draft: '#6B7280',
      pending: '#F59E0B',
      under_review: '#3B82F6',
      assigned: '#8B5CF6',
      in_progress: '#3B82F6',
      on_hold: '#F97316',
      escalated: '#EF4444',
      resolved: '#10B981',
      closed: '#6B7280',
      rejected: '#EF4444',
      reopened: '#F97316',
    };
    return colors[status] || '#6B7280';
  };

  const getStatusLabel = (status: ComplaintStatus) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Animated Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <LinearGradient
          colors={[colors.primary, '#1E40AF']}
          style={styles.headerGradient}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <Avatar source={user?.avatar} name={user?.name} size="md" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => router.push('/(tabs)/notifications')}
            >
              <Bell size={24} color="#FFFFFF" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <Animated.View style={[styles.greetingContainer, headerContentAnimatedStyle]}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Citizen'}</Text>
          </Animated.View>

          {/* Contribution Score */}
          <Animated.View style={[styles.scoreContainer, headerContentAnimatedStyle]}>
            <View style={styles.scoreContent}>
              <Award size={20} color="#FCD34D" />
              <Text style={styles.scoreText}>{stats.contributionScore} points</Text>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{stats.rank}</Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            progressViewOffset={HEADER_MAX_HEIGHT}
          />
        }
      >
        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickAction, { backgroundColor: action.backgroundColor }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  action.onPress();
                }}
              >
                <View style={styles.quickActionIcon}>{action.icon}</View>
                <Text style={[styles.quickActionText, { color: action.id === 'new-complaint' ? '#FFFFFF' : '#374151' }]}>
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Statistics */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Card style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>My Complaints Overview</Text>
              <TouchableOpacity onPress={() => router.push('/analytics')}>
                <BarChart3 size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.statsGrid}>
              {statItems.map((stat, index) => (
                <View key={stat.label} style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                    {stat.icon}
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </Card>
        </Animated.View>

        {/* Recent Complaints */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Complaints</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => router.push('/(tabs)/complaints')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {recentComplaints.length > 0 ? (
            recentComplaints.slice(0, 3).map((complaint, index) => (
              <Animated.View
                key={complaint.id}
                entering={FadeInRight.delay(400 + index * 100).duration(400)}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/complaints/${complaint.id}`)}
                >
                  <Card style={styles.complaintCard}>
                    <View style={styles.complaintHeader}>
                      <View style={styles.complaintCategory}>
                        <Text style={styles.complaintCategoryEmoji}>
                          {COMPLAINT_CATEGORIES.find(c => c.id === complaint.category)?.icon || '📋'}
                        </Text>
                        <Text style={styles.complaintCategoryText}>
                          {COMPLAINT_CATEGORIES.find(c => c.id === complaint.category)?.name || complaint.category}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: `${getStatusColor(complaint.status)}15` },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: getStatusColor(complaint.status) },
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            { color: getStatusColor(complaint.status) },
                          ]}
                        >
                          {getStatusLabel(complaint.status)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.complaintTitle} numberOfLines={1}>
                      {complaint.title}
                    </Text>
                    <View style={styles.complaintMeta}>
                      <View style={styles.complaintMetaItem}>
                        <Calendar size={14} color="#6B7280" />
                        <Text style={styles.complaintMetaText}>
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                      {complaint.location && (
                        <View style={styles.complaintMetaItem}>
                          <MapPin size={14} color="#6B7280" />
                          <Text style={styles.complaintMetaText} numberOfLines={1}>
                            {typeof complaint.location === 'object' 
                              ? complaint.location.address?.split(',')[0] 
                              : complaint.location}
                          </Text>
                        </View>
                      )}
                    </View>
                  </Card>
                </TouchableOpacity>
              </Animated.View>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <FileText size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No complaints yet</Text>
              <Text style={styles.emptyDescription}>
                Tap "New Complaint" to report an issue in your area
              </Text>
            </Card>
          )}
        </Animated.View>

        {/* Community Highlights */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Community Activity</Text>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.communityScroll}
          >
            <Card style={styles.communityCard}>
              <View style={[styles.communityIcon, { backgroundColor: '#FEF2F2' }]}>
                <Flame size={24} color="#EF4444" />
              </View>
              <Text style={styles.communityValue}>24</Text>
              <Text style={styles.communityLabel}>Trending Issues</Text>
            </Card>
            <Card style={styles.communityCard}>
              <View style={[styles.communityIcon, { backgroundColor: '#ECFDF5' }]}>
                <CheckCircle size={24} color="#10B981" />
              </View>
              <Text style={styles.communityValue}>156</Text>
              <Text style={styles.communityLabel}>Resolved Today</Text>
            </Card>
            <Card style={styles.communityCard}>
              <View style={[styles.communityIcon, { backgroundColor: '#EFF6FF' }]}>
                <Users size={24} color={colors.primary} />
              </View>
              <Text style={styles.communityValue}>1.2K</Text>
              <Text style={styles.communityLabel}>Active Citizens</Text>
            </Card>
          </ScrollView>
        </Animated.View>

        {/* Announcements */}
        <Animated.View entering={FadeInDown.delay(600).duration(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Announcements</Text>
          </View>
          
          <Card style={styles.announcementCard}>
            <LinearGradient
              colors={['#FEF3C7', '#FDE68A']}
              style={styles.announcementGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.announcementContent}>
                <View style={styles.announcementIcon}>
                  <Bell size={20} color="#F59E0B" />
                </View>
                <View style={styles.announcementText}>
                  <Text style={styles.announcementTitle}>Water Supply Notice</Text>
                  <Text style={styles.announcementDescription}>
                    Scheduled maintenance on Dec 25. Water supply will be interrupted from 9 AM to 5 PM.
                  </Text>
                </View>
                <ChevronRight size={20} color="#92400E" />
              </View>
            </LinearGradient>
          </Card>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 48,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  greetingContainer: {
    marginBottom: 12,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scoreContainer: {
    alignItems: 'flex-start',
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rankBadge: {
    backgroundColor: '#FCD34D',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78350F',
  },
  scrollContent: {
    paddingTop: HEADER_MAX_HEIGHT + 16,
    paddingHorizontal: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  quickAction: {
    width: (SCREEN_WIDTH - 44) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsCard: {
    marginBottom: 24,
    padding: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  complaintCard: {
    marginBottom: 12,
    padding: 16,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  complaintCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  complaintCategoryEmoji: {
    fontSize: 20,
  },
  complaintCategoryText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  complaintMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  complaintMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  complaintMetaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  communityScroll: {
    paddingBottom: 24,
  },
  communityCard: {
    width: 140,
    padding: 16,
    alignItems: 'center',
    marginRight: 12,
  },
  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  communityValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  communityLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  announcementCard: {
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  announcementGradient: {
    padding: 16,
  },
  announcementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  announcementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  announcementText: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#78350F',
    marginBottom: 2,
  },
  announcementDescription: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
});
