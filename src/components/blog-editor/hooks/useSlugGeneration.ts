
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { slugify } from '@/lib/utils';
import { BlogFormData } from '../types';

export const useSlugGeneration = () => {
  const { watch, setValue } = useFormContext<BlogFormData>();
  
  // Watch for title changes to auto-generate slug
  const title = watch('title');
  
  useEffect(() => {
    if (title) {
      setValue('slug', slugify(title));
    }
  }, [title, setValue]);
};
