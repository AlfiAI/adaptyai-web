
import React, { useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { EditorToolbar } from './EditorToolbar';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isImageUploading: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange,
  onImageUpload,
  isImageUploading
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });
  
  // Initialize with any existing content
  useEffect(() => {
    if (content && editor && editor.isEmpty) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

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
    <div className="border rounded-md border-white/10 overflow-hidden">
      <EditorToolbar 
        editor={editor} 
        isImageUploading={isImageUploading}
        onImageUpload={onImageUpload}
        onLinkAdd={handleLinkAdd}
      />
      
      <div className="bg-black/10 min-h-[400px]">
        <EditorContent 
          editor={editor} 
          className="prose prose-invert max-w-none p-4 min-h-[400px] focus:outline-none" 
        />
      </div>
    </div>
  );
};
