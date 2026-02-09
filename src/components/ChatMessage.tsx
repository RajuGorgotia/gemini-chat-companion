import { useState } from 'react';
import { User, Sparkles, RefreshCw, Copy, ThumbsUp, ThumbsDown, Check, Pencil, ChevronRight, ChevronDown, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import type { Message } from '@/hooks/useChat';
import { toast } from '@/hooks/use-toast';

function CollapsibleSqlBlock({ children }: { children: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-2 border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary/50 transition-colors"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <Code className="h-3.5 w-3.5" />
        <span>View SQL Query</span>
      </button>
      {open && (
        <pre className="px-4 py-3 bg-muted/50 text-xs overflow-x-auto border-t border-border">
          <code>{children}</code>
        </pre>
      )}
    </div>
  );
}

type ChatMessageProps = {
  message: Message;
  onRegenerate?: () => void;
  onThumbsUp?: () => void;
  onThumbsDown?: () => void;
  onEditAndResend?: (newContent: string) => void;
  isLastAssistant?: boolean;
};

export function ChatMessage({ message, onRegenerate, onThumbsUp, onThumbsDown, onEditAndResend, isLastAssistant }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(message.content);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast({ title: 'Copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditSubmit = () => {
    if (editValue.trim() && editValue !== message.content) {
      onEditAndResend?.(editValue.trim());
    }
    setEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSubmit();
    }
    if (e.key === 'Escape') {
      setEditing(false);
      setEditValue(message.content);
    }
  };

  return (
    <div 
      className={cn(
        "group flex gap-4 animate-fade-in",
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
      
      <div className="max-w-[80%] flex flex-col gap-1">
        <div className={cn(
          "rounded-2xl px-4 py-3",
          isUser 
            ? "bg-primary text-primary-foreground rounded-br-md" 
            : "bg-secondary text-secondary-foreground rounded-bl-md"
        )}>
          {isUser ? (
            editing ? (
              <textarea
                className="w-full bg-transparent border-none outline-none resize-none text-primary-foreground min-h-[1.5em]"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={handleEditSubmit}
                autoFocus
                rows={Math.max(1, editValue.split('\n').length)}
              />
            ) : (
              <div className="flex items-start gap-2">
                <p className="whitespace-pre-wrap flex-1">{message.content}</p>
                {onEditAndResend && (
                  <button
                    onClick={() => { setEditing(true); setEditValue(message.content); }}
                    className="opacity-0 group-hover:opacity-100 shrink-0 mt-0.5 transition-opacity hover:text-primary-foreground/80"
                    title="Edit message"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  pre({ children }) {
                    return <>{children}</>;
                  },
                  code({ className, children }) {
                    const lang = className?.replace('language-', '') || '';
                    const text = String(children).replace(/\n$/, '');
                    if (lang === 'sql') {
                      return <CollapsibleSqlBlock>{text}</CollapsibleSqlBlock>;
                    }
                    return (
                      <pre className="my-2 px-4 py-3 bg-muted/50 text-xs overflow-x-auto rounded-lg border border-border">
                        <code>{text}</code>
                      </pre>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Action icons for assistant messages */}
        {!isUser && message.content && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
            {onRegenerate && isLastAssistant && (
              <button onClick={onRegenerate} className="p-1 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="Regenerate">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            )}
            <button onClick={handleCopy} className="p-1 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="Copy">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            {onThumbsUp && (
              <button onClick={onThumbsUp} className="p-1 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="Good response">
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>
            )}
            {onThumbsDown && (
              <button onClick={onThumbsDown} className="p-1 rounded hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground" title="Bad response">
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>
            )}
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
