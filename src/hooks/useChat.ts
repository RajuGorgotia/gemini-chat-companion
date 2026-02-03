import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

export type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  const createConversation = async (firstMessage: string) => {
    const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '');
    const { data, error } = await supabase
      .from('conversations')
      .insert({ title })
      .select()
      .single();
    
    if (error) throw error;
    setCurrentConversation(data);
    return data;
  };

  const saveMessage = async (conversationId: string, role: 'user' | 'assistant', content: string) => {
    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, role, content })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const updatePopularPrompt = async (prompt: string) => {
    const normalizedPrompt = prompt.toLowerCase().trim().slice(0, 100);
    
    const { data: existing } = await supabase
      .from('popular_prompts')
      .select()
      .eq('prompt', normalizedPrompt)
      .single();

    if (existing) {
      await supabase
        .from('popular_prompts')
        .update({ search_count: existing.search_count + 1 })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('popular_prompts')
        .insert({ prompt: normalizedPrompt });
    }
  };

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    
    try {
      let conversation = currentConversation;
      if (!conversation) {
        conversation = await createConversation(input);
      }

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: input,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      await saveMessage(conversation.id, 'user', input);
      await updatePopularPrompt(input);

      const allMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let textBuffer = '';

      const assistantMessageId = crypto.randomUUID();
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
      }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => 
                prev.map(m => m.id === assistantMessageId 
                  ? { ...m, content: assistantContent }
                  : m
                )
              );
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      if (assistantContent) {
        await saveMessage(conversation.id, 'assistant', assistantContent);
      }

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentConversation, isLoading]);

  const loadConversation = async (conversationId: string) => {
    const { data: conversation } = await supabase
      .from('conversations')
      .select()
      .eq('id', conversationId)
      .single();

    const { data: msgs } = await supabase
      .from('messages')
      .select()
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (conversation) setCurrentConversation(conversation);
    if (msgs) setMessages(msgs as Message[]);
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentConversation(null);
  };

  return {
    messages,
    isLoading,
    currentConversation,
    sendMessage,
    loadConversation,
    startNewChat,
  };
}