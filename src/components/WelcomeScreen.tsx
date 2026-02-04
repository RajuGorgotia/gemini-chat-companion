import { Sparkles } from 'lucide-react';
import { usePluginSettings } from '@/hooks/usePluginSettings';

type WelcomeScreenProps = {
  onSelectPrompt: (prompt: string) => void;
};

export function WelcomeScreen({ onSelectPrompt }: WelcomeScreenProps) {
  const { selectedPlugin } = usePluginSettings();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg animate-pulse-glow">
          <Sparkles className="h-8 w-8 text-primary-foreground" />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-center">
        <span className="gradient-text">Hello, how can I help?</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-2 text-center max-w-xl">
        I'm your AI assistant powered by <span className="text-primary font-medium">{selectedPlugin.name}</span>.
      </p>
      <p className="text-sm text-muted-foreground mb-12 text-center max-w-xl">
        {selectedPlugin.description}
      </p>

      {/* Plugin-specific Prompts */}
      <div className="w-full max-w-4xl">
        <h2 className="text-sm font-medium text-muted-foreground mb-4 text-center uppercase tracking-wider">
          Try these prompts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedPlugin.prompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => onSelectPrompt(prompt.prompt)}
              className="prompt-card text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 text-primary group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">{prompt.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{prompt.prompt}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
