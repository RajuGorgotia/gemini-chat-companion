import { ChevronLeft, ChevronRight, Database, TrendingUp, LayoutDashboard, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

type AdminView = 'all-queries' | 'most-used-queries' | 'prompt-orchestrator';

type AdminSidebarProps = {
  activeView: AdminView;
  onSelectView: (view: AdminView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export function AdminSidebar({ activeView, onSelectView, collapsed, onToggleCollapse }: AdminSidebarProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Back to chat */}
      <div className="p-3">
        <button
          onClick={() => navigate('/')}
          className={cn(
            'flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors hover:bg-sidebar-accent/50 text-sidebar-foreground text-sm',
            collapsed && 'justify-center'
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Back to Chat</span>}
        </button>
      </div>

      {/* Section label */}
      {!collapsed && (
        <h3 className="px-5 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Queries
        </h3>
      )}

      {/* Nav items */}
      <div className="px-3 space-y-0.5">
        <button
          onClick={() => onSelectView('all-queries')}
          className={cn(
            'flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors text-sm',
            activeView === 'all-queries'
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'hover:bg-sidebar-accent/50 text-sidebar-foreground',
            collapsed && 'justify-center'
          )}
          title="All Queries"
        >
          <Database className="h-4 w-4 shrink-0" />
          {!collapsed && <span>All Queries</span>}
        </button>

        <button
          onClick={() => onSelectView('most-used-queries')}
          className={cn(
            'flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors text-sm',
            activeView === 'most-used-queries'
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'hover:bg-sidebar-accent/50 text-sidebar-foreground',
            collapsed && 'justify-center'
          )}
          title="Most Used Queries"
        >
          <TrendingUp className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Most Used Queries</span>}
        </button>
      </div>

      {/* Prompt Orchestrator section */}
      {!collapsed && (
        <h3 className="px-5 py-1.5 mt-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Orchestration
        </h3>
      )}

      <div className="px-3 space-y-0.5">
        <button
          onClick={() => onSelectView('prompt-orchestrator')}
          className={cn(
            'flex items-center gap-3 w-full px-2 py-2 rounded-lg transition-colors text-sm',
            activeView === 'prompt-orchestrator'
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'hover:bg-sidebar-accent/50 text-sidebar-foreground',
            collapsed && 'justify-center'
          )}
          title="Prompt Orchestrator"
        >
          <Workflow className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Prompt Orchestrator</span>}
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border p-3 flex justify-end">
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
  );
}
