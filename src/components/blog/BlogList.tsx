
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogCard from './BlogCard';

interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  date: string | { seconds: number };
  author: string;
  category: string;
  image: string;
}

interface BlogListProps {
  loading: boolean;
  blogPosts: BlogPost[];
  loadingMore: boolean;
  loadMorePosts: () => void;
  formatDate: (date: string | { seconds: number }) => string;
}

const BlogList = ({ loading, blogPosts, loadingMore, loadMorePosts, formatDate }: BlogListProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-adapty-aqua" />
      </div>
    );
  }

  return (
    <>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {blogPosts.map((post) => (
          <BlogCard key={post.id} post={post} formatDate={formatDate} />
        ))}
      </motion.div>

      <div className="mt-12 text-center">
        <Button 
          variant="outline" 
          className="border-adapty-aqua text-adapty-aqua hover:bg-adapty-aqua/10"
          onClick={loadMorePosts}
          disabled={loadingMore}
        >
          {loadingMore ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Load More Articles'
          )}
        </Button>
      </div>
    </>
  );
};

export default BlogList;
