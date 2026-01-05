import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  LogIn,
  LogOut,
  Timer,
  Coffee,
  AlertCircle,
  ChevronRight,
  History,
  Fingerprint,
  Camera,
  Wifi,
  WifiOff,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  breakTime: string;
  totalHours: string;
  status: 'present' | 'absent' | 'half-day' | 'late';
  location: string;
}

type AttendanceStatus = 'not-checked-in' | 'checked-in' | 'on-break' | 'checked-out';

export default function AttendanceScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>('not-checked-in');
  const [currentLocation, setCurrentLocation] = useState<string>('Fetching location...');
  const [isInGeofence, setIsInGeofence] = useState(true);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [breakStartTime, setBreakStartTime] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  
  const pulseAnim = useSharedValue(1);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const todayStats = {
    scheduledStart: '9:00 AM',
    scheduledEnd: '6:00 PM',
    totalBreak: '1 hour',
    workLocation: 'Ward 5 Office',
  };

  useEffect(() => {
    loadAttendanceData();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (attendanceStatus === 'checked-in') {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      pulseAnim.value = withRepeat(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else if (attendanceStatus === 'on-break') {
      timerRef.current = setInterval(() => {
        setBreakTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      pulseAnim.value = withTiming(1);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [attendanceStatus]);

  const loadAttendanceData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAttendanceHistory([
      {
        id: '1',
        date: 'Today',
        checkIn: '9:05 AM',
        checkOut: null,
        breakTime: '0 mins',
        totalHours: '-',
        status: 'present',
        location: 'Ward 5 Office',
      },
      {
        id: '2',
        date: 'Yesterday',
        checkIn: '8:55 AM',
        checkOut: '6:10 PM',
        breakTime: '45 mins',
        totalHours: '8h 30m',
        status: 'present',
        location: 'Ward 5 Office',
      },
      {
        id: '3',
        date: '2 days ago',
        checkIn: '9:30 AM',
        checkOut: '6:00 PM',
        breakTime: '1 hour',
        totalHours: '7h 30m',
        status: 'late',
        location: 'Ward 5 Office',
      },
      {
        id: '4',
        date: '3 days ago',
        checkIn: '-',
        checkOut: '-',
        breakTime: '-',
        totalHours: '-',
        status: 'absent',
        location: '-',
      },
    ]);
    
    // Check if already checked in today
    const today = new Date().toDateString();
    // Simulate checking attendance status
    setAttendanceStatus('not-checked-in');
    
    setLoading(false);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCurrentLocation('Location permission denied');
        setIsInGeofence(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      
      // Reverse geocode to get address
      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address) {
        setCurrentLocation(`${address.street || ''}, ${address.city || ''}`);
      } else {
        setCurrentLocation('Location detected');
      }
      
      // Simulate geofence check
      setIsInGeofence(true);
    } catch (error) {
      setCurrentLocation('Unable to get location');
      setIsInGeofence(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadAttendanceData();
    await getCurrentLocation();
    setRefreshing(false);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleCheckIn = async () => {
    if (!isInGeofence) {
      Alert.alert(
        'Outside Work Zone',
        'You must be within the designated work area to check in.',
        [{ text: 'OK' }]
      );
      return;
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    const time = getCurrentTime();
    setCheckInTime(time);
    setAttendanceStatus('checked-in');
    setElapsedTime(0);
    
    Alert.alert(
      'Checked In',
      `You have successfully checked in at ${time}`,
      [{ text: 'OK' }]
    );
  };

  const handleStartBreak = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setBreakStartTime(getCurrentTime());
    setAttendanceStatus('on-break');
    setBreakTime(0);
  };

  const handleEndBreak = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setAttendanceStatus('checked-in');
    setBreakStartTime(null);
  };

  const handleCheckOut = async () => {
    if (!isInGeofence) {
      Alert.alert(
        'Outside Work Zone',
        'You must be within the designated work area to check out.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Confirm Check Out',
      'Are you sure you want to check out for today?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Check Out',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setAttendanceStatus('checked-out');
            
            Alert.alert(
              'Checked Out',
              `You have successfully checked out at ${getCurrentTime()}`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const getStatusColor = () => {
    switch (attendanceStatus) {
      case 'not-checked-in':
        return '#f59e0b';
      case 'checked-in':
        return '#22c55e';
      case 'on-break':
        return '#3b82f6';
      case 'checked-out':
        return '#8b5cf6';
    }
  };

  const getStatusLabel = () => {
    switch (attendanceStatus) {
      case 'not-checked-in':
        return 'Not Checked In';
      case 'checked-in':
        return 'Working';
      case 'on-break':
        return 'On Break';
      case 'checked-out':
        return 'Checked Out';
    }
  };

  const getHistoryStatusStyle = (status: string) => {
    switch (status) {
      case 'present':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'late':
        return { bg: 'bg-amber-100', text: 'text-amber-600' };
      case 'absent':
        return { bg: 'bg-red-100', text: 'text-red-600' };
      case 'half-day':
        return { bg: 'bg-blue-100', text: 'text-blue-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={[getStatusColor(), getStatusColor()]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-6 px-4"
      >
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <ArrowLeft size={20} color="#fff" />
          </TouchableOpacity>
          
          <Text className="text-white text-lg font-semibold">Attendance</Text>
          
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            onPress={() => router.push('/employee/attendance-history')}
          >
            <History size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Status Card */}
        <View className="bg-white rounded-2xl p-4 shadow-lg">
          <View className="items-center mb-4">
            <View className="flex-row items-center mb-2">
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getStatusColor() }}
              />
              <Text className="text-gray-700 font-medium">{getStatusLabel()}</Text>
            </View>
            
            {attendanceStatus === 'checked-in' && (
              <Animated.View style={pulseStyle}>
                <Text
                  className="text-5xl font-bold"
                  style={{ color: getStatusColor() }}
                >
                  {formatTime(elapsedTime)}
                </Text>
              </Animated.View>
            )}
            
            {attendanceStatus === 'on-break' && (
              <View>
                <Text className="text-gray-500 text-sm">Break Time</Text>
                <Text
                  className="text-4xl font-bold"
                  style={{ color: getStatusColor() }}
                >
                  {formatTime(breakTime)}
                </Text>
              </View>
            )}
            
            {attendanceStatus === 'not-checked-in' && (
              <Text className="text-4xl font-bold text-gray-900">
                {getCurrentTime()}
              </Text>
            )}
            
            {attendanceStatus === 'checked-out' && (
              <View className="items-center">
                <CheckCircle size={48} color="#8b5cf6" />
                <Text className="text-gray-700 font-medium mt-2">
                  See you tomorrow!
                </Text>
              </View>
            )}
          </View>

          {/* Location Info */}
          <View
            className={`flex-row items-center justify-center p-3 rounded-xl ${
              isInGeofence ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            {isInGeofence ? (
              <Wifi size={16} color="#22c55e" />
            ) : (
              <WifiOff size={16} color="#ef4444" />
            )}
            <MapPin
              size={16}
              color={isInGeofence ? '#22c55e' : '#ef4444'}
              className="ml-2"
            />
            <Text
              className={`text-sm ml-2 ${
                isInGeofence ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {currentLocation}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
      >
        {/* Action Buttons */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="mb-6"
        >
          {attendanceStatus === 'not-checked-in' && (
            <TouchableOpacity
              className={`rounded-2xl py-5 flex-row items-center justify-center ${
                isInGeofence ? 'bg-green-500' : 'bg-gray-300'
              }`}
              onPress={handleCheckIn}
              disabled={!isInGeofence}
            >
              <LogIn size={24} color="#fff" />
              <Text className="text-white font-bold text-xl ml-3">Check In</Text>
            </TouchableOpacity>
          )}
          
          {attendanceStatus === 'checked-in' && (
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-blue-500 rounded-2xl py-4 flex-row items-center justify-center"
                onPress={handleStartBreak}
              >
                <Coffee size={20} color="#fff" />
                <Text className="text-white font-bold ml-2">Take Break</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className={`flex-1 rounded-2xl py-4 flex-row items-center justify-center ${
                  isInGeofence ? 'bg-red-500' : 'bg-gray-300'
                }`}
                onPress={handleCheckOut}
                disabled={!isInGeofence}
              >
                <LogOut size={20} color="#fff" />
                <Text className="text-white font-bold ml-2">Check Out</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {attendanceStatus === 'on-break' && (
            <TouchableOpacity
              className="bg-green-500 rounded-2xl py-5 flex-row items-center justify-center"
              onPress={handleEndBreak}
            >
              <Timer size={24} color="#fff" />
              <Text className="text-white font-bold text-xl ml-3">End Break</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Today's Schedule */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="bg-white rounded-2xl p-4 mb-6 shadow-sm"
        >
          <View className="flex-row items-center mb-4">
            <Calendar size={20} color="#3b82f6" />
            <Text className="text-gray-900 font-bold text-lg ml-2">Today's Schedule</Text>
          </View>
          
          <View className="flex-row flex-wrap">
            <View className="w-1/2 mb-3">
              <Text className="text-gray-500 text-sm">Start Time</Text>
              <Text className="text-gray-900 font-semibold">{todayStats.scheduledStart}</Text>
            </View>
            
            <View className="w-1/2 mb-3">
              <Text className="text-gray-500 text-sm">End Time</Text>
              <Text className="text-gray-900 font-semibold">{todayStats.scheduledEnd}</Text>
            </View>
            
            <View className="w-1/2">
              <Text className="text-gray-500 text-sm">Break Allowed</Text>
              <Text className="text-gray-900 font-semibold">{todayStats.totalBreak}</Text>
            </View>
            
            <View className="w-1/2">
              <Text className="text-gray-500 text-sm">Work Location</Text>
              <Text className="text-gray-900 font-semibold">{todayStats.workLocation}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Check-in Methods */}
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="bg-white rounded-2xl p-4 mb-6 shadow-sm"
        >
          <Text className="text-gray-900 font-bold text-lg mb-4">Check-in Methods</Text>
          
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-blue-50 rounded-xl p-4 items-center">
              <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-2">
                <MapPin size={24} color="#3b82f6" />
              </View>
              <Text className="text-blue-700 font-medium">GPS</Text>
              <Text className="text-blue-500 text-xs">Current</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 bg-gray-50 rounded-xl p-4 items-center">
              <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2">
                <Fingerprint size={24} color="#6b7280" />
              </View>
              <Text className="text-gray-700 font-medium">Biometric</Text>
              <Text className="text-gray-500 text-xs">Available</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 bg-gray-50 rounded-xl p-4 items-center">
              <View className="w-12 h-12 rounded-full bg-gray-100 items-center justify-center mb-2">
                <Camera size={24} color="#6b7280" />
              </View>
              <Text className="text-gray-700 font-medium">Face ID</Text>
              <Text className="text-gray-500 text-xs">Available</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Attendance History */}
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-900 font-bold text-lg">Recent History</Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push('/employee/attendance-history')}
            >
              <Text className="text-blue-500 font-medium text-sm">View All</Text>
              <ChevronRight size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          
          <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {attendanceHistory.map((record, index) => {
              const statusStyle = getHistoryStatusStyle(record.status);
              return (
                <View
                  key={record.id}
                  className={`p-4 ${
                    index !== attendanceHistory.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-gray-900 font-medium">{record.date}</Text>
                    <View className={`px-3 py-1 rounded-full ${statusStyle.bg}`}>
                      <Text className={`text-xs font-medium capitalize ${statusStyle.text}`}>
                        {record.status}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <View>
                      <Text className="text-gray-500 text-xs">Check In</Text>
                      <Text className="text-gray-700 font-medium">{record.checkIn}</Text>
                    </View>
                    
                    <View>
                      <Text className="text-gray-500 text-xs">Check Out</Text>
                      <Text className="text-gray-700 font-medium">{record.checkOut || '-'}</Text>
                    </View>
                    
                    <View>
                      <Text className="text-gray-500 text-xs">Break</Text>
                      <Text className="text-gray-700 font-medium">{record.breakTime}</Text>
                    </View>
                    
                    <View>
                      <Text className="text-gray-500 text-xs">Total</Text>
                      <Text className="text-gray-700 font-medium">{record.totalHours}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Geofence Warning */}
      {!isInGeofence && (
        <Animated.View
          entering={FadeInUp.springify()}
          className="absolute bottom-0 left-0 right-0 bg-red-500 px-6 py-4"
        >
          <View className="flex-row items-center">
            <AlertCircle size={24} color="#fff" />
            <View className="ml-3 flex-1">
              <Text className="text-white font-bold">Outside Work Zone</Text>
              <Text className="text-white/80 text-sm">
                You must be within the designated area to check in/out.
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
