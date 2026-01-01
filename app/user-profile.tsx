import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Mail, Phone, MapPin, Edit2, Save, Camera } from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';

export default function UserProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    address: 'Sector 14, MG Road, New Delhi - 110001',
    avatarUrl: '',
  });

  const handleSave = () => {
    // TODO: Implement profile update logic
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleChangePhoto = () => {
    Alert.alert('Change Photo', 'Select photo source', [
      { text: 'Camera', onPress: () => {} },
      { text: 'Gallery', onPress: () => {} },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const stats = [
    { label: 'Total Complaints', value: '12', color: 'bg-blue-100 text-blue-600' },
    { label: 'Resolved', value: '8', color: 'bg-green-100 text-green-600' },
    { label: 'In Progress', value: '3', color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Pending', value: '1', color: 'bg-red-100 text-red-600' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-600 pt-12 pb-6 px-6">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-bold flex-1 ml-4">
            My Profile
          </Text>
          <TouchableOpacity
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? (
              <Save size={24} color="white" />
            ) : (
              <Edit2 size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Photo */}
        <View className="items-center">
          <View className="relative">
            <Avatar
              name={profile.name}
              size="xl"
              imageUrl={profile.avatarUrl}
            />
            {isEditing && (
              <TouchableOpacity
                onPress={handleChangePhoto}
                className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full border-2 border-white"
              >
                <Camera size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <Text className="text-white text-2xl font-bold mt-3">
            {profile.name}
          </Text>
          <Text className="text-white/80 text-sm">Citizen</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-6">
        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between mb-6">
          {stats.map((stat, index) => (
            <View
              key={index}
              className="w-[48%] bg-white rounded-xl p-4 mb-3 border border-gray-200"
            >
              <Text className={`text-3xl font-bold ${stat.color.split(' ')[1]}`}>
                {stat.value}
              </Text>
              <Text className="text-gray-600 text-sm mt-1">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Profile Information */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-gray-900 text-lg font-bold mb-4">
            Personal Information
          </Text>

          {/* Name */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <User size={18} color="#6b7280" />
              <Text className="text-gray-600 ml-2">Full Name</Text>
            </View>
            {isEditing ? (
              <TextInput
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                className="bg-gray-50 px-4 py-3 rounded-lg text-gray-900"
              />
            ) : (
              <Text className="text-gray-900 font-semibold ml-7">
                {profile.name}
              </Text>
            )}
          </View>

          {/* Email */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <Mail size={18} color="#6b7280" />
              <Text className="text-gray-600 ml-2">Email</Text>
            </View>
            {isEditing ? (
              <TextInput
                value={profile.email}
                onChangeText={(text) => setProfile({ ...profile, email: text })}
                keyboardType="email-address"
                className="bg-gray-50 px-4 py-3 rounded-lg text-gray-900"
              />
            ) : (
              <Text className="text-gray-900 ml-7">{profile.email}</Text>
            )}
          </View>

          {/* Phone */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <Phone size={18} color="#6b7280" />
              <Text className="text-gray-600 ml-2">Phone</Text>
            </View>
            {isEditing ? (
              <TextInput
                value={profile.phone}
                onChangeText={(text) => setProfile({ ...profile, phone: text })}
                keyboardType="phone-pad"
                className="bg-gray-50 px-4 py-3 rounded-lg text-gray-900"
              />
            ) : (
              <Text className="text-gray-900 ml-7">{profile.phone}</Text>
            )}
          </View>

          {/* Address */}
          <View>
            <View className="flex-row items-center mb-2">
              <MapPin size={18} color="#6b7280" />
              <Text className="text-gray-600 ml-2">Address</Text>
            </View>
            {isEditing ? (
              <TextInput
                value={profile.address}
                onChangeText={(text) => setProfile({ ...profile, address: text })}
                multiline
                numberOfLines={3}
                className="bg-gray-50 px-4 py-3 rounded-lg text-gray-900"
              />
            ) : (
              <Text className="text-gray-900 ml-7">{profile.address}</Text>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="bg-white rounded-xl p-4 mb-6">
          <Text className="text-gray-900 text-lg font-bold mb-3">
            Quick Actions
          </Text>
          
          <TouchableOpacity
            onPress={() => router.push('/settings')}
            className="py-3 border-b border-gray-100"
          >
            <Text className="text-gray-900 font-semibold">⚙️ Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/settings/privacy-policy')}
            className="py-3 border-b border-gray-100"
          >
            <Text className="text-gray-900 font-semibold">🔒 Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/settings/terms')}
            className="py-3 border-b border-gray-100"
          >
            <Text className="text-gray-900 font-semibold">📄 Terms & Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/settings/about')}
            className="py-3"
          >
            <Text className="text-gray-900 font-semibold">ℹ️ About Us</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
