
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BlogFormData } from '../types';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { 
  Bold, Italic, List, ListOrdered, Heading as HeadingIcon, 
  Image as ImageIcon, Link as LinkIcon, Code, Quote,
  Redo, Undo 
} from 'lucide-react';
import { uploadFileToStorage } from '@/lib/utils';

interface BlogContentFormProps {
  onComplete: () => void;
}

export const BlogContentForm: React.FC<BlogContentFormProps> = ({ onComplete }) => {
  const { setValue, getValues } = useFormContext<BlogFormData>();
  const { toast } = useToast();
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: getValues('body') || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setValue('body', html);
      setHtmlContent(html);
    },
  });
  
  // Initialize with any existing content
  useEffect(() => {
    const existingContent = getValues('body');
    if (existingContent && editor && !editor.isEmpty) {
      editor.commands.setContent(existingContent);
    }
  }, [editor, getValues]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image less than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsImageUploading(true);
      
      // Upload file to Supabase storage
      const imageUrl = await uploadFileToStorage(file, 'blog_covers', 'content');
      
      // Add image to editor
      if (editor) {
        editor.chain().focus().insertContent(`<img src="${imageUrl}" alt="Blog image" />`).run();
      }
      
      toast({
        title: "Image added",
        description: "Your image has been added to the post.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsImageUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleLinkAdd = () => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Blog Content</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Write your blog post content using the rich text editor below.
        </p>
        
        <div className="border rounded-md border-white/10 overflow-hidden">
          <div className="bg-black/20 border-b border-white/10 p-2 flex flex-wrap gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={editor?.isActive('bold') ? 'bg-black/40' : ''}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={editor?.isActive('italic') ? 'bg-black/40' : ''}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor?.isActive('heading', { level: 2 }) ? 'bg-black/40' : ''}
            >
              <HeadingIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={editor?.isActive('bulletList') ? 'bg-black/40' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={editor?.isActive('orderedList') ? 'bg-black/40' : ''}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              className={editor?.isActive('codeBlock') ? 'bg-black/40' : ''}
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={editor?.isActive('blockquote') ? 'bg-black/40' : ''}
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLinkAdd}
              className={editor?.isActive('link') ? 'bg-black/40' : ''}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={isImageUploading ? 'opacity-50' : ''}
                disabled={isImageUploading}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
                disabled={isImageUploading}
              />
            </label>
            
            <div className="ml-auto flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="bg-black/10 min-h-[400px]">
            <EditorContent 
              editor={editor} 
              className="prose prose-invert max-w-none p-4 min-h-[400px] focus:outline-none" 
            />
          </div>
        </div>
        
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
