import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { submitScheduleBooking } from '@/services/firebaseService';
import FormInput from '@/components/forms/FormInput';
import FormSelect from '@/components/forms/FormSelect';

interface ScheduleFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  topic: string;
}

interface ScheduleFormProps {
  selectedDate: string | null;
  selectedTime: string | null;
}

const topicOptions = [
  { value: "Custom AI Solutions", label: "Custom AI Solutions" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Natural Language Processing", label: "Natural Language Processing" },
  { value: "AI Consulting", label: "AI Consulting" },
  { value: "AI Integration", label: "AI Integration" },
  { value: "Other", label: "Other" }
];

const ScheduleForm: React.FC<ScheduleFormProps> = ({ selectedDate, selectedTime }) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    topic: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleTopicChange = (value: string) => {
    setFormData(prevData => ({
      ...prevData,
      topic: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select a date and time",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await submitScheduleBooking({
        ...formData,
        date: selectedDate,
        time: selectedTime
      });
      
      setIsSuccess(true);
      toast({
        title: "Call Scheduled!",
        description: "We look forward to speaking with you.",
      });
      
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          topic: ''
        });
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error scheduling call:', error);
      toast({
        title: "Couldn't schedule call",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-full p-6">
      <h2 className="text-2xl font-semibold mb-6">Your Details</h2>
      
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
          <h3 className="text-xl font-semibold mb-2">Call Scheduled!</h3>
          <p className="text-gray-400">We look forward to speaking with you soon.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <FormInput
            id="phone"
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
          
          <FormSelect
            id="topic"
            label="Topic"
            value={formData.topic}
            onChange={handleTopicChange}
            options={topicOptions}
            required
          />
          
          <div className="py-4">
            <h3 className="text-lg font-medium mb-2">Selected Slot</h3>
            {selectedDate && selectedTime ? (
              <p className="text-adapty-aqua">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })} at {selectedTime}
              </p>
            ) : (
              <p className="text-gray-400">Please select a date and time</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-adapty-aqua text-black hover:bg-adapty-aqua/80 animate-pulse-glow"
            disabled={!selectedDate || !selectedTime || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Schedule Call'
            )}
          </Button>
        </form>
      )}
    </Card>
  );
};

export default ScheduleForm;
