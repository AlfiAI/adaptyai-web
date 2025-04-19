
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

interface EthosCardProps {
  title: string;
  description: string;
  index: number;
}

const EthosCard = ({ title, description, index }: EthosCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      className="w-full md:w-1/3"
    >
      <Card className="h-full backdrop-blur-sm bg-black/30 border-adapty-darker hover:border-adapty-aqua/30 transition-all duration-300">
        {/* Desktop Version */}
        <div className="hidden md:flex flex-col p-6 h-full">
          <h3 className="text-xl font-semibold mb-3 text-adapty-purple">
            {title}
          </h3>
          <p className="text-gray-400">
            {description}
          </p>
        </div>
        
        {/* Mobile Version with Accordion */}
        <div className="md:hidden">
          <Accordion type="single" collapsible>
            <AccordionItem value={`ethos-${index}`} className="border-none">
              <AccordionTrigger className="px-6 py-4 text-xl font-semibold text-adapty-purple hover:text-adapty-aqua">
                {title}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-400">
                {description}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Card>
    </motion.div>
  );
};

export default EthosCard;
