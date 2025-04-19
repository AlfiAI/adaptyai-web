
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessMessageProps {
  title: string;
  description: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ title, description }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-[350px] text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-16 h-16 bg-adapty-aqua/20 rounded-full flex items-center justify-center mb-4">
        <Check className="h-8 w-8 text-adapty-aqua" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
};

export default SuccessMessage;
