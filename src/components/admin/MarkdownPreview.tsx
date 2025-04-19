
import React, { useEffect, useState } from 'react';

interface MarkdownPreviewProps {
  markdown: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown }) => {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    // Basic Markdown to HTML conversion
    const convertMarkdownToHtml = (md: string) => {
      if (!md) return '';
      
      let htmlContent = md
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-adapty-aqua hover:underline">$1</a>')
        // Lists
        .replace(/^\s*-\s*(.*)/gim, '<li>$1</li>')
        .replace(/<\/li>\n<li>/g, '</li><li>')
        .replace(/<li>(.+\n?)+/g, '<ul>$&</ul>')
        // Paragraphs
        .replace(/^\s*(\n)?(.+)/gim, function(m) {
          return /\<(\/)?(h|ul|ol|li|blockquote|pre|img|code)/.test(m) ? m : '<p>' + m + '</p>';
        })
        // Images
        .replace(/!\[([^\]]+)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full rounded my-2" />')
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 p-4 rounded my-4 overflow-x-auto"><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-1 py-0.5 rounded text-adapty-aqua">$1</code>')
        // Blockquotes
        .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-adapty-aqua pl-4 py-1 my-2">$1</blockquote>')
        // Line breaks
        .replace(/\n/gim, '<br>');
      
      return htmlContent;
    };

    setHtml(convertMarkdownToHtml(markdown));
  }, [markdown]);

  return (
    <div 
      className="prose prose-invert max-w-none prose-pre:bg-gray-800" 
      dangerouslySetInnerHTML={{ __html: html || '<p>Preview will appear here</p>' }}
    />
  );
};
