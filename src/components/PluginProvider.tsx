import { ReactNode } from 'react';
import { PluginContext, usePluginState } from '@/hooks/usePluginSettings';

type PluginProviderProps = {
  children: ReactNode;
};

export function PluginProvider({ children }: PluginProviderProps) {
  const pluginState = usePluginState();

  return (
    <PluginContext.Provider value={pluginState}>
      {children}
    </PluginContext.Provider>
  );
}
