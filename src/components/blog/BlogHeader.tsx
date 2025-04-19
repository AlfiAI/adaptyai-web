
import { motion } from 'framer-motion';

const BlogHeader = () => {
  return (
    <motion.div 
      className="text-center mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Adapty AI <span className="glow-text">Blog</span>
      </h1>
      <p className="text-gray-300 max-w-3xl mx-auto">
        Insights, updates, and thought leadership on artificial intelligence and its applications in business.
      </p>
    </motion.div>
  );
};

export default BlogHeader;
