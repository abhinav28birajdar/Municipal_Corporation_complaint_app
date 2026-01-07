import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  MapPin,
  Plus,
} from 'lucide-react-native';
import { useSettingsStore } from '@/store/settings-store';

const { width } = Dimensions.get('window');

const mockSchedule = {
  '2026-01-06': [
    {
      id: '1',
      employeeName: 'Rajesh Kumar',
      shift: 'Morning',
      startTime: '08:00',
      endTime: '16:00',
      zone: 'Zone A',
      tasks: 5,
    },
    {
      id: '2',
      employeeName: 'Amit Sharma',
      shift: 'Morning',
      startTime: '08:00',
      endTime: '16:00',
      zone: 'Zone B',
      tasks: 4,
    },
  ],
  '2026-01-07': [
    {
      id: '3',
      employeeName: 'Rajesh Kumar',
      shift: 'Morning',
      startTime: '08:00',
      endTime: '16:00',
      zone: 'Zone A',
      tasks: 6,
    },
    {
      id: '4',
      employeeName: 'Priya Singh',
      shift: 'Morning',
      startTime: '08:00',
      endTime: '16:00',
      zone: 'Zone A',
      tasks: 4,
    },
    {
      id: '5',
      employeeName: 'Amit Sharma',
      shift: 'Afternoon',
      startTime: '12:00',
      endTime: '20:00',
      zone: 'Zone B',
      tasks: 3,
    },
    {
      id: '6',
      employeeName: 'Suresh Patel',
      shift: 'Morning',
      startTime: '08:00',
      endTime: '16:00',
      zone: 'Zone C',
      tasks: 5,
    },
  ],
  '2026-01-08': [
    {
      id: '7',
      employeeName: 'Priya Singh',
      shift: 'Morning',
      startTime: '08:00',
      endTime: '16:00',
      zone: 'Zone A',
      tasks: 4,
    },
    {
      id: '8',
      employeeName: 'Suresh Patel',
      shift: 'Afternoon',
      startTime: '12:00',
      endTime: '20:00',
      zone: 'Zone C',
      tasks: 3,
    },
  ],
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function TeamScheduleScreen() {
  const router = useRouter();
  const { themeMode } = useSettingsStore();
  const isDark = themeMode === 'dark';
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date('2026-01-07'));
  const [currentMonth, setCurrentMonth] = useState(new Date('2026-01-01'));

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date('2026-01-07');
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const hasSchedule = (date: Date) => {
    const dateStr = getDateString(date);
    return mockSchedule[dateStr as keyof typeof mockSchedule]?.length > 0;
  };

  const selectedDateSchedule = mockSchedule[getDateString(selectedDate) as keyof typeof mockSchedule] || [];

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'Morning':
        return '#f59e0b';
      case 'Afternoon':
        return '#3b82f6';
      case 'Evening':
        return '#8b5cf6';
      case 'Night':
        return '#1f2937';
      default:
        return '#6b7280';
    }
  };

  const ScheduleCard = ({ schedule }: { schedule: typeof selectedDateSchedule[0] }) => (
    <View
      className={`p-4 rounded-xl mb-3 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      style={{ borderLeftWidth: 4, borderLeftColor: getShiftColor(schedule.shift) }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <User size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          </View>
          <View className="ml-3">
            <Text className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {schedule.employeeName}
            </Text>
            <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {schedule.shift} Shift
            </Text>
          </View>
        </View>
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: `${getShiftColor(schedule.shift)}20` }}
        >
          <Text style={{ color: getShiftColor(schedule.shift), fontSize: 11, fontWeight: '600' }}>
            {schedule.tasks} Tasks
          </Text>
        </View>
      </View>

      <View className="flex-row mt-2">
        <View className="flex-row items-center mr-4">
          <Clock size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text className={`text-sm ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {schedule.startTime} - {schedule.endTime}
          </Text>
        </View>
        <View className="flex-row items-center">
          <MapPin size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
          <Text className={`text-sm ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {schedule.zone}
          </Text>
        </View>
      </View>
    </View>
  );

  const days = getDaysInMonth(currentMonth);

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      edges={['top']}
    >
      {/* Header */}
      <View
        className={`px-6 py-4 ${isDark ? 'bg-gray-900' : 'bg-white'} border-b ${
          isDark ? 'border-gray-800' : 'border-gray-100'
        }`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ArrowLeft size={24} color={isDark ? '#fff' : '#1f2937'} />
            </TouchableOpacity>
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Team Schedule
            </Text>
          </View>
          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center"
          >
            <Plus size={16} color="#fff" />
            <Text className="text-white font-medium ml-1">Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Calendar */}
        <View className={`p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} m-4 rounded-xl`}>
          {/* Month Navigation */}
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={goToPreviousMonth}>
              <ChevronLeft size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={goToNextMonth}>
              <ChevronRight size={24} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
          </View>

          {/* Week Days Header */}
          <View className="flex-row mb-2">
            {weekDays.map((day) => (
              <View key={day} className="flex-1 items-center">
                <Text className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View className="flex-row flex-wrap">
            {days.map((date, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => date && setSelectedDate(date)}
                disabled={!date}
                className="items-center justify-center"
                style={{ width: (width - 64) / 7, height: 40 }}
              >
                {date && (
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      isSelected(date)
                        ? 'bg-blue-500'
                        : isToday(date)
                        ? isDark
                          ? 'bg-gray-700'
                          : 'bg-gray-200'
                        : ''
                    }`}
                  >
                    <Text
                      className={`text-sm ${
                        isSelected(date)
                          ? 'text-white font-bold'
                          : isToday(date)
                          ? isDark
                            ? 'text-white font-bold'
                            : 'text-gray-900 font-bold'
                          : isDark
                          ? 'text-gray-300'
                          : 'text-gray-700'
                      }`}
                    >
                      {date.getDate()}
                    </Text>
                    {hasSchedule(date) && !isSelected(date) && (
                      <View className="absolute bottom-0.5 w-1 h-1 rounded-full bg-blue-500" />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Date Schedule */}
        <View className="px-4 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {selectedDate.toLocaleDateString('en-IN', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {selectedDateSchedule.length} scheduled
            </Text>
          </View>

          {selectedDateSchedule.length > 0 ? (
            selectedDateSchedule.map((schedule) => (
              <ScheduleCard key={schedule.id} schedule={schedule} />
            ))
          ) : (
            <View
              className={`p-8 rounded-xl items-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <Calendar size={48} color={isDark ? '#4b5563' : '#9ca3af'} />
              <Text
                className={`mt-4 text-lg font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                No schedule for this day
              </Text>
              <TouchableOpacity className="mt-4 bg-blue-500 px-6 py-2 rounded-lg">
                <Text className="text-white font-medium">Add Schedule</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Legend */}
        <View className="px-4 pb-6">
          <Text className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Shift Types
          </Text>
          <View className="flex-row flex-wrap">
            {['Morning', 'Afternoon', 'Evening', 'Night'].map((shift) => (
              <View key={shift} className="flex-row items-center mr-4 mb-2">
                <View
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getShiftColor(shift) }}
                />
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {shift}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
