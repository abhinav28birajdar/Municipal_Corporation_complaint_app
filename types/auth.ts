// Authentication Types
export type AuthProvider = 'email' | 'google' | 'apple' | 'facebook' | 'phone' | 'magic_link';

export type MFAType = 'totp' | 'sms' | 'email';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone?: string;
  role?: UserRole;
  acceptTerms: boolean;
}

export interface OTPVerificationData {
  phone?: string;
  email?: string;
  code: string;
  type: 'phone' | 'email';
}

export interface PasswordResetData {
  email: string;
}

export interface NewPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface SocialAuthData {
  provider: AuthProvider;
  accessToken?: string;
  idToken?: string;
}

export interface BiometricAuthData {
  userId: string;
  biometricType: 'fingerprint' | 'faceId';
}

export interface MFASetupData {
  userId: string;
  type: MFAType;
  secret?: string;
  phoneNumber?: string;
}

export interface Session {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'web';
  browser?: string;
  os?: string;
  ipAddress: string;
  location?: string;
  isActive: boolean;
  isCurrent: boolean;
  lastActive: string;
  createdAt: string;
}

export interface LoginHistory {
  id: string;
  userId: string;
  loginTime: string;
  logoutTime?: string;
  deviceInfo: {
    deviceName: string;
    deviceType: string;
    browser?: string;
    os?: string;
  };
  ipAddress: string;
  location?: {
    city?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status: 'success' | 'failed';
  failureReason?: string;
}

export interface VerificationCode {
  id: string;
  userId: string;
  code: string;
  type: 'email' | 'phone' | 'mfa';
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}

export type UserRole = 'citizen' | 'employee' | 'head' | 'admin';

export interface AuthState {
  user: User | null;
  session: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  mfaRequired: boolean;
  mfaType?: MFAType;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  mfaEnabled: boolean;
  mfaType?: MFAType;
  registrationNumber?: string;
  address?: string;
  department?: string;
  departmentId?: string;
  zoneId?: string;
  wardId?: string;
  areaAssigned?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  notificationsEnabled: boolean;
  notificationChannels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  accessibilitySettings: {
    screenReader: boolean;
    highContrast: boolean;
    reduceMotion: boolean;
    voiceInput: boolean;
    colorBlindMode?: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'none';
  };
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface LinkedAccount {
  id: string;
  userId: string;
  provider: AuthProvider;
  providerAccountId: string;
  email?: string;
  name?: string;
  avatar?: string;
  linkedAt: string;
  isActive: boolean;
}
