import { useState } from 'react';
import { Search, MessageSquare, Trash2, Clock, Settings, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useConversations, Conversation } from '@/hooks/useConversations';
import { usePrompts } from '@/hooks/usePrompts';
import { PluginSettings } from '@/components/PluginSettings';
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

  return (
    <div className="mb-2">
      <h3 className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-0.5">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={cn(
              "group flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors cursor-pointer",
              currentId === conv.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
            )}
          >
            <button
              onClick={() => onSelect(conv.id)}
              className="flex-1 text-left truncate text-sm"
            >
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
  const [historyOpen, setHistoryOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (id: string) => {
    await deleteConversation(id);
    if (id === currentConversationId) {
      onNewChat();
    }
  };

  const filterConversations = (convs: Conversation[]) => {
    if (!searchQuery) return convs;
    return convs.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const hasAnyConversations =
    groupedConversations.today.length > 0 ||
    groupedConversations.last7Days.length > 0 ||
    groupedConversations.last30Days.length > 0 ||
    groupedConversations.older.length > 0;

  return (
    <div className={cn(
      "h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-72"
    )}>
      {/* Search Bar */}
      <div className="p-3">
        {!collapsed ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-12 bg-sidebar-accent border-0 text-sm h-9"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              Ctrl+K
            </span>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            title="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Chat - New Chat Button */}
      <div className="px-3">
        <button
          onClick={onNewChat}
          className={cn(
            "flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors hover:bg-sidebar-accent/50 text-sidebar-foreground",
            collapsed && "justify-center"
          )}
        >
          <Edit3 className="h-4 w-4" />
          {!collapsed && <span className="text-sm">Chat</span>}
        </button>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-hidden flex flex-col mt-1">
        <Collapsible
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          className="flex-1 flex flex-col"
        >
          <CollapsibleTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-3 w-full px-5 py-2 transition-colors hover:bg-sidebar-accent/50 text-sidebar-foreground",
                collapsed && "justify-center px-3"
              )}
            >
              <Clock className="h-4 w-4" />
              {!collapsed && <span className="text-sm">History</span>}
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-3">
              {/* Most Searched Section */}
              {!collapsed && popularPrompts.length > 0 && (
                <div className="mb-3">
                  <h3 className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Most Searched
                  </h3>
                  <div className="space-y-0.5">
                    {popularPrompts.slice(0, 3).map((prompt) => (
                      <div
                        key={prompt.id}
                        className="text-sm px-2 py-1.5 rounded-lg truncate text-sidebar-foreground hover:bg-sidebar-accent/50 cursor-pointer"
                      >
                        {prompt.prompt}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grouped Conversations */}
              {!collapsed && hasAnyConversations && (
                <>
                  <ConversationGroup
                    title="Today"
                    conversations={filterConversations(groupedConversations.today)}
                    currentId={currentConversationId}
                    onSelect={onSelectConversation}
                    onDelete={handleDelete}
                  />
                  <ConversationGroup
                    title="Last 7 Days"
                    conversations={filterConversations(groupedConversations.last7Days)}
                    currentId={currentConversationId}
                    onSelect={onSelectConversation}
                    onDelete={handleDelete}
                  />
                  <ConversationGroup
                    title="Last 30 Days"
                    conversations={filterConversations(groupedConversations.last30Days)}
                    currentId={currentConversationId}
                    onSelect={onSelectConversation}
                    onDelete={handleDelete}
                  />
                  <ConversationGroup
                    title="Older"
                    conversations={filterConversations(groupedConversations.older)}
                    currentId={currentConversationId}
                    onSelect={onSelectConversation}
                    onDelete={handleDelete}
                  />
                </>
              )}

              {collapsed && (
                <div className="space-y-1">
                  {groupedConversations.today.slice(0, 3).map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => onSelectConversation(conv.id)}
                      className={cn(
                        "w-full p-2 rounded-lg transition-colors flex items-center justify-center",
                        currentConversationId === conv.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                      )}
                      title={conv.title}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Bottom Section - Settings & Collapse */}
      <div className="mt-auto border-t border-sidebar-border p-3">
        {/* Settings */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors hover:bg-sidebar-accent/50 text-sidebar-foreground",
                collapsed && "justify-center"
              )}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
              {!collapsed && <span className="text-sm">Settings</span>}
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            align="end"
            className="w-72 p-3 bg-popover border border-border shadow-lg"
          >
            <div className="mb-3">
              <h4 className="font-medium text-sm">Select Plugin</h4>
              <p className="text-xs text-muted-foreground">
                Choose the AI capability mode
              </p>
            </div>
            <PluginSettings collapsed={false} />
          </PopoverContent>
        </Popover>

        {/* Collapse Toggle */}
        <div className="flex justify-end mt-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
