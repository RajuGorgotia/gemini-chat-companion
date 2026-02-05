import { Plus, MessageSquare, Trash2, Clock, Settings, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
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
  collapsed: boolean;
  onToggleCollapse: () => void;
};

function ConversationGroup({ 
  title, 
  conversations, 
  currentId, 
  onSelect, 
  onDelete,
  collapsed 
}: { 
  title: string; 
  conversations: Conversation[]; 
  currentId?: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  collapsed?: boolean;
}) {
  if (conversations.length === 0) return null;

  if (collapsed) {
    return (
      <div className="space-y-1">
        {conversations.slice(0, 3).map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              "w-full p-2 rounded-lg transition-all duration-200 flex items-center justify-center",
              currentId === conv.id 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "hover:bg-sidebar-accent text-sidebar-foreground"
            )}
            title={conv.title}
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        ))}
      </div>
    );
  }

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

export function ChatSidebar({ 
  currentConversationId, 
  onSelectConversation, 
  onNewChat,
  collapsed,
  onToggleCollapse 
}: ChatSidebarProps) {
  const { groupedConversations, deleteConversation } = useConversations();
  const { popularPrompts } = usePrompts();

  const handleDelete = async (id: string) => {
    await deleteConversation(id);
    if (id === currentConversationId) {
      onNewChat();
    }
  };

  return (
    <div className={cn(
      "h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-72"
    )}>
      {/* Header with collapse toggle */}
      <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <Button 
            onClick={onNewChat} 
            className="flex-1 justify-start gap-2 gradient-border bg-sidebar hover:bg-sidebar-accent"
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        )}
        {collapsed && (
          <Button 
            onClick={onNewChat} 
            variant="ghost"
            size="icon"
            className="w-full"
            title="New Chat"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className={cn("shrink-0", collapsed ? "w-full" : "ml-2")}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Popular Prompts - Only show when not collapsed */}
      {!collapsed && popularPrompts.length > 0 && (
        <div className="p-3 border-b border-sidebar-border">
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
        {!collapsed && (
          <>
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Chat History</span>
            </div>
            <Separator className="my-2" />
          </>
        )}
        
        <ConversationGroup
          title="Today"
          conversations={groupedConversations.today}
          currentId={currentConversationId}
          onSelect={onSelectConversation}
          onDelete={handleDelete}
          collapsed={collapsed}
        />
        {!collapsed && (
          <>
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
          </>
        )}
      </ScrollArea>
    </div>
  );
}
