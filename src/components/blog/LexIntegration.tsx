
import { Button } from '@/components/ui/button';

const LexIntegration: React.FC = () => {
  const openLexAssistant = (): void => {
    const lexButton = document.querySelector('button[data-lex-toggle]');
    if (lexButton instanceof HTMLElement) {
      lexButton.click();
    }
  };

  return (
    <div className="mt-20 bg-black/30 border border-adapty-aqua/20 rounded-lg p-8 text-center">
      <h3 className="text-2xl font-semibold mb-4">
        Ask L.E.X. about this topic
      </h3>
      <p className="text-gray-300 mb-4">
        Have questions about the articles? Use our AI assistant to learn more.
      </p>
      <Button 
        className="bg-adapty-aqua text-black hover:bg-adapty-aqua/80 animate-pulse-glow"
        onClick={openLexAssistant}
      >
        <img 
          src="/lovable-uploads/8a61a1a9-32d1-44df-ab93-d4d6dfae9992.png"
          alt="L.E.X. Avatar"
          className="w-5 h-5 mr-2 rounded-full"
        />
        Ask L.E.X.
      </Button>
    </div>
  );
};

export default LexIntegration;
