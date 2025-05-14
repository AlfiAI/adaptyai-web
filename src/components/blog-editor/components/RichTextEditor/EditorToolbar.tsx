
import React from 'react';
import { Button } from '@/components/ui/button';
import { Editor } from '@tiptap/react';
import { 
  Bold, Italic, List, ListOrdered, Heading as HeadingIcon, 
  Image as ImageIcon, Link as LinkIcon, Code, Quote,
  Redo, Undo 
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor | null;
  isImageUploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLinkAdd: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  editor, 
  isImageUploading,
  onImageUpload,
  onLinkAdd
}) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="bg-black/20 border-b border-white/10 p-2 flex flex-wrap gap-1">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-black/40' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-black/40' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-black/40' : ''}
      >
        <HeadingIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-black/40' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-black/40' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'bg-black/40' : ''}
      >
        <Code className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-black/40' : ''}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onLinkAdd}
        className={editor.isActive('link') ? 'bg-black/40' : ''}
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
          onChange={onImageUpload} 
          disabled={isImageUploading}
        />
      </label>
      
      <div className="ml-auto flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
