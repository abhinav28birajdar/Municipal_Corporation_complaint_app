export type UserRole = "citizen" | "employee" | "admin";

export type ComplaintStatus = "new" | "assigned" | "in_progress" | "completed" | "cancelled";

export type ComplaintType =
  | "road_damage"
  | "water_supply"
  | "garbage_issue"
  | "tree_plantation"
  | "hospital_waste"
  | "other";

export type ComplaintPriority = "normal" | "urgent";

export interface User {
  avatar: string | undefined;
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  address?: string;
  department?: string;
  areaAssigned?: string;
  registrationNumber?: string;
  departmentId?: string;
}

export interface Complaint {
  id: string;
  citizenId: string;
  type: ComplaintType;
  description: string;
  photoUrls?: string[];
  locationLat?: number;
  locationLong?: number;
  address?: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assignedEmployeeId?: string;
  departmentId?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ComplaintUpdate {
  id: string;
  complaintId: string;
  status: ComplaintStatus;
  notes?: string;
  photoUrls?: string[];
  updatedBy: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  citizenId: string;
  complaintId: string;
  rating: number;
  feedbackText?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  complaintId: string;
  senderId: string;
  senderRole: UserRole;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  userRole: UserRole;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface Area {
  id: string;
  name: string;
  description?: string;
}

export interface Schedule {
  id: string;
  area: string;
  eventType: "garbage" | "tree" | "road";
  scheduleDate: string;
  remarks?: string;
  createdBy: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  photoUrl?: string;
  createdBy: string;
  createdAt: string;
}