
import React from 'react';
import { FormProvider } from "react-hook-form";
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Save, CheckCircle2 } from 'lucide-react';
import { BlogMetadataForm } from './steps/BlogMetadataForm';
import { BlogCoverUploadForm } from './steps/BlogCoverUploadForm';
import { BlogKeyTakeawaysForm } from './steps/BlogKeyTakeawaysForm';
import { BlogContentForm } from './steps/BlogContentForm';
import { BlogFaqForm } from './steps/BlogFaqForm';
import { BlogReviewForm } from './steps/BlogReviewForm';
import { BlogEditorProgress } from './components/BlogEditorProgress';
import { BlogEditorNavigation } from './components/BlogEditorNavigation';
import { BlogEditorProvider, useBlogEditorContext } from './context/BlogEditorContext';
import { useBlogEditorForm } from './hooks/useBlogEditorForm';

const BlogEditorFormContent: React.FC = () => {
  const { 
    activeStep, 
    setActiveStep,
    completedSteps,
    isSubmitting
  } = useBlogEditorContext();
  
  const { 
    methods, 
    handleSubmit, 
    onSubmit, 
    onSaveDraft,
    handleStepChange
  } = useBlogEditorForm();

  return (
    <FormProvider {...methods}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onSaveDraft}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
          </div>
        </div>
        
        <BlogEditorProgress />
        
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
          
          <BlogEditorNavigation 
            onPrevious={() => handleStepChange('prev')}
            onNext={() => handleStepChange('next')}
          />
        </form>
      </div>
    </FormProvider>
  );
};

export const BlogEditorForm: React.FC = () => {
  return (
    <BlogEditorProvider>
      <BlogEditorFormContent />
    </BlogEditorProvider>
  );
};
