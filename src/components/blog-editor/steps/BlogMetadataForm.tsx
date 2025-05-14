
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BlogFormData } from '../BlogEditorForm';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface BlogMetadataFormProps {
  onComplete: () => void;
}

export const BlogMetadataForm: React.FC<BlogMetadataFormProps> = ({ onComplete }) => {
  const { control, register, formState: { errors }, getValues } = useFormContext<BlogFormData>();

  const handleContinue = () => {
    // Basic validation
    const { title, slug } = getValues();
    if (title && slug) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="title">Blog Title <span className="text-red-500">*</span></Label>
          <Input
            id="title"
            placeholder="Enter the title of your blog post"
            className="bg-black/30 border-white/10"
            {...register('title', { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="slug">URL Slug <span className="text-red-500">*</span></Label>
          <Input
            id="slug"
            placeholder="blog-post-url-slug"
            className="bg-black/30 border-white/10"
            {...register('slug', { required: "Slug is required" })}
          />
          <p className="text-xs text-muted-foreground">
            This will be used in the URL of your blog post. It's automatically generated from the title but you can customize it.
          </p>
          {errors.slug && (
            <p className="text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            placeholder="Write a short summary of your blog post"
            className="bg-black/30 border-white/10"
            rows={3}
            {...register('excerpt')}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            placeholder="AI, Technology, Future (comma separated)"
            className="bg-black/30 border-white/10"
            {...register('tags', {
              setValueAs: (v) => v.split(',').map((tag: string) => tag.trim()).filter(Boolean)
            })}
          />
          <p className="text-xs text-muted-foreground">
            Enter tags separated by commas
          </p>
        </div>

        <div className="grid gap-3">
          <FormField
            control={control}
            name="published_at"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Publication Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal bg-black/30 border-white/10",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          "Select a date"
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When should this post be published? Defaults to today.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-4 py-2">
          <FormField
            control={control}
            name="featured"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="featured" className="cursor-pointer">Feature this post</Label>
              </div>
            )}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={handleContinue}
          className="bg-adapty-aqua hover:bg-adapty-aqua/80 text-black"
        >
          Continue to Cover Image
        </Button>
      </div>
    </div>
  );
};
