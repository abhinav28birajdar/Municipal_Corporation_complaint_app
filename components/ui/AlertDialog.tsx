import React from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { LucideIcon, AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface AlertDialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  icon?: LucideIcon;
  primaryButton?: {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'danger';
  };
  secondaryButton?: {
    label: string;
    onPress: () => void;
  };
  showCloseButton?: boolean;
  dismissable?: boolean;
}

const TYPE_CONFIG = {
  info: {
    icon: Info,
    color: '#3b82f6',
    bgColor: '#eff6ff',
  },
  success: {
    icon: CheckCircle,
    color: '#22c55e',
    bgColor: '#f0fdf4',
  },
  warning: {
    icon: AlertTriangle,
    color: '#f59e0b',
    bgColor: '#fffbeb',
  },
  error: {
    icon: AlertCircle,
    color: '#ef4444',
    bgColor: '#fef2f2',
  },
};

export default function AlertDialog({
  visible,
  onClose,
  title,
  message,
  type = 'info',
  icon,
  primaryButton,
  secondaryButton,
  showCloseButton = true,
  dismissable = true,
}: AlertDialogProps) {
  const typeConfig = TYPE_CONFIG[type];
  const IconComponent = icon || typeConfig.icon;

  const handleClose = () => {
    if (dismissable) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onClose();
    }
  };

  const handlePrimaryPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (primaryButton?.onPress) {
      primaryButton.onPress();
    }
    onClose();
  };

  const handleSecondaryPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (secondaryButton?.onPress) {
      secondaryButton.onPress();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Animated.View
        entering={FadeIn.duration(200)}
        className="flex-1 bg-black/50 items-center justify-center px-6"
      >
        <TouchableOpacity
          className="absolute inset-0"
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          entering={ZoomIn.duration(200)}
          className="bg-white rounded-3xl overflow-hidden w-full"
          style={{ maxWidth: width - 48 }}
        >
          {/* Close Button */}
          {showCloseButton && (
            <TouchableOpacity
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
              onPress={handleClose}
            >
              <X size={16} color="#6b7280" />
            </TouchableOpacity>
          )}

          {/* Content */}
          <View className="items-center pt-8 pb-6 px-6">
            {/* Icon */}
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
              style={{ backgroundColor: typeConfig.bgColor }}
            >
              <IconComponent size={32} color={typeConfig.color} />
            </View>

            {/* Title */}
            <Text className="text-gray-900 font-bold text-xl text-center mb-2">
              {title}
            </Text>

            {/* Message */}
            <Text className="text-gray-500 text-center leading-5">
              {message}
            </Text>
          </View>

          {/* Actions */}
          {(primaryButton || secondaryButton) && (
            <View className="px-6 pb-6">
              <View className="flex-row gap-3">
                {secondaryButton && (
                  <TouchableOpacity
                    className="flex-1 bg-gray-100 rounded-xl py-3.5 items-center"
                    onPress={handleSecondaryPress}
                  >
                    <Text className="text-gray-700 font-semibold">
                      {secondaryButton.label}
                    </Text>
                  </TouchableOpacity>
                )}

                {primaryButton && (
                  <TouchableOpacity
                    className={`flex-1 rounded-xl py-3.5 items-center ${
                      primaryButton.variant === 'danger'
                        ? 'bg-red-500'
                        : 'bg-purple-500'
                    }`}
                    onPress={handlePrimaryPress}
                  >
                    <Text className="text-white font-semibold">
                      {primaryButton.label}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
