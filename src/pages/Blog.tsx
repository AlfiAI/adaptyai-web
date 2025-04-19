
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getBlogPosts } from '@/services/firebaseService';
import { useToast } from '@/hooks/use-toast';

// Define the blog post type to match Firestore data structure
interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  date: string | { seconds: number };
  author: string;
  category: string;
  image: string;
}

// Placeholder blog data for when Firestore is not available
const placeholderPosts: BlogPost[] = [
  {
    id: 1,
    title: 'The Future of AI in Business',
    excerpt: 'Artificial intelligence is transforming how businesses operate, from customer service to product development...',
    date: 'April 15, 2025',
    author: 'Dr. Sarah Chen',
    category: 'Technology',
    image: '/placeholder.svg'
  },
  {
    id: 2,
    title: 'Ethical Considerations in AI Development',
    excerpt: "As AI systems become more powerful, it's crucial that we address the ethical implications of their deployment...",
    date: 'April 10, 2025',
    author: 'James Wilson',
    category: 'Ethics',
    image: '/placeholder.svg'
  },
  {
    id: 3,
    title: 'Machine Learning: A Primer',
    excerpt: 'Understanding the basics of machine learning can help businesses identify opportunities for AI implementation...',
    date: 'April 5, 2025',
    author: 'Dr. Michael Rahman',
    category: 'Education',
    image: '/placeholder.svg'
  },
  {
    id: 4,
    title: 'AI and the Future of Work',
    excerpt: 'How will artificial intelligence impact jobs and the workforce? We explore the potential changes and how to prepare...',
    date: 'March 28, 2025',
    author: 'Emily Takahashi',
    category: 'Workforce',
    image: '/placeholder.svg'
  },
  {
    id: 5,
    title: 'Implementing AI in Your Organization',
    excerpt: 'A step-by-step guide to successfully integrating AI solutions into your organization...',
    date: 'March 20, 2025',
    author: 'Carlos Mendez',
    category: 'Implementation',
    image: '/placeholder.svg'
  },
  {
    id: 6,
    title: 'The Role of Data in AI Success',
    excerpt: 'Quality data is the foundation of effective AI systems. Learn how to cultivate and maintain good data practices...',
    date: 'March 15, 2025',
    author: 'Dr. Lisa Johnson',
    category: 'Data Science',
    image: '/placeholder.svg'
  }
];

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(placeholderPosts);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [postsToShow, setPostsToShow] = useState(6);
  const { toast } = useToast();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const posts = await getBlogPosts(postsToShow);
        if (posts && posts.length > 0) {
          // Make sure posts have all required fields before setting state
          const formattedPosts = posts.map(post => ({
            id: post.id || '',
            title: post.title || 'Untitled Post',
            excerpt: post.excerpt || 'No description available',
            date: post.date || new Date().toISOString(),
            author: post.author || 'Anonymous',
            category: post.category || 'Uncategorized',
            image: post.image || '/placeholder.svg'
          }));
          setBlogPosts(formattedPosts);
        }
      } catch (error) {
        console.error('Error loading blog posts:', error);
        toast({
          title: "Couldn't load blog posts",
          description: "Using placeholder content instead.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [postsToShow, toast]);

  const loadMorePosts = async () => {
    setLoadingMore(true);
    try {
      const newPostsCount = postsToShow + 3;
      setPostsToShow(newPostsCount);
      // The useEffect will handle loading the additional posts
    } catch (error) {
      console.error('Error loading more posts:', error);
      toast({
        title: "Couldn't load more posts",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoadingMore(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Helper function to safely format date
  const formatDate = (date: string | { seconds: number }): string => {
    if (typeof date === 'string') {
      return date;
    }
    if (date && typeof date === 'object' && 'seconds' in date) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    return 'Unknown date';
  };

  return (
    <PageContainer>
      <Section>
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Adapty AI <span className="glow-text">Blog</span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Insights, updates, and thought leadership on artificial intelligence and its applications in business.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-adapty-aqua" />
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {blogPosts.map((post) => (
              <motion.div key={post.id} variants={itemVariants}>
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
            ))}
          </motion.div>
        )}

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
        
        <div className="mt-20 bg-black/30 border border-adapty-aqua/20 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">
            Ask L.E.X. about this topic
          </h3>
          <p className="text-gray-300 mb-4">
            Have questions about the articles? Use our AI assistant to learn more.
          </p>
          <Button 
            className="bg-adapty-aqua text-black hover:bg-adapty-aqua/80 animate-pulse-glow"
            onClick={() => {
              // Find the L.E.X. assistant component and toggle it
              const lexButton = document.querySelector('button[data-lex-toggle]');
              if (lexButton) {
                lexButton.click();
              }
            }}
          >
            Ask L.E.X.
          </Button>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Blog;
