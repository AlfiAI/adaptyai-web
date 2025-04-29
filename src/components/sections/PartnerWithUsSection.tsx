
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Section from '@/components/layout/Section';
import PartnershipForm from '@/components/forms/PartnershipForm';
import { Card } from "@/components/ui/card";

const PartnerWithUsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <Section id="partner-with-us" className="bg-gradient-radial py-20">
      <motion.div 
        ref={ref}
        className="container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          variants={childVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Partner <span className="glow-text">With Us</span>
          </h2>
          <p className="text-gray-300 mb-8">
            We're always looking for strategic partnerships to advance ethical AI development and implementation.
            Whether you're a technology provider, researcher, or business looking to leverage AI, let's collaborate.
          </p>
        </motion.div>
        
        <motion.div
          variants={childVariants}
          className="max-w-2xl mx-auto"
        >
          <Card className="p-6 bg-black/30 border-white/10">
            <PartnershipForm />
          </Card>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default PartnerWithUsSection;
