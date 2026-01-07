// Complaint Detail Card Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  Tag,
  MessageSquare,
  ThumbsUp,
  Share2,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react-native';
import { Complaint, ComplaintStatus, ComplaintPriority } from '@/types/complete';
import { useSettingsStore } from '@/store/settings-store';
import { colors as lightColors, darkColors } from '@/constants/Colors';

interface ComplaintDetailCardProps {
  complaint: Complaint;
  onViewLocation?: () => void;
  onViewTimeline?: () => void;
  onUpvote?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onImagePress?: (images: string[], index: number) => void;
}

const statusConfig: Record<ComplaintStatus, { color: string; bg: string; label: string }> = {
  submitted: { color: '#D97706', bg: '#FEF3C7', label: 'Submitted' },
  acknowledged: { color: '#2563EB', bg: '#DBEAFE', label: 'Acknowledged' },
  in_progress: { color: '#4F46E5', bg: '#E0E7FF', label: 'In Progress' },
  resolved: { color: '#059669', bg: '#D1FAE5', label: 'Resolved' },
  rejected: { color: '#DC2626', bg: '#FEE2E2', label: 'Rejected' },
  reopened: { color: '#DB2777', bg: '#FCE7F3', label: 'Reopened' },
};

const priorityConfig: Record<ComplaintPriority, { color: string; bg: string; label: string }> = {
  low: { color: '#059669', bg: '#D1FAE5', label: 'Low' },
  medium: { color: '#D97706', bg: '#FEF3C7', label: 'Medium' },
  high: { color: '#EA580C', bg: '#FED7AA', label: 'High' },
  critical: { color: '#DC2626', bg: '#FEE2E2', label: 'Critical' },
};

export const ComplaintDetailCard: React.FC<ComplaintDetailCardProps> = ({
  complaint,
  onViewLocation,
  onViewTimeline,
  onUpvote,
  onComment,
  onShare,
  onImagePress,
}) => {
  const { isDarkMode } = useSettingsStore();
  const colors = isDarkMode ? darkColors : lightColors;
  const status = statusConfig[complaint.status];
  const priority = priorityConfig[complaint.priority];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysRemaining = () => {
    if (!complaint.sla_deadline) return null;
    const deadline = new Date(complaint.sla_deadline);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Status and Priority */}
      <View style={styles.header}>
        <View style={styles.badgesRow}>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: priority.bg }]}>
            <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />
            <Text style={[styles.priorityText, { color: priority.color }]}>
              {priority.label} Priority
            </Text>
          </View>
        </View>
        
        {/* Complaint Number */}
        <Text style={[styles.complaintNumber, { color: colors.tabIconDefault }]}>
          #{complaint.complaint_number}
        </Text>
      </View>

      {/* Title and Description */}
      <View style={styles.titleSection}>
        <Text style={[styles.title, { color: colors.text }]}>
          {complaint.title}
        </Text>
        <Text style={[styles.description, { color: colors.tabIconDefault }]}>
          {complaint.description}
        </Text>
      </View>

      {/* SLA Deadline Warning */}
      {daysRemaining !== null && daysRemaining <= 3 && complaint.status !== 'resolved' && complaint.status !== 'rejected' && (
        <View style={[styles.slaWarning, { backgroundColor: daysRemaining <= 0 ? '#FEE2E2' : '#FEF3C7' }]}>
          <AlertTriangle size={16} color={daysRemaining <= 0 ? '#DC2626' : '#D97706'} />
          <Text style={[styles.slaText, { color: daysRemaining <= 0 ? '#DC2626' : '#D97706' }]}>
            {daysRemaining <= 0 
              ? 'SLA deadline exceeded!' 
              : `SLA deadline in ${daysRemaining} day(s)`}
          </Text>
        </View>
      )}

      {/* Images */}
      {complaint.images && complaint.images.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.imagesContainer}
        >
          {complaint.images.map((image, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => onImagePress?.(complaint.images!, index)}
              activeOpacity={0.8}
            >
              <Image 
                source={{ uri: image }} 
                style={styles.image}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Details Grid */}
      <View style={[styles.detailsGrid, { borderColor: isDarkMode ? '#374151' : '#E5E7EB' }]}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Calendar size={16} color={colors.tabIconDefault} />
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: colors.tabIconDefault }]}>
                Created
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {formatDate(complaint.created_at)}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Tag size={16} color={colors.tabIconDefault} />
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: colors.tabIconDefault }]}>
                Category
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {(complaint as any).category?.name || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Building2 size={16} color={colors.tabIconDefault} />
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: colors.tabIconDefault }]}>
                Department
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {(complaint as any).department?.name || 'Unassigned'}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <User size={16} color={colors.tabIconDefault} />
            <View style={styles.detailContent}>
              <Text style={[styles.detailLabel, { color: colors.tabIconDefault }]}>
                Assigned To
              </Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {(complaint as any).assigned_employee?.user?.full_name || 'Not Assigned'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Location Section */}
      {complaint.address && (
        <TouchableOpacity 
          style={[styles.locationSection, { backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB' }]}
          onPress={onViewLocation}
          activeOpacity={0.7}
        >
          <View style={styles.locationContent}>
            <MapPin size={18} color={colors.tint} />
            <Text 
              style={[styles.locationText, { color: colors.text }]}
              numberOfLines={2}
            >
              {complaint.address}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.tabIconDefault} />
        </TouchableOpacity>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onUpvote}
          activeOpacity={0.7}
        >
          <ThumbsUp size={18} color={colors.tabIconDefault} />
          <Text style={[styles.actionText, { color: colors.tabIconDefault }]}>
            {complaint.upvote_count || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onComment}
          activeOpacity={0.7}
        >
          <MessageSquare size={18} color={colors.tabIconDefault} />
          <Text style={[styles.actionText, { color: colors.tabIconDefault }]}>
            {complaint.comment_count || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onShare}
          activeOpacity={0.7}
        >
          <Share2 size={18} color={colors.tabIconDefault} />
          <Text style={[styles.actionText, { color: colors.tabIconDefault }]}>
            Share
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.timelineButton, { backgroundColor: colors.tint }]}
          onPress={onViewTimeline}
          activeOpacity={0.7}
        >
          <Clock size={16} color="#FFFFFF" />
          <Text style={styles.timelineButtonText}>
            Timeline
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  complaintNumber: {
    fontSize: 13,
    fontWeight: '500',
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  slaWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  slaText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  imagesContainer: {
    marginBottom: 16,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 10,
  },
  detailsGrid: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailContent: {
    marginLeft: 10,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  locationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  timelineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  timelineButtonText: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ComplaintDetailCard;
