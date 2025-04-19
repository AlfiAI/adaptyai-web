
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Trash, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { submitBlogPost, getBlogPosts, deleteBlogPost, uploadImage, FirestoreBlogPost } from '@/services/firebaseService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MarkdownPreview } from '@/components/admin/MarkdownPreview';

// Schema for blog post validation
const blogPostSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters" }),
  tags: z.string().min(1, { message: "At least one tag is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  body: z.string().min(50, { message: "Content must be at least 50 characters" }),
  cover_image_url: z.string().url({ message: "Please enter a valid image URL" }).or(z.string().length(0)),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export const AdminBlogManager = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set up form with validation
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      tags: '',
      author: '',
      body: '',
      cover_image_url: '',
    },
  });

  // Query to fetch blog posts
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => await getBlogPosts(),
  });

  // Mutation to submit a blog post
  const submitMutation = useMutation({
    mutationFn: async (data: BlogPostFormValues) => {
      let coverImageUrl = data.cover_image_url;
      
      // If a file is selected, upload it first
      if (selectedFile) {
        setUploading(true);
        try {
          coverImageUrl = await uploadImage(selectedFile, 'blogs/covers');
        } catch (error) {
          console.error('Error uploading cover image:', error);
          throw error;
        } finally {
          setUploading(false);
        }
      }
      
      // Prepare tags array from comma-separated string
      const tags = data.tags.split(',').map(tag => tag.trim());
      
      // Submit the post with the image URL
      return submitBlogPost({
        title: data.title,
        excerpt: data.excerpt,
        body: data.body,
        author: data.author,
        tags: tags,
        cover_image_url: coverImageUrl,
        published_at: new Date()
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your blog post has been published",
      });
      form.reset();
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to publish blog post: " + error,
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
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

  const onSubmit = (data: BlogPostFormValues) => {
    if (!data.cover_image_url && !selectedFile) {
      toast({
        title: "Cover image required",
        description: "Please provide a cover image URL or upload an image",
        variant: "destructive",
      });
      return;
    }
    
    submitMutation.mutate(data);
  };

  const handleEditPost = (post: FirestoreBlogPost) => {
    setEditingPost(post.id);
    form.reset({
      title: post.title,
      excerpt: post.excerpt,
      tags: post.tags.join(', '),
      author: post.author,
      body: post.body,
      cover_image_url: post.cover_image_url,
    });
    setSelectedFile(null);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(postId);
    }
  };

  // Mutation to delete a blog post
  const deleteMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Blog post has been deleted",
      });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete blog post: " + error,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Blog Post Form */}
        <div className="w-full lg:w-1/2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                              onChange={handleFileChange}
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
                
                <div className="flex justify-end space-x-2 pt-4">
                  {editingPost && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setEditingPost(null);
                        form.reset();
                        setSelectedFile(null);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    type="submit"
                    className="bg-adapty-aqua hover:bg-adapty-aqua/80"
                    disabled={submitMutation.isPending || uploading}
                  >
                    {(submitMutation.isPending || uploading) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {uploading ? 'Uploading...' : 'Publishing...'}
                      </>
                    ) : (
                      'Publish Post'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </div>
        
        {/* Blog Posts List */}
        <div className="w-full lg:w-1/2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Published Blog Posts</h2>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-adapty-aqua" />
              </div>
            ) : blogPosts && blogPosts.length > 0 ? (
              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="p-4 flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold line-clamp-1">{post.title}</h3>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditPost(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDeletePost(post.id as string)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mt-1 flex justify-between">
                      <span>Tags: {post.tags.join(', ')}</span>
                      <span>By: {post.author}</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No blog posts yet. Create your first post!
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
