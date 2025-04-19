
import { motion } from 'framer-motion';
import Section from '@/components/layout/Section';

const AboutSection = () => {
  return (
    <Section id="about" className="bg-gradient-to-b from-adapty-darker to-adapty-dark">
      <motion.div 
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-adapty-purple drop-shadow-[0_0_5px_rgba(177,156,255,0.7)]">
          A Human-Led, AI-Powered Evolution
        </h2>
        <motion.p 
          className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Adapty AI is a next-generation AI company designing autonomous, ethical intelligence systems that empower industries to self-adapt, grow, and evolve.
        </motion.p>
        <motion.p 
          className="text-lg text-gray-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          We blend human-centered design, empathy, and automation to unlock intelligent possibilities that are scalable, sustainable, and radically transformative.
        </motion.p>
      </motion.div>
    </Section>
  );
};

export default AboutSection;
