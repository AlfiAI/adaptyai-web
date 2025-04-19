
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PageContainer from '@/components/layout/PageContainer';
import Section from '@/components/layout/Section';

const NotFound = () => {
  return (
    <PageContainer>
      <Section className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl font-bold glow-text mb-6">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
          <Button 
            className="bg-adapty-aqua text-black hover:bg-adapty-aqua/80"
            asChild
          >
            <Link to="/">
              Return to Home
            </Link>
          </Button>
        </div>
      </Section>
    </PageContainer>
  );
};

export default NotFound;
