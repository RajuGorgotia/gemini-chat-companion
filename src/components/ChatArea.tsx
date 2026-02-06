import { useRef, useEffect, useState } from 'react';
import { ChatMessage, TypingIndicator } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { WelcomeScreen } from './WelcomeScreen';
import { SatisfactionPopup } from './SatisfactionPopup';
import { FeedbackDialog } from './FeedbackDialog';
import type { Message } from '@/hooks/useChat';
import { usePluginSettings } from '@/hooks/usePluginSettings';

type ChatAreaProps = {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onRegenerate?: () => void;
  onEditAndResend?: (messageId: string, newContent: string) => void;
};

export function ChatArea({ messages, isLoading, onSendMessage, onRegenerate, onEditAndResend }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;
  const { selectedPlugin } = usePluginSettings();
  const [showSatisfaction, setShowSatisfaction] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [prevMessageCount, setPrevMessageCount] = useState(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show satisfaction popup when a new assistant message completes
  useEffect(() => {
    if (messages.length > prevMessageCount && !isLoading) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === 'assistant' && lastMsg.content) {
        setShowSatisfaction(true);
      }
    }
    setPrevMessageCount(messages.length);
  }, [messages.length, isLoading]);

  const lastAssistantIdx = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') return i;
    }
    return -1;
  })();

  const handleFeedbackSubmit = (issueType: string, details: string) => {
    console.log('Feedback submitted:', { issueType, details });
    // Could persist to DB
  };

  const chatContent = (
    <>
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message, idx) => (
            <ChatMessage
              key={message.id}
              message={message}
              isLastAssistant={idx === lastAssistantIdx}
              onRegenerate={idx === lastAssistantIdx ? onRegenerate : undefined}
              onThumbsUp={() => setShowSatisfaction(false)}
              onThumbsDown={() => { setShowSatisfaction(false); setFeedbackOpen(true); }}
              onEditAndResend={message.role === 'user' ? (newContent) => onEditAndResend?.(message.id, newContent) : undefined}
            />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Satisfaction popup */}
      {showSatisfaction && !isLoading && (
        <div className="flex justify-center py-2">
          <SatisfactionPopup
            appName={selectedPlugin.name}
            onLike={() => setShowSatisfaction(false)}
            onDislike={() => { setShowSatisfaction(false); setFeedbackOpen(true); }}
            onDismiss={() => setShowSatisfaction(false)}
          />
        </div>
      )}

      <div className="p-4 md:p-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={onSendMessage} isLoading={isLoading} />
        </div>
      </div>

      <FeedbackDialog
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </>
  );

  return (
    <div className="flex-1 flex flex-col h-full">
      {hasMessages ? chatContent : (
        <>
          <WelcomeScreen onSelectPrompt={onSendMessage} />
          <div className="p-4 md:p-6 border-t border-border">
            <div className="max-w-3xl mx-auto">
              <ChatInput onSend={onSendMessage} isLoading={isLoading} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
