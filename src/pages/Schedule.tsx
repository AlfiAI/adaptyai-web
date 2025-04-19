
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { submitScheduleBooking } from '@/services/firebaseService';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', 
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
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
      // Submit to Firestore
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
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          topic: ''
        });
        setSelectedDate(null);
        setSelectedTime(null);
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
  
  // Generate the next 14 days for the calendar
  const getDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <PageContainer>
      <Section>
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Schedule a <span className="glow-text">Call</span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Book a call with our AI experts to discuss how Adapty AI can help transform your business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full p-6">
              <h2 className="text-2xl font-semibold mb-6">Select a Date & Time</h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Available Dates</h3>
                <div className="grid grid-cols-7 gap-2">
                  {getDates().map((date, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                      className={`
                        p-2 rounded-md text-center transition-all duration-300
                        ${selectedDate === date.toISOString().split('T')[0] 
                          ? 'bg-adapty-aqua text-black shadow-[0_0_10px_rgba(0,255,247,0.5)]' 
                          : 'bg-black/30 hover:bg-adapty-aqua/20'
                        }
                      `}
                    >
                      <div className="text-xs">{formatDay(date)}</div>
                      <div className="font-semibold">{formatDate(date)}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-lg font-medium mb-4">Available Times</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {timeSlots.map((time, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          p-2 rounded-md text-center transition-all duration-300
                          ${selectedTime === time 
                            ? 'bg-adapty-aqua text-black shadow-[0_0_10px_rgba(0,255,247,0.5)]' 
                            : 'bg-black/30 hover:bg-adapty-aqua/20'
                          }
                        `}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
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
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)]"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-1">
                      Topic
                    </label>
                    <select
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-md focus:outline-none focus:border-adapty-aqua focus:shadow-[0_0_10px_rgba(0,255,247,0.25)]"
                    >
                      <option value="">Select a topic</option>
                      <option value="Custom AI Solutions">Custom AI Solutions</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Natural Language Processing">Natural Language Processing</option>
                      <option value="AI Consulting">AI Consulting</option>
                      <option value="AI Integration">AI Integration</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
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
          </motion.div>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Schedule;
