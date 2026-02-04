import { Workflow, Network, GitBranch, Check } from 'lucide-react';
import { PLUGINS, Plugin, usePluginSettings } from '@/hooks/usePluginSettings';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Workflow,
  Network,
  GitBranch,
};

type PluginSettingsProps = {
  collapsed?: boolean;
};

export function PluginSettings({ collapsed = false }: PluginSettingsProps) {
  const { selectedPlugin, setSelectedPlugin } = usePluginSettings();

  if (collapsed) {
    return (
      <div className="space-y-2">
        {PLUGINS.map((plugin) => {
          const Icon = iconMap[plugin.icon];
          const isActive = selectedPlugin.id === plugin.id;

          return (
            <button
              key={plugin.id}
              onClick={() => setSelectedPlugin(plugin)}
              className={cn(
                "w-full p-2 rounded-lg transition-all duration-200 flex items-center justify-center",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-sidebar-accent text-sidebar-foreground"
              )}
              title={plugin.name}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {PLUGINS.map((plugin) => {
        const Icon = iconMap[plugin.icon];
        const isActive = selectedPlugin.id === plugin.id;

        return (
          <button
            key={plugin.id}
            onClick={() => setSelectedPlugin(plugin)}
            className={cn(
              "plugin-card w-full text-left flex items-start gap-3",
              isActive && "plugin-card-active"
            )}
          >
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{plugin.name}</span>
                {isActive && <Check className="h-3 w-3 text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {plugin.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
