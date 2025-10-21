import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Sun, Moon, Monitor } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: number;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  showLabel = false,
  size = 24 
}) => {
  const { colors, themeMode, toggleTheme } = useTheme();

  const getIcon = () => {
    switch (themeMode) {
      case 'light':
        return <Sun size={size} color={colors.text} />;
      case 'dark':
        return <Moon size={size} color={colors.text} />;
      case 'system':
        return <Monitor size={size} color={colors.text} />;
      default:
        return <Sun size={size} color={colors.text} />;
    }
  };

  const getLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Light Mode';
      case 'dark':
        return 'Dark Mode';
      case 'system':
        return 'System';
      default:
        return 'Light Mode';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]} 
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      {getIcon()}
      {showLabel && (
        <Text style={[styles.label, { color: colors.text }]}>
          {getLabel()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
