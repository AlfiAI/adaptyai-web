
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface DateSelectorProps {
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime
}) => {
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

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  return (
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
  );
};

export default DateSelector;
