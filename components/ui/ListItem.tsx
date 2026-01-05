import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LucideIcon, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ListItemProps {
  title: string;
  subtitle?: string;
  leftIcon?: LucideIcon;
  leftIconColor?: string;
  leftIconBgColor?: string;
  rightContent?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  danger?: boolean;
  compact?: boolean;
  animated?: boolean;
  animationDelay?: number;
  style?: ViewStyle;
  borderBottom?: boolean;
}

export default function ListItem({
  title,
  subtitle,
  leftIcon: LeftIcon,
  leftIconColor = '#7c3aed',
  leftIconBgColor = '#f3e8ff',
  rightContent,
  showChevron = true,
  onPress,
  disabled = false,
  danger = false,
  compact = false,
  animated = false,
  animationDelay = 0,
  style,
  borderBottom = true,
}: ListItemProps) {
  const handlePress = () => {
    if (disabled || !onPress) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const content = (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || !onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className={`flex-row items-center bg-white ${compact ? 'py-3' : 'py-4'} px-4 ${
        borderBottom ? 'border-b border-gray-100' : ''
      } ${disabled ? 'opacity-50' : ''}`}
      style={style}
    >
      {/* Left Icon */}
      {LeftIcon && (
        <View
          className={`${compact ? 'w-9 h-9' : 'w-10 h-10'} rounded-xl items-center justify-center mr-3`}
          style={{
            backgroundColor: danger ? '#fef2f2' : leftIconBgColor,
          }}
        >
          <LeftIcon
            size={compact ? 18 : 20}
            color={danger ? '#ef4444' : leftIconColor}
          />
        </View>
      )}

      {/* Content */}
      <View className="flex-1">
        <Text
          className={`font-medium ${compact ? 'text-base' : 'text-base'} ${
            danger ? 'text-red-500' : 'text-gray-900'
          }`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className="text-gray-500 text-sm mt-0.5">{subtitle}</Text>
        )}
      </View>

      {/* Right Content */}
      {rightContent}

      {/* Chevron */}
      {showChevron && onPress && (
        <ChevronRight
          size={20}
          color={danger ? '#ef4444' : '#9ca3af'}
          style={{ marginLeft: rightContent ? 8 : 0 }}
        />
      )}
    </TouchableOpacity>
  );

  if (animated) {
    return (
      <Animated.View entering={FadeInDown.delay(animationDelay).springify()}>
        {content}
      </Animated.View>
    );
  }

  return content;
}

// Section Header Component
interface ListSectionProps {
  title: string;
  rightAction?: {
    label: string;
    onPress: () => void;
  };
}

export function ListSection({ title, rightAction }: ListSectionProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-gray-50">
      <Text className="text-gray-500 text-sm font-medium uppercase tracking-wide">
        {title}
      </Text>
      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress}>
          <Text className="text-purple-600 text-sm font-medium">
            {rightAction.label}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// List Container Component
interface ListContainerProps {
  children: React.ReactNode;
  title?: string;
  style?: ViewStyle;
}

export function ListContainer({ children, title, style }: ListContainerProps) {
  return (
    <View style={style}>
      {title && (
        <Text className="text-gray-900 font-bold text-lg mb-3 px-4">
          {title}
        </Text>
      )}
      <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
        {children}
      </View>
    </View>
  );
}
