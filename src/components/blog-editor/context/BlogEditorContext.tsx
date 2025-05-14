
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BlogFormData } from '../types';

interface BlogEditorContextType {
  activeStep: string;
  setActiveStep: (step: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  isAutoSaving: boolean;
  setIsAutoSaving: (isAutoSaving: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
  completedSteps: Record<string, boolean>;
  setCompletedSteps: (completedSteps: Record<string, boolean>) => void;
}

export const BlogEditorContext = createContext<BlogEditorContextType | undefined>(undefined);

interface BlogEditorProviderProps {
  children: ReactNode;
}

export const BlogEditorProvider: React.FC<BlogEditorProviderProps> = ({ children }) => {
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

  const value = {
    activeStep,
    setActiveStep,
    isSubmitting,
    setIsSubmitting,
    isAutoSaving,
    setIsAutoSaving,
    progress,
    setProgress,
    completedSteps,
    setCompletedSteps,
  };

  return (
    <BlogEditorContext.Provider value={value}>
      {children}
    </BlogEditorContext.Provider>
  );
};

export const useBlogEditorContext = () => {
  const context = useContext(BlogEditorContext);
  if (context === undefined) {
    throw new Error('useBlogEditorContext must be used within a BlogEditorProvider');
  }
  return context;
};
