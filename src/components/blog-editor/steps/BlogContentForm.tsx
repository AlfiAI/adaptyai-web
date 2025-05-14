
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BlogFormData } from '../types';
import { RichTextEditor } from '../components/RichTextEditor/RichTextEditor';
import { useImageUpload } from '../hooks/useImageUpload';

interface BlogContentFormProps {
  onComplete: () => void;
}

export const BlogContentForm: React.FC<BlogContentFormProps> = ({ onComplete }) => {
  const { setValue, getValues } = useFormContext<BlogFormData>();
  const { toast } = useToast();
  const [htmlContent, setHtmlContent] = useState('');
  const { isImageUploading, uploadImage } = useImageUpload();
  
  const handleContinue = () => {
    const content = getValues('body');
    if (content && content.length > 10) {
      onComplete();
    } else {
      toast({
        title: "Content required",
        description: "Please add some content to your blog post before continuing.",
        variant: "destructive"
      });
    }
  };

  const handleEditorChange = (html: string) => {
    setValue('body', html);
    setHtmlContent(html);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await uploadImage(file, (imageUrl) => {
      const editor = document.querySelector('.ProseMirror')?.['editor'];
      if (editor) {
        editor.commands.insertContent(`<img src="${imageUrl}" alt="Blog image" />`);
      }
    });
    
    e.target.value = ''; // Reset input
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Blog Content</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Write your blog post content using the rich text editor below.
        </p>
        
        <RichTextEditor
          content={getValues('body') || ''}
          onChange={handleEditorChange}
          onImageUpload={handleImageUpload}
          isImageUploading={isImageUploading}
        />
        
        <p className="text-xs text-muted-foreground mt-2">
          Use the toolbar above to format your text, add images, and create links.
        </p>
      </div>

      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={handleContinue}
          disabled={!htmlContent || htmlContent.length < 10}
          className="bg-adapty-aqua hover:bg-adapty-aqua/80 text-black"
        >
          Continue to FAQs (Optional)
        </Button>
      </div>
    </div>
  );
};
