
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Placeholder blog data
const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI in Business',
    excerpt: 'Artificial intelligence is transforming how businesses operate, from customer service to product development...',
    date: 'April 15, 2025',
    author: 'Dr. Sarah Chen',
    category: 'Technology',
    image: '/placeholder.svg'
  },
  {
    id: 2,
    title: 'Ethical Considerations in AI Development',
    excerpt: "As AI systems become more powerful, it's crucial that we address the ethical implications of their deployment...",
    date: 'April 10, 2025',
    author: 'James Wilson',
    category: 'Ethics',
    image: '/placeholder.svg'
  },
  {
    id: 3,
    title: 'Machine Learning: A Primer',
    excerpt: 'Understanding the basics of machine learning can help businesses identify opportunities for AI implementation...',
    date: 'April 5, 2025',
    author: 'Dr. Michael Rahman',
    category: 'Education',
    image: '/placeholder.svg'
  },
  {
    id: 4,
    title: 'AI and the Future of Work',
    excerpt: 'How will artificial intelligence impact jobs and the workforce? We explore the potential changes and how to prepare...',
    date: 'March 28, 2025',
    author: 'Emily Takahashi',
    category: 'Workforce',
    image: '/placeholder.svg'
  },
  {
    id: 5,
    title: 'Implementing AI in Your Organization',
    excerpt: 'A step-by-step guide to successfully integrating AI solutions into your organization...',
    date: 'March 20, 2025',
    author: 'Carlos Mendez',
    category: 'Implementation',
    image: '/placeholder.svg'
  },
  {
    id: 6,
    title: 'The Role of Data in AI Success',
    excerpt: 'Quality data is the foundation of effective AI systems. Learn how to cultivate and maintain good data practices...',
    date: 'March 15, 2025',
    author: 'Dr. Lisa Johnson',
    category: 'Data Science',
    image: '/placeholder.svg'
  }
];

const Blog = () => {
  return (
    <PageContainer>
      <Section>
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Adapty AI <span className="glow-text">Blog</span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Insights, updates, and thought leadership on artificial intelligence and its applications in business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden flex flex-col">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-48 object-cover mb-4"
              />
              <div className="flex-1 flex flex-col">
                <div className="mb-2 flex justify-between text-sm text-gray-400">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-400 mb-4 flex-1">{post.excerpt}</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
                  <span className="text-sm text-gray-400">By {post.author}</span>
                  <Button variant="ghost" className="text-adapty-aqua hover:text-adapty-aqua/80 p-0">
                    Read More
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="border-adapty-aqua text-adapty-aqua hover:bg-adapty-aqua/10">
            Load More Articles
          </Button>
        </div>
      </Section>
    </PageContainer>
  );
};

export default Blog;
