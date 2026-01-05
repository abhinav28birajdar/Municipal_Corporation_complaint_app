import { ComplaintType } from "@/types";
import { ComplaintCategory } from "@/types/complaint";

// Legacy format for backwards compatibility
export const complaintTypes: { value: ComplaintType; label: string; icon: string }[] = [
  { value: "road_damage", label: "Road Damage", icon: "road" },
  { value: "water_supply", label: "Water Supply", icon: "droplet" },
  { value: "garbage_issue", label: "Garbage Issue", icon: "trash-2" },
  { value: "tree_plantation", label: "Tree Plantation", icon: "tree" },
  { value: "hospital_waste", label: "Hospital Waste", icon: "activity" },
  { value: "other", label: "Other", icon: "more-horizontal" }
];

// Enhanced categories with icons and descriptions
export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface SubcategoryItem {
  id: string;
  name: string;
}

export const COMPLAINT_CATEGORIES: CategoryItem[] = [
  {
    id: 'roads',
    name: 'Roads & Footpaths',
    icon: '🛣️',
    description: 'Potholes, damaged roads, footpath issues',
    color: '#6366F1',
  },
  {
    id: 'water',
    name: 'Water Supply',
    icon: '💧',
    description: 'Water shortage, contamination, leakage',
    color: '#3B82F6',
  },
  {
    id: 'drainage',
    name: 'Drainage & Sewage',
    icon: '🚰',
    description: 'Blocked drains, overflow, sewage issues',
    color: '#8B5CF6',
  },
  {
    id: 'garbage',
    name: 'Garbage & Sanitation',
    icon: '🗑️',
    description: 'Waste collection, cleanliness, dumping',
    color: '#10B981',
  },
  {
    id: 'streetlights',
    name: 'Street Lights',
    icon: '💡',
    description: 'Non-functional lights, damaged poles',
    color: '#F59E0B',
  },
  {
    id: 'parks',
    name: 'Parks & Gardens',
    icon: '🌳',
    description: 'Park maintenance, tree issues, greenery',
    color: '#22C55E',
  },
  {
    id: 'buildings',
    name: 'Buildings & Property',
    icon: '🏢',
    description: 'Illegal construction, encroachment',
    color: '#EF4444',
  },
  {
    id: 'traffic',
    name: 'Traffic & Parking',
    icon: '🚗',
    description: 'Traffic signals, parking issues, congestion',
    color: '#EC4899',
  },
  {
    id: 'noise',
    name: 'Noise & Pollution',
    icon: '🔊',
    description: 'Noise complaints, air pollution, dust',
    color: '#F97316',
  },
  {
    id: 'animals',
    name: 'Stray Animals',
    icon: '🐕',
    description: 'Stray dogs, cattle on roads, animal issues',
    color: '#84CC16',
  },
  {
    id: 'health',
    name: 'Public Health',
    icon: '🏥',
    description: 'Health hazards, mosquito breeding, diseases',
    color: '#14B8A6',
  },
  {
    id: 'other',
    name: 'Other Issues',
    icon: '📋',
    description: 'Any other municipal concerns',
    color: '#6B7280',
  },
];

