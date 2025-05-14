
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormValues } from '../schema';

export const DescriptionFields = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
    </>
  );
};
