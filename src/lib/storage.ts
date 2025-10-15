// Storage utilities for file uploads
import { supabase } from '@/integrations/supabase/client';

const BUCKET_NAME = 'submissions';

/**
 * Upload a file to Supabase storage
 */
export async function uploadFile(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const timestamp = Date.now();
  const fileName = `${userId}/${timestamp}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;
  return data.path;
}

/**
 * Get public URL for a file
 */
export function getFileUrl(filePath: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Download file content as text
 */
export async function downloadFileContent(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(filePath);

  if (error) throw error;
  return await data.text();
}

/**
 * Delete a file from storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) throw error;
}

/**
 * Check if storage bucket exists and is accessible
 */
export async function checkStorageAccess(): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.getBucket(BUCKET_NAME);
    return !error && data !== null;
  } catch {
    return false;
  }
}
