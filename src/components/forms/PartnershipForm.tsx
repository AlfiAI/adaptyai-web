
import { useState } from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SuccessMessage from '@/components/feedback/SuccessMessage';

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  partnershipType: z.string({
    required_error: "Please select a partnership type",
  }),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type PartnershipFormValues = z.infer<typeof formSchema>;

const partnershipTypes = [
  { value: "technology", label: "Technology Partnership" },
  { value: "research", label: "Research Collaboration" },
  { value: "commercial", label: "Commercial Partnership" },
  { value: "investment", label: "Investment Opportunity" },
  { value: "other", label: "Other" },
];

const PartnershipForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<PartnershipFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      companyName: "",
      partnershipType: "",
      message: "",
    },
  });

  const onSubmit = async (values: PartnershipFormValues) => {
    setIsSubmitting(true);
    try {
      // Store partnership request in Supabase
      const { error } = await supabase
        .from('partnership_requests')
        .insert({
          name: values.name,
          email: values.email,
          company_name: values.companyName,
          partnership_type: values.partnershipType,
          message: values.message,
          submitted_at: new Date().toISOString(),
          status: 'pending'
        });

      if (error) throw error;
      
      setIsSuccess(true);
      toast({
        title: "Request submitted successfully!",
        description: "We'll review your partnership request and get back to you soon.",
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
    <div className="w-full mx-auto">
      {isSuccess ? (
        <SuccessMessage
          title="Partnership Request Received!"
          description="Thank you for your interest in partnering with Adapty AI. Our team will review your submission and get back to you soon."
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
                      placeholder="Enter your full name"
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
            
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Company Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-black/30 border-white/10 focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)]"
                      placeholder="Enter your company name"
                      autoComplete="organization"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="partnershipType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Partnership Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-black/30 border-white/10 focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)]">
                        <SelectValue placeholder="Select partnership type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-adapty-darker border-white/10">
                      {partnershipTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="bg-black/30 border-white/10 focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)] min-h-[120px] resize-y"
                      placeholder="Tell us about your partnership interests and how we can collaborate..."
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
                  Submitting...
                </>
              ) : (
                'Submit Partnership Request'
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default PartnershipForm;
