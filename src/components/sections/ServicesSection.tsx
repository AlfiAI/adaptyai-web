
import { motion } from 'framer-motion';
import { Workflow, Users, ShieldCheck, Leaf, ChartLine, MessageSquareHeart } from 'lucide-react';
import Section from '@/components/layout/Section';
import ServiceCard from '@/components/cards/ServiceCard';

const ServicesSection = () => {
  const services = [
    {
      icon: <Workflow className="h-10 w-10" />,
      title: "AI Workflow Automation",
      description: "End-to-end intelligent automations that scale with your vision."
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Multi-Agent Intelligence",
      description: "Self-improving AI agents that execute, adapt, and optimize."
    },
    {
      icon: <ShieldCheck className="h-10 w-10" />,
      title: "AI-Powered Risk & Cybersecurity",
      description: "Proactive defense powered by predictive intelligence."
    },
    {
      icon: <Leaf className="h-10 w-10" />,
      title: "ESG & Sustainability AI",
      description: "Track, report, and optimize sustainability impact at scale."
    },
    {
      icon: <ChartLine className="h-10 w-10" />,
      title: "Decision Intelligence Systems",
      description: "Real-time operational insight and strategic forecasting."
    },
    {
      icon: <MessageSquareHeart className="h-10 w-10" />,
      title: "Human-Centric AI Design",
      description: "Empathy-first NLP and intuitive AI interfaces."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Section id="services" className="bg-adapty-dark bg-gradient-radial">
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          What <span className="glow-text">We Do</span>
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We build AI systems that are not just intelligent, but also intuitive, ethical, and aligned with human values.
        </motion.p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            description={service.description}
            index={index}
          />
        ))}
      </motion.div>
    </Section>
  );
};

export default ServicesSection;
