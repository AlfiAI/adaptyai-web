
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-md py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/52771ff6-9f17-4730-b5a2-2a88e3487edc.png" 
            alt="Adapty AI Logo" 
            className="h-10 w-auto" 
          />
          <span className="text-xl font-bold glow-text">Adapty AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:glow-text transition-all">
            Home
          </Link>
          <Link to="/#about" className="text-white hover:glow-text transition-all">
            About
          </Link>
          <Link to="/#services" className="text-white hover:glow-text transition-all">
            What We Do
          </Link>
          <Link to="/blog" className="text-white hover:glow-text transition-all">
            Blog
          </Link>
          <Link to="/contact" className="text-white hover:glow-text transition-all">
            Contact
          </Link>
          <Link to="/schedule">
            <Button 
              variant="outline" 
              className="border-adapty-aqua text-adapty-aqua bg-transparent hover:bg-adapty-aqua/10 animate-pulse-glow"
            >
              Schedule a Call
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-lg">
          <div className="container py-4 flex flex-col space-y-4">
            <Link to="/" className="text-white hover:glow-text transition-all">
              Home
            </Link>
            <Link to="/#about" className="text-white hover:glow-text transition-all">
              About
            </Link>
            <Link to="/#services" className="text-white hover:glow-text transition-all">
              What We Do
            </Link>
            <Link to="/blog" className="text-white hover:glow-text transition-all">
              Blog
            </Link>
            <Link to="/contact" className="text-white hover:glow-text transition-all">
              Contact
            </Link>
            <Link to="/schedule">
              <Button 
                variant="outline" 
                className="w-full border-adapty-aqua text-adapty-aqua bg-transparent hover:bg-adapty-aqua/10 animate-pulse-glow"
              >
                Schedule a Call
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
