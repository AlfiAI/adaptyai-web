
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, XCircle } from 'lucide-react';

interface CoverImagePreviewProps {
  imageUrl: string;
  onReplace: () => void;
  onRemove: () => void;
}

export const CoverImagePreview: React.FC<CoverImagePreviewProps> = ({ 
  imageUrl, 
  onReplace, 
  onRemove 
}) => {
  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden border border-gray-700">
        <img 
          src={imageUrl} 
          alt="Cover Preview" 
          className="w-full h-auto object-cover"
          style={{ maxHeight: '300px' }}
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-black/50 hover:bg-black/70 rounded-full h-8 w-8 p-0"
            onClick={onReplace}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="bg-black/50 hover:bg-black/70 rounded-full h-8 w-8 p-0 hover:bg-red-900/50"
            onClick={onRemove}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Cover image uploaded successfully. You can replace or remove it using the buttons above.
      </p>
    </div>
  );
};
