import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ArrowLeft, List, MapIcon } from 'lucide-react-native';

const mockComplaints = [
  {
    id: 'CMP-001',
    category: 'Road Damage',
    status: 'in_progress',
    latitude: 28.6139,
    longitude: 77.2090,
    priority: 'urgent',
  },
  {
    id: 'CMP-002',
    category: 'Garbage Issue',
    status: 'assigned',
    latitude: 28.6129,
    longitude: 77.2295,
    priority: 'normal',
  },
  {
    id: 'CMP-003',
    category: 'Water Supply',
    status: 'completed',
    latitude: 28.7041,
    longitude: 77.1025,
    priority: 'urgent',
  },
];

export default function MapViewScreen() {
  const router = useRouter();
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);

  const initialRegion = {
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'new':
        return '#eab308';
      case 'assigned':
        return '#3b82f6';
      case 'in_progress':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="absolute top-0 left-0 right-0 z-10 bg-white pt-12 pb-4 px-6 shadow-sm">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text className="text-gray-900 text-xl font-bold flex-1">
            Map View
          </Text>
          <TouchableOpacity onPress={() => router.push('/complaints/track')}>
            <List size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {mockComplaints.map((complaint) => (
          <Marker
            key={complaint.id}
            coordinate={{
              latitude: complaint.latitude,
              longitude: complaint.longitude,
            }}
            pinColor={getMarkerColor(complaint.status)}
            onPress={() => setSelectedComplaint(complaint.id)}
          >
            <View className="items-center">
              <View
                style={{
                  backgroundColor: getMarkerColor(complaint.status),
                  padding: 8,
                  borderRadius: 20,
                  borderWidth: 3,
                  borderColor: 'white',
                }}
              >
                <Text className="text-white text-xs font-bold">
                  {complaint.category.split(' ')[0]}
                </Text>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Legend */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
        <Text className="text-gray-900 font-bold mb-2">Status Legend</Text>
        <View className="flex-row flex-wrap">
          <View className="flex-row items-center mr-4 mb-2">
            <View className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
            <Text className="text-gray-700 text-sm">New</Text>
          </View>
          <View className="flex-row items-center mr-4 mb-2">
            <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
            <Text className="text-gray-700 text-sm">Assigned</Text>
          </View>
          <View className="flex-row items-center mr-4 mb-2">
            <View className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
            <Text className="text-gray-700 text-sm">In Progress</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
            <Text className="text-gray-700 text-sm">Completed</Text>
          </View>
        </View>
      </View>

      {/* Selected Complaint Card */}
      {selectedComplaint && (
        <View className="absolute bottom-32 left-4 right-4 bg-white rounded-xl p-4 shadow-lg">
          <TouchableOpacity
            onPress={() => router.push(`/complaints/${selectedComplaint}`)}
          >
            {mockComplaints
              .filter((c) => c.id === selectedComplaint)
              .map((complaint) => (
                <View key={complaint.id}>
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <Text className="text-gray-900 text-lg font-bold">
                        {complaint.category}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {complaint.id}
                      </Text>
                    </View>
                    {complaint.priority === 'urgent' && (
                      <View className="bg-red-100 px-3 py-1 rounded-full">
                        <Text className="text-red-600 text-xs font-semibold">
                          URGENT
                        </Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity className="bg-blue-600 py-2 rounded-lg mt-2">
                    <Text className="text-white text-center font-semibold">
                      View Details
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedComplaint(null)}
            className="absolute -top-2 -right-2 bg-gray-900 rounded-full p-2"
          >
            <Text className="text-white text-xs">✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
