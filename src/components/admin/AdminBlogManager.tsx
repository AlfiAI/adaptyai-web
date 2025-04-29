
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { BlogPostForm, BlogPostFormValues } from './blog/BlogPostForm';
import { BlogPostList } from './blog/BlogPostList';
import { uploadImage } from '@/services/firebase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBlogRepository } from '@/lib/dataAccess';
import type { BlogPostData } from '@/lib/dataAccess';

export const AdminBlogManager = () => {
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const blogRepository = getBlogRepository();

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => await blogRepository.getAll(),
  });

  const submitMutation = useMutation({
    mutationFn: async (data: { formData: BlogPostFormValues; file: File | null }) => {
      let coverImageUrl = data.formData.cover_image_url;
      
      if (data.file) {
        try {
          coverImageUrl = await uploadImage(data.file, 'blogs/covers');
        } catch (error) {
          console.error('Error uploading cover image:', error);
          throw error;
        }
      }
      
      const tags = data.formData.tags.split(',').map(tag => tag.trim());
      
      if (editingPost) {
        // Update existing post
        return blogRepository.update(editingPost, {
          title: data.formData.title,
          excerpt: data.formData.excerpt,
          body: data.formData.body,
          author: data.formData.author,
          tags: tags,
          cover_image_url: coverImageUrl,
          published_at: new Date()
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
          published_at: new Date()
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
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${editingPost ? 'update' : 'publish'} blog post: ${error}`,
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
      toast({
        title: "Error",
        description: "Failed to delete blog post: " + error,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: BlogPostFormValues, file: File | null) => {
    submitMutation.mutate({ formData: data, file });
  };

  const handleEditPost = (post: BlogPostData) => {
    setEditingPost(post.id);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteMutation.mutate(postId);
    }
  };

  return (
    <div className="space-y-8">
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
