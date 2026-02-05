 import { usePluginSettings } from '@/hooks/usePluginSettings';
 
 export function PluginHeader() {
   const { selectedPlugin } = usePluginSettings();
 
   return (
     <div className="h-12 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-4 shrink-0">
       <span className="font-display font-semibold text-lg text-foreground">
         {selectedPlugin.name}
       </span>
     </div>
   );
 }