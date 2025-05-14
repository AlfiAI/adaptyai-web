
import { Editor } from '@tiptap/react';

export const handleLinkAdd = (editor: Editor | null) => {
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
