
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/integrations/supabase/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | number | Date) {
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export async function uploadFileToStorage(
  file: File, 
  bucket: 'blog_covers' | 'podcast_covers' | 'podcast_audio',
  folder?: string
): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = folder ? 
      `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}` :
      `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function deleteFileFromStorage(
  url: string,
  bucket: 'blog_covers' | 'podcast_covers' | 'podcast_audio'
): Promise<boolean> {
  try {
    // Extract the filename from the URL
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    const filePath = pathSegments[pathSegments.length - 1];
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}
