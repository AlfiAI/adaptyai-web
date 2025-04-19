
import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

const PageContainer = ({ children, className = '' }: PageContainerProps) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Extract the hash from the location
  useEffect(() => {
    if (location.hash) {
      // Wait for a moment to ensure the DOM is fully rendered
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [location.hash]);

  return (
    <main className={`min-h-screen pt-20 animate-fade-in ${className}`}>
      {children}
    </main>
  );
};

export default PageContainer;
