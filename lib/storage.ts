// Supabase Storage Service
import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

// Storage bucket names
export const BUCKETS = {
  COMPLAINT_IMAGES: 'complaint-images',
  PROFILE_IMAGES: 'profile-images',
  DOCUMENT_ATTACHMENTS: 'document-attachments',
  EVENT_IMAGES: 'event-images',
  ANNOUNCEMENT_IMAGES: 'announcement-images',
} as const;

type BucketName = typeof BUCKETS[keyof typeof BUCKETS];

interface UploadOptions {
  bucket: BucketName;
  path: string;
  file: string; // Local file URI
  contentType?: string;
  upsert?: boolean;
}

interface UploadResult {
  success: boolean;
  path?: string;
  publicUrl?: string;
  error?: string;
}

interface DeleteResult {
  success: boolean;
  error?: string;
}

class StorageService {
  // Upload a file from local URI
  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    const { bucket, path, file, contentType = 'image/jpeg', upsert = false } = options;

    try {
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(file, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert to ArrayBuffer
      const arrayBuffer = decode(base64);

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, arrayBuffer, {
          contentType,
          upsert,
        });

      if (error) {
        console.error('Storage upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        success: true,
        path: data.path,
        publicUrl: urlData.publicUrl,
      };
    } catch (error: any) {
      console.error('Upload file error:', error);
      return { success: false, error: error.message || 'Upload failed' };
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(
    bucket: BucketName,
    files: { uri: string; path: string; contentType?: string }[]
  ): Promise<{ successful: UploadResult[]; failed: UploadResult[] }> {
    const results = await Promise.all(
      files.map(async (file) => {
        const result = await this.uploadFile({
          bucket,
          path: file.path,
          file: file.uri,
          contentType: file.contentType,
        });
        return { ...result, originalUri: file.uri };
      })
    );

    return {
      successful: results.filter((r) => r.success),
      failed: results.filter((r) => !r.success),
    };
  }

  // Upload complaint images
  async uploadComplaintImages(
    complaintId: string,
    imageUris: string[]
  ): Promise<{ successful: UploadResult[]; failed: UploadResult[] }> {
    const files = imageUris.map((uri, index) => ({
      uri,
      path: `${complaintId}/${Date.now()}_${index}.jpg`,
      contentType: 'image/jpeg',
    }));

    return this.uploadMultipleFiles(BUCKETS.COMPLAINT_IMAGES, files);
  }

  // Upload profile image
  async uploadProfileImage(userId: string, imageUri: string): Promise<UploadResult> {
    const path = `${userId}/profile_${Date.now()}.jpg`;

    return this.uploadFile({
      bucket: BUCKETS.PROFILE_IMAGES,
      path,
      file: imageUri,
      contentType: 'image/jpeg',
      upsert: true,
    });
  }

  // Upload event image
  async uploadEventImage(eventId: string, imageUri: string): Promise<UploadResult> {
    const path = `${eventId}/${Date.now()}.jpg`;

    return this.uploadFile({
      bucket: BUCKETS.EVENT_IMAGES,
      path,
      file: imageUri,
      contentType: 'image/jpeg',
    });
  }

  // Get public URL for a file
  getPublicUrl(bucket: BucketName, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  // Get signed URL for private files
  async getSignedUrl(
    bucket: BucketName,
    path: string,
    expiresIn: number = 3600
  ): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Get signed URL error:', error);
      return null;
    }

    return data.signedUrl;
  }

  // Delete a file
  async deleteFile(bucket: BucketName, path: string): Promise<DeleteResult> {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);

      if (error) {
        console.error('Delete file error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Delete file error:', error);
      return { success: false, error: error.message || 'Delete failed' };
    }
  }

  // Delete multiple files
  async deleteMultipleFiles(bucket: BucketName, paths: string[]): Promise<DeleteResult> {
    try {
      const { error } = await supabase.storage.from(bucket).remove(paths);

      if (error) {
        console.error('Delete files error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Delete files error:', error);
      return { success: false, error: error.message || 'Delete failed' };
    }
  }

  // List files in a directory
  async listFiles(
    bucket: BucketName,
    path: string = '',
    options?: { limit?: number; offset?: number }
  ): Promise<{ files: any[]; error?: string }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path, {
          limit: options?.limit || 100,
          offset: options?.offset || 0,
        });

      if (error) {
        console.error('List files error:', error);
        return { files: [], error: error.message };
      }

      return { files: data || [] };
    } catch (error: any) {
      console.error('List files error:', error);
      return { files: [], error: error.message || 'List failed' };
    }
  }

  // Download file to local storage
  async downloadFile(
    bucket: BucketName,
    path: string,
    localPath: string
  ): Promise<{ success: boolean; localUri?: string; error?: string }> {
    try {
      // Get signed URL
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60);

      if (error || !data?.signedUrl) {
        return { success: false, error: error?.message || 'Failed to get download URL' };
      }

      // Download to local
      const downloadResult = await FileSystem.downloadAsync(
        data.signedUrl,
        localPath
      );

      return {
        success: downloadResult.status === 200,
        localUri: downloadResult.uri,
      };
    } catch (error: any) {
      console.error('Download file error:', error);
      return { success: false, error: error.message || 'Download failed' };
    }
  }

  // Move/copy file
  async moveFile(
    bucket: BucketName,
    fromPath: string,
    toPath: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage.from(bucket).move(fromPath, toPath);

      if (error) {
        console.error('Move file error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Move file error:', error);
      return { success: false, error: error.message || 'Move failed' };
    }
  }

  // Copy file
  async copyFile(
    bucket: BucketName,
    fromPath: string,
    toPath: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage.from(bucket).copy(fromPath, toPath);

      if (error) {
        console.error('Copy file error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Copy file error:', error);
      return { success: false, error: error.message || 'Copy failed' };
    }
  }

  // Generate unique file path
  generateFilePath(
    folder: string,
    fileName: string,
    extension: string = 'jpg'
  ): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `${folder}/${timestamp}_${random}_${fileName}.${extension}`;
  }

  // Get file metadata
  async getFileInfo(
    bucket: BucketName,
    path: string
  ): Promise<{ info?: any; error?: string }> {
    try {
      // List the specific file to get its info
      const pathParts = path.split('/');
      const fileName = pathParts.pop();
      const folderPath = pathParts.join('/');

      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folderPath);

      if (error) {
        return { error: error.message };
      }

      const fileInfo = data?.find((f) => f.name === fileName);
      return { info: fileInfo };
    } catch (error: any) {
      console.error('Get file info error:', error);
      return { error: error.message || 'Failed to get file info' };
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();

// Export class for testing
export default StorageService;
