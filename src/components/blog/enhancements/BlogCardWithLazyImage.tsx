
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LazyImage from '@/components/ui/lazy-image';
import { DateFormatFunction } from '@/types/blog';

interface BlogCardWithLazyImageProps {
  id: string | number;
  title: string;
  excerpt: string;
  date: string | { seconds: number } | Date;
  author: string;
  category: string;
  image: string;
  formatDate: DateFormatFunction;
}

const BlogCardWithLazyImage = ({ 
  id, 
  title, 
  excerpt, 
  date, 
  author, 
  category, 
  image,
  formatDate 
}: BlogCardWithLazyImageProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col bg-black/30 border-white/10 hover:border-adapty-aqua/50 transition-all duration-300">
      <Link to={`/blog/${id}`} className="relative block">
        <LazyImage
          src={image}
          alt={title}
          className="h-48 w-full"
        />
      </Link>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <Badge variant="outline" className="bg-adapty-aqua/10 text-adapty-aqua border-adapty-aqua/20">
            {category}
          </Badge>
          <span className="text-sm text-gray-400">{formatDate(date)}</span>
        </div>
        
        <Link to={`/blog/${id}`} className="group">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-adapty-aqua transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span className="text-sm text-gray-400">By {author}</span>
          <Link 
            to={`/blog/${id}`} 
            className="text-sm text-adapty-aqua hover:text-adapty-aqua/80 transition-colors"
          >
            Read More
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default BlogCardWithLazyImage;
