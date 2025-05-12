
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { BlogPostData } from '@/lib/dataAccess/types';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BlogFormControls } from './form/BlogFormControls';
import { BlogContentEditor } from './form/BlogContentEditor';
import { BlogCoverUpload } from './form/BlogCoverUpload';
import { Switch } from '@/components/ui/switch';
import { slugify } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const blogPostSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters" }),
  tags: z.string().min(1, { message: "At least one tag is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  body: z.string().min(50, { message: "Content must be at least 50 characters" }),
  cover_image_url: z.string().url({ message: "Please enter a valid image URL" }).or(z.string().length(0)),
  slug: z.string().optional(),
  featured: z.boolean().default(false)
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  onSubmit: (data: BlogPostFormValues, file: File | null) => void;
  initialData?: BlogPostData;
  isSubmitting: boolean;
  onCancel?: () => void;
}

export const BlogPostForm = ({ onSubmit, initialData, isSubmitting, onCancel }: BlogPostFormProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || '',
      excerpt: initialData?.excerpt || '',
      tags: initialData?.tags?.join(', ') || '',
      author: initialData?.author || '',
      body: initialData?.body || '',
      cover_image_url: initialData?.cover_image_url || '',
      slug: initialData?.slug || '',
      featured: initialData?.featured || false
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        setFormError("Please select an image file (JPEG, PNG, GIF, WebP)");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Maximum file size is 5MB");
        return;
      }
      
      setFormError(null);
      setSelectedFile(file);
    }
  };

  const handleSubmit = (data: BlogPostFormValues) => {
    if (!data.cover_image_url && !selectedFile) {
      setFormError("Please provide a cover image URL or upload an image");
      return;
    }
    
    // Generate slug from title if not provided
    if (!data.slug) {
      data.slug = slugify(data.title);
    } else {
      // Ensure slug is properly formatted
      data.slug = slugify(data.slug);
    }
    
    setFormError(null);
    onSubmit(data, selectedFile);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {formError}
            </AlertDescription>
          </Alert>
        )}
        
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
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug (optional - will be generated from title if empty)</FormLabel>
              <FormControl>
                <Input placeholder="my-post-url" {...field} />
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
        
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Featured Post</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Mark this post as featured to highlight it on the blog homepage
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
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
