
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { BlogFormData } from '../BlogEditorForm';
import { Plus, Trash, MoveUp, MoveDown } from 'lucide-react';

interface BlogKeyTakeawaysFormProps {
  onComplete: () => void;
}

export const BlogKeyTakeawaysForm: React.FC<BlogKeyTakeawaysFormProps> = ({ onComplete }) => {
  const { watch, setValue } = useFormContext<BlogFormData>();
  const { toast } = useToast();
  const [newTakeaway, setNewTakeaway] = useState('');
  
  const keyTakeaways = watch('key_takeaways') || [];

  const handleAddTakeaway = () => {
    if (!newTakeaway.trim()) {
      toast({
        title: "Cannot add empty takeaway",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    setValue('key_takeaways', [...keyTakeaways, newTakeaway.trim()]);
    setNewTakeaway('');
  };

  const handleRemoveTakeaway = (index: number) => {
    const updated = [...keyTakeaways];
    updated.splice(index, 1);
    setValue('key_takeaways', updated);
  };

  const handleMoveTakeaway = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === keyTakeaways.length - 1)
    ) {
      return;
    }

    const updated = [...keyTakeaways];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setValue('key_takeaways', updated);
  };

  const handleContinue = () => {
    if (keyTakeaways.length > 0) {
      onComplete();
    } else {
      toast({
        title: "Key takeaways required",
        description: "Please add at least one key takeaway before continuing.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Key Takeaways</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add the main points or takeaways from your blog post. These will appear as bullet points at the beginning of your article.
        </p>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter a key takeaway"
              value={newTakeaway}
              onChange={(e) => setNewTakeaway(e.target.value)}
              className="bg-black/30 border-white/10 flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTakeaway();
                }
              }}
            />
            <Button 
              type="button" 
              onClick={handleAddTakeaway}
              className="bg-adapty-aqua hover:bg-adapty-aqua/80 text-black"
            >
              <Plus className="h-4 w-4" />
              <span className="ml-1">Add</span>
            </Button>
          </div>
          
          {keyTakeaways.length > 0 ? (
            <div className="border rounded-md border-white/10 overflow-hidden">
              <div className="p-3 bg-black/20 border-b border-white/10">
                <h4 className="font-medium">Current Takeaways</h4>
              </div>
              <ul className="divide-y divide-white/10">
                {keyTakeaways.map((takeaway, index) => (
                  <li 
                    key={index} 
                    className="flex items-center justify-between p-3 hover:bg-black/20 transition-colors"
                  >
                    <span className="flex-1 text-sm">
                      {index + 1}. {takeaway}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleMoveTakeaway(index, 'up')}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleMoveTakeaway(index, 'down')}
                        disabled={index === keyTakeaways.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:text-red-500"
                        onClick={() => handleRemoveTakeaway(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="border border-dashed rounded-md border-white/10 p-6">
              <p className="text-center text-muted-foreground">
                No takeaways added yet. Add your first one above.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={handleContinue}
          disabled={keyTakeaways.length === 0}
          className="bg-adapty-aqua hover:bg-adapty-aqua/80 text-black"
        >
          Continue to Blog Content
        </Button>
      </div>
    </div>
  );
};
