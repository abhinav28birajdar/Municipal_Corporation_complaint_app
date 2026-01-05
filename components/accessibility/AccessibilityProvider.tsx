import React, { createContext, useContext, useCallback, useRef } from 'react';
import {
  View,
  Text,
  AccessibilityInfo,
  findNodeHandle,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';

// Accessibility Context
interface AccessibilityContextType {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isBoldTextEnabled: boolean;
  isHighContrastEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  announceForAccessibility: (message: string) => void;
  focusOnElement: (ref: React.RefObject<any>) => void;
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
  settings?: {
    fontSize?: 'small' | 'medium' | 'large' | 'xlarge';
    highContrast?: boolean;
    colorBlindMode?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  };
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
  settings,
}) => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = React.useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = React.useState(false);
  const [isBoldTextEnabled, setIsBoldTextEnabled] = React.useState(false);

  React.useEffect(() => {
    // Check initial states
    AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderEnabled);
    AccessibilityInfo.isReduceMotionEnabled().then(setIsReduceMotionEnabled);
    if (Platform.OS === 'ios') {
      AccessibilityInfo.isBoldTextEnabled().then(setIsBoldTextEnabled);
    }

    // Add listeners
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );
    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsReduceMotionEnabled
    );

    return () => {
      screenReaderListener.remove();
      reduceMotionListener.remove();
    };
  }, []);

  const announceForAccessibility = useCallback((message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  }, []);

  const focusOnElement = useCallback((ref: React.RefObject<any>) => {
    if (ref.current) {
      const handle = findNodeHandle(ref.current);
      if (handle) {
        AccessibilityInfo.setAccessibilityFocus(handle);
      }
    }
  }, []);

  const hapticFeedback = useCallback(async (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch (error) {
      console.log('Haptic feedback not available');
    }
  }, []);

  const value: AccessibilityContextType = {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    isBoldTextEnabled,
    isHighContrastEnabled: settings?.highContrast || false,
    fontSize: settings?.fontSize || 'medium',
    colorBlindMode: settings?.colorBlindMode || 'none',
    announceForAccessibility,
    focusOnElement,
    hapticFeedback,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Accessible Text Component
interface AccessibleTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'label';
  accessibilityRole?: 'header' | 'text' | 'link' | 'button';
  accessibilityLabel?: string;
  accessibilityHint?: string;
  numberOfLines?: number;
}

export const AccessibleText: React.FC<AccessibleTextProps> = ({
  children,
  style,
  variant = 'body',
  accessibilityRole = 'text',
  accessibilityLabel,
  accessibilityHint,
  numberOfLines,
}) => {
  const { fontSize, isBoldTextEnabled, isHighContrastEnabled } = useAccessibility();

  const getFontSize = () => {
    const baseSizes = {
      heading: 24,
      subheading: 18,
      body: 16,
      caption: 14,
      label: 12,
    };
    const multipliers = {
      small: 0.85,
      medium: 1,
      large: 1.15,
      xlarge: 1.3,
    };
    return baseSizes[variant] * multipliers[fontSize];
  };

  const textStyle: TextStyle = {
    fontSize: getFontSize(),
    fontWeight: isBoldTextEnabled || variant === 'heading' ? 'bold' : 'normal',
    color: isHighContrastEnabled ? '#000000' : undefined,
    ...style,
  };

  return (
    <Text
      style={textStyle}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};

// Focus Trap Component
interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ children, active = true }) => {
  return (
    <View
      accessible={active}
      accessibilityViewIsModal={active}
      importantForAccessibility={active ? 'yes' : 'no'}
    >
      {children}
    </View>
  );
};

// Skip Link Component
interface SkipLinkProps {
  targetRef: React.RefObject<any>;
  label?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ targetRef, label = 'Skip to main content' }) => {
  const { focusOnElement, isScreenReaderEnabled } = useAccessibility();

  if (!isScreenReaderEnabled) return null;

  return (
    <Text
      accessible
      accessibilityRole="link"
      accessibilityLabel={label}
      accessibilityHint="Double tap to skip navigation and go to main content"
      onPress={() => focusOnElement(targetRef)}
      style={styles.skipLink}
    >
      {label}
    </Text>
  );
};

// Live Region Component
interface LiveRegionProps {
  children: React.ReactNode;
  mode?: 'polite' | 'assertive' | 'none';
  atomic?: boolean;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  mode = 'polite',
  atomic = true,
}) => {
  return (
    <View
      accessibilityLiveRegion={mode}
      accessibilityElementsHidden={mode === 'none'}
    >
      {children}
    </View>
  );
};

// Progress Indicator with Accessibility
interface AccessibleProgressProps {
  value: number;
  maxValue?: number;
  label?: string;
  style?: ViewStyle;
}

export const AccessibleProgress: React.FC<AccessibleProgressProps> = ({
  value,
  maxValue = 100,
  label = 'Progress',
  style,
}) => {
  const percentage = Math.round((value / maxValue) * 100);
  const { announceForAccessibility, isScreenReaderEnabled } = useAccessibility();

  React.useEffect(() => {
    if (isScreenReaderEnabled && (percentage === 0 || percentage === 50 || percentage === 100)) {
      announceForAccessibility(`${label}: ${percentage}%`);
    }
  }, [percentage, label, isScreenReaderEnabled]);

  return (
    <View
      style={[styles.progressContainer, style]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`${label}: ${percentage}%`}
      accessibilityValue={{
        min: 0,
        max: maxValue,
        now: value,
        text: `${percentage}%`,
      }}
    >
      <View style={[styles.progressBar, { width: `${percentage}%` }]} />
    </View>
  );
};

// Color Blind Safe Colors
export const getColorBlindSafeColor = (
  color: string,
  mode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
): string => {
  if (mode === 'none') return color;

  // Color transformations for different types of color blindness
  const colorMappings: Record<string, Record<string, string>> = {
    protanopia: {
      '#EF4444': '#0077BB', // Red -> Blue
      '#10B981': '#EE7733', // Green -> Orange
      '#F59E0B': '#DDCC77', // Yellow -> Light Yellow
    },
    deuteranopia: {
      '#EF4444': '#0077BB', // Red -> Blue
      '#10B981': '#EE7733', // Green -> Orange
      '#F59E0B': '#DDCC77', // Yellow -> Light Yellow
    },
    tritanopia: {
      '#3B82F6': '#EE7733', // Blue -> Orange
      '#10B981': '#009988', // Green -> Teal
      '#F59E0B': '#EE3377', // Yellow -> Pink
    },
  };

  return colorMappings[mode]?.[color] || color;
};

const styles = StyleSheet.create({
  skipLink: {
    position: 'absolute',
    top: -1000,
    left: 0,
    backgroundColor: '#000',
    color: '#fff',
    padding: 10,
    zIndex: 1000,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
});

export default AccessibilityProvider;
