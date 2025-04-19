
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit, Trash } from 'lucide-react';
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
import { submitBlogPost, getBlogPosts, deleteBlogPost } from '@/services/firebaseService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MarkdownPreview } from '@/components/admin/MarkdownPreview';

// Schema for blog post validation
const blogPostSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  summary: z.string().min(10, { message: "Summary must be at least 10 characters" }),
  category: z.string().min(1, { message: "Category is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  coverImageURL: z.string().url({ message: "Please enter a valid image URL" }),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

export const AdminBlogManager = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Set up form with validation
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      summary: '',
      category: '',
      author: '',
      content: '',
      coverImageURL: '',
    },
  });

  // Query to fetch blog posts
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: getBlogPosts,
  });

  // Mutation to submit a blog post
  const submitMutation = useMutation({
    mutationFn: submitBlogPost,
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your blog post has been published",
      });
      form.reset();
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const onSubmit = (data: BlogPostFormValues) => {
    const slug = generateSlug(data.title);
    const postData = {
      ...data,
      slug,
      date: new Date(),
    };
    
    submitMutation.mutate(postData);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post.id);
    form.reset({
      title: post.title,
      summary: post.excerpt || post.summary,
      category: post.category,
      author: post.author,
      content: post.content || '',
      coverImageURL: post.image || post.coverImageURL,
    });
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(postId);
    }
  };

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
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary</FormLabel>
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
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
                  name="coverImageURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
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
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    type="submit"
                    className="bg-adapty-aqua hover:bg-adapty-aqua/80"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
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
                      <span>Category: {post.category}</span>
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
