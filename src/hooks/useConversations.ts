import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Conversation = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type GroupedConversations = {
  today: Conversation[];
  last7Days: Conversation[];
  last30Days: Conversation[];
  older: Conversation[];
};

function groupConversationsByDate(conversations: Conversation[]): GroupedConversations {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  return conversations.reduce<GroupedConversations>(
    (groups, conv) => {
      const convDate = new Date(conv.created_at);
      
      if (convDate >= today) {
        groups.today.push(conv);
      } else if (convDate >= last7Days) {
        groups.last7Days.push(conv);
      } else if (convDate >= last30Days) {
        groups.last30Days.push(conv);
      } else {
        groups.older.push(conv);
      }
      
      return groups;
    },
    { today: [], last7Days: [], last30Days: [], older: [] }
  );
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [groupedConversations, setGroupedConversations] = useState<GroupedConversations>({
    today: [],
    last7Days: [],
    last30Days: [],
    older: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchConversations = async () => {
    setIsLoading(true);
    const { data, error, count } = await supabase
      .from('conversations')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setConversations(data);
      setGroupedConversations(groupConversationsByDate(data));
      setTotalCount(count || 0);
    }
    setIsLoading(false);
  };

  const deleteConversation = async (id: string) => {
    await supabase.from('conversations').delete().eq('id', id);
    await fetchConversations();
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    groupedConversations,
    isLoading,
    totalCount,
    fetchConversations,
    deleteConversation,
  };
}