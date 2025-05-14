
import React, { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { uploadFileToStorage } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { BlogFormData } from '../BlogEditorForm';
import { Progress } from '@/components/ui/progress';
import { Upload, Image, XCircle, RefreshCw } from 'lucide-react';

interface BlogCoverUploadFormProps {
  onComplete: () => void;
}

export const BlogCoverUploadForm: React.FC<BlogCoverUploadFormProps> = ({ onComplete }) => {
  const { setValue, watch } = useFormContext<BlogFormData>();
  const { toast } = useToast();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const coverImageUrl = watch('cover_image_url');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
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
      setIsUploading(true);
      setUploadProgress(10);

      // Simulate progress (in a real app, this would come from the upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Upload file to Supabase storage
      const imageUrl = await uploadFileToStorage(file, 'blog_covers');
      
      // Update form data
      setValue('cover_image_url', imageUrl);
      setValue('coverImageFile', file);

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Upload successful",
        description: "Your cover image has been uploaded.",
      });

      // Reset upload state after a short delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      setUploadProgress(0);
      
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveImage = () => {
    setValue('cover_image_url', '');
    setValue('coverImageFile', null);
  };

  const handleReplaceImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleContinue = () => {
    if (coverImageUrl) {
      onComplete();
    } else {
      toast({
        title: "Cover image required",
        description: "Please upload a cover image for your blog post",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Cover Image</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload an eye-catching cover image for your blog post. Recommended size: 1200×630 pixels.
        </p>
        
        {!coverImageUrl ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-all ${
              dragActive ? 'border-adapty-aqua bg-adapty-aqua/10' : 'border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              {isUploading ? (
                <div className="w-full space-y-4">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-black/30">
                    <Upload className="h-8 w-8 text-adapty-aqua" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium mb-1">
                      Drag & drop your image here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports: JPEG, PNG, GIF (Max 5MB)
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-black/30 border-white/10"
                  >
                    Select File
                  </Button>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border border-gray-700">
              <img 
                src={coverImageUrl} 
                alt="Cover Preview" 
                className="w-full h-auto object-cover"
                style={{ maxHeight: '300px' }}
              />
              <div className="absolute top-3 right-3 flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-black/50 hover:bg-black/70 rounded-full h-8 w-8 p-0"
                  onClick={handleReplaceImage}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-black/50 hover:bg-black/70 rounded-full h-8 w-8 p-0 hover:bg-red-900/50"
                  onClick={handleRemoveImage}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Cover image uploaded successfully. You can replace or remove it using the buttons above.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={handleContinue}
          disabled={!coverImageUrl}
          className="bg-adapty-aqua hover:bg-adapty-aqua/80 text-black"
        >
          Continue to Key Takeaways
        </Button>
      </div>
    </div>
  );
};
