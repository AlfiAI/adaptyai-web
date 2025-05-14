
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SupabaseAgentRepository } from '@/lib/dataAccess/repositories/supabase/agentRepository';
import { AgentFeature } from '@/lib/dataAccess/types';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  icon: z.string().optional(),
  displayOrder: z.number().min(0, 'Display order must be a positive number'),
});

type FormValues = z.infer<typeof formSchema>;

interface FeatureFormProps {
  feature: AgentFeature | null;
  agentId: string;
  onSaved: () => void;
  onCancel: () => void;
}

const FeatureForm: React.FC<FeatureFormProps> = ({
  feature,
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
      title: feature?.title || '',
      description: feature?.description || '',
      icon: feature?.icon || '',
      displayOrder: feature?.displayOrder || 0,
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
      
      if (feature?.id) {
        // Update existing feature
        await agentRepo.updateFeature(feature.id, {
          title: values.title,
          description: values.description,
          icon: values.icon || null,
          displayOrder: values.displayOrder,
        });
        
        toast({
          title: 'Success',
          description: 'Feature updated successfully',
        });
      } else {
        // Create new feature
        await agentRepo.createFeature({
          agentId,
          title: values.title,
          description: values.description,
          icon: values.icon || null,
          displayOrder: values.displayOrder,
        });
        
        toast({
          title: 'Success',
          description: 'Feature created successfully',
        });
      }
      
      onSaved();
    } catch (error) {
      console.error('Error saving feature:', error);
      toast({
        title: 'Error',
        description: `Failed to ${feature ? 'update' : 'create'} feature`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. ✓ or 🔍" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="E.g. Regulatory Compliance" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed description of this feature" 
                  {...field} 
                  className="resize-none"
                  rows={3}
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
            {isLoading ? 'Saving...' : feature ? 'Update Feature' : 'Add Feature'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FeatureForm;
