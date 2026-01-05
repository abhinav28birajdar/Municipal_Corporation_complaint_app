// Admin Types
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  headId?: string;
  parentDepartmentId?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  employeeCount?: number;
  pendingComplaints?: number;
  avgResolutionTime?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Ward {
  id: string;
  zoneId: string;
  wardNumber: number;
  wardName: string;
  councillorName?: string;
  councillorContact?: string;
  population?: number;
  areaSqKm?: number;
  boundaries?: GeoJSON.Polygon;
  createdAt: string;
}

export interface Zone {
  id: string;
  zoneName: string;
  zoneCode: string;
  headId?: string;
  boundaries?: GeoJSON.Polygon;
  wardIds?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface SLARule {
  id: string;
  categoryId: string;
  priority: string;
  responseTimeHours: number;
  resolutionTimeHours: number;
  escalationLevel1Hours: number;
  escalationLevel2Hours: number;
  escalationLevel3Hours: number;
  isActive: boolean;
  createdAt: string;
}

export interface AssignmentRule {
  id: string;
  name: string;
  description?: string;
  ruleType: 'auto' | 'round_robin' | 'workload_based' | 'skill_based' | 'zone_based';
  conditions: {
    categoryIds?: string[];
    priorityLevels?: string[];
    zoneIds?: string[];
    wardIds?: string[];
  };
  actions: {
    departmentId?: string;
    employeeIds?: string[];
    maxWorkload?: number;
    skillRequired?: string[];
  };
  priority: number;
  isActive: boolean;
  createdAt: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  triggerEvent: 'status_change' | 'assignment' | 'sla_breach' | 'feedback' | 'escalation';
  conditions: Record<string, any>;
  actions: {
    sendNotification?: boolean;
    notificationTemplateId?: string;
    updateStatus?: string;
    assignTo?: string;
    escalateTo?: string;
    createTask?: boolean;
  };
  isActive: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'emergency' | 'maintenance' | 'event' | 'update';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdBy: string;
  targetZones?: string[];
  targetWards?: string[];
  targetRoles?: string[];
  targetDepartments?: string[];
  isActive: boolean;
  publishedAt?: string;
  expiresAt?: string;
  images?: string[];
  attachments?: string[];
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description?: string;
  category: string;
  dataType: 'string' | 'number' | 'boolean' | 'json';
  isPublic: boolean;
  isEditable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'push' | 'email' | 'sms' | 'in_app';
  event: string;
  titleTemplate: string;
  bodyTemplate: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'national' | 'local' | 'optional';
  isRecurring: boolean;
  affectedDepartments?: string[];
  createdAt: string;
}

export interface CustomField {
  id: string;
  entityType: 'complaint' | 'user' | 'employee' | 'department';
  fieldName: string;
  fieldLabel: string;
  fieldType: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'file';
  options?: string[];
  isRequired: boolean;
  isActive: boolean;
  displayOrder: number;
  validationRules?: Record<string, any>;
  createdAt: string;
}

export interface APIKey {
  id: string;
  name: string;
  keyHash: string;
  permissions: string[];
  rateLimit: number;
  isActive: boolean;
  expiresAt?: string;
  lastUsedAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
  headers?: Record<string, string>;
  retryCount: number;
  lastTriggeredAt?: string;
  lastStatus?: 'success' | 'failed';
  createdAt: string;
}

export interface BackupHistory {
  id: string;
  backupType: 'full' | 'incremental' | 'differential';
  status: 'in_progress' | 'completed' | 'failed';
  filePath?: string;
  fileSize?: number;
  startedAt: string;
  completedAt?: string;
  triggeredBy: string;
  notes?: string;
}

// Analytics Types
export interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  resolvedComplaints: number;
  overdueComplaints: number;
  avgResolutionTime: number;
  citizenSatisfaction: number;
  activeEmployees: number;
  totalCitizens: number;
  complaintsToday: number;
  resolvedToday: number;
}

export interface TrendData {
  date: string;
  complaints: number;
  resolved: number;
  avgResolutionTime: number;
}

export interface CategoryAnalytics {
  categoryId: string;
  categoryName: string;
  totalComplaints: number;
  resolved: number;
  pending: number;
  avgResolutionTime: number;
  slaBreachRate: number;
  satisfaction: number;
}

export interface DepartmentAnalytics {
  departmentId: string;
  departmentName: string;
  totalComplaints: number;
  resolved: number;
  pending: number;
  overdue: number;
  avgResolutionTime: number;
  employeeCount: number;
  avgEmployeeRating: number;
  efficiency: number;
}

export interface GeospatialAnalytics {
  wardId: string;
  wardName: string;
  zoneId: string;
  zoneName: string;
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  hotspots: {
    lat: number;
    lng: number;
    intensity: number;
    categoryId: string;
  }[];
}

export interface TimeAnalytics {
  hourlyDistribution: { hour: number; count: number }[];
  dailyDistribution: { day: string; count: number }[];
  monthlyDistribution: { month: string; count: number }[];
  peakHours: number[];
  peakDays: string[];
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  reportType: 'complaints' | 'employees' | 'departments' | 'analytics' | 'custom';
  filters: Record<string, any>;
  columns: string[];
  groupBy?: string[];
  sortBy?: string;
  chartType?: 'bar' | 'line' | 'pie' | 'table';
  isScheduled: boolean;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    recipients: string[];
  };
  createdBy: string;
  createdAt: string;
}

export interface GeneratedReport {
  id: string;
  templateId: string;
  name: string;
  format: 'pdf' | 'excel' | 'csv';
  filePath: string;
  fileSize: number;
  generatedBy: string;
  generatedAt: string;
  parameters?: Record<string, any>;
  expiresAt?: string;
}

export interface UserManagement {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: { role: string; count: number }[];
  verificationPending: number;
  suspendedUsers: number;
}

export interface BulkOperation {
  id: string;
  operationType: 'import' | 'export' | 'update' | 'delete';
  entityType: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  totalRecords: number;
  processedRecords: number;
  successCount: number;
  failureCount: number;
  errors?: { row: number; error: string }[];
  filePath?: string;
  startedAt: string;
  completedAt?: string;
  createdBy: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  targetPercentage?: number;
  targetUserIds?: string[];
  targetRoles?: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
