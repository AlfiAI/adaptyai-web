
import { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  title?: string; // Added title prop
}

const Section = ({ id, children, className = '', title }: SectionProps) => {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="container">
        {title && <h2 className="text-3xl font-bold mb-8">{title}</h2>}
        {children}
      </div>
    </section>
  );
};

export default Section;
