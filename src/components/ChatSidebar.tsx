import { useState } from 'react';
import { Plus, MessageSquare, Clock, Settings, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useConversations, Conversation } from '@/hooks/useConversations';
import { PluginSettings } from '@/components/PluginSettings';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

type ChatSidebarProps = {
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeRoute?: 'home' | 'chats';
};

export function ChatSidebar({
  currentConversationId,
  onSelectConversation,
  onNewChat,
  collapsed,
  onToggleCollapse,
  activeRoute = 'home',
}: ChatSidebarProps) {
  const { conversations, deleteConversation } = useConversations();
  const navigate = useNavigate();

  // Recent: max 2 weeks
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const recentConversations = conversations.filter(
    (c) => new Date(c.updated_at) >= twoWeeksAgo
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteConversation(id);
    if (id === currentConversationId) {
      onNewChat();
    }
  };

  return (
    <div
      className={cn(
        'h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Nav items */}
      <div className="p-3 space-y-0.5">
        {/* New Chat */}
        <button
          onClick={() => { onNewChat(); navigate('/'); }}
          className={cn(
            'flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors hover:bg-sidebar-accent/50 text-sidebar-foreground text-sm',
            collapsed && 'justify-center'
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span>New chat</span>}
        </button>

        {/* Chats */}
        <button
          onClick={() => navigate('/chats')}
          className={cn(
            'flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors text-sm',
            activeRoute === 'chats'
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'hover:bg-sidebar-accent/50 text-sidebar-foreground',
            collapsed && 'justify-center'
          )}
        >
          <MessageSquare className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Chats</span>}
        </button>

        {/* Recent Search - navigates to chats */}
        <button
          onClick={() => navigate('/chats')}
          className={cn(
            'flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors hover:bg-sidebar-accent/50 text-sidebar-foreground text-sm',
            collapsed && 'justify-center'
          )}
        >
          <Clock className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Recent Search</span>}
        </button>
      </div>

      {/* Recents section */}
      {!collapsed && recentConversations.length > 0 && (
        <div className="flex-1 overflow-hidden flex flex-col mt-1">
          <h3 className="px-5 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Recents
          </h3>
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-0.5">
              {recentConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    'group flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors cursor-pointer',
                    currentConversationId === conv.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                  )}
                >
                  <button
                    onClick={() => onSelectConversation(conv.id)}
                    className="flex-1 text-left truncate text-sm"
                  >
                    {conv.title}
                  </button>
                  <button
                    onClick={(e) => handleDelete(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {collapsed && recentConversations.length > 0 && (
        <div className="flex-1 overflow-hidden px-3 mt-2">
          <ScrollArea className="h-full">
            <div className="space-y-1">
              {recentConversations.slice(0, 5).map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={cn(
                    'w-full p-2 rounded-lg transition-colors flex items-center justify-center',
                    currentConversationId === conv.id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
                  )}
                  title={conv.title}
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom: Settings & Collapse */}
      <div className="border-t border-sidebar-border p-3">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                'flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors hover:bg-sidebar-accent/50 text-sidebar-foreground text-sm',
                collapsed && 'justify-center'
              )}
              title="Settings"
            >
              <Settings className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Settings</span>}
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            align="end"
            className="w-72 p-3 bg-popover border border-border shadow-lg"
          >
            <div className="mb-3">
              <h4 className="font-medium text-sm">Select Plugin</h4>
              <p className="text-xs text-muted-foreground">Choose the AI capability mode</p>
            </div>
            <PluginSettings collapsed={false} />
          </PopoverContent>
        </Popover>

        <div className="flex justify-end mt-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
