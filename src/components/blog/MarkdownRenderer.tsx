
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  markdown,
  className 
}) => {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    // Basic Markdown to HTML conversion
    const convertMarkdownToHtml = (md: string) => {
      if (!md) return '';
      
      let htmlContent = md
        // Headers
        .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold my-4">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold my-5">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold my-6">$1</h1>')
        // Bold
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-adapty-aqua hover:underline">$1</a>')
        // Lists
        .replace(/^\s*-\s*(.*)/gim, '<li class="ml-6 list-disc">$1</li>')
        .replace(/^\s*\d+\.\s*(.*)/gim, '<li class="ml-6 list-decimal">$1</li>')
        .replace(/<\/li>\n<li>/g, '</li><li>')
        .replace(/<li>(.+\n?)+/g, '<ul class="my-4">$&</ul>')
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 p-4 rounded-md my-4 overflow-x-auto"><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-1.5 py-0.5 rounded text-adapty-aqua">$1</code>')
        // Blockquotes
        .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-adapty-aqua pl-4 py-1 my-4">$1</blockquote>')
        // Horizontal rules
        .replace(/^\s*---\s*$/gim, '<hr class="my-6 border-t border-gray-300" />')
        // Paragraphs
        .replace(/^\s*(\n)?(.+)/gim, function(m) {
          return /\<(\/)?(h|ul|ol|li|blockquote|pre|img|hr)/.test(m) ? m : '<p class="my-3">' + m + '</p>';
        })
        // Images
        .replace(/!\[([^\]]+)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full rounded my-4" />')
        // Line breaks
        .replace(/\n/gim, '<br>');
      
      return htmlContent;
    };

    setHtml(convertMarkdownToHtml(markdown));
  }, [markdown]);

  return (
    <div 
      className={cn("prose prose-invert max-w-none", className)} 
      dangerouslySetInnerHTML={{ __html: html || '<p>No content available</p>' }}
    />
  );
};

export default MarkdownRenderer;
