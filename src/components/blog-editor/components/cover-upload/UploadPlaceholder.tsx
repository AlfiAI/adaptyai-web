
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface UploadPlaceholderProps {
  onClick: () => void;
}

export const UploadPlaceholder: React.FC<UploadPlaceholderProps> = ({ onClick }) => {
  return (
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
        onClick={onClick}
        className="bg-black/30 border-white/10"
      >
        Select File
      </Button>
    </>
  );
};
