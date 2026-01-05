// Employee Types
export type EmployeeStatus = 'active' | 'on_leave' | 'inactive' | 'suspended';

export type WorkStatus = 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'paused' | 'completed' | 'verified';

export type AttendanceStatus = 'present' | 'absent' | 'partial' | 'on_leave' | 'holiday';

export interface Employee {
  id: string;
  userId: string;
  employeeCode: string;
  departmentId: string;
  designation: string;
  specialization: string[];
  availableHours: {
    start: string;
    end: string;
    days: number[];
  };
  maxDailyAssignments: number;
  currentWorkload: number;
  ratingAverage: number;
  totalCompleted: number;
  totalRejected: number;
  joinedDate: string;
  status: EmployeeStatus;
  supervisorId?: string;
  zoneId?: string;
  wardIds?: string[];
  skills?: string[];
  certifications?: Certification[];
  metadata?: Record<string, any>;
}

export interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate?: string;
  documentUrl?: string;
}

export interface Assignment {
  id: string;
  complaintId: string;
  employeeId: string;
  assignedBy: string;
  status: WorkStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  startedAt?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  
  // Related data
  complaint?: any;
  citizen?: any;
}

export interface WorkSession {
  id: string;
  assignmentId: string;
  employeeId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  breakDuration?: number;
  location?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  status: 'active' | 'paused' | 'completed';
  notes?: string;
}

export interface WorkUpdate {
  id: string;
  assignmentId: string;
  employeeId: string;
  updateType: 'progress' | 'note' | 'photo' | 'completion' | 'issue';
  description: string;
  photos?: WorkPhoto[];
  percentage?: number;
  createdAt: string;
}

export interface WorkPhoto {
  id: string;
  assignmentId: string;
  photoUrl: string;
  thumbnailUrl?: string;
  photoType: 'before' | 'progress' | 'after' | 'issue';
  caption?: string;
  location?: {
    lat: number;
    lng: number;
  };
  uploadedAt: string;
}

export interface MaterialUsage {
  id: string;
  assignmentId: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  cost?: number;
  notes?: string;
  createdAt: string;
}

export interface EmployeeAttendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  checkInLocation?: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  checkOutLocation?: {
    lat: number;
    lng: number;
  };
  workHours?: number;
  overtimeHours?: number;
  notes?: string;
  createdAt: string;
}

export interface FieldVisit {
  id: string;
  employeeId: string;
  assignmentId?: string;
  visitType: 'inspection' | 'work' | 'follow_up' | 'verification';
  location: {
    lat: number;
    lng: number;
    accuracy?: number;
  };
  address?: string;
  arrivalTime: string;
  departureTime?: string;
  duration?: number;
  notes?: string;
  photos?: string[];
  createdAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: 'casual' | 'sick' | 'annual' | 'emergency' | 'other';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  attachments?: string[];
  createdAt: string;
}

export interface OvertimeLog {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  assignmentIds?: string[];
  createdAt: string;
}

export interface EmployeeRating {
  id: string;
  employeeId: string;
  complaintId: string;
  citizenId: string;
  rating: number;
  feedbackText?: string;
  categories: {
    punctuality: number;
    quality: number;
    behavior: number;
    communication: number;
  };
  createdAt: string;
}

export interface EmployeePerformance {
  employeeId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  metrics: {
    totalAssignments: number;
    completedAssignments: number;
    rejectedAssignments: number;
    avgCompletionTime: number;
    avgRating: number;
    totalRatings: number;
    attendanceRate: number;
    onTimeCompletion: number;
    citizenSatisfaction: number;
    slaCompliance: number;
  };
  trend: {
    assignmentsChange: number;
    ratingChange: number;
    efficiencyChange: number;
  };
  rank?: number;
  achievements?: string[];
}

export interface EmployeeSchedule {
  id: string;
  employeeId: string;
  date: string;
  shiftStart: string;
  shiftEnd: string;
  isHoliday: boolean;
  isLeave: boolean;
  assignments?: string[];
  notes?: string;
}

export interface RouteOptimization {
  employeeId: string;
  date: string;
  assignments: {
    assignmentId: string;
    order: number;
    location: { lat: number; lng: number };
    estimatedArrival: string;
    estimatedDuration: number;
  }[];
  totalDistance: number;
  totalDuration: number;
  optimizedRoute: { lat: number; lng: number }[];
}

export interface WorkTransfer {
  id: string;
  assignmentId: string;
  fromEmployeeId: string;
  toEmployeeId: string;
  reason: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestedBy: string;
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
}

export interface EmployeeFilter {
  departmentId?: string;
  status?: EmployeeStatus[];
  designation?: string;
  zoneId?: string;
  wardId?: string;
  skillIds?: string[];
  availableOnly?: boolean;
  minRating?: number;
  searchQuery?: string;
  sortBy?: 'name' | 'rating' | 'workload' | 'joinedDate';
  sortOrder?: 'asc' | 'desc';
}

export interface DailyReport {
  employeeId: string;
  date: string;
  summary: {
    totalAssignments: number;
    completed: number;
    inProgress: number;
    pending: number;
    totalHours: number;
    overtime: number;
  };
  assignments: {
    id: string;
    complaintNumber: string;
    status: WorkStatus;
    timeSpent: number;
  }[];
  attendance: {
    checkIn: string;
    checkOut: string;
    status: AttendanceStatus;
  };
  notes?: string;
  submittedAt: string;
}
