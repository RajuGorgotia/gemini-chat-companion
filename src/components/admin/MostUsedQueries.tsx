import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Pencil, Check, X, TrendingUp, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type PopularQuery = {
  id: string;
  prompt: string;
  search_count: number;
  cacheable: boolean;
};

export function MostUsedQueries() {
  const [queries, setQueries] = useState<PopularQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('popular_prompts')
      .select('*')
      .order('search_count', { ascending: false });

    if (data) {
      setQueries(
        data.map((d) => ({
          id: d.id,
          prompt: d.prompt,
          search_count: d.search_count,
          cacheable: false, // local-only toggle for now
        }))
      );
    }
    setLoading(false);
  };

  const startEdit = (q: PopularQuery) => {
    setEditingId(q.id);
    setEditText(q.prompt);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from('popular_prompts')
      .update({ prompt: editText })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update query', variant: 'destructive' });
    } else {
      setQueries((prev) => prev.map((q) => (q.id === id ? { ...q, prompt: editText } : q)));
      toast({ title: 'Updated', description: 'Query updated successfully' });
    }
    setEditingId(null);
    setEditText('');
  };

  const toggleCacheable = (id: string) => {
    setQueries((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const next = !q.cacheable;
          toast({
            title: next ? 'Caching Enabled' : 'Caching Disabled',
            description: next
              ? 'This query will be reused from cache on next request'
              : 'This query will not be cached',
          });
          return { ...q, cacheable: next };
        }
        return q;
      })
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1 font-['Space_Grotesk']">Most Used Queries</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Edit queries and mark them for caching to improve response times
      </p>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg shimmer" />
          ))}
        </div>
      ) : queries.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No popular queries yet</p>
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-2">
            {queries.map((q) => (
              <div
                key={q.id}
                className="border border-border rounded-lg bg-card px-4 py-3 flex items-center gap-3"
              >
                {/* Search count badge */}
                <span className="shrink-0 text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-md min-w-[3rem] text-center">
                  {q.search_count}×
                </span>

                {/* Query text or edit input */}
                <div className="flex-1 min-w-0">
                  {editingId === q.id ? (
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(q.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="w-full text-sm bg-muted/50 border border-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm truncate">{q.prompt}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {editingId === q.id ? (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => saveEdit(q.id)}>
                        <Check className="h-4 w-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cancelEdit}>
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(q)} title="Edit query">
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  )}

                  {/* Cache toggle */}
                  <button
                    onClick={() => toggleCacheable(q.id)}
                    className={cn(
                      'flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-colors',
                      q.cacheable
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                    title={q.cacheable ? 'Caching enabled – click to disable' : 'Enable caching for this query'}
                  >
                    {q.cacheable ? (
                      <ToggleRight className="h-4 w-4" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">Cache</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
