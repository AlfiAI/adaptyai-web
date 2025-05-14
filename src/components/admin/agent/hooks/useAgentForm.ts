
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { SupabaseAgentRepository } from '@/lib/dataAccess/repositories/supabase/agentRepository';
import { FormValues, formSchema } from '../schema';

interface UseAgentFormProps {
  agentId?: string | null;
  onAgentCreated?: () => void;
  onAgentUpdated?: () => void;
}

export const useAgentForm = ({
  agentId,
  onAgentCreated,
  onAgentUpdated
}: UseAgentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const agentRepo = new SupabaseAgentRepository();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      title: '',
      shortDescription: '',
      fullDescription: '',
      agentType: 'operator',
      capabilities: '',
      avatarUrl: '',
      themeColor: '#3CDFFF',
    },
  });

  // Load agent data if editing
  useEffect(() => {
    const loadAgent = async () => {
      if (!agentId) return;
      
      try {
        setIsLoading(true);
        const agent = await agentRepo.getById(agentId);
        if (agent) {
          form.reset({
            name: agent.name,
            slug: agent.slug,
            title: agent.title,
            shortDescription: agent.shortDescription,
            fullDescription: agent.fullDescription,
            agentType: agent.agentType,
            capabilities: agent.capabilities.join(', '),
            avatarUrl: agent.avatarUrl || '',
            themeColor: agent.themeColor,
          });
        }
      } catch (error) {
        console.error('Error loading agent:', error);
        toast({
          title: 'Error',
          description: 'Failed to load agent data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAgent();
  }, [agentId, form, toast]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      
      if (agentId) {
        // Update existing agent
        await agentRepo.update(agentId, {
          name: values.name,
          slug: values.slug,
          title: values.title,
          shortDescription: values.shortDescription,
          fullDescription: values.fullDescription,
          agentType: values.agentType,
          // The zod schema has already transformed capabilities into a string array
          capabilities: values.capabilities,
          avatarUrl: values.avatarUrl || null,
          themeColor: values.themeColor,
        });
        
        if (onAgentUpdated) {
          onAgentUpdated();
        }
      } else {
        // Create new agent
        const newAgentId = await agentRepo.create({
          name: values.name,
          slug: values.slug,
          title: values.title,
          shortDescription: values.shortDescription,
          fullDescription: values.fullDescription,
          agentType: values.agentType,
          // The zod schema has already transformed capabilities into a string array
          capabilities: values.capabilities,
          avatarUrl: values.avatarUrl || null,
          themeColor: values.themeColor,
          createdAt: new Date(),
        });
        
        if (newAgentId && onAgentCreated) {
          onAgentCreated();
        }
      }
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: 'Error',
        description: `Failed to ${agentId ? 'update' : 'create'} agent`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate slug from name
  const generateSlug = () => {
    const name = form.getValues('name');
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      form.setValue('slug', slug);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
    generateSlug
  };
};
