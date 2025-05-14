
import { useForm } from "react-hook-form";
import { BlogFormData, defaultBlogPost } from '../types';
import { useAutoSave } from './useAutoSave';
import { useFormProgress } from './useFormProgress';
import { useFormSubmission } from './useFormSubmission';
import { useSlugGeneration } from './useSlugGeneration';

export const useBlogEditorForm = () => {
  // Initialize form with default values
  const methods = useForm<BlogFormData>({
    defaultValues: {
      ...defaultBlogPost,
      key_takeaways: [],
      faqs: [],
    },
  });

  // Use the separated hooks
  useSlugGeneration();
  const { onSaveDraft } = useAutoSave();
  const { handleStepChange } = useFormProgress();
  const { onSubmit, handleSubmit } = useFormSubmission();

  return {
    methods,
    handleSubmit,
    onSubmit,
    onSaveDraft,
    handleStepChange,
  };
};
