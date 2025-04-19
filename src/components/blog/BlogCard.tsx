import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlogPost, DateFormatFunction } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  formatDate: DateFormatFunction;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, formatDate }) => {
  return (
    <motion.div variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5
        }
      }
    }}>
      <Card className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,247,0.1)]">
        <img 
          src={post.image || '/placeholder.svg'} 
          alt={post.title} 
          className="w-full h-48 object-cover mb-4"
        />
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-2 flex justify-between text-sm text-gray-400">
            <span>{post.category}</span>
            <span>{formatDate(post.date)}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
          <p className="text-gray-400 mb-4 flex-1">{post.excerpt}</p>
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
            <span className="text-sm text-gray-400">By {post.author}</span>
            <Button 
              variant="ghost" 
              className="text-adapty-aqua hover:text-adapty-aqua/80 p-0"
              asChild
            >
              <Link to={`/blog/${post.id}`}>
                Read More
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default BlogCard;
