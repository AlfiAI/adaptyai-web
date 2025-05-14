
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useForm, FormProvider } from "react-hook-form";
import { slugify, uploadFileToStorage } from '@/lib/utils';
import { getBlogRepository } from '@/lib/dataAccess/factory';
import { BlogPostData } from '@/lib/dataAccess/types';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Save, ChevronRight, CheckCircle2 } from 'lucide-react';
import { BlogMetadataForm } from './steps/BlogMetadataForm';
import { BlogCoverUploadForm } from './steps/BlogCoverUploadForm';
import { BlogKeyTakeawaysForm } from './steps/BlogKeyTakeawaysForm';
import { BlogContentForm } from './steps/BlogContentForm';
import { BlogFaqForm } from './steps/BlogFaqForm';
import { BlogReviewForm } from './steps/BlogReviewForm';

// Local storage key for autosave
const AUTOSAVE_KEY = 'blog-editor-autosave';

// Default blog post data
const defaultBlogPost: Partial<BlogPostData> = {
  title: '',
  excerpt: '',
  body: '',
  tags: [],
  featured: false,
  cover_image_url: '',
  slug: '',
  published_at: new Date(),
};

// FAQ and Key takeaways interfaces
export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogFormData extends Partial<BlogPostData> {
  key_takeaways: string[];
  faqs: FAQ[];
  coverImageFile?: File | null;
}

