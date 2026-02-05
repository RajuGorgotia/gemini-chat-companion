 import { Settings } from 'lucide-react';
 import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
 import { PluginSettings } from '@/components/PluginSettings';
 import { usePluginSettings } from '@/hooks/usePluginSettings';
 
 export function PluginHeader() {
   const { selectedPlugin } = usePluginSettings();
 
   return (
     <div className="h-12 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-4 shrink-0">
       <Popover>
         <PopoverTrigger asChild>
           <button className="flex items-center gap-2 hover:bg-accent/50 rounded-lg px-3 py-1.5 transition-colors">
             <span className="font-display font-semibold text-lg text-foreground">
               {selectedPlugin.name}
             </span>
             <Settings className="h-4 w-4 text-muted-foreground" />
           </button>
         </PopoverTrigger>
         <PopoverContent 
           side="bottom" 
           align="start" 
           className="w-72 p-3 bg-popover border border-border shadow-lg"
         >
           <div className="mb-3">
             <h4 className="font-medium text-sm">Select Plugin</h4>
             <p className="text-xs text-muted-foreground">Choose the AI capability mode</p>
           </div>
           <PluginSettings collapsed={false} />
         </PopoverContent>
       </Popover>
     </div>
   );
 }