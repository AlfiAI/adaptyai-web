
import { supabase } from '@/integrations/supabase/client';

// This function can be imported and called once to initialize sample data
export const createBlogSampleData = async () => {
  try {
    // First, check if we already have posts to avoid duplicates
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      throw error;
    }
    
    // If we already have posts, don't add more
    if (count && count > 0) {
      console.log(`${count} blog posts already exist, skipping sample data creation.`);
      return;
    }
    
    // Insert sample blog posts
    const { data, error: insertError } = await supabase
      .from('posts')
      .insert([
        {
          title: 'Getting Started with AI',
          slug: 'getting-started-with-ai',
          excerpt: 'A comprehensive guide to understanding the basics of artificial intelligence.',
          content: '# Getting Started with AI\n\nArtificial intelligence (AI) is rapidly transforming the way we live and work. In this post, we\'ll explore the fundamentals of AI and how you can start incorporating it into your business.\n\n## What is AI?\n\nAI refers to computer systems that can perform tasks that typically require human intelligence. These tasks include:\n\n- Learning from data\n- Recognizing patterns\n- Making decisions\n- Processing natural language\n\n## Types of AI\n\nThere are several different approaches to AI:\n\n1. **Machine Learning**: Systems that learn from data\n2. **Deep Learning**: Neural networks with multiple layers\n3. **Natural Language Processing**: Systems that understand human language\n4. **Computer Vision**: Systems that can "see" and understand images\n\n## Getting Started\n\nIf you\'re new to AI, here are some steps to get started:\n\n1. Identify problems in your business that AI could solve\n2. Start with simple, well-defined projects\n3. Collect and organize your data\n4. Work with experienced AI professionals\n5. Iterate and improve based on results\n\nRemember, the goal is not to implement AI for its own sake, but to solve real problems and create value.',
          cover_image_url: '/placeholder.svg',
          tags: ['ai', 'machine learning', 'beginners'],
          featured: true,
          published_at: new Date().toISOString()
        },
        {
          title: 'The Future of Natural Language Processing',
          slug: 'future-of-nlp',
          excerpt: 'Exploring how NLP is evolving and what to expect in the coming years.',
          content: '# The Future of Natural Language Processing\n\nNatural Language Processing (NLP) has seen remarkable advances in recent years. In this post, we\'ll look at where the field is headed.\n\n## Current State of NLP\n\nToday\'s NLP systems can:\n\n- Generate human-like text\n- Translate between languages\n- Summarize documents\n- Answer questions\n- Extract information from text\n\n## Emerging Trends\n\nSeveral trends are shaping the future of NLP:\n\n### 1. Multimodal Models\n\nFuture NLP systems will integrate text with other modalities like images, video, and audio.\n\n### 2. More Efficient Models\n\nResearchers are working on making models that require less computational resources while maintaining performance.\n\n### 3. Few-Shot Learning\n\nModels that can learn from just a few examples, rather than requiring massive datasets.\n\n### 4. Improved Reasoning\n\nSystems that can perform more complex reasoning and follow multi-step instructions.\n\n## Implications\n\nThese advances will enable new applications like:\n\n- More natural human-computer interaction\n- Better content creation tools\n- More accurate translation and summarization\n- Improved information extraction\n\nThe future of NLP is exciting, with systems becoming increasingly capable of understanding and generating human language.',
          cover_image_url: '/placeholder.svg',
          tags: ['nlp', 'machine learning', 'future'],
          featured: false,
          published_at: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
        },
        {
          title: 'Ethical Considerations in AI Development',
          slug: 'ethical-considerations-ai',
          excerpt: 'Exploring the important ethical questions that arise when developing AI systems.',
          content: '# Ethical Considerations in AI Development\n\nAs AI becomes more powerful, it\'s essential to consider the ethical implications of these technologies.\n\n## Key Ethical Concerns\n\n### Bias and Fairness\n\nAI systems can inherit biases from the data they\'re trained on, leading to unfair outcomes for certain groups.\n\n### Privacy\n\nMany AI systems require large amounts of data, raising concerns about privacy and data protection.\n\n### Transparency\n\nComplex AI systems like deep neural networks can be difficult to interpret, making it hard to understand how they reach their decisions.\n\n### Accountability\n\nWhen AI systems make mistakes, who is responsible? The developers, the users, or the system itself?\n\n### Impact on Employment\n\nAs AI automates more tasks, there\'s concern about job displacement and economic inequality.\n\n## Approaches to Ethical AI\n\n### 1. Diverse Development Teams\n\nIncluding people from diverse backgrounds in AI development can help identify potential biases and ethical issues.\n\n### 2. Transparent Documentation\n\nClearly documenting how systems are developed, what data they use, and their limitations.\n\n### 3. Human Oversight\n\nKeeping humans in the loop for important decisions, rather than fully automating them.\n\n### 4. Impact Assessments\n\nConducting thorough assessments of the potential societal impacts of AI systems before deployment.\n\n### 5. Ongoing Monitoring\n\nContinuously monitoring AI systems for unintended consequences and addressing issues as they arise.\n\n## Conclusion\n\nEthical considerations should be central to AI development, not an afterthought. By proactively addressing these issues, we can build AI systems that benefit humanity while minimizing harm.',
          cover_image_url: '/placeholder.svg',
          tags: ['ethics', 'ai', 'responsible ai'],
          featured: false,
          published_at: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
        }
      ]);

    if (insertError) {
      throw insertError;
    }
    
    console.log('Successfully created blog sample data:', data);
    return data;
  } catch (error) {
    console.error('Error creating blog sample data:', error);
    throw error;
  }
};

// Uncomment this line to run the function when this file is imported
// createBlogSampleData().catch(console.error);
