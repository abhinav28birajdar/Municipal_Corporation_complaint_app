// Image Utilities
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Alert, Platform } from 'react-native';

interface ImagePickerOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
  mediaTypes?: ImagePicker.MediaTypeOptions;
  selectionLimit?: number;
  maxWidth?: number;
  maxHeight?: number;
  compress?: boolean;
}

interface ProcessedImage {
  uri: string;
  width: number;
  height: number;
  base64?: string;
  fileSize?: number;
  mimeType: string;
}

const DEFAULT_OPTIONS: ImagePickerOptions = {
  allowsEditing: false,
  aspect: [4, 3],
  quality: 0.8,
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  selectionLimit: 5,
  maxWidth: 1920,
  maxHeight: 1080,
  compress: true,
};

class ImageUtility {
  // Request camera permission
  async requestCameraPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is needed to take photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  }

  // Request media library permission
  async requestMediaLibraryPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Photo library permission is needed to select images.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  }

  // Take a photo with camera
  async takePhoto(options: Partial<ImagePickerOptions> = {}): Promise<ProcessedImage | null> {
    const hasPermission = await this.requestCameraPermission();
    if (!hasPermission) return null;

    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: mergedOptions.allowsEditing,
        aspect: mergedOptions.aspect,
        quality: mergedOptions.quality,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      
      // Process the image
      if (mergedOptions.compress) {
        return await this.processImage(asset.uri, mergedOptions);
      }

      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        mimeType: asset.mimeType || 'image/jpeg',
      };
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      return null;
    }
  }

  // Pick images from library
  async pickImages(options: Partial<ImagePickerOptions> = {}): Promise<ProcessedImage[]> {
    const hasPermission = await this.requestMediaLibraryPermission();
    if (!hasPermission) return [];

    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mergedOptions.mediaTypes,
        allowsEditing: mergedOptions.allowsEditing && mergedOptions.selectionLimit === 1,
        aspect: mergedOptions.aspect,
        quality: mergedOptions.quality,
        allowsMultipleSelection: (mergedOptions.selectionLimit || 1) > 1,
        selectionLimit: mergedOptions.selectionLimit,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return [];
      }

      // Process all selected images
      const processedImages: ProcessedImage[] = [];
      
      for (const asset of result.assets) {
        let processedImage: ProcessedImage;
        
        if (mergedOptions.compress) {
          const processed = await this.processImage(asset.uri, mergedOptions);
          if (processed) {
            processedImages.push(processed);
          }
        } else {
          processedImages.push({
            uri: asset.uri,
            width: asset.width,
            height: asset.height,
            mimeType: asset.mimeType || 'image/jpeg',
          });
        }
      }

      return processedImages;
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to select images. Please try again.');
      return [];
    }
  }

  // Process/compress an image
  async processImage(
    uri: string,
    options: Partial<ImagePickerOptions> = {}
  ): Promise<ProcessedImage | null> {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    try {
      // Get image dimensions first
      const imageInfo = await ImageManipulator.manipulateAsync(uri, [], {});
      
      // Calculate resize dimensions
      const { width, height } = this.calculateResizeDimensions(
        imageInfo.width,
        imageInfo.height,
        mergedOptions.maxWidth || 1920,
        mergedOptions.maxHeight || 1080
      );

      // Only resize if needed
      const actions: ImageManipulator.Action[] = [];
      if (width !== imageInfo.width || height !== imageInfo.height) {
        actions.push({ resize: { width, height } });
      }

      // Process the image
      const result = await ImageManipulator.manipulateAsync(
        uri,
        actions,
        {
          compress: mergedOptions.quality || 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      // Get file size
      const fileInfo = await FileSystem.getInfoAsync(result.uri);
      const fileSize = (fileInfo as any).size;

      return {
        uri: result.uri,
        width: result.width,
        height: result.height,
        fileSize,
        mimeType: 'image/jpeg',
      };
    } catch (error) {
      console.error('Error processing image:', error);
      return null;
    }
  }

  // Calculate resize dimensions maintaining aspect ratio
  private calculateResizeDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
      return { width: originalWidth, height: originalHeight };
    }

    const aspectRatio = originalWidth / originalHeight;

    let newWidth = maxWidth;
    let newHeight = maxWidth / aspectRatio;

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = maxHeight * aspectRatio;
    }

    return {
      width: Math.round(newWidth),
      height: Math.round(newHeight),
    };
  }

  // Convert image to base64
  async toBase64(uri: string): Promise<string | null> {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting to base64:', error);
      return null;
    }
  }

  // Get file size
  async getFileSize(uri: string): Promise<number | null> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return (fileInfo as any).size || null;
    } catch (error) {
      console.error('Error getting file size:', error);
      return null;
    }
  }

  // Delete a local image file
  async deleteLocalImage(uri: string): Promise<boolean> {
    try {
      await FileSystem.deleteAsync(uri, { idempotent: true });
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Check if file exists
  async fileExists(uri: string): Promise<boolean> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      return fileInfo.exists;
    } catch (error) {
      return false;
    }
  }

  // Create a thumbnail
  async createThumbnail(
    uri: string,
    size: number = 200
  ): Promise<ProcessedImage | null> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: size, height: size } }],
        {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return {
        uri: result.uri,
        width: result.width,
        height: result.height,
        mimeType: 'image/jpeg',
      };
    } catch (error) {
      console.error('Error creating thumbnail:', error);
      return null;
    }
  }
}

// Export singleton instance
export const imageUtility = new ImageUtility();

// Export class for testing
export default ImageUtility;
