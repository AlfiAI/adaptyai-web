
import { useState } from 'react';
import { uploadFileToStorage } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export const useImageUpload = () => {
  const { toast } = useToast();
  const [isImageUploading, setIsImageUploading] = useState(false);

  const uploadImage = async (
    file: File, 
    onSuccess: (imageUrl: string) => void
  ): Promise<void> => {
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image less than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsImageUploading(true);
      
      // Upload file to storage
      const imageUrl = await uploadFileToStorage(file, 'blog_covers', 'content');
      
      // Call success callback with the URL
      onSuccess(imageUrl);
      
      toast({
        title: "Image added",
        description: "Your image has been added to the post.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsImageUploading(false);
    }
  };

  return {
    isImageUploading,
    uploadImage
  };
};
