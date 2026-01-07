// Date and Time Utilities

// Format date to readable string
export const formatDate = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  const d = new Date(date);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return d.toLocaleDateString('en-IN', options || defaultOptions);
};

// Format time to readable string
export const formatTime = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  const d = new Date(date);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return d.toLocaleTimeString('en-IN', options || defaultOptions);
};

// Format date and time together
export const formatDateTime = (
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string => {
  const d = new Date(date);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return d.toLocaleString('en-IN', options || defaultOptions);
};

// Get relative time (e.g., "2 hours ago", "in 3 days")
export const getRelativeTime = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  // Future dates
  if (diffInSeconds < 0) {
    const absDiff = Math.abs(diffInSeconds);
    if (absDiff < 60) return 'in a few seconds';
    if (absDiff < 3600) return `in ${Math.floor(absDiff / 60)} minutes`;
    if (absDiff < 86400) return `in ${Math.floor(absDiff / 3600)} hours`;
    if (absDiff < 604800) return `in ${Math.floor(absDiff / 86400)} days`;
    return formatDate(date);
  }

  // Past dates
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
};

// Get short relative time (compact version)
export const getShortRelativeTime = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 0) return 'soon';
  if (diffInSeconds < 60) return 'now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo`;
  return `${Math.floor(diffInSeconds / 31536000)}y`;
};

// Check if date is today
export const isToday = (date: string | Date): boolean => {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

// Check if date is yesterday
export const isYesterday = (date: string | Date): boolean => {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
};

// Check if date is tomorrow
export const isTomorrow = (date: string | Date): boolean => {
  const d = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear()
  );
};

// Check if date is this week
export const isThisWeek = (date: string | Date): boolean => {
  const d = new Date(date);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  return d >= startOfWeek && d < endOfWeek;
};

// Get date string in YYYY-MM-DD format
export const getISODateString = (date: string | Date): string => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Get start of day
export const getStartOfDay = (date: string | Date = new Date()): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Get end of day
export const getEndOfDay = (date: string | Date = new Date()): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// Get start of week (Sunday)
export const getStartOfWeek = (date: string | Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Get end of week (Saturday)
export const getEndOfWeek = (date: string | Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (6 - day));
  d.setHours(23, 59, 59, 999);
  return d;
};

// Get start of month
export const getStartOfMonth = (date: string | Date = new Date()): Date => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Get end of month
export const getEndOfMonth = (date: string | Date = new Date()): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
};

// Add days to date
export const addDays = (date: string | Date, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// Add hours to date
export const addHours = (date: string | Date, hours: number): Date => {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
};

// Add months to date
export const addMonths = (date: string | Date, months: number): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

// Get days between two dates
export const getDaysBetween = (date1: string | Date, date2: string | Date): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffInTime = d2.getTime() - d1.getTime();
  return Math.ceil(diffInTime / (1000 * 60 * 60 * 24));
};

// Get hours between two dates
export const getHoursBetween = (date1: string | Date, date2: string | Date): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffInTime = d2.getTime() - d1.getTime();
  return Math.ceil(diffInTime / (1000 * 60 * 60));
};

// Format duration in milliseconds to readable string
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

// Format SLA deadline
export const formatSLADeadline = (deadline: string | Date): {
  text: string;
  isOverdue: boolean;
  urgency: 'critical' | 'warning' | 'normal';
} => {
  const d = new Date(deadline);
  const now = new Date();
  const hoursRemaining = getHoursBetween(now, d);

  if (hoursRemaining < 0) {
    const overdueHours = Math.abs(hoursRemaining);
    return {
      text: `Overdue by ${formatDuration(overdueHours * 60 * 60 * 1000)}`,
      isOverdue: true,
      urgency: 'critical',
    };
  }

  if (hoursRemaining < 4) {
    return {
      text: `Due in ${formatDuration(hoursRemaining * 60 * 60 * 1000)}`,
      isOverdue: false,
      urgency: 'critical',
    };
  }

  if (hoursRemaining < 24) {
    return {
      text: `Due in ${hoursRemaining} hours`,
      isOverdue: false,
      urgency: 'warning',
    };
  }

  const daysRemaining = Math.ceil(hoursRemaining / 24);
  return {
    text: `Due in ${daysRemaining} days`,
    isOverdue: false,
    urgency: 'normal',
  };
};

// Get working days between two dates (excluding weekends)
export const getWorkingDaysBetween = (
  startDate: string | Date,
  endDate: string | Date
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
};

// Get calendar week number
export const getWeekNumber = (date: string | Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

// Get day name
export const getDayName = (date: string | Date, short: boolean = false): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { weekday: short ? 'short' : 'long' });
};

// Get month name
export const getMonthName = (date: string | Date, short: boolean = false): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { month: short ? 'short' : 'long' });
};

// Check if date is within business hours (9 AM - 6 PM, Mon-Sat)
export const isWithinBusinessHours = (date: string | Date = new Date()): boolean => {
  const d = new Date(date);
  const day = d.getDay();
  const hour = d.getHours();

  // Sunday is off
  if (day === 0) return false;

  // Business hours: 9 AM - 6 PM
  return hour >= 9 && hour < 18;
};

// Get next business day
export const getNextBusinessDay = (date: string | Date = new Date()): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);

  // Skip Sunday
  while (d.getDay() === 0) {
    d.setDate(d.getDate() + 1);
  }

  return d;
};

// Parse date from various formats
export const parseDate = (dateString: string): Date | null => {
  // Try ISO format first
  let d = new Date(dateString);
  if (!isNaN(d.getTime())) return d;

  // Try DD/MM/YYYY format
  const ddmmyyyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyy) {
    d = new Date(parseInt(ddmmyyyy[3]), parseInt(ddmmyyyy[2]) - 1, parseInt(ddmmyyyy[1]));
    if (!isNaN(d.getTime())) return d;
  }

  // Try DD-MM-YYYY format
  const ddmmyyyyDash = dateString.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (ddmmyyyyDash) {
    d = new Date(parseInt(ddmmyyyyDash[3]), parseInt(ddmmyyyyDash[2]) - 1, parseInt(ddmmyyyyDash[1]));
    if (!isNaN(d.getTime())) return d;
  }

  return null;
};
