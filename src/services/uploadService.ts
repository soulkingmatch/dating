import { supabase } from '../lib/supabase';
import { getCurrentUser } from './profileService';

export async function uploadMedia(file: File, bucket: string): Promise<string> {
  if (!file) throw new Error('No file provided');
  
  // Validate file size (max 5MB)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error('File size must be less than 5MB');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG and GIF files are allowed');
  }

  const user = await getCurrentUser();
  
  // Generate unique filename with timestamp and random string
  const fileExt = file.name.split('.').pop();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileName = `${user.id}-${Date.now()}-${randomString}.${fileExt}`;
  
  try {
    // Upload to Supabase storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(`${user.id}/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(`${user.id}/${fileName}`);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
}