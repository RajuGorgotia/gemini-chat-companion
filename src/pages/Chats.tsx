import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { ChatSidebar } from '@/components/ChatSidebar';
import { PluginHeader } from '@/components/PluginHeader';
import { useConversations, Conversation } from '@/hooks/useConversations';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const Chats = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { conversations, totalCount } = useConversations();
  const navigate = useNavigate();

  const filtered = searchQuery
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  const handleSelectConversation = (id: string) => {
    navigate('/', { state: { conversationId: id } });
  };

  const handleNewChat = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-20 left-4 z-50 md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Sidebar */}
        <div className={`
          fixed inset-y-14 left-0 z-40 transform transition-transform duration-300 ease-in-out
          md:relative md:inset-y-0 md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <ChatSidebar
            currentConversationId={undefined}
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            activeRoute="chats"
          />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-14 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <PluginHeader />
          <div className="flex-1 overflow-auto">
            <div className="max-w-3xl mx-auto px-6 py-8">
              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-foreground">Chats</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewChat}
                  className="gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  New chat
                </Button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted/50 border-border"
                />
              </div>

              {/* Count */}
              <p className="text-sm text-muted-foreground mb-4">
                {filtered.length} chat{filtered.length !== 1 ? 's' : ''}
              </p>

              {/* Conversation list */}
              <div className="divide-y divide-border">
                {filtered.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className="w-full text-left py-4 px-2 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <p className="font-medium text-foreground">{conv.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Last message {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                    </p>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="py-8 text-center text-muted-foreground text-sm">
                    No chats found
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chats;
