
import React from 'react';
import { EditorContent } from '@tiptap/react';
import { EditorToolbar } from './EditorToolbar';
import { useRichTextEditor } from './hooks/useRichTextEditor';
import { handleLinkAdd } from './utils/linkUtils';

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
  const editor = useRichTextEditor({ content, onChange });
  
  return (
    <div className="border rounded-md border-white/10 overflow-hidden">
      <EditorToolbar 
        editor={editor} 
        isImageUploading={isImageUploading}
        onImageUpload={onImageUpload}
        onLinkAdd={() => handleLinkAdd(editor)}
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
