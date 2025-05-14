
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useBlogEditorContext } from '../context/BlogEditorContext';
import { BlogFormData } from '../types';

export const useFormProgress = () => {
  const { 
    setProgress, 
    completedSteps, 
    setCompletedSteps, 
    activeStep, 
    setActiveStep 
  } = useBlogEditorContext();
  const { getValues, watch } = useFormContext<BlogFormData>();

  // Calculate progress based on completed steps
  useEffect(() => {
    const steps = Object.values(completedSteps);
    const completedCount = steps.filter(Boolean).length;
    setProgress((completedCount / steps.length) * 100);
  }, [completedSteps, setProgress]);

  // Update completed steps based on form data
  useEffect(() => {
    const formData = getValues();
    
    const updatedSteps: Record<string, boolean> = {
      'step-1': !!(formData.title && formData.slug),
      'step-2': !!formData.cover_image_url,
      'step-3': !!(formData.key_takeaways && formData.key_takeaways.length > 0),
      'step-4': !!(formData.body && formData.body.length > 10),
      'step-5': true // FAQs are optional
    };
    
    setCompletedSteps(updatedSteps);
  }, [watch, getValues, setCompletedSteps]);

  // Navigation functions
  const handleStepChange = (direction: 'prev' | 'next') => {
    const steps = ['step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'review'];
    const currentIndex = steps.indexOf(activeStep);
    
    if (direction === 'prev' && currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1]);
    }
  };

  return { handleStepChange };
};
