
import { motion } from 'framer-motion';
import Section from '@/components/layout/Section';
import EthosCard from '@/components/cards/EthosCard';

const EthosSection = () => {
  const ethosValues = [
    {
      title: "Ethical by Design",
      description: "We believe in AI that protects, uplifts, and empowers — not replaces."
    },
    {
      title: "Sustainably Scalable",
      description: "We build systems that evolve, learn, and grow with the industries they serve."
    },
    {
      title: "Emotionally Intelligent",
      description: "Our AI understands humans — not just data."
    }
  ];

  return (
    <Section id="ethos" className="bg-adapty-darker relative overflow-hidden">
      {/* Animated background ripple */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-radial from-adapty-aqua/10 to-transparent animate-pulse-slow"></div>
      </div>
      
      <div className="relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            The Adapty <span className="glow-text">Ethos</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our core values guide everything we do, from how we design our AI to how we interact with our partners and clients.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {ethosValues.map((value, index) => (
            <EthosCard
              key={index}
              title={value.title}
              description={value.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default EthosSection;
