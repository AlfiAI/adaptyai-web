
import { motion } from 'framer-motion';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactForm from '@/components/contact/ContactForm';

const Contact = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6
      }
    }
  };

  return (
    <PageContainer>
      <Section>
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            variants={fadeInUp}
          >
            Get in <span className="glow-text">Touch</span>
          </motion.h1>
          <motion.p 
            className="text-gray-300 max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Have questions about our AI solutions? Ready to start a project? We're here to help.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactInfo />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Contact;
