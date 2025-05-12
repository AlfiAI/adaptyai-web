
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBlogRepository } from '@/lib/dataAccess';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Calendar, Tag, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const blogRepo = getBlogRepository() as any;

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');
      
      if (typeof blogRepo.getBySlug === 'function') {
        const post = await blogRepo.getBySlug(slug);
        if (post) return post;
      }
      
      // Fallback to searching in all posts
      const posts = await blogRepo.getAll();
      return posts.find(p => p.slug === slug);
    },
    enabled: !!slug,
  });

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Unknown date';
    
    if (date instanceof Date) {
      return format(date, 'MMMM dd, yyyy');
    }
    
    if (typeof date === 'string') {
      return format(new Date(date), 'MMMM dd, yyyy');
    }
    
    return 'Unknown date';
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

  if (error || !post) {
    return (
      <PageContainer>
        <Section>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Post Not Found</h1>
            <p className="text-gray-400 mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/blog')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </div>
        </Section>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Section>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/blog">
              <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-adapty-aqua">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>

          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {post.cover_image_url && (
                <div className="w-full aspect-video mb-8 overflow-hidden rounded-lg">
                  <img 
                    src={post.cover_image_url} 
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              {post.excerpt && (
                <div className="text-xl text-gray-300 italic border-l-4 border-adapty-aqua pl-4 py-2">
                  {post.excerpt}
                </div>
              )}
            </header>

            <div className="prose-lg">
              <MarkdownRenderer markdown={post.body} />
            </div>
          </article>
        </div>
      </Section>
    </PageContainer>
  );
};

export default BlogPost;
