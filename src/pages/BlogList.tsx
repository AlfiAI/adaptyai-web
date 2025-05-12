
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getBlogRepository } from '@/lib/dataAccess';
import { BlogPostData } from '@/lib/dataAccess/types';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus } from 'lucide-react';
import { formatDistance } from 'date-fns';
import DataInitializer from '@/components/blog/DataInitializer';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';

const BlogList = () => {
  const [showInitializer, setShowInitializer] = useState(false);
  const queryClient = useQueryClient();
  const { authenticated, role } = useAuthStore();
  const isAdmin = authenticated && role === 'admin';
  const blogRepository = getBlogRepository();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      const posts = await blogRepository.getAll();
      
      if (posts.length === 0 && !showInitializer) {
        setShowInitializer(true);
      }
      
      return posts;
    },
  });

  const { data: featuredPost } = useQuery({
    queryKey: ['featuredPost'],
    queryFn: async () => {
      // Try to get a featured post first
      const repo = getBlogRepository() as any;
      if (typeof repo.getFeatured === 'function') {
        try {
          const featured = await repo.getFeatured();
          if (featured) return featured;
        } catch (err) {
          console.error('Error fetching featured post:', err);
        }
      }
      
      // If no featured post or error, return first post from regular posts
      const posts = await blogRepository.getAll();
      return posts?.length > 0 ? posts[0] : null;
    },
    enabled: !isLoading && !!posts,
  });

  const formatDate = (date: Date | string) => {
    if (date instanceof Date) {
      return formatDistance(date, new Date(), { addSuffix: true });
    }
    if (typeof date === 'string') {
      return formatDistance(new Date(date), new Date(), { addSuffix: true });
    }
    return 'Unknown date';
  };

  const handleDataInitialized = () => {
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    queryClient.invalidateQueries({ queryKey: ['featuredPost'] });
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Section>
          <div className="flex justify-center items-center min-h-[40vh]">
            <Loader2 className="h-12 w-12 animate-spin text-adapty-aqua" />
          </div>
        </Section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Section>
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-gray-400">
              Insights and perspectives on AI, technology, and business transformation
            </p>
          </div>

          {isAdmin && (showInitializer || (posts && posts.length === 0)) && (
            <DataInitializer onComplete={handleDataInitialized} />
          )}

          {isAdmin && (
            <div className="mb-8 flex justify-end">
              <Link to="/admin">
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" /> Manage Posts
                </Button>
              </Link>
            </div>
          )}

          {featuredPost && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">Featured Post</h2>
              <Link to={`/blog/${featuredPost.slug}`} className="group">
                <Card className="overflow-hidden hover:border-adapty-aqua transition-colors bg-card/50">
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={featuredPost.cover_image_url || '/placeholder.svg'} 
                      alt={featuredPost.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-adapty-aqua text-black font-medium">Featured</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl group-hover:text-adapty-aqua transition-colors">
                      {featuredPost.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{featuredPost.excerpt}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex flex-wrap gap-2">
                      {featuredPost.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-gray-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatDate(featuredPost.published_at)}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts && 
              posts
                .filter(post => !featuredPost || post.id !== featuredPost.id)
                .map((post: BlogPostData) => (
                  <Link to={`/blog/${post.slug}`} key={post.id} className="group">
                    <Card className="h-full hover:border-adapty-aqua transition-colors bg-card/50">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.cover_image_url || '/placeholder.svg'} 
                          alt={post.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl group-hover:text-adapty-aqua transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 line-clamp-3">{post.excerpt}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-gray-300 text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(post.published_at)}
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}

            {(!posts || posts.length === 0) && (
              <div className="col-span-3 py-12 text-center text-gray-400">
                <p>No blog posts found. Check back soon for new content!</p>
              </div>
            )}
          </div>
        </div>
      </Section>
    </PageContainer>
  );
};

export default BlogList;
