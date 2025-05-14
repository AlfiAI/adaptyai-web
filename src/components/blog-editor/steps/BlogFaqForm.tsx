
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FAQ, BlogFormData } from '../types';
import { Plus, Trash, MoveUp, MoveDown, HelpCircle } from 'lucide-react';

interface BlogFaqFormProps {
  onComplete: () => void;
}

export const BlogFaqForm: React.FC<BlogFaqFormProps> = ({ onComplete }) => {
  const { watch, setValue } = useFormContext<BlogFormData>();
  const { toast } = useToast();
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  
  const faqs = watch('faqs') || [];

  const handleAddFaq = () => {
    if (!newQuestion.trim()) {
      toast({
        title: "Cannot add empty question",
        description: "Please enter a question first.",
        variant: "destructive"
      });
      return;
    }

    if (!newAnswer.trim()) {
      toast({
        title: "Cannot add empty answer",
        description: "Please enter an answer first.",
        variant: "destructive"
      });
      return;
    }

    setValue('faqs', [...faqs, { 
      question: newQuestion.trim(), 
      answer: newAnswer.trim() 
    }]);
    
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleRemoveFaq = (index: number) => {
    const updated = [...faqs];
    updated.splice(index, 1);
    setValue('faqs', updated);
  };

  const handleMoveFaq = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === faqs.length - 1)
    ) {
      return;
    }

    const updated = [...faqs];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setValue('faqs', updated);
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
          <span className="text-xs bg-adapty-aqua/20 text-adapty-aqua px-2 py-0.5 rounded-full">
            Optional
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Add frequently asked questions related to your blog post. These will appear as a separate section at the end of your article.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Question</label>
              <Input
                placeholder="Enter a question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="bg-black/30 border-white/10"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Answer</label>
              <Textarea
                placeholder="Enter the answer"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={3}
                className="bg-black/30 border-white/10"
              />
            </div>
            <div className="flex justify-end">
              <Button 
                type="button" 
                onClick={handleAddFaq}
                className="bg-adapty-aqua hover:bg-adapty-aqua/80 text-black"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add FAQ
              </Button>
            </div>
          </div>
          
          {faqs.length > 0 ? (
            <div className="border rounded-md border-white/10 overflow-hidden">
              <div className="p-3 bg-black/20 border-b border-white/10">
                <h4 className="font-medium">Current FAQs</h4>
              </div>
              <ul className="divide-y divide-white/10">
                {faqs.map((faq, index) => (
                  <li 
                    key={index} 
                    className="hover:bg-black/20 transition-colors"
                  >
                    <div className="p-3 border-b border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <HelpCircle className="h-5 w-5 text-adapty-aqua shrink-0 mt-0.5" />
                          <span className="font-medium">{faq.question}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleMoveFaq(index, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleMoveFaq(index, 'down')}
                            disabled={index === faqs.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:text-red-500"
                            onClick={() => handleRemoveFaq(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 pl-10 text-sm text-gray-300">
                      {faq.answer}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="border border-dashed rounded-md border-white/10 p-6">
              <p className="text-center text-muted-foreground">
                No FAQs added yet. Add your first one using the form above (optional).
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={onComplete}
          className="bg-adapty-aqua hover:bg-adapty-aqua/80 text-black"
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
};
