
import { useState } from 'react';
import { motion } from 'framer-motion';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import DateSelector from '@/components/schedule/DateSelector';
import ScheduleForm from '@/components/schedule/ScheduleForm';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

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
            <DateSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ScheduleForm
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          </motion.div>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Schedule;
