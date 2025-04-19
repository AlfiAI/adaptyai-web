
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { MarkdownPreview } from '@/components/admin/MarkdownPreview';
import { UseFormReturn } from 'react-hook-form';
import { BlogPostFormValues } from '../BlogPostForm';

interface BlogContentEditorProps {
  form: UseFormReturn<BlogPostFormValues>;
}

export const BlogContentEditor = ({ form }: BlogContentEditorProps) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <FormField
      control={form.control}
      name="body"
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>Content (Markdown)</FormLabel>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Edit Markdown' : 'Preview'}
            </Button>
          </div>
          <FormControl>
            {showPreview ? (
              <div className="border rounded-md p-4 min-h-[300px] bg-card">
                <MarkdownPreview markdown={field.value} />
              </div>
            ) : (
              <Textarea 
                placeholder="Write your blog post content in Markdown..." 
                className="min-h-[300px]"
                {...field} 
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
