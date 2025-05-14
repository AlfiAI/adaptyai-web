
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Plus, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

interface FAQsListProps {
  faqs: FAQ[];
  isLoading: boolean;
  onAddFaq: () => void;
  onEditFaq: (faq: FAQ) => void;
  onDeleteFaq: (faqId: string) => void;
  isDeleting: boolean;
}

export const FAQsList: React.FC<FAQsListProps> = ({
  faqs,
  isLoading,
  onAddFaq,
  onEditFaq,
  onDeleteFaq,
  isDeleting,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-adapty-aqua" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">FAQs</h3>
        <Button size="sm" onClick={onAddFaq}>
          <Plus className="h-4 w-4 mr-1" /> Add FAQ
        </Button>
      </div>
      
      {faqs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          No FAQs added yet. Click the button above to add your first FAQ.
        </p>
      ) : (
        <div className="space-y-2">
          {faqs.sort((a, b) => a.display_order - b.display_order).map((faq) => (
            <Card key={faq.id} className="p-3">
              <div className="flex justify-between items-start">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={faq.id} className="border-none">
                    <AccordionTrigger className="py-1 font-medium text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pl-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="flex space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditFaq(faq)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => onDeleteFaq(faq.id)}
                    disabled={isDeleting}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FAQsList;
