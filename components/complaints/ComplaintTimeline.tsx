// Complaint Timeline Component
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  MapPin,
  FileText,
  Image as ImageIcon,
} from 'lucide-react-native';
import { ComplaintUpdate, ComplaintStatus } from '@/types/complete';
import { useSettingsStore } from '@/store/settings-store';
import { colors as lightColors, darkColors } from '@/constants/Colors';

interface TimelineEvent {
  id: string;
  type: 'created' | 'assigned' | 'update' | 'status_change' | 'resolved' | 'closed' | 'rejected';
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
  status?: ComplaintStatus;
  images?: string[];
  isInternal?: boolean;
}

interface ComplaintTimelineProps {
  events: TimelineEvent[];
  showImages?: boolean;
  onImagePress?: (images: string[], index: number) => void;
}

export const ComplaintTimeline: React.FC<ComplaintTimelineProps> = ({
  events,
  showImages = true,
  onImagePress,
}) => {
  const { isDarkMode } = useSettingsStore();
  const colors = isDarkMode ? darkColors : lightColors;

  const getEventIcon = (type: TimelineEvent['type'], status?: ComplaintStatus) => {
    const iconColor = getIconColor(type, status);
    const iconSize = 18;
    
    switch (type) {
      case 'created':
        return <FileText size={iconSize} color={iconColor} />;
      case 'assigned':
        return <User size={iconSize} color={iconColor} />;
      case 'update':
        return <AlertCircle size={iconSize} color={iconColor} />;
      case 'resolved':
        return <CheckCircle size={iconSize} color={iconColor} />;
      case 'closed':
        return <CheckCircle size={iconSize} color={iconColor} />;
      case 'rejected':
        return <XCircle size={iconSize} color={iconColor} />;
      default:
        return <Clock size={iconSize} color={iconColor} />;
    }
  };

  const getIconColor = (type: TimelineEvent['type'], status?: ComplaintStatus): string => {
    switch (type) {
      case 'created':
        return '#3B82F6';
      case 'assigned':
        return '#8B5CF6';
      case 'resolved':
        return '#10B981';
      case 'closed':
        return '#6B7280';
      case 'rejected':
        return '#EF4444';
      default:
        return colors.tint;
    }
  };

  const getIconBackground = (type: TimelineEvent['type']): string => {
    switch (type) {
      case 'created':
        return '#DBEAFE';
      case 'assigned':
        return '#EDE9FE';
      case 'resolved':
        return '#D1FAE5';
      case 'closed':
        return '#E5E7EB';
      case 'rejected':
        return '#FEE2E2';
      default:
        return isDarkMode ? '#374151' : '#F3F4F6';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes} min ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  return (
    <View style={styles.container}>
      {events.map((event, index) => (
        <View key={event.id} style={styles.eventContainer}>
          {/* Timeline line */}
          {index !== events.length - 1 && (
            <View 
              style={[
                styles.timelineLine, 
                { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }
              ]} 
            />
          )}
          
          {/* Event icon */}
          <View 
            style={[
              styles.iconContainer, 
              { backgroundColor: getIconBackground(event.type) }
            ]}
          >
            {getEventIcon(event.type, event.status)}
          </View>
          
          {/* Event content */}
          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={[styles.title, { color: colors.text }]}>
                {event.title}
              </Text>
              <Text style={[styles.timestamp, { color: colors.tabIconDefault }]}>
                {formatDate(event.timestamp)}
              </Text>
            </View>
            
            {event.description && (
              <Text style={[styles.description, { color: colors.tabIconDefault }]}>
                {event.description}
              </Text>
            )}
            
            {event.user && (
              <View style={styles.userRow}>
                <User size={12} color={colors.tabIconDefault} />
                <Text style={[styles.userName, { color: colors.tabIconDefault }]}>
                  {event.user}
                </Text>
              </View>
            )}

            {showImages && event.images && event.images.length > 0 && (
              <View style={styles.imagesRow}>
                <ImageIcon size={12} color={colors.tabIconDefault} />
                <Text style={[styles.imageCount, { color: colors.tint }]}>
                  {event.images.length} image(s) attached
                </Text>
              </View>
            )}

            {event.isInternal && (
              <View style={[styles.internalBadge, { backgroundColor: isDarkMode ? '#374151' : '#FEF3C7' }]}>
                <Text style={[styles.internalText, { color: isDarkMode ? '#FCD34D' : '#D97706' }]}>
                  Internal Note
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  eventContainer: {
    flexDirection: 'row',
    paddingLeft: 8,
    paddingBottom: 24,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 24,
    top: 40,
    bottom: 0,
    width: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  userName: {
    fontSize: 12,
    marginLeft: 6,
  },
  imagesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  imageCount: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  internalBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 8,
  },
  internalText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default ComplaintTimeline;
