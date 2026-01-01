import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trash2, Droplets, TreeDeciduous, Building2, Lightbulb, Wrench, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const categories = [
  {
    id: 'garbage_issue',
    title: 'Garbage & Waste',
    icon: Trash2,
    description: 'Waste collection, littering',
    color: ['#10b981', '#059669'],
  },
  {
    id: 'water_supply',
    title: 'Water Supply',
    icon: Droplets,
    description: 'Leakage, shortage, quality',
    color: ['#3b82f6', '#2563eb'],
  },
  {
    id: 'road_damage',
    title: 'Roads & Streets',
    icon: Building2,
    description: 'Potholes, damage, construction',
    color: ['#f59e0b', '#d97706'],
  },
  {
    id: 'tree_plantation',
    title: 'Tree & Parks',
    icon: TreeDeciduous,
    description: 'Fallen trees, park maintenance',
    color: ['#22c55e', '#16a34a'],
  },
  {
    id: 'electricity',
    title: 'Street Lights',
    icon: Lightbulb,
    description: 'Not working, damaged poles',
    color: ['#eab308', '#ca8a04'],
  },
  {
    id: 'drainage',
    title: 'Drainage',
    icon: Wrench,
    description: 'Blockage, overflow, smell',
    color: ['#8b5cf6', '#7c3aed'],
  },
  {
    id: 'hospital_waste',
    title: 'Bio-Medical Waste',
    icon: AlertCircle,
    description: 'Hospital waste disposal',
    color: ['#ef4444', '#dc2626'],
  },
  {
    id: 'other',
    title: 'Other Issues',
    icon: AlertCircle,
    description: 'Any other civic issues',
    color: ['#6b7280', '#4b5563'],
  },
];

export default function CategorySelectionScreen() {
  const router = useRouter();

  const handleCategorySelect = (categoryId: string) => {
    router.push({
      pathname: '/complaints/new',
      params: { category: categoryId },
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient
        colors={['#3b82f6', '#2563eb']}
        className="pt-12 pb-6 px-6"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">Select Category</Text>
        <Text className="text-white/80 text-base mt-2">
          Choose the type of issue you want to report
        </Text>
      </LinearGradient>

      <ScrollView className="flex-1 p-4">
        <View className="flex-row flex-wrap justify-between">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategorySelect(category.id)}
                className="w-[48%] mb-4"
              >
                <LinearGradient
                  colors={category.color}
                  className="rounded-2xl p-4 h-40 justify-between"
                >
                  <View className="bg-white/20 rounded-full w-14 h-14 items-center justify-center">
                    <Icon size={28} color="white" />
                  </View>
                  <View>
                    <Text className="text-white text-lg font-bold mb-1">
                      {category.title}
                    </Text>
                    <Text className="text-white/80 text-sm">
                      {category.description}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Emergency Contact */}
        <View className="mt-4 mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <Text className="text-red-800 font-bold text-base mb-1">
            🚨 Emergency?
          </Text>
          <Text className="text-red-700 text-sm">
            For urgent issues requiring immediate attention, call: 1800-XXX-XXXX
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
