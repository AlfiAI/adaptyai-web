
import { useState } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SuccessMessage from '@/components/feedback/SuccessMessage';

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterFormValues = z.infer<typeof formSchema>;

const NewsletterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (values: NewsletterFormValues) => {
    setIsSubmitting(true);
    try {
      // Store subscriber in Supabase
      const { error } = await supabase
        .from('subscribers')
        .insert({
          name: values.name,
          email: values.email,
          subscribed_at: new Date().toISOString(),
          is_confirmed: false,
          source: 'newsletter_form'
        });

      if (error) throw error;

      // Would trigger a confirmation email here in a real implementation
      // For now, we'll just show a success message
      
      setIsSuccess(true);
      toast({
        title: "Subscription successful!",
        description: "Please check your email to confirm your subscription.",
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {isSuccess ? (
        <SuccessMessage
          title="You're on the list!"
          description="Thank you for subscribing to our newsletter. Please check your email to confirm your subscription."
        />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Your Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-black/30 border-white/10 focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)]"
                      placeholder="Enter your name"
                      autoComplete="name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="bg-black/30 border-white/10 focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)]"
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-adapty-aqua text-black hover:bg-adapty-aqua/80 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Join the Mission'
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default NewsletterForm;
