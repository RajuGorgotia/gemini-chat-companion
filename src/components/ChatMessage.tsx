import { User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import type { Message } from '@/hooks/useChat';

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div 
      className={cn(
        "flex gap-4 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-gradient-to-br from-primary to-accent text-white"
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>
      
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3",
        isUser 
          ? "bg-primary text-primary-foreground rounded-br-md" 
          : "bg-secondary text-secondary-foreground rounded-bl-md"
      )}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-4 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}