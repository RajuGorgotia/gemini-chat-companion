import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatArea } from '@/components/ChatArea';
import { PluginHeader } from '@/components/PluginHeader';
import { useChat } from '@/hooks/useChat';
import { useConversations } from '@/hooks/useConversations';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { messages, isLoading, currentConversation, sendMessage, loadConversation, startNewChat } = useChat();
  const { fetchConversations } = useConversations();
  const location = useLocation();

  // Handle navigation from Chats page with a conversationId
  useEffect(() => {
    const state = location.state as { conversationId?: string } | null;
    if (state?.conversationId) {
      loadConversation(state.conversationId);
      // Clear state so it doesn't reload on re-renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSelectConversation = async (id: string) => {
    await loadConversation(id);
  };

  const handleNewChat = () => {
    startNewChat();
  };

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
    fetchConversations();
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
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
            currentConversationId={currentConversation?.id}
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            activeRoute="home"
          />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 top-14 bg-background/80 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <PluginHeader />
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
