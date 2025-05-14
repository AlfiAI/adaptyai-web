
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { BasicInfoFields } from './components/BasicInfoFields';
import { DescriptionFields } from './components/DescriptionFields';
import { AppearanceFields } from './components/AppearanceFields';
import { useAgentForm } from './hooks/useAgentForm';

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
  const { form, isLoading, onSubmit, generateSlug } = useAgentForm({
    agentId,
    onAgentCreated,
    onAgentUpdated,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoFields generateSlug={generateSlug} />
        <DescriptionFields />
        <AppearanceFields />
        
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
