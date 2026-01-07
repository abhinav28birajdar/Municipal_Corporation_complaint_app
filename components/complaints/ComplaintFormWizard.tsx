// Multi-Step Complaint Form Component
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  MapPin,
  Tag,
  FileText,
  Image as ImageIcon,
  X,
  Check,
  AlertCircle,
} from 'lucide-react-native';
import { ComplaintCategory, ComplaintSubCategory, ComplaintFormData } from '@/types/complete';
import { useSettingsStore } from '@/store/settings-store';
import { colors as lightColors, darkColors } from '@/constants/Colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ComplaintFormWizardProps {
  categories: ComplaintCategory[];
  onSubmit: (data: ComplaintFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormState {
  category_id: string;
  sub_category_id?: string;
  title: string;
  description: string;
  images: string[];
  latitude?: number;
  longitude?: number;
  address: string;
  landmark?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_anonymous: boolean;
}

const STEPS = [
  { id: 1, title: 'Category', icon: Tag },
  { id: 2, title: 'Details', icon: FileText },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Photos', icon: Camera },
  { id: 5, title: 'Review', icon: Check },
];

export const ComplaintFormWizard: React.FC<ComplaintFormWizardProps> = ({
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const { isDarkMode } = useSettingsStore();
  const colors = isDarkMode ? darkColors : lightColors;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormState>({
    category_id: '',
    sub_category_id: undefined,
    title: '',
    description: '',
    images: [],
    latitude: undefined,
    longitude: undefined,
    address: '',
    landmark: '',
    priority: 'medium',
    is_anonymous: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  const animateSlide = (direction: 'next' | 'prev') => {
    const toValue = direction === 'next' ? -SCREEN_WIDTH : SCREEN_WIDTH;
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.category_id) {
          newErrors.category = 'Please select a category';
        }
        break;
      case 2:
        if (!formData.title.trim()) {
          newErrors.title = 'Title is required';
        } else if (formData.title.length < 10) {
          newErrors.title = 'Title should be at least 10 characters';
        }
        if (!formData.description.trim()) {
          newErrors.description = 'Description is required';
        } else if (formData.description.length < 20) {
          newErrors.description = 'Description should be at least 20 characters';
        }
        break;
      case 3:
        if (!formData.address.trim()) {
          newErrors.address = 'Address is required';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      animateSlide('next');
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onCancel();
    } else {
      animateSlide('prev');
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCategorySelect = (category: ComplaintCategory) => {
    setSelectedCategory(category);
    setFormData(prev => ({
      ...prev,
      category_id: category.id,
      sub_category_id: undefined,
    }));
    setErrors(prev => ({ ...prev, category: '' }));
  };

  const handleSubCategorySelect = (subCategoryId: string) => {
    setFormData(prev => ({
      ...prev,
      sub_category_id: subCategoryId,
    }));
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to auto-fill address.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      const formattedAddress = [
        address.name,
        address.street,
        address.district,
        address.city,
        address.region,
        address.postalCode,
      ]
        .filter(Boolean)
        .join(', ');

      setFormData(prev => ({
        ...prev,
        latitude,
        longitude,
        address: formattedAddress,
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Gallery permission is required to select images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - formData.images.length,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5),
      }));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, result.assets[0].uri].slice(0, 5),
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      await onSubmit({
        category_id: formData.category_id,
        sub_category_id: formData.sub_category_id,
        title: formData.title,
        description: formData.description,
        images: formData.images,
        location: formData.latitude && formData.longitude 
          ? { latitude: formData.latitude, longitude: formData.longitude }
          : undefined,
        address: formData.address,
        landmark: formData.landmark,
        priority: formData.priority,
        is_anonymous: formData.is_anonymous,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to submit complaint. Please try again.');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const Icon = step.icon;
        
        return (
          <React.Fragment key={step.id}>
            <View style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  isActive && { backgroundColor: colors.tint },
                  isCompleted && { backgroundColor: '#10B981' },
                  !isActive && !isCompleted && { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' },
                ]}
              >
                {isCompleted ? (
                  <Check size={14} color="#FFFFFF" />
                ) : (
                  <Icon 
                    size={14} 
                    color={isActive ? '#FFFFFF' : colors.tabIconDefault} 
                  />
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  { color: isActive ? colors.tint : colors.tabIconDefault },
                ]}
              >
                {step.title}
              </Text>
            </View>
            {index < STEPS.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  { 
                    backgroundColor: isCompleted 
                      ? '#10B981' 
                      : isDarkMode ? '#374151' : '#E5E7EB' 
                  },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );

  const renderCategoryStep = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Select a Category
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.tabIconDefault }]}>
        Choose the category that best describes your complaint
      </Text>
      
      {errors.category && (
        <View style={styles.errorContainer}>
          <AlertCircle size={14} color="#DC2626" />
          <Text style={styles.errorText}>{errors.category}</Text>
        </View>
      )}

      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryCard,
              { 
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                borderColor: formData.category_id === category.id 
                  ? colors.tint 
                  : isDarkMode ? '#374151' : '#E5E7EB',
                borderWidth: formData.category_id === category.id ? 2 : 1,
              },
            ]}
            onPress={() => handleCategorySelect(category)}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text 
              style={[styles.categoryName, { color: colors.text }]}
              numberOfLines={2}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedCategory && selectedCategory.sub_categories && selectedCategory.sub_categories.length > 0 && (
        <View style={styles.subCategoriesSection}>
          <Text style={[styles.subCategoriesTitle, { color: colors.text }]}>
            Sub-category (Optional)
          </Text>
          <View style={styles.subCategoriesList}>
            {selectedCategory.sub_categories.map((sub: any) => (
              <TouchableOpacity
                key={sub.id}
                style={[
                  styles.subCategoryChip,
                  {
                    backgroundColor: formData.sub_category_id === sub.id
                      ? colors.tint
                      : isDarkMode ? '#374151' : '#E5E7EB',
                  },
                ]}
                onPress={() => handleSubCategorySelect(sub.id)}
              >
                <Text
                  style={[
                    styles.subCategoryText,
                    {
                      color: formData.sub_category_id === sub.id
                        ? '#FFFFFF'
                        : colors.text,
                    },
                  ]}
                >
                  {sub.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderDetailsStep = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Complaint Details
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.tabIconDefault }]}>
        Provide detailed information about your complaint
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>
          Title *
        </Text>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
              color: colors.text,
              borderColor: errors.title ? '#DC2626' : isDarkMode ? '#374151' : '#E5E7EB',
            },
          ]}
          placeholder="Brief title for your complaint"
          placeholderTextColor={colors.tabIconDefault}
          value={formData.title}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, title: text }));
            setErrors(prev => ({ ...prev, title: '' }));
          }}
          maxLength={100}
        />
        {errors.title && (
          <View style={styles.errorContainer}>
            <AlertCircle size={14} color="#DC2626" />
            <Text style={styles.errorText}>{errors.title}</Text>
          </View>
        )}
        <Text style={[styles.charCount, { color: colors.tabIconDefault }]}>
          {formData.title.length}/100
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>
          Description *
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
              color: colors.text,
              borderColor: errors.description ? '#DC2626' : isDarkMode ? '#374151' : '#E5E7EB',
            },
          ]}
          placeholder="Describe the issue in detail..."
          placeholderTextColor={colors.tabIconDefault}
          value={formData.description}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, description: text }));
            setErrors(prev => ({ ...prev, description: '' }));
          }}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          maxLength={1000}
        />
        {errors.description && (
          <View style={styles.errorContainer}>
            <AlertCircle size={14} color="#DC2626" />
            <Text style={styles.errorText}>{errors.description}</Text>
          </View>
        )}
        <Text style={[styles.charCount, { color: colors.tabIconDefault }]}>
          {formData.description.length}/1000
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>
          Priority
        </Text>
        <View style={styles.priorityOptions}>
          {(['low', 'medium', 'high', 'critical'] as const).map((priority) => {
            const priorityColors: Record<string, string> = {
              low: '#10B981',
              medium: '#F59E0B',
              high: '#F97316',
              critical: '#EF4444',
            };
            const isSelected = formData.priority === priority;
            
            return (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityOption,
                  {
                    backgroundColor: isSelected 
                      ? priorityColors[priority] 
                      : isDarkMode ? '#1F2937' : '#F9FAFB',
                    borderColor: priorityColors[priority],
                  },
                ]}
                onPress={() => setFormData(prev => ({ ...prev, priority }))}
              >
                <Text
                  style={[
                    styles.priorityText,
                    { color: isSelected ? '#FFFFFF' : priorityColors[priority] },
                  ]}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.anonymousOption,
          { backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB' },
        ]}
        onPress={() => setFormData(prev => ({ ...prev, is_anonymous: !prev.is_anonymous }))}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: formData.is_anonymous ? colors.tint : 'transparent',
              borderColor: formData.is_anonymous ? colors.tint : colors.tabIconDefault,
            },
          ]}
        >
          {formData.is_anonymous && <Check size={12} color="#FFFFFF" />}
        </View>
        <View style={styles.anonymousText}>
          <Text style={[styles.anonymousTitle, { color: colors.text }]}>
            Submit Anonymously
          </Text>
          <Text style={[styles.anonymousSubtitle, { color: colors.tabIconDefault }]}>
            Your identity will be hidden from public view
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderLocationStep = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Location Details
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.tabIconDefault }]}>
        Help us locate the issue accurately
      </Text>

      <TouchableOpacity
        style={[styles.locationButton, { backgroundColor: colors.tint }]}
        onPress={getCurrentLocation}
        disabled={isLoadingLocation}
      >
        <MapPin size={20} color="#FFFFFF" />
        <Text style={styles.locationButtonText}>
          {isLoadingLocation ? 'Getting Location...' : 'Use Current Location'}
        </Text>
      </TouchableOpacity>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>
          Address *
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
              color: colors.text,
              borderColor: errors.address ? '#DC2626' : isDarkMode ? '#374151' : '#E5E7EB',
            },
          ]}
          placeholder="Enter the complete address"
          placeholderTextColor={colors.tabIconDefault}
          value={formData.address}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, address: text }));
            setErrors(prev => ({ ...prev, address: '' }));
          }}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
        {errors.address && (
          <View style={styles.errorContainer}>
            <AlertCircle size={14} color="#DC2626" />
            <Text style={styles.errorText}>{errors.address}</Text>
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.inputLabel, { color: colors.text }]}>
          Landmark (Optional)
        </Text>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
              color: colors.text,
              borderColor: isDarkMode ? '#374151' : '#E5E7EB',
            },
          ]}
          placeholder="Nearby landmark for reference"
          placeholderTextColor={colors.tabIconDefault}
          value={formData.landmark}
          onChangeText={(text) => setFormData(prev => ({ ...prev, landmark: text }))}
        />
      </View>

      {formData.latitude && formData.longitude && (
        <View style={[styles.coordinatesBox, { backgroundColor: isDarkMode ? '#1F2937' : '#F0FDF4' }]}>
          <Check size={16} color="#10B981" />
          <Text style={[styles.coordinatesText, { color: '#10B981' }]}>
            GPS coordinates captured
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderPhotosStep = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Add Photos
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.tabIconDefault }]}>
        Photos help us understand and resolve the issue faster
      </Text>

      <View style={styles.photoButtons}>
        <TouchableOpacity
          style={[styles.photoButton, { backgroundColor: colors.tint }]}
          onPress={takePhoto}
          disabled={formData.images.length >= 5}
        >
          <Camera size={24} color="#FFFFFF" />
          <Text style={styles.photoButtonText}>Take Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.photoButton,
            { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' },
          ]}
          onPress={pickImages}
          disabled={formData.images.length >= 5}
        >
          <ImageIcon size={24} color={colors.text} />
          <Text style={[styles.photoButtonText, { color: colors.text }]}>
            From Gallery
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.photoLimit, { color: colors.tabIconDefault }]}>
        {formData.images.length}/5 photos added
      </Text>

      {formData.images.length > 0 && (
        <View style={styles.imageGrid}>
          {formData.images.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <X size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {formData.images.length === 0 && (
        <View style={[styles.noPhotosBox, { backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB' }]}>
          <Camera size={48} color={colors.tabIconDefault} />
          <Text style={[styles.noPhotosText, { color: colors.tabIconDefault }]}>
            No photos added yet
          </Text>
          <Text style={[styles.noPhotosSubtext, { color: colors.tabIconDefault }]}>
            Adding photos is optional but recommended
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderReviewStep = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Review & Submit
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.tabIconDefault }]}>
        Please review your complaint before submitting
      </Text>

      <View style={[styles.reviewCard, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: colors.tabIconDefault }]}>Category</Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {selectedCategory?.name || 'N/A'}
          </Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: colors.tabIconDefault }]}>Title</Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {formData.title}
          </Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: colors.tabIconDefault }]}>Description</Text>
          <Text style={[styles.reviewValue, { color: colors.text }]} numberOfLines={3}>
            {formData.description}
          </Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: colors.tabIconDefault }]}>Location</Text>
          <Text style={[styles.reviewValue, { color: colors.text }]} numberOfLines={2}>
            {formData.address}
          </Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: colors.tabIconDefault }]}>Priority</Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
          </Text>
        </View>
        
        <View style={styles.reviewItem}>
          <Text style={[styles.reviewLabel, { color: colors.tabIconDefault }]}>Photos</Text>
          <Text style={[styles.reviewValue, { color: colors.text }]}>
            {formData.images.length} photo(s) attached
          </Text>
        </View>
        
        {formData.is_anonymous && (
          <View style={[styles.anonymousBadge, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.anonymousBadgeText}>Submitting Anonymously</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderCategoryStep();
      case 2:
        return renderDetailsStep();
      case 3:
        return renderLocationStep();
      case 4:
        return renderPhotosStep();
      case 5:
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderStepIndicator()}
      
      <Animated.View 
        style={[
          styles.contentContainer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {renderStepContent()}
      </Animated.View>

      <View style={[styles.footer, { borderTopColor: isDarkMode ? '#374151' : '#E5E7EB' }]}>
        <TouchableOpacity
          style={[
            styles.footerButton,
            styles.backButton,
            { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' },
          ]}
          onPress={handleBack}
        >
          <ChevronLeft size={20} color={colors.text} />
          <Text style={[styles.footerButtonText, { color: colors.text }]}>
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.footerButton,
            styles.nextButton,
            { backgroundColor: colors.tint },
          ]}
          onPress={currentStep === STEPS.length ? handleSubmit : handleNext}
          disabled={isLoading}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === STEPS.length ? 'Submit' : 'Next'}
          </Text>
          {currentStep !== STEPS.length && <ChevronRight size={20} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  stepLine: {
    height: 2,
    width: 24,
    marginHorizontal: 4,
    marginBottom: 18,
  },
  contentContainer: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    marginLeft: 6,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - 52) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  subCategoriesSection: {
    marginTop: 24,
  },
  subCategoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  subCategoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subCategoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  subCategoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  anonymousOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  anonymousText: {
    flex: 1,
  },
  anonymousTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  anonymousSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  coordinatesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  coordinatesText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  photoLimit: {
    fontSize: 14,
    marginBottom: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  previewImage: {
    width: (SCREEN_WIDTH - 60) / 3,
    height: (SCREEN_WIDTH - 60) / 3,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPhotosBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 12,
  },
  noPhotosText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  noPhotosSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  reviewCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  anonymousBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  anonymousBadgeText: {
    color: '#D97706',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    gap: 12,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  backButton: {},
  nextButton: {},
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
});

export default ComplaintFormWizard;