export const BlogEditorForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState<string>('step-1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'step-1': false,
    'step-2': false,
    'step-3': false,
    'step-4': false,
    'step-5': false,
  });

  // Initialize form with default values or autosaved data
  const methods = useForm<BlogFormData>({
    defaultValues: {
      ...defaultBlogPost,
      key_takeaways: [],
      faqs: [],
    },
  });

  const { watch, setValue, getValues, handleSubmit } = methods;

  // Watch for title changes to auto-generate slug
  const title = watch('title');
  useEffect(() => {
    if (title) {
      setValue('slug', slugify(title));
    }
  }, [title, setValue]);

  // Load autosaved data on mount
  useEffect(() => {
    const autosavedData = localStorage.getItem(AUTOSAVE_KEY);
    if (autosavedData) {
      try {
        const parsedData = JSON.parse(autosavedData);
        
        // Convert string dates back to Date objects
        if (parsedData.published_at) {
          parsedData.published_at = new Date(parsedData.published_at);
        }
        
        // Restore form data
        Object.keys(parsedData).forEach(key => {
          if (key !== 'coverImageFile') {
            setValue(key as any, parsedData[key]);
          }
        });

        toast({
          title: "Draft Restored",
          description: "Your previous draft has been loaded.",
        });
      } catch (error) {
        console.error('Error loading autosaved data:', error);
      }
    }
  }, [setValue, toast]);

  // Autosave every 60 seconds
  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      saveToLocalStorage();
    }, 60000); // 60 seconds

    return () => clearInterval(autosaveInterval);
  }, []);

  // Calculate progress
  useEffect(() => {
    const steps = Object.values(completedSteps);
    const completedCount = steps.filter(Boolean).length;
    setProgress((completedCount / steps.length) * 100);
  }, [completedSteps]);

  // Update completed steps based on form data
  useEffect(() => {
    const formData = getValues();
    
    setCompletedSteps(prev => ({
      ...prev,
      'step-1': !!(formData.title && formData.slug),
      'step-2': !!formData.cover_image_url,
      'step-3': !!(formData.key_takeaways && formData.key_takeaways.length > 0),
      'step-4': !!(formData.body && formData.body.length > 10),
      'step-5': true // FAQs are optional
    }));
  }, [watch, getValues]);

  const saveToLocalStorage = () => {
    try {
      setIsAutoSaving(true);
      const formData = getValues();
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(formData));
      setIsAutoSaving(false);
    } catch (error) {
      console.error('Error saving to local storage:', error);
      setIsAutoSaving(false);
    }
  };

  const onSaveDraft = () => {
    saveToLocalStorage();
    toast({
      title: "Draft Saved",
      description: "Your draft has been saved locally.",
    });
  };

  const processBlogContent = (formData: BlogFormData): BlogPostData => {
    let processedBody = formData.body || '';
    
    // Add key takeaways section if present
    if (formData.key_takeaways && formData.key_takeaways.length > 0) {
      const takeawaysSection = `## Key Takeaways\n${formData.key_takeaways.map(item => `- ${item}`).join('\n')}\n\n`;
      processedBody = takeawaysSection + processedBody;
    }
    
    // Add FAQs section if present
    if (formData.faqs && formData.faqs.length > 0) {
      const faqsSection = `\n\n## Frequently Asked Questions\n\n${formData.faqs.map(faq => 
        `### ${faq.question}\n${faq.answer}`
      ).join('\n\n')}`;
      processedBody = processedBody + faqsSection;
    }
    
    return {
      id: '', // Will be generated by Supabase
      title: formData.title || 'Untitled',
      slug: formData.slug || slugify(formData.title || 'untitled'),
      excerpt: formData.excerpt || '',
      body: processedBody,
      author: formData.author || 'Admin',
      tags: formData.tags || [],
      cover_image_url: formData.cover_image_url || '',
      featured: formData.featured || false,
      published_at: formData.published_at || new Date(),
    };
  };

  const onSubmit = async (formData: BlogFormData) => {
    try {
      setIsSubmitting(true);
      
      // Process the blog post data
      const blogPostData = processBlogContent(formData);
      
      // Save to Supabase
      const blogRepo = getBlogRepository();
      const postId = await blogRepo.create(blogPostData);
      
      if (!postId) {
        throw new Error("Failed to create blog post");
      }
      
      // Clear autosaved data
      localStorage.removeItem(AUTOSAVE_KEY);
      
      toast({
        title: "Success!",
        description: "Your blog post has been published.",
      });
      
      // Redirect to the newly created blog post
      navigate(`/blog/${blogPostData.slug}`);
      
    } catch (error) {
      console.error('Error publishing blog post:', error);
      toast({
        title: "Error",
        description: "Failed to publish blog post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onSaveDraft}
              disabled={isAutoSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {isAutoSaving ? 'Saving...' : 'Save Draft'}
            </Button>
          </div>
        </div>
        
        <Card className="mb-6 p-4 bg-black/20 border-white/10">
          <div className="flex items-center mb-2">
            <div className="flex-1">
              <Progress value={progress} className="h-2" />
            </div>
            <span className="ml-4 text-sm font-medium">{Math.round(progress)}% complete</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Complete all required steps to publish your blog post. Progress is automatically saved.
          </p>
        </Card>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <Accordion
            type="single"
            collapsible
            defaultValue="step-1"
            value={activeStep}
            onValueChange={setActiveStep}
            className="mb-6"
          >
            <AccordionItem value="step-1" className="border-white/10">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted mr-3 text-sm">
                    {completedSteps['step-1'] ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <span>1</span>
                    )}
                  </div>
                  <span className="text-lg font-medium">Blog Metadata</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <BlogMetadataForm onComplete={() => setActiveStep('step-2')} />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="step-2" className="border-white/10">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted mr-3 text-sm">
                    {completedSteps['step-2'] ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <span>2</span>
                    )}
                  </div>
                  <span className="text-lg font-medium">Cover Image</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <BlogCoverUploadForm onComplete={() => setActiveStep('step-3')} />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="step-3" className="border-white/10">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted mr-3 text-sm">
                    {completedSteps['step-3'] ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <span>3</span>
                    )}
                  </div>
                  <span className="text-lg font-medium">Key Takeaways</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <BlogKeyTakeawaysForm onComplete={() => setActiveStep('step-4')} />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="step-4" className="border-white/10">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted mr-3 text-sm">
                    {completedSteps['step-4'] ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <span>4</span>
                    )}
                  </div>
                  <span className="text-lg font-medium">Blog Content</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <BlogContentForm onComplete={() => setActiveStep('step-5')} />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="step-5" className="border-white/10">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted mr-3 text-sm">
                    {completedSteps['step-5'] ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <span>5</span>
                    )}
                  </div>
                  <span className="text-lg font-medium">FAQs (Optional)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <BlogFaqForm onComplete={() => setActiveStep('review')} />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="review" className="border-white/10">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted mr-3 text-sm">
                    <span>6</span>
                  </div>
                  <span className="text-lg font-medium">Review & Publish</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <BlogReviewForm isSubmitting={isSubmitting} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="flex justify-between py-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                const steps = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'review'];
                const currentIndex = steps.indexOf(activeStep);
                if (currentIndex > 0) {
                  setActiveStep(steps[currentIndex - 1]);
                }
              }}
              disabled={activeStep === 'step-1'}
            >
              Previous
            </Button>
            
            {activeStep !== 'review' ? (
              <Button 
                type="button"
                onClick={() => {
                  const steps = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'review'];
                  const currentIndex = steps.indexOf(activeStep);
                  if (currentIndex < steps.length - 1) {
                    setActiveStep(steps[currentIndex + 1]);
                  }
                }}
                className="bg-adapty-aqua hover:bg-adapty-aqua/80 text-black"
              >
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="submit"
                disabled={isSubmitting || progress < 80}
                className="bg-adapty-aqua hover:bg-adapty-aqua/80 text-black"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Blog Post'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
};
