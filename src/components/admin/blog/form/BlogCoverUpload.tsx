
import { FormMediaUpload } from '@/components/forms/shared/FormMediaUpload';
import { UseFormReturn } from 'react-hook-form';
import { BlogPostFormValues } from '../BlogPostForm';

interface BlogCoverUploadProps {
  form: UseFormReturn<BlogPostFormValues>;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BlogCoverUpload = ({ form, selectedFile, onFileChange }: BlogCoverUploadProps) => {
  return (
    <FormMediaUpload
      id="coverImageUpload"
      label="Cover Image"
      urlValue={form.watch('cover_image_url')}
      onUrlChange={(value) => form.setValue('cover_image_url', value)}
      selectedFile={selectedFile}
      onFileChange={onFileChange}
      accept="image/*"
      urlPlaceholder="https://example.com/image.jpg"
      error={form.formState.errors.cover_image_url?.message}
    />
  );
};
