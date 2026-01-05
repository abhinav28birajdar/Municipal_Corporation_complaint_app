import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropPress?: boolean;
  height?: 'auto' | 'half' | 'full';
  showHandle?: boolean;
  actions?: React.ReactNode;
}

export default function BottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
  showCloseButton = true,
  closeOnBackdropPress = true,
  height = 'auto',
  showHandle = true,
  actions,
}: BottomSheetProps) {
  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const getHeightStyle = () => {
    switch (height) {
      case 'half':
        return 'max-h-[50%]';
      case 'full':
        return 'max-h-[90%]';
      default:
        return 'max-h-[85%]';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        {/* Backdrop */}
        {closeOnBackdropPress && (
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={handleClose}
          />
        )}

        {/* Sheet Content */}
        <View className={`bg-white rounded-t-3xl ${getHeightStyle()}`}>
          {/* Handle */}
          {showHandle && (
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
          )}

          {/* Header */}
          {(title || showCloseButton) && (
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
              <View className="flex-1">
                {title && (
                  <Text className="text-gray-900 font-bold text-xl">{title}</Text>
                )}
                {subtitle && (
                  <Text className="text-gray-500 text-sm mt-0.5">{subtitle}</Text>
                )}
              </View>

              {showCloseButton && (
                <TouchableOpacity
                  onPress={handleClose}
                  className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
                >
                  <X size={18} color="#6b7280" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Content */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 24, paddingBottom: actions ? 16 : 24 }}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

          {/* Actions */}
          {actions && (
            <View className="px-6 pb-6 pt-4 border-t border-gray-100">
              {actions}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
