
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  glowing?: boolean;
  className?: string;
}

const Card = ({ children, glowing = false, className = '' }: CardProps) => {
  return (
    <div 
      className={`
        bg-black/30 backdrop-blur-sm 
        p-6 rounded-lg border border-white/10 
        ${glowing ? 'glow-border animate-pulse-glow' : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
