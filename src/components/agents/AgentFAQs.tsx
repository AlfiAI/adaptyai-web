
import React from 'react';
import { AgentFaq } from '@/lib/dataAccess/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AgentFAQsProps {
  faqs: AgentFaq[];
  isLoading?: boolean;
}

export const AgentFAQs: React.FC<AgentFAQsProps> = ({ faqs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4 my-6">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-14 bg-muted/30 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!faqs || faqs.length === 0) {
    return (
      <div className="space-y-4 my-6">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <p className="text-muted-foreground italic">No FAQs available at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 my-6">
      <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p className="whitespace-pre-wrap">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default AgentFAQs;