export const COMPLAINT_SUBCATEGORIES: Record<string, SubcategoryItem[]> = {
  roads: [
    { id: 'pothole', name: 'Pothole' },
    { id: 'road_damage', name: 'Road Damage' },
    { id: 'footpath_damage', name: 'Footpath Damage' },
    { id: 'road_marking', name: 'Road Marking Issue' },
    { id: 'speed_breaker', name: 'Speed Breaker Issue' },
    { id: 'waterlogging', name: 'Waterlogging' },
  ],
  water: [
    { id: 'no_supply', name: 'No Water Supply' },
    { id: 'low_pressure', name: 'Low Pressure' },
    { id: 'contamination', name: 'Water Contamination' },
    { id: 'leakage', name: 'Pipeline Leakage' },
    { id: 'meter_issue', name: 'Meter Issue' },
    { id: 'billing', name: 'Billing Problem' },
  ],
  drainage: [
    { id: 'blocked_drain', name: 'Blocked Drain' },
    { id: 'overflow', name: 'Drain Overflow' },
    { id: 'broken_cover', name: 'Broken Manhole Cover' },
    { id: 'sewage_leak', name: 'Sewage Leakage' },
    { id: 'bad_odor', name: 'Bad Odor' },
  ],
  garbage: [
    { id: 'missed_collection', name: 'Missed Collection' },
    { id: 'illegal_dumping', name: 'Illegal Dumping' },
    { id: 'overflowing_bin', name: 'Overflowing Bin' },
    { id: 'construction_waste', name: 'Construction Waste' },
    { id: 'dead_animal', name: 'Dead Animal' },
  ],
  streetlights: [
    { id: 'not_working', name: 'Not Working' },
    { id: 'flickering', name: 'Flickering Light' },
    { id: 'damaged_pole', name: 'Damaged Pole' },
    { id: 'wiring_issue', name: 'Wiring Issue' },
    { id: 'new_light', name: 'Request New Light' },
  ],
  parks: [
    { id: 'maintenance', name: 'Park Maintenance' },
    { id: 'fallen_tree', name: 'Fallen Tree' },
    { id: 'damaged_equipment', name: 'Damaged Equipment' },
    { id: 'overgrown', name: 'Overgrown Vegetation' },
    { id: 'tree_trimming', name: 'Tree Trimming Needed' },
  ],
  buildings: [
    { id: 'illegal_construction', name: 'Illegal Construction' },
    { id: 'encroachment', name: 'Encroachment' },
    { id: 'dangerous_building', name: 'Dangerous Building' },
    { id: 'unauthorized_use', name: 'Unauthorized Use' },
  ],
  traffic: [
    { id: 'signal_issue', name: 'Traffic Signal Issue' },
    { id: 'illegal_parking', name: 'Illegal Parking' },
    { id: 'missing_sign', name: 'Missing Sign Board' },
    { id: 'congestion', name: 'Traffic Congestion' },
  ],
  noise: [
    { id: 'loud_music', name: 'Loud Music' },
    { id: 'construction_noise', name: 'Construction Noise' },
    { id: 'industrial_noise', name: 'Industrial Noise' },
    { id: 'air_pollution', name: 'Air Pollution' },
    { id: 'burning', name: 'Open Burning' },
  ],
  animals: [
    { id: 'stray_dogs', name: 'Stray Dogs' },
    { id: 'cattle', name: 'Stray Cattle' },
    { id: 'dog_bite', name: 'Dog Bite Incident' },
    { id: 'animal_abuse', name: 'Animal Abuse' },
  ],
  health: [
    { id: 'mosquito', name: 'Mosquito Breeding' },
    { id: 'dirty_area', name: 'Unhygienic Area' },
    { id: 'food_safety', name: 'Food Safety Issue' },
    { id: 'disease_outbreak', name: 'Disease Outbreak' },
  ],
  other: [
    { id: 'general', name: 'General Complaint' },
    { id: 'suggestion', name: 'Suggestion' },
    { id: 'appreciation', name: 'Appreciation' },
  ],
};

// Priority levels with colors
export const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    color: '#22C55E',
    backgroundColor: '#F0FDF4',
    description: 'Minor issue, can be addressed within 2-3 weeks',
  },
  medium: {
    label: 'Medium',
    color: '#EAB308',
    backgroundColor: '#FFFBEB',
    description: 'Moderate issue, should be addressed within 1-2 weeks',
  },
  high: {
    label: 'High',
    color: '#F97316',
    backgroundColor: '#FFF7ED',
    description: 'Urgent issue, needs attention within 3-5 days',
  },
  critical: {
    label: 'Critical',
    color: '#EF4444',
    backgroundColor: '#FEF2F2',
    description: 'Emergency situation, requires immediate attention',
  },
};

// Status configuration
export const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    icon: 'file-text',
  },
  pending: {
    label: 'Pending',
    color: '#F59E0B',
    backgroundColor: '#FFFBEB',
    icon: 'clock',
  },
  under_review: {
    label: 'Under Review',
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    icon: 'eye',
  },
  assigned: {
    label: 'Assigned',
    color: '#8B5CF6',
    backgroundColor: '#F5F3FF',
    icon: 'user-check',
  },
  in_progress: {
    label: 'In Progress',
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    icon: 'loader',
  },
  on_hold: {
    label: 'On Hold',
    color: '#F97316',
    backgroundColor: '#FFF7ED',
    icon: 'pause-circle',
  },
  escalated: {
    label: 'Escalated',
    color: '#EF4444',
    backgroundColor: '#FEF2F2',
    icon: 'alert-triangle',
  },
  resolved: {
    label: 'Resolved',
    color: '#10B981',
    backgroundColor: '#ECFDF5',
    icon: 'check-circle',
  },
  closed: {
    label: 'Closed',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    icon: 'x-circle',
  },
  rejected: {
    label: 'Rejected',
    color: '#EF4444',
    backgroundColor: '#FEF2F2',
    icon: 'x-octagon',
  },
  reopened: {
    label: 'Reopened',
    color: '#F97316',
    backgroundColor: '#FFF7ED',
    icon: 'rotate-cw',
  },
};