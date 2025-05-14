
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SupabaseAgentRepository } from '@/lib/dataAccess/repositories/supabase/agentRepository';
import { useToast } from '@/hooks/use-toast';

const agentTypes = [
  { value: 'aviation', label: 'Aviation' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'sustainability', label: 'Sustainability' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'operator', label: 'Operator' },
];

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
  fullDescription: z.string().min(30, 'Full description must be at least 30 characters'),
  agentType: z.enum(['aviation', 'insurance', 'sustainability', 'cybersecurity', 'operator']),
  capabilities: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  avatarUrl: z.string().optional(),
  themeColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color code'),
});

type FormValues = z.infer<typeof formSchema>;

interface AgentFormProps {
  agentId?: string | null;
  onAgentCreated?: () => void;
  onAgentUpdated?: () => void;
  onCancel?: () => void;
}

const AgentForm: React.FC<AgentFormProps> = ({
  agentId,
  onAgentCreated,
  onAgentUpdated,
  onCancel,
}) => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="E.g. Mina" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    // Auto-generate slug if it's empty
                    if (!form.getValues('slug')) {
                      setTimeout(generateSlug, 100);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Slug</FormLabel>
                <FormControl>
                  <div className="flex">
                    <Input placeholder="e.g. mina" {...field} />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="ml-2" 
                      onClick={generateSlug}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="agentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {agentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="E.g. Aviation Compliance Expert" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief description of what this agent does" 
                  {...field} 
                  className="resize-none"
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="fullDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detailed description of agent capabilities" 
                  {...field} 
                  className="resize-none"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="capabilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capabilities</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter capabilities separated by commas" 
                  {...field} 
                  className="resize-none"
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="themeColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Theme Color</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    <Input {...field} />
                    <div 
                      className="w-10 h-10 rounded border" 
                      style={{ backgroundColor: field.value }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : agentId ? 'Update Agent' : 'Create Agent'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AgentForm;
