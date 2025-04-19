
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { FirestoreBlogPost } from '@/services/firebase';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BlogFormControls } from './form/BlogFormControls';
import { BlogContentEditor } from './form/BlogContentEditor';
import { BlogCoverUpload } from './form/BlogCoverUpload';

export const blogPostSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters" }),
  tags: z.string().min(1, { message: "At least one tag is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  body: z.string().min(50, { message: "Content must be at least 50 characters" }),
  cover_image_url: z.string().url({ message: "Please enter a valid image URL" }).or(z.string().length(0)),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  onSubmit: (data: BlogPostFormValues, file: File | null) => void;
  initialData?: FirestoreBlogPost;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export const BlogPostForm = ({ onSubmit, initialData, isSubmitting, onCancel }: BlogPostFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || '',
      excerpt: initialData?.excerpt || '',
      tags: initialData?.tags.join(', ') || '',
      author: initialData?.author || '',
      body: initialData?.body || '',
      cover_image_url: initialData?.cover_image_url || '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleSubmit = (data: BlogPostFormValues) => {
    if (!data.cover_image_url && !selectedFile) {
      toast({
        title: "Cover image required",
        description: "Please provide a cover image URL or upload an image",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(data, selectedFile);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a brief summary of the post" 
                  className="h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (comma separated)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Technology, AI, Business" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Author name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <BlogCoverUpload
          form={form}
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
        />
        
        <BlogContentEditor form={form} />
        
        <BlogFormControls
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </form>
    </Form>
  );
};
