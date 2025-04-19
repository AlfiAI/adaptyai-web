import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm } from '@/services/firebaseService';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import ContactFormFields from './ContactFormFields';

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
        <SuccessMessage 
          title="Thanks for reaching out!"
          description="We'll get back to you as soon as possible."
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <ContactFormFields
            formData={formData}
            handleChange={handleChange}
          />
          
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
