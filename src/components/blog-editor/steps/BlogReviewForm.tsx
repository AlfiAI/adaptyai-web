
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { BlogFormData } from '../types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Tag, Pin } from 'lucide-react';

interface BlogReviewFormProps {
  isSubmitting: boolean;
}

export const BlogReviewForm: React.FC<BlogReviewFormProps> = ({ isSubmitting }) => {
  const { watch, getValues } = useFormContext<BlogFormData>();
  
  const title = watch('title');
  const slug = watch('slug');
  const excerpt = watch('excerpt');
  const coverImageUrl = watch('cover_image_url');
  const keyTakeaways = watch('key_takeaways') || [];
  const body = watch('body');
  const tags = watch('tags') || [];
  const featured = watch('featured');
  const publishedAt = watch('published_at');
  const faqs = watch('faqs') || [];

  const renderHtml = (html: string) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Review Your Blog Post</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Review your blog post before publishing. You can go back to any section to make changes.
        </p>
        
        <div className="space-y-6">
          <Card className="p-4 bg-black/20 border-white/10">
            <h1 className="text-2xl font-bold mb-2">{title || 'Untitled Post'}</h1>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-black/30">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {publishedAt ? format(publishedAt, 'MMMM d, yyyy') : 'Unpublished'}
              </div>
              
              {featured && (
                <Badge variant="secondary" className="bg-amber-900/30 border-amber-600/30 text-amber-300">
                  <Pin className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            
            <div className="mb-4">
              <p className="text-gray-300">
                {excerpt || 'No excerpt provided.'}
              </p>
            </div>
            
            {coverImageUrl && (
              <div className="mb-6">
                <img 
                  src={coverImageUrl} 
                  alt="Cover" 
                  className="w-full h-auto rounded-md object-cover"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}
            
            {keyTakeaways.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Key Takeaways</h3>
                <ul className="list-disc list-inside space-y-1">
                  {keyTakeaways.map((takeaway, index) => (
                    <li key={index} className="text-gray-300">{takeaway}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {body && (
              <div className="mb-6 prose prose-invert max-w-none">
                {renderHtml(body)}
              </div>
            )}
            
            {faqs.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-3">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-white/10 pb-3">
                      <h4 className="font-medium mb-2">{faq.question}</h4>
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Permalink: /blog/{slug || 'untitled'}</p>
            </div>
          </Card>
          
          <div className="border border-white/10 rounded-md p-4 bg-black/30">
            <h3 className="font-medium mb-2">Ready to publish?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Once published, your blog post will be publicly available at /blog/{slug || 'untitled'}
            </p>
            
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-adapty-aqua hover:bg-adapty-aqua/80 text-black py-6 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish Blog Post'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
