import { Plus, MessageSquare, Trash2, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useConversations, GroupedConversations, Conversation } from '@/hooks/useConversations';
import { usePrompts } from '@/hooks/usePrompts';
import { cn } from '@/lib/utils';

type ChatSidebarProps = {
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
};

function ConversationGroup({ 
  title, 
  conversations, 
  currentId, 
  onSelect, 
  onDelete 
}: { 
  title: string; 
  conversations: Conversation[]; 
  currentId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  if (conversations.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={cn(
              "sidebar-item group flex items-center justify-between",
              currentId === conv.id && "sidebar-item-active"
            )}
          >
            <button
              onClick={() => onSelect(conv.id)}
              className="flex items-center gap-2 flex-1 text-left truncate"
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate">{conv.title}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatSidebar({ currentConversationId, onSelectConversation, onNewChat }: ChatSidebarProps) {
  const { groupedConversations, totalCount, deleteConversation, fetchConversations } = useConversations();
  const { popularPrompts } = usePrompts();

  const handleDelete = async (id: string) => {
    await deleteConversation(id);
    if (id === currentConversationId) {
      onNewChat();
    }
  };

  return (
    <div className="w-72 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <Button 
          onClick={onNewChat} 
          className="w-full justify-start gap-2 gradient-border bg-sidebar hover:bg-sidebar-accent"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Stats */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <BarChart3 className="h-4 w-4" />
          <span>Chat Statistics</span>
        </div>
        <div className="bg-sidebar-accent rounded-lg p-3">
          <div className="text-2xl font-display font-semibold gradient-text">{totalCount}</div>
          <div className="text-xs text-muted-foreground">Total chats created</div>
        </div>
      </div>

      {/* Popular Prompts */}
      {popularPrompts.length > 0 && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <TrendingUp className="h-4 w-4" />
            <span>Most Searched</span>
          </div>
          <div className="space-y-1">
            {popularPrompts.slice(0, 5).map((prompt) => (
              <div key={prompt.id} className="text-xs p-2 bg-sidebar-accent rounded-md truncate text-sidebar-foreground">
                {prompt.prompt}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversations */}
      <ScrollArea className="flex-1 p-2">
        <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Chat History</span>
        </div>
        <Separator className="my-2" />
        
        <ConversationGroup
          title="Today"
          conversations={groupedConversations.today}
          currentId={currentConversationId}
          onSelect={onSelectConversation}
          onDelete={handleDelete}
        />
        <ConversationGroup
          title="Last 7 Days"
          conversations={groupedConversations.last7Days}
          currentId={currentConversationId}
          onSelect={onSelectConversation}
          onDelete={handleDelete}
        />
        <ConversationGroup
          title="Last 30 Days"
          conversations={groupedConversations.last30Days}
          currentId={currentConversationId}
          onSelect={onSelectConversation}
          onDelete={handleDelete}
        />
        <ConversationGroup
          title="Older"
          conversations={groupedConversations.older}
          currentId={currentConversationId}
          onSelect={onSelectConversation}
          onDelete={handleDelete}
        />
      </ScrollArea>
    </div>
  );
}