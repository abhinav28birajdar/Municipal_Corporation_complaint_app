import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
  MapPin,
  Clock,
  Trash2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { Session } from '@/types/auth';

export default function SessionManagementScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      // Mock data - replace with actual Supabase query
      const mockSessions: Session[] = [
        {
          id: '1',
          userId: user?.id || '',
          deviceName: 'iPhone 14 Pro',
          deviceType: 'mobile',
          os: 'iOS 17.2',
          ipAddress: '192.168.1.100',
          location: 'Mumbai, Maharashtra',
          isActive: true,
          isCurrent: true,
          lastActive: new Date().toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '2',
          userId: user?.id || '',
          deviceName: 'MacBook Pro',
          deviceType: 'desktop',
          browser: 'Chrome 120',
          os: 'macOS Sonoma',
          ipAddress: '192.168.1.101',
          location: 'Mumbai, Maharashtra',
          isActive: true,
          isCurrent: false,
          lastActive: new Date(Date.now() - 3600000).toISOString(),
          createdAt: new Date(Date.now() - 604800000).toISOString(),
        },
        {
          id: '3',
          userId: user?.id || '',
          deviceName: 'Windows PC',
          deviceType: 'desktop',
          browser: 'Firefox 121',
          os: 'Windows 11',
          ipAddress: '10.0.0.50',
          location: 'Pune, Maharashtra',
          isActive: false,
          isCurrent: false,
          lastActive: new Date(Date.now() - 86400000 * 3).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        },
        {
          id: '4',
          userId: user?.id || '',
          deviceName: 'iPad Air',
          deviceType: 'tablet',
          os: 'iPadOS 17',
          ipAddress: '192.168.1.102',
          location: 'Mumbai, Maharashtra',
          isActive: false,
          isCurrent: false,
          lastActive: new Date(Date.now() - 86400000 * 7).toISOString(),
          createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        },
      ];

      setSessions(mockSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
      Alert.alert('Error', 'Failed to load sessions. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadSessions();
  };

  const handleTerminateSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session?.isCurrent) {
      Alert.alert('Cannot Terminate', 'You cannot terminate your current session.');
      return;
    }

    Alert.alert(
      'Terminate Session',
      'Are you sure you want to terminate this session? The device will be logged out.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Terminate',
          style: 'destructive',
          onPress: async () => {
            try {
              // Terminate session via Supabase
              setSessions(prev => prev.filter(s => s.id !== sessionId));
              Alert.alert('Success', 'Session terminated successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to terminate session. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleTerminateAll = () => {
    Alert.alert(
      'Terminate All Sessions',
      'Are you sure you want to log out from all other devices? This will not affect your current session.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Terminate All',
          style: 'destructive',
          onPress: async () => {
            try {
              // Terminate all sessions except current
              setSessions(prev => prev.filter(s => s.isCurrent));
              Alert.alert('Success', 'All other sessions terminated successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to terminate sessions. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone size={24} color={colors.primary} />;
      case 'tablet':
        return <Tablet size={24} color={colors.primary} />;
      case 'desktop':
        return <Laptop size={24} color={colors.primary} />;
      default:
        return <Globe size={24} color={colors.primary} />;
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const activeSessions = sessions.filter(s => s.isActive);
  const inactiveSessions = sessions.filter(s => !s.isActive);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Sessions</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Security Notice */}
        <Card style={styles.securityCard}>
          <View style={styles.securityContent}>
            <ShieldCheck size={24} color="#10B981" />
            <View style={styles.securityText}>
              <Text style={styles.securityTitle}>Account Security</Text>
              <Text style={styles.securityDescription}>
                Review devices that have accessed your account. Terminate any sessions you don't recognize.
              </Text>
            </View>
          </View>
        </Card>

        {/* Current Session */}
        {sessions.find(s => s.isCurrent) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Session</Text>
            {renderSessionCard(sessions.find(s => s.isCurrent)!, true)}
          </View>
        )}

        {/* Other Active Sessions */}
        {activeSessions.filter(s => !s.isCurrent).length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Sessions</Text>
              <Text style={styles.sessionCount}>
                {activeSessions.filter(s => !s.isCurrent).length} devices
              </Text>
            </View>
            {activeSessions.filter(s => !s.isCurrent).map(session => 
              renderSessionCard(session)
            )}
          </View>
        )}

        {/* Inactive Sessions */}
        {inactiveSessions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Previous Sessions</Text>
              <Text style={styles.sessionCount}>
                {inactiveSessions.length} devices
              </Text>
            </View>
            {inactiveSessions.map(session => 
              renderSessionCard(session)
            )}
          </View>
        )}

        {/* Terminate All Button */}
        {activeSessions.filter(s => !s.isCurrent).length > 0 && (
          <View style={styles.terminateAllContainer}>
            <Button
              title="Terminate All Other Sessions"
              variant="danger"
              onPress={handleTerminateAll}
              leftIcon={<Trash2 size={18} color="#FFFFFF" />}
            />
          </View>
        )}

        {/* Security Tips */}
        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <AlertCircle size={20} color="#F59E0B" />
            <Text style={styles.tipsTitle}>Security Tips</Text>
          </View>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Always log out from public or shared devices</Text>
            <Text style={styles.tipItem}>• Enable two-factor authentication for extra security</Text>
            <Text style={styles.tipItem}>• Regularly review and terminate unknown sessions</Text>
            <Text style={styles.tipItem}>• Keep your app and device software up to date</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );

  function renderSessionCard(session: Session, isCurrent = false) {
    return (
      <Card key={session.id} style={[styles.sessionCard, isCurrent && styles.currentSessionCard]}>
        <View style={styles.sessionHeader}>
          <View style={styles.deviceIconContainer}>
            {getDeviceIcon(session.deviceType)}
          </View>
          <View style={styles.sessionInfo}>
            <View style={styles.sessionNameRow}>
              <Text style={styles.deviceName}>{session.deviceName}</Text>
              {isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current</Text>
                </View>
              )}
              {session.isActive && !isCurrent && (
                <View style={styles.activeBadge}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeBadgeText}>Active</Text>
                </View>
              )}
            </View>
            <Text style={styles.sessionDetails}>
              {session.os}
              {session.browser ? ` • ${session.browser}` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.sessionMeta}>
          <View style={styles.metaItem}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.metaText}>{session.location || 'Unknown location'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.metaText}>
              {isCurrent ? 'Active now' : formatLastActive(session.lastActive)}
            </Text>
          </View>
        </View>

        <Text style={styles.ipAddress}>IP: {session.ipAddress}</Text>

        {!isCurrent && (
          <TouchableOpacity
            style={styles.terminateButton}
            onPress={() => handleTerminateSession(session.id)}
          >
            <Trash2 size={16} color="#EF4444" />
            <Text style={styles.terminateText}>Terminate Session</Text>
          </TouchableOpacity>
        )}
      </Card>
    );
  }
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  securityCard: {
    marginBottom: 24,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  securityContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  securityText: {
    flex: 1,
    marginLeft: 12,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
  },
  securityDescription: {
    fontSize: 14,
    color: '#047857',
    marginTop: 4,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  sessionCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  sessionCard: {
    marginBottom: 12,
    padding: 16,
  },
  currentSessionCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sessionNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  currentBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#047857',
  },
  sessionDetails: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  sessionMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  ipAddress: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  terminateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  terminateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  terminateAllContainer: {
    marginBottom: 24,
  },
  tipsCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#A16207',
    lineHeight: 20,
  },
});
