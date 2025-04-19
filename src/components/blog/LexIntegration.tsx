
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
        Ask L.E.X.
      </Button>
    </div>
  );
};

export default LexIntegration;
