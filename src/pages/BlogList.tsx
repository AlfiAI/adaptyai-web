
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import BlogCard from '@/components/blog/BlogCard';
import BlogCardSkeleton from '@/components/blog/BlogCardSkeleton';
import { getBlogRepository } from '@/lib/dataAccess';
import DataInitializer from '@/components/blog/DataInitializer';
import { createBlogSampleData } from '@/lib/dataAccess/repositories/supabase/createBlogSampleData';

export default function BlogList() {
  const { toast } = useToast();
  const [initializingData, setInitializingData] = useState(false);
  
  const blogRepo = getBlogRepository();
  
  const { data: posts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      try {
        return await blogRepo.getAll();
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        toast({
          title: 'Error',
          description: 'Failed to load blog posts',
          variant: 'destructive',
        });
        return [];
      }
    }
  });

  // Auto-initialize blog posts if none exist
  useEffect(() => {
    const initializeData = async () => {
      if (!isLoading && posts.length === 0 && !initializingData) {
        try {
          setInitializingData(true);
          console.log('No blog posts found. Creating sample data...');
          await createBlogSampleData();
          refetch();
          toast({
            title: 'Blog Initialized',
            description: 'Sample blog posts have been created.',
          });
        } catch (error) {
          console.error('Error initializing blog data:', error);
          toast({
            title: 'Error',
            description: 'Failed to initialize sample blog data.',
            variant: 'destructive',
          });
        } finally {
          setInitializingData(false);
        }
      }
    };
    
    initializeData();
  }, [posts.length, isLoading, refetch, toast, initializingData]);
  
  return (
    <PageContainer>
      <Section>
        <h1 className="text-4xl font-bold mb-2">Adapty AI Blog</h1>
        <p className="text-muted-foreground mb-8">
          Updates, insights, and news from our team
        </p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">Failed to load blog posts</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              {initializingData ? 'Creating blog posts...' : 'No blog posts available.'}
            </p>
            {!initializingData && (
              <DataInitializer onComplete={refetch} />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Section>
    </PageContainer>
  );
}
