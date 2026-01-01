import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search as SearchIcon, MapPin, Calendar, Filter } from 'lucide-react-native';
import { StatusBadge } from '@/components/ui/StatusBadge';

const mockResults = [
  {
    id: 'CMP-12345678',
    category: 'Road Damage',
    status: 'in_progress',
    location: 'MG Road, Sector 14',
    date: '2026-01-01',
  },
  {
    id: 'CMP-12345679',
    category: 'Water Supply',
    status: 'completed',
    location: 'Park Street, Block A',
    date: '2025-12-28',
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(mockResults);
  const [recentSearches] = useState([
    'Road Damage',
    'CMP-12345678',
    'Sector 14',
    'Water Supply',
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search logic
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Search */}
      <View className="bg-white pt-12 pb-4 px-6 border-b border-gray-200">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="#1f2937" />
          </TouchableOpacity>
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
            <SearchIcon size={20} color="#6b7280" />
            <TextInput
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Search by ID, category, or location..."
              autoFocus
              className="flex-1 ml-3 text-gray-900"
            />
          </View>
          <TouchableOpacity className="ml-3">
            <Filter size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Recent Searches */}
        {searchQuery === '' && (
          <View className="p-6">
            <Text className="text-gray-900 text-lg font-bold mb-3">
              Recent Searches
            </Text>
            <View className="flex-row flex-wrap">
              {recentSearches.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSearch(item)}
                  className="bg-gray-100 px-4 py-2 rounded-full mr-2 mb-2"
                >
                  <Text className="text-gray-700">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Search Results */}
        {searchQuery !== '' && (
          <View className="p-4">
            <Text className="text-gray-600 mb-4">
              {results.length} results found
            </Text>
            {results.map((result) => (
              <TouchableOpacity
                key={result.id}
                onPress={() => router.push(`/complaints/${result.id}`)}
                className="bg-white rounded-xl p-4 mb-3 border border-gray-200"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-gray-900 text-lg font-bold mb-1">
                      {result.category}
                    </Text>
                    <Text className="text-gray-500 text-sm">{result.id}</Text>
                  </View>
                  <StatusBadge status={result.status as any} />
                </View>

                <View className="flex-row items-center mb-1">
                  <MapPin size={14} color="#6b7280" />
                  <Text className="text-gray-600 text-sm ml-2">
                    {result.location}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Calendar size={14} color="#6b7280" />
                  <Text className="text-gray-600 text-sm ml-2">
                    {new Date(result.date).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* No Results */}
        {searchQuery !== '' && results.length === 0 && (
          <View className="items-center justify-center py-12">
            <Text className="text-6xl mb-4">🔍</Text>
            <Text className="text-gray-900 text-xl font-bold mb-2">
              No Results Found
            </Text>
            <Text className="text-gray-600 text-center px-6">
              Try searching with different keywords
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
