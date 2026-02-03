import { useRef, useEffect } from 'react';
import { ChatMessage, TypingIndicator } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { WelcomeScreen } from './WelcomeScreen';
import type { Message } from '@/hooks/useChat';

type ChatAreaProps = {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
};

export function ChatArea({ messages, isLoading, onSendMessage }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {hasMessages ? (
        <>
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="p-4 md:p-6 border-t border-border">
            <div className="max-w-3xl mx-auto">
              <ChatInput onSend={onSendMessage} isLoading={isLoading} />
            </div>
          </div>
        </>
      ) : (
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