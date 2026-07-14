/**
 * Storage Service Client
 * Integration layer for Firebase Storage and Supabase Storage.
 */

import { storage as firebaseStorage } from '../config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { supabase } from '../config/supabaseClient';

const STORAGE_PROVIDER = import.meta.env.VITE_STORAGE_PROVIDER || 'firebase'; // 'firebase' | 'supabase'

/**
 * Uploads file to the designated cloud storage provider
 * @param path Destination path inside the bucket (e.g. 'receipts/bill_101.jpg')
 * @param file File or Blob object to upload
 */
export async function uploadFileToCloud(path: string, file: File | Blob): Promise<string> {
  try {
    if (STORAGE_PROVIDER === 'supabase') {
      return await uploadToSupabase(path, file);
    } else {
      return await uploadToFirebase(path, file);
    }
  } catch (error) {
    console.error(`[StorageService] Failed to upload to ${STORAGE_PROVIDER}:`, error);
    throw error;
  }
}

/**
 * Upload to Firebase Storage
 */
async function uploadToFirebase(path: string, file: File | Blob): Promise<string> {
  const storageRef = ref(firebaseStorage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}

/**
 * Upload to Supabase Storage
 */
async function uploadToSupabase(path: string, file: File | Blob): Promise<string> {
  // Parse bucket and filename from path
  const parts = path.split('/');
  const bucketName = parts[0] || 'uploads';
  const filename = parts.slice(1).join('/');

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw error;
  }

  // Get public CDN URL
  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
