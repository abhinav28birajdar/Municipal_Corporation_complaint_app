// Complaint Types
export type ComplaintStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'on_hold'
  | 'resolved'
  | 'closed'
  | 'rejected'
  | 'reopened'
  | 'escalated';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent' | 'emergency';

export interface ComplaintCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  parentCategoryId?: string;
  departmentId?: string;
  priorityDefault: ComplaintPriority;
  slaHours: number;
  isActive: boolean;
  displayOrder: number;
  keywords: string[];
  subcategories?: ComplaintSubcategory[];
}

export interface ComplaintSubcategory {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  icon?: string;
  slaHours?: number;
  isActive: boolean;
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  citizenId: string;
  categoryId: string;
  subcategoryId?: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  urgencyReason?: string;
  
  // Location
  location?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  addressText?: string;
  landmark?: string;
  wardId?: string;
  zoneId?: string;
  areaId?: string;
  
  // Media
  images?: ComplaintImage[];
  videos?: ComplaintVideo[];
  audio?: ComplaintAudio[];
  documents?: ComplaintDocument[];
  
  // Visibility & Engagement
  isPublic: boolean;
  upvoteCount: number;
  viewCount: number;
  followerCount: number;
  
  // Timeline
  submittedAt: string;
  assignedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  estimatedResolutionDate?: string;
  slaDeadline?: string;
  isOverdue: boolean;
  
  // Assignment
  assignedEmployeeId?: string;
  assignedBy?: string;
  departmentId?: string;
  
  // Related
  duplicateOf?: string;
  relatedComplaints?: string[];
  tags?: string[];
  
  // Feedback
  citizenRating?: number;
  citizenFeedback?: string;
  
  // Metadata
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ComplaintImage {
  id: string;
  complaintId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  imageType: 'evidence' | 'before' | 'after' | 'progress';
  uploadedBy: string;
  uploadedAt: string;
  metadata?: {
    width?: number;
    height?: number;
    size?: number;
    mimeType?: string;
  };
  annotations?: ImageAnnotation[];
  orderIndex: number;
}

export interface ImageAnnotation {
  id: string;
  type: 'arrow' | 'circle' | 'rectangle' | 'text';
  position: { x: number; y: number };
  size?: { width: number; height: number };
  color: string;
  text?: string;
}

export interface ComplaintVideo {
  id: string;
  complaintId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds: number;
  uploadedBy: string;
  uploadedAt: string;
  metadata?: {
    width?: number;
    height?: number;
    size?: number;
    mimeType?: string;
  };
}

export interface ComplaintAudio {
  id: string;
  complaintId: string;
  audioUrl: string;
  durationSeconds: number;
  transcription?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ComplaintDocument {
  id: string;
  complaintId: string;
  documentUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ComplaintStatusHistory {
  id: string;
  complaintId: string;
  oldStatus?: ComplaintStatus;
  newStatus: ComplaintStatus;
  changedBy: string;
  changeReason?: string;
  notes?: string;
  changedAt: string;
}

export interface ComplaintComment {
  id: string;
  complaintId: string;
  userId: string;
  commentText: string;
  isInternal: boolean;
  parentCommentId?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  replies?: ComplaintComment[];
}

export interface ComplaintUpvote {
  id: string;
  complaintId: string;
  userId: string;
  createdAt: string;
}

export interface ComplaintFollower {
  id: string;
  complaintId: string;
  userId: string;
  createdAt: string;
}

export interface ComplaintDraft {
  id: string;
  userId: string;
  categoryId?: string;
  subcategoryId?: string;
  title?: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
  };
  addressText?: string;
  images?: string[];
  priority?: ComplaintPriority;
  lastModifiedAt: string;
  createdAt: string;
}

export interface ComplaintTemplate {
  id: string;
  userId?: string;
  name: string;
  categoryId: string;
  subcategoryId?: string;
  titleTemplate: string;
  descriptionTemplate: string;
  isSystem: boolean;
  usageCount: number;
  createdAt: string;
}

export interface CitizenFeedback {
  id: string;
  complaintId: string;
  citizenId: string;
  rating: number;
  feedbackText?: string;
  categories: string[];
  wouldRecommend: boolean;
  responseTime: 'excellent' | 'good' | 'fair' | 'poor';
  qualityOfWork: 'excellent' | 'good' | 'fair' | 'poor';
  staffBehavior: 'excellent' | 'good' | 'fair' | 'poor';
  createdAt: string;
}

export interface ComplaintFilter {
  status?: ComplaintStatus[];
  priority?: ComplaintPriority[];
  categoryId?: string[];
  dateFrom?: string;
  dateTo?: string;
  wardId?: string;
  zoneId?: string;
  assignedEmployeeId?: string;
  isOverdue?: boolean;
  isPublic?: boolean;
  searchQuery?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'upvoteCount';
  sortOrder?: 'asc' | 'desc';
}

export interface ComplaintStats {
  total: number;
  submitted: number;
  inProgress: number;
  resolved: number;
  closed: number;
  overdue: number;
  avgResolutionTime: number;
  categoryBreakdown: { categoryId: string; count: number }[];
  priorityBreakdown: { priority: ComplaintPriority; count: number }[];
}

// Gamification
export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  progress: number;
  isComplete: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'complaints' | 'engagement' | 'contribution' | 'streak';
  requirement: number;
  points: number;
  badge?: string;
}

export interface ContributionScore {
  userId: string;
  totalPoints: number;
  complaintsSubmitted: number;
  complaintsResolved: number;
  upvotesReceived: number;
  commentsPosted: number;
  streak: number;
  rank: number;
  level: number;
  badges: string[];
}
