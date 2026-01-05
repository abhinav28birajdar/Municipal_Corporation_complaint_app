import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  FlatList,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeOutLeft,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { useAuthStore } from '@/store/auth-store';
import { useComplaintStore } from '@/store/complaint-store';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  ArrowRight,
  X,
  Camera,
  MapPin,
  FileText,
  Check,
  AlertCircle,
  Trash2,
  Plus,
  Mic,
  MicOff,
  Image as ImageIcon,
  Video,
  Folder,
  ChevronRight,
  Clock,
  Shield,
  Zap,
  Info,
} from 'lucide-react-native';
import { colors } from '@/constants/Colors';
import { ComplaintCategory, ComplaintPriority } from '@/types/complaint';
import { COMPLAINT_CATEGORIES, COMPLAINT_SUBCATEGORIES } from '@/constants/complaint-types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STEPS = [
  { id: 1, title: 'Category', icon: Folder },
  { id: 2, title: 'Details', icon: FileText },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Media', icon: Camera },
  { id: 5, title: 'Review', icon: Check },
];

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  uri: string;
  thumbnail?: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  landmark?: string;
}

export default function ComplaintWizardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addComplaint } = useComplaintStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [category, setCategory] = useState<ComplaintCategory | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('medium');
  const [location, setLocation] = useState<LocationData | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Animations
  const progressWidth = useSharedValue(20);
  const slideDirection = useSharedValue(1);

  useEffect(() => {
    progressWidth.value = withTiming((currentStep / STEPS.length) * 100, { duration: 300 });
  }, [currentStep]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const handleBack = () => {
    if (currentStep > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      slideDirection.value = -1;
      setCurrentStep(currentStep - 1);
    } else {
      handleCancel();
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      slideDirection.value = 1;
      setCurrentStep(currentStep + 1);
    }
  };

  const validateStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!category) {
          Alert.alert('Required', 'Please select a complaint category');
          return false;
        }
        return true;
      case 2:
        if (!title.trim()) {
          Alert.alert('Required', 'Please enter a complaint title');
          return false;
        }
        if (!description.trim() || description.length < 20) {
          Alert.alert('Required', 'Please provide a detailed description (at least 20 characters)');
          return false;
        }
        return true;
      case 3:
        if (!location) {
          Alert.alert('Required', 'Please select or enter a location');
          return false;
        }
        return true;
      case 4:
        // Media is optional
        return true;
      default:
        return true;
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Complaint',
      'Are you sure you want to discard this complaint? All entered data will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsLoading(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      // Upload media files
      const uploadedMedia = await Promise.all(
        media.map(async (item) => {
          const fileName = `complaint_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          // Upload to Supabase Storage
          // Return uploaded URL
          return {
            ...item,
            url: item.uri, // Replace with actual uploaded URL
          };
        })
      );

      // Create complaint
      const complaintData = {
        user_id: user?.id,
        category,
        subcategory,
        title,
        description,
        priority,
        location: location,
        media: uploadedMedia,
        is_anonymous: isAnonymous,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('complaints')
        .insert(complaintData)
        .select()
        .single();

      if (error) throw error;

      // Navigate to confirmation screen
      router.push({
        pathname: '/complaint-confirmation',
        params: { complaintId: data.id },
      });
    } catch (error: any) {
      console.error('Submit error:', error);
      Alert.alert('Error', error.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to tag your complaint location.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address: `${address.street || ''}, ${address.city || ''}, ${address.region || ''} ${address.postalCode || ''}`.trim(),
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get current location. Please try again or enter manually.');
    }
  };

  const handleSelectFromMap = () => {
    router.push({
      pathname: '/location-picker',
      params: {
        onSelect: 'complaint-wizard',
      },
    });
  };

  const handleAddMedia = async (type: 'camera' | 'gallery' | 'video') => {
    try {
      let result;

      if (type === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          allowsEditing: true,
        });
      } else if (type === 'gallery') {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: 0.8,
          selectionLimit: 5 - media.length,
        });
      } else if (type === 'video') {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          quality: 0.8,
        });
      }

      if (result && !result.canceled) {
        const newMedia: MediaItem[] = result.assets.map((asset) => ({
          id: Math.random().toString(36).substring(7),
          type: asset.type === 'video' ? 'video' : 'image',
          uri: asset.uri,
        }));

        if (media.length + newMedia.length > 5) {
          Alert.alert('Limit Reached', 'You can add a maximum of 5 media files.');
          return;
        }

        setMedia([...media, ...newMedia]);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.error('Media error:', error);
      Alert.alert('Error', 'Failed to add media. Please try again.');
    }
  };

  const handleRemoveMedia = (id: string) => {
    setMedia(media.filter((item) => item.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderCategoryStep = () => (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft} style={styles.stepContent}>
      <Text style={styles.stepTitle}>What's the issue about?</Text>
      <Text style={styles.stepDescription}>
        Select a category that best describes your complaint
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.categoryList}>
        {COMPLAINT_CATEGORIES.map((cat, index) => (
          <Animated.View
            key={cat.id}
            entering={FadeInDown.delay(index * 50).duration(300)}
          >
            <TouchableOpacity
              style={[
                styles.categoryItem,
                category === cat.id && styles.categoryItemSelected,
              ]}
              onPress={() => {
                setCategory(cat.id as ComplaintCategory);
                setSubcategory(null);
                Haptics.selectionAsync();
              }}
            >
              <View
                style={[
                  styles.categoryIcon,
                  category === cat.id && styles.categoryIconSelected,
                ]}
              >
                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
              </View>
              <View style={styles.categoryInfo}>
                <Text style={[
                  styles.categoryName,
                  category === cat.id && styles.categoryNameSelected,
                ]}>
                  {cat.name}
                </Text>
                <Text style={styles.categoryDescription}>{cat.description}</Text>
              </View>
              <ChevronRight
                size={20}
                color={category === cat.id ? colors.primary : '#9CA3AF'}
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Subcategories */}
      {category && COMPLAINT_SUBCATEGORIES[category] && (
        <Animated.View entering={FadeInDown.duration(300)} style={styles.subcategorySection}>
          <Text style={styles.subcategoryTitle}>Select specific issue</Text>
          <View style={styles.subcategoryGrid}>
            {COMPLAINT_SUBCATEGORIES[category].map((sub) => (
              <TouchableOpacity
                key={sub.id}
                style={[
                  styles.subcategoryItem,
                  subcategory === sub.id && styles.subcategoryItemSelected,
                ]}
                onPress={() => {
                  setSubcategory(sub.id);
                  Haptics.selectionAsync();
                }}
              >
                <Text
                  style={[
                    styles.subcategoryText,
                    subcategory === sub.id && styles.subcategoryTextSelected,
                  ]}
                >
                  {sub.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );

  const renderDetailsStep = () => (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft} style={styles.stepContent}>
      <Text style={styles.stepTitle}>Describe the issue</Text>
      <Text style={styles.stepDescription}>
        Provide details to help us understand and resolve your complaint
      </Text>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Input
          label="Complaint Title"
          placeholder="Brief summary of the issue"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
          showCharacterCount
        />

        <View style={styles.textAreaContainer}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe the issue in detail. Include what, when, and how it affects you or others..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            maxLength={1000}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {description.length}/1000 characters
          </Text>
        </View>

        {/* Voice Recording Option */}
        <TouchableOpacity
          style={[styles.voiceButton, isRecording && styles.voiceButtonRecording]}
          onPress={() => {
            setIsRecording(!isRecording);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          {isRecording ? (
            <>
              <MicOff size={20} color="#EF4444" />
              <Text style={styles.voiceButtonTextRecording}>Stop Recording</Text>
            </>
          ) : (
            <>
              <Mic size={20} color={colors.primary} />
              <Text style={styles.voiceButtonText}>Or describe using voice</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Priority Selection */}
        <View style={styles.prioritySection}>
          <Text style={styles.inputLabel}>Priority Level</Text>
          <View style={styles.priorityOptions}>
            {(['low', 'medium', 'high', 'critical'] as ComplaintPriority[]).map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityOption,
                  priority === p && styles.priorityOptionSelected,
                  priority === p && {
                    backgroundColor:
                      p === 'critical' ? '#FEF2F2' :
                      p === 'high' ? '#FFF7ED' :
                      p === 'medium' ? '#FFFBEB' :
                      '#F0FDF4',
                  },
                ]}
                onPress={() => {
                  setPriority(p);
                  Haptics.selectionAsync();
                }}
              >
                <View
                  style={[
                    styles.priorityDot,
                    {
                      backgroundColor:
                        p === 'critical' ? '#EF4444' :
                        p === 'high' ? '#F97316' :
                        p === 'medium' ? '#EAB308' :
                        '#22C55E',
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.priorityText,
                    priority === p && styles.priorityTextSelected,
                  ]}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );

  const renderLocationStep = () => (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft} style={styles.stepContent}>
      <Text style={styles.stepTitle}>Where is the issue?</Text>
      <Text style={styles.stepDescription}>
        Help us locate the problem by providing the exact location
      </Text>

      {/* Location Options */}
      <View style={styles.locationOptions}>
        <TouchableOpacity
          style={styles.locationOption}
          onPress={handleGetLocation}
        >
          <View style={[styles.locationOptionIcon, { backgroundColor: '#EFF6FF' }]}>
            <MapPin size={24} color={colors.primary} />
          </View>
          <Text style={styles.locationOptionText}>Use Current Location</Text>
          <Text style={styles.locationOptionHint}>GPS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.locationOption}
          onPress={handleSelectFromMap}
        >
          <View style={[styles.locationOptionIcon, { backgroundColor: '#F0FDF4' }]}>
            <MapPin size={24} color="#22C55E" />
          </View>
          <Text style={styles.locationOptionText}>Select on Map</Text>
          <Text style={styles.locationOptionHint}>Manual</Text>
        </TouchableOpacity>
      </View>

      {/* Selected Location */}
      {location && (
        <Animated.View entering={FadeInDown.duration(300)}>
          <Card style={styles.selectedLocationCard}>
            <View style={styles.selectedLocationHeader}>
              <MapPin size={20} color="#10B981" />
              <Text style={styles.selectedLocationTitle}>Selected Location</Text>
              <TouchableOpacity
                onPress={() => setLocation(null)}
                style={styles.removeLocationButton}
              >
                <X size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <Text style={styles.selectedLocationAddress}>{location.address}</Text>
            <Text style={styles.selectedLocationCoords}>
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </Text>
          </Card>
        </Animated.View>
      )}

      {/* Landmark */}
      <Input
        label="Nearby Landmark (Optional)"
        placeholder="e.g., Near City Hospital, Opposite Park..."
        value={location?.landmark || ''}
        onChangeText={(text) => setLocation(location ? { ...location, landmark: text } : null)}
      />

      {/* Location Tips */}
      <Card style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Info size={16} color="#F59E0B" />
          <Text style={styles.tipsTitle}>Location Tips</Text>
        </View>
        <Text style={styles.tipsText}>
          • Be as specific as possible about the location{'\n'}
          • Include nearby landmarks for faster identification{'\n'}
          • Accurate location helps in quicker resolution
        </Text>
      </Card>
    </Animated.View>
  );

  const renderMediaStep = () => (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft} style={styles.stepContent}>
      <Text style={styles.stepTitle}>Add supporting evidence</Text>
      <Text style={styles.stepDescription}>
        Photos and videos help us understand and address the issue faster
      </Text>

      {/* Media Options */}
      <View style={styles.mediaOptions}>
        <TouchableOpacity
          style={styles.mediaOption}
          onPress={() => handleAddMedia('camera')}
        >
          <View style={[styles.mediaOptionIcon, { backgroundColor: '#EFF6FF' }]}>
            <Camera size={24} color={colors.primary} />
          </View>
          <Text style={styles.mediaOptionText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mediaOption}
          onPress={() => handleAddMedia('gallery')}
        >
          <View style={[styles.mediaOptionIcon, { backgroundColor: '#F0FDF4' }]}>
            <ImageIcon size={24} color="#22C55E" />
          </View>
          <Text style={styles.mediaOptionText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mediaOption}
          onPress={() => handleAddMedia('video')}
        >
          <View style={[styles.mediaOptionIcon, { backgroundColor: '#FEF2F2' }]}>
            <Video size={24} color="#EF4444" />
          </View>
          <Text style={styles.mediaOptionText}>Video</Text>
        </TouchableOpacity>
      </View>

      {/* Media Preview */}
      {media.length > 0 && (
        <Animated.View entering={FadeInDown.duration(300)} style={styles.mediaPreview}>
          <Text style={styles.mediaPreviewTitle}>
            Added Media ({media.length}/5)
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {media.map((item) => (
              <View key={item.id} style={styles.mediaItem}>
                <Image source={{ uri: item.uri }} style={styles.mediaImage} />
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => handleRemoveMedia(item.id)}
                >
                  <X size={14} color="#FFFFFF" />
                </TouchableOpacity>
                {item.type === 'video' && (
                  <View style={styles.videoOverlay}>
                    <Video size={20} color="#FFFFFF" />
                  </View>
                )}
              </View>
            ))}
            {media.length < 5 && (
              <TouchableOpacity
                style={styles.addMoreMedia}
                onPress={() => handleAddMedia('gallery')}
              >
                <Plus size={24} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </ScrollView>
        </Animated.View>
      )}

      {/* Tips */}
      <Card style={styles.mediaTipsCard}>
        <Text style={styles.mediaTipsTitle}>📸 Tips for better evidence</Text>
        <Text style={styles.mediaTipsText}>
          • Take clear, well-lit photos{'\n'}
          • Include wide shots to show context{'\n'}
          • Capture close-ups of specific damage{'\n'}
          • Add date/time visible if possible
        </Text>
      </Card>
    </Animated.View>
  );

  const renderReviewStep = () => (
    <Animated.View entering={SlideInRight} exiting={SlideOutLeft} style={styles.stepContent}>
      <Text style={styles.stepTitle}>Review your complaint</Text>
      <Text style={styles.stepDescription}>
        Please verify all details before submitting
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Category & Priority */}
        <Card style={styles.reviewCard}>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Category</Text>
            <Text style={styles.reviewValue}>
              {COMPLAINT_CATEGORIES.find((c) => c.id === category)?.name}
              {subcategory && ` > ${COMPLAINT_SUBCATEGORIES[category!]?.find((s) => s.id === subcategory)?.name}`}
            </Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Priority</Text>
            <View style={styles.priorityBadge}>
              <View
                style={[
                  styles.priorityDot,
                  {
                    backgroundColor:
                      priority === 'critical' ? '#EF4444' :
                      priority === 'high' ? '#F97316' :
                      priority === 'medium' ? '#EAB308' :
                      '#22C55E',
                  },
                ]}
              />
              <Text style={styles.priorityBadgeText}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
            </View>
          </View>
        </Card>

        {/* Title & Description */}
        <Card style={styles.reviewCard}>
          <Text style={styles.reviewLabel}>Title</Text>
          <Text style={styles.reviewTitle}>{title}</Text>
          <Text style={[styles.reviewLabel, { marginTop: 12 }]}>Description</Text>
          <Text style={styles.reviewDescription}>{description}</Text>
        </Card>

        {/* Location */}
        <Card style={styles.reviewCard}>
          <Text style={styles.reviewLabel}>Location</Text>
          <View style={styles.reviewLocation}>
            <MapPin size={16} color="#6B7280" />
            <Text style={styles.reviewLocationText}>{location?.address}</Text>
          </View>
          {location?.landmark && (
            <Text style={styles.reviewLandmark}>Landmark: {location.landmark}</Text>
          )}
        </Card>

        {/* Media */}
        {media.length > 0 && (
          <Card style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>Attachments ({media.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {media.map((item) => (
                <Image
                  key={item.id}
                  source={{ uri: item.uri }}
                  style={styles.reviewMedia}
                />
              ))}
            </ScrollView>
          </Card>
        )}

        {/* Anonymous Toggle */}
        <Card style={styles.anonymousCard}>
          <View style={styles.anonymousContent}>
            <Shield size={24} color={isAnonymous ? '#22C55E' : '#9CA3AF'} />
            <View style={styles.anonymousText}>
              <Text style={styles.anonymousTitle}>Submit Anonymously</Text>
              <Text style={styles.anonymousDescription}>
                Your identity will be hidden from public view
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.anonymousToggle, isAnonymous && styles.anonymousToggleActive]}
              onPress={() => {
                setIsAnonymous(!isAnonymous);
                Haptics.selectionAsync();
              }}
            >
              <Animated.View
                style={[
                  styles.anonymousToggleCircle,
                  isAnonymous && styles.anonymousToggleCircleActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Estimated Resolution */}
        <Card style={styles.estimateCard}>
          <View style={styles.estimateContent}>
            <Clock size={20} color={colors.primary} />
            <View style={styles.estimateText}>
              <Text style={styles.estimateTitle}>Estimated Resolution Time</Text>
              <Text style={styles.estimateValue}>
                {priority === 'critical' ? '24-48 hours' :
                 priority === 'high' ? '3-5 days' :
                 priority === 'medium' ? '7-10 days' :
                 '14-21 days'}
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </Animated.View>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderCategoryStep();
      case 2:
        return renderDetailsStep();
      case 3:
        return renderLocationStep();
      case 4:
        return renderMediaStep();
      case 5:
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Complaint</Text>
        <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep} of {STEPS.length}
        </Text>
      </View>

      {/* Step Indicator */}
      <View style={styles.stepsContainer}>
        <StepIndicator
          steps={STEPS.map((s) => ({ label: s.title, icon: s.icon }))}
          currentStep={currentStep - 1}
        />
      </View>

      {/* Step Content */}
      <View style={styles.contentContainer}>
        {renderStep()}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentStep > 1 && (
          <Button
            title="Back"
            variant="outline"
            onPress={handleBack}
            style={styles.navButton}
          />
        )}
        {currentStep < STEPS.length ? (
          <Button
            title="Continue"
            onPress={handleNext}
            rightIcon={<ArrowRight size={18} color="#FFFFFF" />}
            style={[styles.navButton, currentStep === 1 && styles.fullWidthButton]}
          />
        ) : (
          <Button
            title="Submit Complaint"
            onPress={handleSubmit}
            loading={isLoading}
            leftIcon={<Check size={18} color="#FFFFFF" />}
            style={[styles.navButton, styles.submitButton]}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  progressBackground: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  stepsContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  categoryList: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  categoryItemSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EFF6FF',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryIconSelected: {
    backgroundColor: '#DBEAFE',
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  categoryNameSelected: {
    color: colors.primary,
  },
  categoryDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  subcategorySection: {
    marginTop: 16,
  },
  subcategoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  subcategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subcategoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subcategoryItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  subcategoryText: {
    fontSize: 14,
    color: '#374151',
  },
  subcategoryTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  textAreaContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 16,
    gap: 8,
  },
  voiceButtonRecording: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  voiceButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  voiceButtonTextRecording: {
    color: '#EF4444',
    fontWeight: '500',
  },
  prioritySection: {
    marginTop: 8,
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  priorityOptionSelected: {
    borderWidth: 2,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 13,
    color: '#374151',
  },
  priorityTextSelected: {
    fontWeight: '600',
  },
  locationOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  locationOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  locationOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  locationOptionHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  selectedLocationCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  selectedLocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedLocationTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
    marginLeft: 8,
  },
  removeLocationButton: {
    padding: 4,
  },
  selectedLocationAddress: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
  },
  selectedLocationCoords: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontFamily: 'monospace',
  },
  tipsCard: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  tipsText: {
    fontSize: 13,
    color: '#A16207',
    lineHeight: 20,
  },
  mediaOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  mediaOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mediaOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  mediaOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
  },
  mediaPreview: {
    marginBottom: 24,
  },
  mediaPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  mediaItem: {
    position: 'relative',
    marginRight: 12,
  },
  mediaImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeMediaButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoreMedia: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaTipsCard: {
    padding: 16,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  mediaTipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
  },
  mediaTipsText: {
    fontSize: 13,
    color: '#15803D',
    lineHeight: 20,
  },
  reviewCard: {
    marginBottom: 12,
    padding: 16,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  reviewLabel: {
    fontSize: 13,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reviewValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 4,
  },
  reviewDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginTop: 4,
  },
  reviewLocation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    gap: 8,
  },
  reviewLocationText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  reviewLandmark: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  reviewMedia: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  priorityBadgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  anonymousCard: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  anonymousContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  anonymousText: {
    flex: 1,
    marginLeft: 12,
  },
  anonymousTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  anonymousDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  anonymousToggle: {
    width: 52,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1D5DB',
    padding: 2,
    justifyContent: 'center',
  },
  anonymousToggleActive: {
    backgroundColor: '#22C55E',
  },
  anonymousToggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  anonymousToggleCircleActive: {
    transform: [{ translateX: 24 }],
  },
  estimateCard: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  estimateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estimateText: {
    marginLeft: 12,
  },
  estimateTitle: {
    fontSize: 13,
    color: '#3B82F6',
  },
  estimateValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
    marginTop: 2,
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  navButton: {
    flex: 1,
  },
  fullWidthButton: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#22C55E',
  },
});
