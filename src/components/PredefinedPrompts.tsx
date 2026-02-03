import { BookOpen, Lightbulb, Code, FileText, Sparkles, Calendar, Globe, ChefHat } from 'lucide-react';
import { usePrompts, PredefinedPrompt } from '@/hooks/usePrompts';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Lightbulb,
  Code,
  FileText,
  Sparkles,
  Calendar,
  Globe,
  ChefHat,
};

type PredefinedPromptsProps = {
  onSelectPrompt: (prompt: string) => void;
};

export function PredefinedPrompts({ onSelectPrompt }: PredefinedPromptsProps) {
  const { predefinedPrompts, isLoading } = usePrompts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 shimmer rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {predefinedPrompts.map((prompt) => {
        const IconComponent = prompt.icon ? iconMap[prompt.icon] : Sparkles;
        
        return (
          <button
            key={prompt.id}
            onClick={() => onSelectPrompt(prompt.prompt)}
            className="prompt-card text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 text-primary group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-sm mb-1">{prompt.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{prompt.prompt}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}