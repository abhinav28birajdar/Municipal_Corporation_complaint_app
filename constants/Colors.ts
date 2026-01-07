export const colors = {
    primary: "#3B82F6", // Blue
    primaryDark: "#2563EB",
    secondary: "#10B981", // Green
    secondaryDark: "#059669",
    danger: "#EF4444", // Red
    warning: "#F59E0B", // Amber
    info: "#6366F1", // Indigo
    success: "#10B981", // Green
    background: "#F9FAFB",
    card: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    notification: "#EF4444",
    placeholder: "#9CA3AF",
    disabled: "#E5E7EB",
    statusNew: "#6366F1", // Indigo
    statusAssigned: "#F59E0B", // Amber
    statusInProgress: "#3B82F6", // Blue
    statusCompleted: "#10B981", // Green
    statusCancelled: "#EF4444", // Red
    // Additional theme colors
    tint: "#3B82F6", // Same as primary
    tabIconDefault: "#6B7280", // Same as textSecondary
    tabIconSelected: "#3B82F6", // Same as primary
  };
  
  export const darkColors = {
    primary: "#3B82F6",
    primaryDark: "#2563EB",
    secondary: "#10B981",
    secondaryDark: "#059669",
    danger: "#EF4444",
    warning: "#F59E0B",
    info: "#6366F1",
    success: "#10B981",
    background: "#111827",
    card: "#1F2937",
    text: "#F9FAFB",
    textSecondary: "#9CA3AF",
    border: "#374151",
    notification: "#EF4444",
    placeholder: "#6B7280",
    disabled: "#4B5563",
    statusNew: "#6366F1",
    statusAssigned: "#F59E0B",
    statusInProgress: "#3B82F6",
    statusCompleted: "#10B981",
    statusCancelled: "#EF4444",
    // Additional theme colors
    tint: "#60A5FA", // Lighter blue for dark mode
    tabIconDefault: "#9CA3AF", // Same as textSecondary
    tabIconSelected: "#60A5FA", // Lighter blue for dark mode
  };

  // Also export Colors object for files expecting Colors.dark/Colors.light pattern
  export const Colors = {
    light: colors,
    dark: darkColors,
  };