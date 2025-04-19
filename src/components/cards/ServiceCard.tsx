
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
}

const ServiceCard = ({ icon, title, description, index }: ServiceCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6,
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div variants={cardVariants}>
      <Card className="p-6 h-full backdrop-blur-sm bg-black/30 border-adapty-darker hover:border-adapty-aqua/30 transition-all duration-300 group">
        <div className="text-adapty-aqua mb-4 group-hover:animate-pulse-glow">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-adapty-aqua transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400">
          {description}
        </p>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
