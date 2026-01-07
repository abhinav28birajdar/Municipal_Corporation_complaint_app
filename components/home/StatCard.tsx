// Dashboard Stats Card Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';
import { colors as lightColors, darkColors } from '@/constants/Colors';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = '#3B82F6',
  iconBgColor = '#DBEAFE',
  trend,
  onPress,
}) => {
  const { isDarkMode } = useSettingsStore();
  const colors = isDarkMode ? darkColors : lightColors;

  const renderTrend = () => {
    if (!trend) return null;
    
    const TrendIcon = trend.value > 0 
      ? TrendingUp 
      : trend.value < 0 
        ? TrendingDown 
        : Minus;
    const trendColor = trend.isPositive 
      ? '#10B981' 
      : trend.value < 0 
        ? '#EF4444' 
        : colors.tabIconDefault;

    return (
      <View style={[styles.trendContainer, { backgroundColor: trend.isPositive ? '#D1FAE5' : '#FEE2E2' }]}>
        <TrendIcon size={12} color={trendColor} />
        <Text style={[styles.trendText, { color: trendColor }]}>
          {Math.abs(trend.value)}%
        </Text>
      </View>
    );
  };

  const content = (
    <View style={[styles.card, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <Icon size={22} color={iconColor} />
        </View>
        {renderTrend()}
      </View>
      
      <Text style={[styles.value, { color: colors.text }]}>
        {value}
      </Text>
      
      <Text style={[styles.title, { color: colors.tabIconDefault }]}>
        {title}
      </Text>
      
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// Stats Grid Component
interface StatsGridProps {
  stats: StatCardProps[];
  columns?: 2 | 3;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, columns = 2 }) => {
  return (
    <View style={[styles.grid, { gap: 12 }]}>
      {stats.map((stat, index) => (
        <View 
          key={index} 
          style={[
            styles.gridItem, 
            { width: columns === 2 ? '48.5%' : '31.5%' }
          ]}
        >
          <StatCard {...stat} />
        </View>
      ))}
    </View>
  );
};

// Summary Card Component
interface SummaryCardProps {
  title: string;
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  total: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, data, total }) => {
  const { isDarkMode } = useSettingsStore();
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <View style={[styles.summaryCard, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
      <Text style={[styles.summaryTitle, { color: colors.text }]}>
        {title}
      </Text>
      
      <View style={styles.summaryBarContainer}>
        <View style={[styles.summaryBar, { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }]}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            return (
              <View
                key={index}
                style={[
                  styles.summaryBarSegment,
                  { 
                    backgroundColor: item.color, 
                    width: `${percentage}%`,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.summaryLegend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={[styles.legendLabel, { color: colors.tabIconDefault }]}>
              {item.label}
            </Text>
            <Text style={[styles.legendValue, { color: colors.text }]}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    marginBottom: 12,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryBarContainer: {
    marginBottom: 16,
  },
  summaryBar: {
    height: 12,
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  summaryBarSegment: {
    height: '100%',
  },
  summaryLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 13,
    marginRight: 4,
  },
  legendValue: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export { StatCard as default };
