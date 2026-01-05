// Notification Types
export type NotificationChannel = 'push' | 'email' | 'sms' | 'in_app' | 'whatsapp';

export type NotificationType = 
  | 'complaint_status'
  | 'complaint_assigned'
  | 'complaint_comment'
  | 'complaint_resolved'
  | 'complaint_escalated'
  | 'assignment_new'
  | 'assignment_urgent'
  | 'assignment_deadline'
  | 'feedback_request'
  | 'announcement'
  | 'system_update'
  | 'achievement'
  | 'chat_message'
  | 'emergency'
  | 'reminder';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  priority: NotificationPriority;
  channel: NotificationChannel;
  relatedType?: 'complaint' | 'assignment' | 'announcement' | 'chat' | 'user';
  relatedId?: string;
  data?: Record<string, any>;
  imageUrl?: string;
  actionUrl?: string;
  actions?: NotificationAction[];
  isRead: boolean;
  isSent: boolean;
  isDelivered: boolean;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface NotificationAction {
  id: string;
  title: string;
  actionType: 'open_url' | 'mark_read' | 'dismiss' | 'reply' | 'custom';
  actionData?: Record<string, any>;
}

export interface NotificationPreferences {
  userId: string;
  globalEnabled: boolean;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    inApp: boolean;
    whatsapp: boolean;
  };
  types: {
    [key in NotificationType]?: {
      enabled: boolean;
      channels: NotificationChannel[];
    };
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    timezone: string;
    allowCritical: boolean;
  };
  frequency: {
    instant: boolean;
    digest: boolean;
    digestFrequency?: 'daily' | 'weekly';
    digestTime?: string;
  };
  updatedAt: string;
}

export interface PushNotificationPayload {
  to: string | string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: string;
  badge?: number;
  channelId?: string;
  priority?: 'default' | 'high';
  ttl?: number;
  expiration?: number;
  categoryId?: string;
}

export interface EmailNotificationPayload {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  templateId?: string;
  templateData?: Record<string, any>;
  from?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string;
  contentType: string;
}

export interface SMSNotificationPayload {
  to: string | string[];
  body: string;
  from?: string;
  mediaUrl?: string[];
}

export interface NotificationDeliveryLog {
  id: string;
  notificationId: string;
  channel: NotificationChannel;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  provider?: string;
  providerId?: string;
  errorMessage?: string;
  errorCode?: string;
  attempts: number;
  sentAt?: string;
  deliveredAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface NotificationAnalytics {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  deliveryRate: number;
  readRate: number;
  byChannel: {
    channel: NotificationChannel;
    sent: number;
    delivered: number;
    failed: number;
    rate: number;
  }[];
  byType: {
    type: NotificationType;
    sent: number;
    read: number;
    readRate: number;
  }[];
}

export interface ScheduledNotification {
  id: string;
  userId?: string;
  targetType: 'user' | 'role' | 'department' | 'zone' | 'all';
  targetIds?: string[];
  notification: Omit<Notification, 'id' | 'userId' | 'createdAt'>;
  scheduleType: 'once' | 'recurring';
  scheduledAt: string;
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
    daysOfWeek?: number[];
  };
  status: 'scheduled' | 'sent' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

export interface NotificationGroup {
  id: string;
  title: string;
  notifications: Notification[];
  count: number;
  latestAt: string;
  isExpanded: boolean;
}

// Chat/Messaging Types
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'citizen' | 'employee' | 'admin' | 'system';
  messageType: 'text' | 'image' | 'file' | 'voice' | 'location' | 'system';
  content: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
  location?: { lat: number; lng: number };
  replyTo?: string;
  isEdited: boolean;
  isDeleted: boolean;
  readBy: string[];
  deliveredTo: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'complaint' | 'support';
  participants: string[];
  title?: string;
  relatedType?: 'complaint' | 'assignment';
  relatedId?: string;
  lastMessage?: ChatMessage;
  unreadCount: { [userId: string]: number };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
  timestamp: string;
}

export interface ChatPresence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: string;
  device?: string;
}
