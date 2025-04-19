
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { BlogPostFormValues } from '../BlogPostForm';

interface BlogCoverUploadProps {
  form: UseFormReturn<BlogPostFormValues>;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BlogCoverUpload = ({ form, selectedFile, onFileChange }: BlogCoverUploadProps) => {
  return (
    <FormField
      control={form.control}
      name="cover_image_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cover Image</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="col-span-2">
              <FormControl>
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  {...field} 
                />
              </FormControl>
            </div>
            <div>
              <div className="relative">
                <Input
                  type="file"
                  id="coverImageUpload"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={onFileChange}
                  accept="image/*"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
          {selectedFile && (
            <p className="text-sm mt-1 text-emerald-500">
              Selected: {selectedFile.name}
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
