
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { BlogPostForm, BlogPostFormValues } from './blog/BlogPostForm';
import { BlogPostList } from './blog/BlogPostList';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBlogRepository } from '@/lib/dataAccess';
import type { BlogPostData } from '@/lib/dataAccess';
import { slugify, uploadFileToStorage } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const AdminBlogManager = () => {
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const blogRepository = getBlogRepository();

  const { data: blogPosts, isLoading, isError } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => await blogRepository.getAll(),
  });

  const submitMutation = useMutation({
    mutationFn: async (data: { formData: BlogPostFormValues; file: File | null }) => {
      let coverImageUrl = data.formData.cover_image_url;
      
      if (data.file) {
        try {
          // Using Supabase storage
          coverImageUrl = await uploadFileToStorage(data.file, 'blog_covers');
        } catch (error) {
          console.error('Error uploading cover image:', error);
          throw error;
        }
      }
      
      const tags = data.formData.tags.split(',').map(tag => tag.trim());
      const slug = data.formData.slug || slugify(data.formData.title);
      
      if (editingPost) {
        // Update existing post
        return blogRepository.update(editingPost, {
          title: data.formData.title,
          excerpt: data.formData.excerpt,
          body: data.formData.body,
          author: data.formData.author,
          tags: tags,
          cover_image_url: coverImageUrl,
          published_at: new Date(),
          slug: slug,
          featured: data.formData.featured || false
        });
      } else {
        // Create new post
        return blogRepository.create({
          title: data.formData.title,
          excerpt: data.formData.excerpt,
          body: data.formData.body,
          author: data.formData.author,
          tags: tags,
          cover_image_url: coverImageUrl,
          published_at: new Date(),
          slug: slug,
          featured: data.formData.featured || false
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: editingPost 
          ? "Your blog post has been updated" 
          : "Your blog post has been published",
      });
      setEditingPost(null);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred";
      
      setError(`Failed to ${editingPost ? 'update' : 'publish'} blog post: ${errorMessage}`);
      
      toast({
        title: "Error",
        description: `Failed to ${editingPost ? 'update' : 'publish'} blog post`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: string) => blogRepository.delete(postId),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Blog post has been deleted",
      });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
    onError: (error) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred";
        
      setError(`Failed to delete blog post: ${errorMessage}`);
      
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: BlogPostFormValues, file: File | null) => {
    setError(null);
    submitMutation.mutate({ formData: data, file });
  };

  const handleEditPost = (post: BlogPostData) => {
    setEditingPost(post.id);
    setError(null);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(postId);
    }
  };

  if (isError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load blog posts. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h2>
            <BlogPostForm
              onSubmit={handleSubmit}
              initialData={editingPost ? blogPosts?.find(post => post.id === editingPost) : undefined}
              isSubmitting={submitMutation.isPending}
              onCancel={editingPost ? () => setEditingPost(null) : undefined}
            />
          </Card>
        </div>
        
        <div className="w-full lg:w-1/2">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Published Blog Posts</h2>
            <BlogPostList
              posts={blogPosts || []}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              isLoading={isLoading}
              isDeletingPost={deleteMutation.isPending}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
