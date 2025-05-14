
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BlogFormData } from '../types';
import { UploadProgress } from '../components/cover-upload/UploadProgress';
import { UploadPlaceholder } from '../components/cover-upload/UploadPlaceholder';
import { CoverImagePreview } from '../components/cover-upload/CoverImagePreview';
import { useCoverImageUpload } from '../hooks/useCoverImageUpload';

interface BlogCoverUploadFormProps {
  onComplete: () => void;
}

export const BlogCoverUploadForm: React.FC<BlogCoverUploadFormProps> = ({ onComplete }) => {
  const { setValue, watch } = useFormContext<BlogFormData>();
  const { toast } = useToast();
  
  const coverImageUrl = watch('cover_image_url');
  
  const {
    isUploading,
    uploadProgress,
    dragActive,
    fileInputRef,
    handleDrag,
    handleDrop,
    handleFileChange,
    handleRemoveImage,
    handleClickFileInput
  } = useCoverImageUpload(setValue);

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
                <UploadProgress progress={uploadProgress} />
              ) : (
                <UploadPlaceholder onClick={handleClickFileInput} />
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
          <CoverImagePreview 
            imageUrl={coverImageUrl}
            onReplace={handleClickFileInput}
            onRemove={handleRemoveImage}
          />
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
