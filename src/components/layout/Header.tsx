
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Users, BookOpen, Phone, MessageSquare, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { label: 'AI Agents', icon: <Users className="h-4 w-4" />, href: '/agents' },
    { label: 'Blog', icon: <BookOpen className="h-4 w-4" />, href: '/blog' },
    { label: 'Contact', icon: <MessageSquare className="h-4 w-4" />, href: '/contact' },
    { label: 'Schedule', icon: <Phone className="h-4 w-4" />, href: '/schedule' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isLinkActive = (path: string) => {
    // Check if the current path starts with the given path (for nested routes)
    // Special case for home page
    if (path === '/' && location.pathname === '/') return true;
    // For other pages, check if pathname starts with the path (e.g. /blog/something should highlight /blog)
    return path !== '/' && location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <img
            src="/favicon.ico" 
            alt="Adapty AI Logo"
            width={32}
            height={32}
            className="rounded-sm"
          />
          <span className="text-xl font-bold text-adapty-aqua">Adapty AI</span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`group flex items-center text-sm font-medium transition-colors hover:text-adapty-aqua relative px-1 py-2 ${
                  isLinkActive(item.href) ? 'text-adapty-aqua' : 'text-gray-300'
                }`}
              >
                <span className="flex items-center gap-1">
                  {item.icon}
                  {item.label}
                </span>
                <span
                  className={`absolute inset-x-0 bottom-0 h-0.5 bg-adapty-aqua scale-x-0 transition-transform group-hover:scale-x-100 duration-300 ${
                    isLinkActive(item.href) ? 'scale-x-100' : ''
                  }`}
                />
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-adapty-aqua/50 hover:border-adapty-aqua focus:ring-adapty-aqua"
                >
                  {user.email?.charAt(0).toUpperCase() || 'A'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-56">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate('/admin')}
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/auth')}
              className="gap-1 hover:bg-adapty-aqua/10 hover:text-adapty-aqua hidden md:flex"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          )}

          <Button
            variant="default"
            size="sm"
            className="hidden md:flex"
            onClick={() => navigate('/schedule')}
          >
            Schedule a Call
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-black/90 backdrop-blur-md md:hidden">
          <nav className="container flex flex-col gap-6 p-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2 text-lg font-medium ${
                  isLinkActive(item.href) ? 'text-adapty-aqua' : 'text-gray-200'
                }`}
                onClick={closeMenu}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent my-2"></div>
            
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-lg font-medium text-gray-200"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Button variant="destructive" onClick={handleLogout}>
                  Log Out
                </Button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-2 text-lg font-medium text-adapty-aqua"
                onClick={closeMenu}
              >
                <LogIn className="h-5 w-5" />
                Login
              </Link>
            )}
            
            <Button variant="default" className="mt-2" onClick={() => { 
              navigate('/schedule');
              closeMenu();
            }}>
              Schedule a Call
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
