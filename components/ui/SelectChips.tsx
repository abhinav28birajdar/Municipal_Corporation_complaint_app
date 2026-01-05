import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LucideIcon, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface SelectOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  description?: string;
  disabled?: boolean;
}

interface SelectChipsProps {
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  scrollable?: boolean;
  label?: string;
  required?: boolean;
  error?: string;
}

export default function SelectChips({
  options,
  value,
  onChange,
  multiple = false,
  variant = 'default',
  size = 'md',
  scrollable = false,
  label,
  required,
  error,
}: SelectChipsProps) {
  const isSelected = (optionValue: string) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  const handleSelect = (optionValue: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (multiple) {
      const currentValue = Array.isArray(value) ? value : [];
      if (currentValue.includes(optionValue)) {
        onChange(currentValue.filter(v => v !== optionValue));
      } else {
        onChange([...currentValue, optionValue]);
      }
    } else {
      onChange(optionValue);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: 'px-3 py-1.5', text: 'text-sm', icon: 14, gap: 'gap-1.5' };
      case 'lg':
        return { padding: 'px-5 py-3', text: 'text-base', icon: 20, gap: 'gap-3' };
      default:
        return { padding: 'px-4 py-2', text: 'text-sm', icon: 16, gap: 'gap-2' };
    }
  };

  const sizeStyles = getSizeStyles();

  const renderChip = (option: SelectOption) => {
    const selected = isSelected(option.value);
    const OptionIcon = option.icon;

    const getChipStyles = () => {
      if (selected) {
        switch (variant) {
          case 'filled':
            return 'bg-purple-500';
          case 'outlined':
            return 'bg-purple-50 border-2 border-purple-500';
          default:
            return 'bg-purple-500';
        }
      }
      switch (variant) {
        case 'filled':
          return 'bg-gray-100';
        case 'outlined':
          return 'bg-transparent border-2 border-gray-300';
        default:
          return 'bg-gray-100';
      }
    };

    return (
      <TouchableOpacity
        key={option.value}
        onPress={() => !option.disabled && handleSelect(option.value)}
        disabled={option.disabled}
        className={`rounded-full flex-row items-center ${sizeStyles.padding} ${getChipStyles()} ${
          option.disabled ? 'opacity-50' : ''
        }`}
        activeOpacity={0.7}
      >
        {OptionIcon && (
          <OptionIcon
            size={sizeStyles.icon}
            color={
              selected
                ? variant === 'outlined'
                  ? '#7c3aed'
                  : '#fff'
                : '#6b7280'
            }
          />
        )}
        
        <Text
          className={`font-medium ${sizeStyles.text} ${
            selected
              ? variant === 'outlined'
                ? 'text-purple-600'
                : 'text-white'
              : 'text-gray-600'
          } ${OptionIcon ? 'ml-1.5' : ''}`}
        >
          {option.label}
        </Text>

        {selected && multiple && (
          <View className="ml-1.5">
            <Check
              size={sizeStyles.icon - 2}
              color={variant === 'outlined' ? '#7c3aed' : '#fff'}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const ChipsContent = () => (
    <View className={`flex-row flex-wrap ${sizeStyles.gap}`}>
      {options.map(renderChip)}
    </View>
  );

  return (
    <View className="mb-4">
      {label && (
        <View className="flex-row items-center mb-2">
          <Text className="text-gray-700 font-medium">{label}</Text>
          {required && <Text className="text-red-500 ml-1">*</Text>}
        </View>
      )}

      {scrollable ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {options.map(renderChip)}
        </ScrollView>
      ) : (
        <ChipsContent />
      )}

      {error && (
        <Text className="text-red-500 text-sm mt-1.5">{error}</Text>
      )}
    </View>
  );
}
