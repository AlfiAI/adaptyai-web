
import React, { useState, useEffect } from 'react';
import { BlogPostList } from './blog/BlogPostList';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FirestoreBlogPost } from '@/services/firebase';
import { useToast } from '@/hooks/use-toast';
import { getBlogRepository } from '@/lib/dataAccess/factory';

export const AdminBlogManager: React.FC = () => {
  const [posts, setPosts] = useState<FirestoreBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const blogRepo = getBlogRepository();
      const fetchedPosts = await blogRepo.getAll();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blog posts',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditPost = (post: FirestoreBlogPost) => {
    // Navigate to edit page or open edit modal
    toast({
      title: 'Edit Post',
      description: `Editing ${post.title}`,
    });
  };
  
  const handleDeletePost = async (postId: string) => {
    try {
      setIsDeletingPost(true);
      const blogRepo = getBlogRepository();
      await blogRepo.delete(postId);
      
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
      
      // Refresh the posts list
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingPost(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Link to="/admin/blog/new">
          <Button className="flex items-center gap-2 bg-adapty-aqua text-black hover:bg-adapty-aqua/80">
            <Plus className="h-4 w-4" /> New Blog Post
          </Button>
        </Link>
      </div>

      <BlogPostList 
        posts={posts} 
        onEdit={handleEditPost} 
        onDelete={handleDeletePost}
        isLoading={isLoading}
        isDeletingPost={isDeletingPost}
      />
    </div>
  );
};
