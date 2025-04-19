
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Loader2 } from 'lucide-react';
import { FirestoreBlogPost } from '@/services/firebase';

interface BlogPostListProps {
  posts: FirestoreBlogPost[];
  onEdit: (post: FirestoreBlogPost) => void;
  onDelete: (postId: string) => void;
  isLoading: boolean;
  isDeletingPost: boolean;
}

export const BlogPostList = ({ 
  posts, 
  onEdit, 
  onDelete, 
  isLoading,
  isDeletingPost 
}: BlogPostListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-adapty-aqua" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No blog posts yet. Create your first post!
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
      {posts.map((post) => (
        <Card key={post.id} className="p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold line-clamp-1">{post.title}</h3>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onEdit(post)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                onClick={() => onDelete(post.id as string)}
                disabled={isDeletingPost}
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
  );
};
