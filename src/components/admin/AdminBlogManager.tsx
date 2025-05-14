
import React from 'react';
import { BlogPostList } from './blog/BlogPostList';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminBlogManager: React.FC = () => {
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

      <BlogPostList />
    </div>
  );
};
