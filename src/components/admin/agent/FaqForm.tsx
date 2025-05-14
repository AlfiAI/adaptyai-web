
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SupabaseAgentRepository } from '@/lib/dataAccess/repositories/supabase/agentRepository';
import { AgentFaq } from '@/lib/dataAccess/types';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
  displayOrder: z.number().min(0, 'Display order must be a positive number'),
});

type FormValues = z.infer<typeof formSchema>;

interface FaqFormProps {
  faq: AgentFaq | null;
  agentId: string;
  onSaved: () => void;
  onCancel: () => void;
}

const FaqForm: React.FC<FaqFormProps> = ({
  faq,
  agentId,
  onSaved,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const agentRepo = new SupabaseAgentRepository();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: faq?.question || '',
      answer: faq?.answer || '',
      displayOrder: faq?.displayOrder || 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!agentId) {
      toast({
        title: 'Error',
        description: 'No agent selected',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (faq?.id) {
        // Update existing FAQ
        await agentRepo.updateFaq(faq.id, {
          question: values.question,
          answer: values.answer,
          displayOrder: values.displayOrder,
        });
        
        toast({
          title: 'Success',
          description: 'FAQ updated successfully',
        });
      } else {
        // Create new FAQ
        await agentRepo.createFaq({
          agentId,
          question: values.question,
          answer: values.answer,
          displayOrder: values.displayOrder,
        });
        
        toast({
          title: 'Success',
          description: 'FAQ created successfully',
        });
      }
      
      onSaved();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast({
        title: 'Error',
        description: `Failed to ${faq ? 'update' : 'create'} FAQ`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Input placeholder="E.g. How does this agent help with...?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed answer to the question" 
                  {...field} 
                  className="resize-none"
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="displayOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : faq ? 'Update FAQ' : 'Add FAQ'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FaqForm;
