import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm } from '@/services/firebaseService';
import FormInput from '@/components/forms/FormInput';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await submitContactForm(formData);
      setIsSuccess(true);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you soon.",
      });
      
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          company: '',
          message: ''
        });
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Couldn't send message",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full p-6">
      <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
      
      {isSuccess ? (
        <motion.div 
          className="flex flex-col items-center justify-center h-[350px] text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 bg-adapty-aqua/20 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-adapty-aqua" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Thanks for reaching out!</h3>
          <p className="text-gray-400">We'll get back to you as soon as possible.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <FormInput
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <FormInput
            id="company"
            label="Company"
            value={formData.company}
            onChange={handleChange}
          />
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)]"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-adapty-aqua text-black hover:bg-adapty-aqua/80 animate-pulse-glow"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>
        </form>
      )}
    </Card>
  );
};

export default ContactForm;
