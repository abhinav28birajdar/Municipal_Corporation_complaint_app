// Validation Utilities

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (Indian format)
export const isValidPhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  // Indian phone numbers: 10 digits, optionally with country code
  const phoneRegex = /^(?:(?:\+|0{0,2})91)?[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone) || phoneRegex.test(phone);
};

// Password validation
export interface PasswordStrength {
  isValid: boolean;
  score: number; // 0-5
  errors: string[];
}

export const validatePassword = (password: string): PasswordStrength => {
  const errors: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score++;
  } else {
    errors.push('Password must be at least 8 characters');
  }

  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    errors.push('Password must contain an uppercase letter');
  }

  if (/[a-z]/.test(password)) {
    score++;
  } else {
    errors.push('Password must contain a lowercase letter');
  }

  if (/\d/.test(password)) {
    score++;
  } else {
    errors.push('Password must contain a number');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score++;
  } else {
    errors.push('Password must contain a special character');
  }

  return {
    isValid: errors.length === 0,
    score,
    errors,
  };
};

// Name validation
export const isValidName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
};

// Aadhaar number validation (12 digits)
export const isValidAadhaar = (aadhaar: string): boolean => {
  const cleanAadhaar = aadhaar.replace(/\D/g, '');
  return /^\d{12}$/.test(cleanAadhaar);
};

// PAN card validation
export const isValidPAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
};

// Pincode validation (Indian)
export const isValidPincode = (pincode: string): boolean => {
  const cleanPincode = pincode.replace(/\D/g, '');
  return /^[1-9][0-9]{5}$/.test(cleanPincode);
};

// URL validation
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// OTP validation
export const isValidOTP = (otp: string, length: number = 6): boolean => {
  const cleanOTP = otp.replace(/\D/g, '');
  return cleanOTP.length === length;
};

// Date validation
export const isValidDate = (date: string | Date): boolean => {
  const d = new Date(date);
  return !isNaN(d.getTime());
};

// Future date validation
export const isFutureDate = (date: string | Date): boolean => {
  const d = new Date(date);
  return d.getTime() > Date.now();
};

// Past date validation
export const isPastDate = (date: string | Date): boolean => {
  const d = new Date(date);
  return d.getTime() < Date.now();
};

// Age validation
export const isValidAge = (birthDate: string | Date, minAge: number = 18, maxAge: number = 120): boolean => {
  const d = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const monthDiff = today.getMonth() - d.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d.getDate())) {
    age--;
  }
  
  return age >= minAge && age <= maxAge;
};

// Required field validation
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// Min length validation
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

// Max length validation
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

// Coordinates validation
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

// File size validation
export const isValidFileSize = (sizeInBytes: number, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return sizeInBytes <= maxSizeInBytes;
};

// File type validation
export const isValidFileType = (fileName: string, allowedTypes: string[]): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  return allowedTypes.includes(extension);
};

// Image file validation
export const isValidImageFile = (fileName: string): boolean => {
  return isValidFileType(fileName, ['jpg', 'jpeg', 'png', 'gif', 'webp']);
};

// Complaint validation
export interface ComplaintValidation {
  isValid: boolean;
  errors: { field: string; message: string }[];
}

export const validateComplaint = (data: {
  categoryId?: string;
  title?: string;
  description?: string;
  location?: { latitude: number; longitude: number };
}): ComplaintValidation => {
  const errors: { field: string; message: string }[] = [];

  if (!data.categoryId) {
    errors.push({ field: 'categoryId', message: 'Please select a category' });
  }

  if (!data.title || data.title.trim().length < 10) {
    errors.push({ field: 'title', message: 'Title must be at least 10 characters' });
  }

  if (!data.description || data.description.trim().length < 20) {
    errors.push({ field: 'description', message: 'Description must be at least 20 characters' });
  }

  if (data.description && data.description.length > 2000) {
    errors.push({ field: 'description', message: 'Description must not exceed 2000 characters' });
  }

  if (!data.location) {
    errors.push({ field: 'location', message: 'Please provide a location' });
  } else if (!isValidCoordinates(data.location.latitude, data.location.longitude)) {
    errors.push({ field: 'location', message: 'Invalid location coordinates' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Registration validation
export interface RegistrationValidation {
  isValid: boolean;
  errors: { field: string; message: string }[];
}

export const validateRegistration = (data: {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}): RegistrationValidation => {
  const errors: { field: string; message: string }[] = [];

  if (!data.fullName || !isValidName(data.fullName)) {
    errors.push({ field: 'fullName', message: 'Please enter a valid name (2-100 characters)' });
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push({ field: 'password', message: passwordValidation.errors[0] });
    }
  }

  if (data.password !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Profile update validation
export const validateProfileUpdate = (data: {
  fullName?: string;
  phone?: string;
  address?: string;
}): RegistrationValidation => {
  const errors: { field: string; message: string }[] = [];

  if (data.fullName !== undefined && !isValidName(data.fullName)) {
    errors.push({ field: 'fullName', message: 'Please enter a valid name (2-100 characters)' });
  }

  if (data.phone !== undefined && !isValidPhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  if (data.address !== undefined && data.address.trim().length > 0 && data.address.length > 500) {
    errors.push({ field: 'address', message: 'Address must not exceed 500 characters' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  // Indian format: +91 XXXXX XXXXX
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

// Format Aadhaar for display
export const formatAadhaar = (aadhaar: string): string => {
  const cleaned = aadhaar.replace(/\D/g, '');
  if (cleaned.length === 12) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
  }
  return aadhaar;
};

// Sanitize input (remove potentially dangerous characters)
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"&]/g, '') // Remove special characters
    .trim();
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};
