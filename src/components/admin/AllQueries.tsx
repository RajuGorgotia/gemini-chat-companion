import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

type QueryRow = {
  id: string;
  conversation_id: string;
  user_message: string;
  assistant_response: string;
  created_at: string;
};

export function AllQueries() {
  const [queries, setQueries] = useState<QueryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    // Fetch all user messages with their assistant responses
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (messages) {
      // Group by conversation: pair user messages with the next assistant response
      const paired: QueryRow[] = [];
      const byConvo: Record<string, typeof messages> = {};

      for (const msg of messages) {
        if (!byConvo[msg.conversation_id]) byConvo[msg.conversation_id] = [];
        byConvo[msg.conversation_id].push(msg);
      }

      for (const convoId of Object.keys(byConvo)) {
        const convoMsgs = byConvo[convoId].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        for (let i = 0; i < convoMsgs.length; i++) {
          if (convoMsgs[i].role === 'user') {
            const response = convoMsgs[i + 1]?.role === 'assistant' ? convoMsgs[i + 1].content : '—';
            paired.push({
              id: convoMsgs[i].id,
              conversation_id: convoId,
              user_message: convoMsgs[i].content,
              assistant_response: response,
              created_at: convoMsgs[i].created_at,
            });
          }
        }
      }

      paired.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setQueries(paired);
    }
    setLoading(false);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1 font-['Space_Grotesk']">All Queries</h1>
      <p className="text-sm text-muted-foreground mb-6">View all user queries and their responses</p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg shimmer" />
          ))}
        </div>
      ) : queries.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No queries yet</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-2">
            {queries.map((q) => {
              const isOpen = expandedId === q.id;
              return (
                <div
                  key={q.id}
                  className="border border-border rounded-lg bg-card overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isOpen ? null : q.id)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="flex-1 text-sm font-medium truncate">{q.user_message}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{formatDate(q.created_at)}</span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-border">
                      <h4 className="text-xs font-medium text-muted-foreground uppercase mb-2">Response</h4>
                      <div className="text-sm text-foreground whitespace-pre-wrap bg-muted/30 rounded-lg p-3 max-h-80 overflow-auto scrollbar-thin">
                        {q.assistant_response}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
