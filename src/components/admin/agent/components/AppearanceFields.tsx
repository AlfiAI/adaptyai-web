
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormValues } from '../schema';

export const AppearanceFields = () => {
  const { control, watch } = useFormContext<FormValues>();
  const themeColor = watch('themeColor');

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
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
        control={control}
        name="themeColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Theme Color</FormLabel>
            <FormControl>
              <div className="flex space-x-2">
                <Input {...field} />
                <div 
                  className="w-10 h-10 rounded border" 
                  style={{ backgroundColor: themeColor }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
