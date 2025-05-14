
import { useEditor } from '@tiptap/react';
import { useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

interface UseRichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export const useRichTextEditor = ({ content, onChange }: UseRichTextEditorProps) => {
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

  return editor;
};
