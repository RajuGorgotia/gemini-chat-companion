import { Sparkles } from 'lucide-react';
import { PredefinedPrompts } from './PredefinedPrompts';

type WelcomeScreenProps = {
  onSelectPrompt: (prompt: string) => void;
};

export function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-accent to-destructive flex items-center justify-center shadow-lg animate-pulse-glow">
          <Sparkles className="h-8 w-8 text-primary-foreground" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-center">
        <span className="gradient-text">Hello, how can I help?</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-12 text-center max-w-xl">
        I'm your AI assistant powered by advanced language models. Ask me anything or try one of the prompts below.
      </p>

      {/* Predefined Prompts */}
      <div className="w-full max-w-4xl">
        <h2 className="text-sm font-medium text-muted-foreground mb-4 text-center uppercase tracking-wider">
          Try these prompts
        </h2>
        <PredefinedPrompts onSelectPrompt={onSelectPrompt} />
      </div>
    </div>
  );
}