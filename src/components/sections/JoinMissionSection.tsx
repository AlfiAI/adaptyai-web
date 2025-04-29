
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Section from '@/components/layout/Section';
import NewsletterForm from '@/components/forms/NewsletterForm';
import { Card } from "@/components/ui/card";

const JoinMissionSection = () => {
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
    <Section id="join-mission" className="bg-gradient-radial py-20">
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
            Join Our <span className="glow-text">Mission</span>
          </h2>
          <p className="text-gray-300 mb-8">
            Stay updated with the latest in adaptive AI and be the first to know about our innovations and developments.
            Join our newsletter for exclusive insights, updates, and ethical AI resources.
          </p>
        </motion.div>
        
        <motion.div
          variants={childVariants}
          className="max-w-md mx-auto"
        >
          <Card className="p-6 bg-black/30 border-white/10">
            <NewsletterForm />
          </Card>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default JoinMissionSection;
