import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Camera, Image as ImageIcon, File, Trash2, X, Plus, Video, Mic } from 'lucide-react-native';
import { colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export type MediaType = 'image' | 'video' | 'audio' | 'document';

export interface MediaFile {
  id: string;
  uri: string;
  type: MediaType;
  name?: string;
  size?: number;
  mimeType?: string;
  duration?: number;
  thumbnail?: string;
}

interface MediaPickerProps {
  value?: MediaFile[];
  onChange?: (files: MediaFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  allowedTypes?: MediaType[];
  showCamera?: boolean;
  showGallery?: boolean;
  showDocuments?: boolean;
  multiple?: boolean;
  aspectRatio?: [number, number];
  quality?: number;
  style?: object;
  disabled?: boolean;
  error?: string;
  label?: string;
  hint?: string;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  value = [],
  onChange,
  maxFiles = 5,
  maxFileSize = 10,
  allowedTypes = ['image', 'video', 'document'],
  showCamera = true,
  showGallery = true,
  showDocuments = true,
  multiple = true,
  aspectRatio,
  quality = 0.8,
  style,
  disabled = false,
  error,
  label,
  hint,
}) => {
  const [files, setFiles] = useState<MediaFile[]>(value);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setFiles(value);
  }, [value]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const checkPermissions = async (type: 'camera' | 'mediaLibrary') => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera access is required to take photos.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Media library access is required to select files.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const handleAddFile = (newFile: MediaFile) => {
    if (files.length >= maxFiles) {
      Alert.alert('Limit Reached', `Maximum ${maxFiles} files allowed.`);
      return;
    }

    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = files.filter((f) => f.id !== fileId);
    setFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  const takePhoto = async () => {
    if (disabled) return;

    const hasPermission = await checkPermissions('camera');
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: aspectRatio,
        quality,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        handleAddFile({
          id: generateId(),
          uri: asset.uri,
          type: 'image',
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          size: asset.fileSize,
          mimeType: asset.mimeType,
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const recordVideo = async () => {
    if (disabled) return;

    const hasPermission = await checkPermissions('camera');
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        handleAddFile({
          id: generateId(),
          uri: asset.uri,
          type: 'video',
          name: asset.fileName || `video_${Date.now()}.mp4`,
          size: asset.fileSize,
          mimeType: asset.mimeType,
          duration: asset.duration,
        });
      }
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video. Please try again.');
    }
  };

  const pickFromGallery = async () => {
    if (disabled) return;

    const hasPermission = await checkPermissions('mediaLibrary');
    if (!hasPermission) return;

    try {
      const mediaTypes = [];
      if (allowedTypes.includes('image')) {
        mediaTypes.push(ImagePicker.MediaTypeOptions.Images);
      }
      if (allowedTypes.includes('video')) {
        mediaTypes.push(ImagePicker.MediaTypeOptions.Videos);
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: allowedTypes.includes('video')
          ? ImagePicker.MediaTypeOptions.All
          : ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: multiple && maxFiles - files.length > 1,
        selectionLimit: maxFiles - files.length,
        quality,
        allowsEditing: !multiple,
        aspect: aspectRatio,
      });

      if (!result.canceled && result.assets) {
        result.assets.forEach((asset) => {
          const isVideo = asset.mimeType?.startsWith('video') || asset.uri.includes('.mp4');
          handleAddFile({
            id: generateId(),
            uri: asset.uri,
            type: isVideo ? 'video' : 'image',
            name: asset.fileName || `media_${Date.now()}`,
            size: asset.fileSize,
            mimeType: asset.mimeType,
            duration: asset.duration,
          });
        });
      }
    } catch (error) {
      console.error('Error picking from gallery:', error);
      Alert.alert('Error', 'Failed to select media. Please try again.');
    }
  };

  const pickDocument = async () => {
    if (disabled) return;

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
        multiple: multiple && maxFiles - files.length > 1,
      });

      if (!result.canceled && result.assets) {
        result.assets.forEach((asset) => {
          if (asset.size && asset.size > maxFileSize * 1024 * 1024) {
            Alert.alert('File Too Large', `Maximum file size is ${maxFileSize}MB.`);
            return;
          }
          handleAddFile({
            id: generateId(),
            uri: asset.uri,
            type: 'document',
            name: asset.name,
            size: asset.size,
            mimeType: asset.mimeType,
          });
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select document. Please try again.');
    }
  };

  const openPreview = (file: MediaFile) => {
    setSelectedFile(file);
    setPreviewVisible(true);
  };

  const renderFileItem = ({ item }: { item: MediaFile }) => (
    <View style={styles.fileItem}>
      <TouchableOpacity
        style={styles.fileThumbnail}
        onPress={() => openPreview(item)}
        disabled={disabled}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Preview ${item.name || item.type}`}
      >
        {item.type === 'image' && (
          <Image source={{ uri: item.uri }} style={styles.thumbnailImage} />
        )}
        {item.type === 'video' && (
          <View style={styles.videoThumbnail}>
            <Image
              source={{ uri: item.thumbnail || item.uri }}
              style={styles.thumbnailImage}
            />
            <View style={styles.videoOverlay}>
              <Video size={24} color="#FFFFFF" />
            </View>
          </View>
        )}
        {item.type === 'document' && (
          <View style={styles.documentThumbnail}>
            <File size={32} color={colors.primary} />
            <Text style={styles.documentName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
        )}
        {item.type === 'audio' && (
          <View style={styles.audioThumbnail}>
            <Mic size={32} color={colors.primary} />
            <Text style={styles.audioDuration}>
              {item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : '0:00'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      {!disabled && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFile(item.id)}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.name || item.type}`}
        >
          <X size={16} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );

  const canAddMore = files.length < maxFiles && !disabled;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      {/* File List */}
      {files.length > 0 && (
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.fileList}
          contentContainerStyle={styles.fileListContent}
        />
      )}

      {/* Action Buttons */}
      {canAddMore && (
        <View style={styles.actionButtons}>
          {showCamera && allowedTypes.includes('image') && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={takePhoto}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Take photo"
            >
              <Camera size={24} color={colors.primary} />
              <Text style={styles.actionButtonText}>Camera</Text>
            </TouchableOpacity>
          )}
          
          {showCamera && allowedTypes.includes('video') && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={recordVideo}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Record video"
            >
              <Video size={24} color={colors.primary} />
              <Text style={styles.actionButtonText}>Video</Text>
            </TouchableOpacity>
          )}
          
          {showGallery && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={pickFromGallery}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Select from gallery"
            >
              <ImageIcon size={24} color={colors.primary} />
              <Text style={styles.actionButtonText}>Gallery</Text>
            </TouchableOpacity>
          )}
          
          {showDocuments && allowedTypes.includes('document') && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={pickDocument}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Select document"
            >
              <File size={24} color={colors.primary} />
              <Text style={styles.actionButtonText}>Document</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Count Indicator */}
      <Text style={styles.countText}>
        {files.length} / {maxFiles} files
      </Text>

      {hint && <Text style={styles.hint}>{hint}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Preview Modal */}
      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={styles.previewModal}>
          <TouchableOpacity
            style={styles.previewClose}
            onPress={() => setPreviewVisible(false)}
          >
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          {selectedFile?.type === 'image' && (
            <Image
              source={{ uri: selectedFile.uri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  fileList: {
    marginBottom: 12,
  },
  fileListContent: {
    gap: 12,
  },
  fileItem: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  fileThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  documentThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 8,
  },
  documentName: {
    fontSize: 10,
    color: '#374151',
    marginTop: 4,
    textAlign: 'center',
  },
  audioThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  audioDuration: {
    fontSize: 12,
    color: '#374151',
    marginTop: 4,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#DBEAFE',
    borderStyle: 'dashed',
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  countText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  previewModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  previewImage: {
    width: width - 40,
    height: width - 40,
  },
});

export default MediaPicker;
