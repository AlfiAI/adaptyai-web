
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { agentTypes } from '../schema';
import { FormValues } from '../schema';

interface BasicInfoFieldsProps {
  generateSlug: () => void;
}

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ generateSlug }) => {
  const { control } = useFormContext<FormValues>();

  return (
    <>
      <FormField
        control={control}
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
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
    </>
  );
};
