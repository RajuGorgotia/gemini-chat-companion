import { ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SatisfactionPopupProps = {
  appName: string;
  onLike: () => void;
  onDislike: () => void;
  onDismiss: () => void;
};

export function SatisfactionPopup({ appName, onLike, onDislike, onDismiss }: SatisfactionPopupProps) {
  return (
    <div className="flex items-center gap-3 bg-secondary border border-border rounded-full px-4 py-2 shadow-md animate-fade-in">
      <span className="text-sm text-secondary-foreground">
        Are you satisfied with {appName}'s answer?
      </span>
      <Button variant="outline" size="sm" className="rounded-full gap-1.5 h-8" onClick={onLike}>
        <ThumbsUp className="h-3.5 w-3.5" /> Like
      </Button>
      <Button variant="outline" size="sm" className="rounded-full gap-1.5 h-8" onClick={onDislike}>
        <ThumbsDown className="h-3.5 w-3.5" /> Dislike
      </Button>
      <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
