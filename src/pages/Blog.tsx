import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { getBlogPosts } from '@/services/firebaseService';
import { useToast } from '@/hooks/use-toast';
import BlogHeader from '@/components/blog/BlogHeader';
import BlogList from '@/components/blog/BlogList';

interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  date: string | { seconds: number };
  author: string;
  category: string;
  image: string;
}

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

  const formatDate = (date: string | { seconds: number }): string => {
    if (typeof date === 'string') {
      return date;
    }
    if (date && typeof date === 'object' && 'seconds' in date) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    return 'Unknown date';
  };

  const openLexAssistant = () => {
    const lexButton = document.querySelector('button[data-lex-toggle]');
    if (lexButton && lexButton instanceof HTMLElement) {
      lexButton.click();
    }
  };

  return (
    <PageContainer>
      <Section>
        <BlogHeader />
        <BlogList 
          loading={loading}
          blogPosts={blogPosts}
          loadingMore={loadingMore}
          loadMorePosts={loadMorePosts}
          formatDate={formatDate}
        />
        
        <div className="mt-20 bg-black/30 border border-adapty-aqua/20 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">
            Ask L.E.X. about this topic
          </h3>
          <p className="text-gray-300 mb-4">
            Have questions about the articles? Use our AI assistant to learn more.
          </p>
          <Button 
            className="bg-adapty-aqua text-black hover:bg-adapty-aqua/80 animate-pulse-glow"
            onClick={openLexAssistant}
          >
            Ask L.E.X.
          </Button>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Blog;
