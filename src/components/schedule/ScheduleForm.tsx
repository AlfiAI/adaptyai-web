import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { submitScheduleBooking } from '@/services/firebaseService';
import SuccessMessage from '@/components/feedback/SuccessMessage';
import ScheduleFormFields from './ScheduleFormFields';

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
    topic: '_default'
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
    
    if (formData.topic === '_default') {
      toast({
        title: "Please select a topic",
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
          topic: '_default'
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
        <SuccessMessage 
          title="Call Scheduled!"
          description="We look forward to speaking with you soon."
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <ScheduleFormFields
            formData={formData}
            handleChange={handleChange}
            handleTopicChange={handleTopicChange}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            topicOptions={topicOptions}
          />
          
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
