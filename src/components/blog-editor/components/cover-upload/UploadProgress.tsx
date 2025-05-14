
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  progress: number;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => {
  return (
    <div className="w-full space-y-4">
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-center">
        Uploading... {progress}%
      </p>
    </div>
  );
};
