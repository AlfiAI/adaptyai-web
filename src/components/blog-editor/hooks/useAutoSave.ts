
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useBlogEditorContext } from '../context/BlogEditorContext';
import { AUTOSAVE_KEY, BlogFormData } from '../types';

export const useAutoSave = () => {
  const { toast } = useToast();
  const { setIsAutoSaving } = useBlogEditorContext();
  const { getValues, setValue } = useFormContext<BlogFormData>();
  
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

  return { 
    saveToLocalStorage, 
    onSaveDraft 
  };
};
