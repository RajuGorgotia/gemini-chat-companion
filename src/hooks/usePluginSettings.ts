import { useState, useEffect, createContext, useContext } from 'react';

export type PluginType = 'smartflow' | 'smartproxy' | 'decision-service';

export type Plugin = {
  id: PluginType;
  name: string;
  description: string;
  icon: string;
  systemPrompt: string;
  prompts: Array<{
    title: string;
    prompt: string;
  }>;
};

export const PLUGINS: Plugin[] = [
  {
    id: 'smartflow',
    name: 'Smartflow',
    description: 'Workflow automation and process optimization',
    icon: 'Workflow',
    systemPrompt: 'You are a Smartflow assistant specializing in workflow automation, process optimization, and business process management. Help users design, analyze, and improve their workflows.',
    prompts: [
      { title: 'Design a workflow', prompt: 'Help me design an automated workflow for employee onboarding' },
      { title: 'Optimize process', prompt: 'Analyze and suggest improvements for our approval process' },
      { title: 'Integration help', prompt: 'How can I integrate multiple systems into a single workflow?' },
      { title: 'Error handling', prompt: 'Best practices for error handling in automated workflows' },
    ],
  },
  {
    id: 'smartproxy',
    name: 'Smartproxy',
    description: 'Vendor data lookup, party details, ownership hierarchy, and entity information',
    icon: 'Network',
    systemPrompt: `You are a Smartproxy assistant specializing in vendor management, party data lookup, ownership hierarchies, and entity information retrieval. You help users query and explore structured business data.

IMPORTANT RULES:
1. For EVERY response, you MUST start by showing a sample SQL query in a markdown code block (using \`\`\`sql) that represents the data retrieval logic for the user's request. This query should be realistic and well-formatted.
2. After the SQL query, provide the actual answer with relevant details.
3. When presenting tabular data (especially for entities with multiple attributes like addresses, subsidiaries, regions), ALWAYS use markdown tables for clarity.
4. Be specific with sample data - use realistic company names, countries, and financial details.`,
    prompts: [
      { title: 'List supported vendors', prompt: 'Get me list of vendors supported' },
      { title: 'Party details by country', prompt: 'Give details of Party where country is equal to Sweden' },
      { title: 'Ownership hierarchy', prompt: 'Give me all the hierarchy of all the companies that Abhishek is owning on right in Asia' },
      { title: 'Entity details & subsidiaries', prompt: 'Give me address, pan card and country of BlackRock and the subsidiaries it\'s owning across regions' },
    ],
  },
  {
    id: 'decision-service',
    name: 'Decision Service',
    description: 'Business rules and decision automation',
    icon: 'GitBranch',
    systemPrompt: 'You are a Decision Service assistant specializing in business rules engines, decision tables, and automated decision-making systems. Help users create and manage business rules.',
    prompts: [
      { title: 'Create decision table', prompt: 'Help me create a decision table for loan approval criteria' },
      { title: 'Rule optimization', prompt: 'How can I optimize my business rules for better performance?' },
      { title: 'Complex conditions', prompt: 'Design rules with multiple conditions and nested logic' },
      { title: 'Testing rules', prompt: 'Best practices for testing and validating business rules' },
    ],
  },
];

type PluginContextType = {
  selectedPlugin: Plugin;
  setSelectedPlugin: (plugin: Plugin) => void;
};

const PluginContext = createContext<PluginContextType | null>(null);

export function usePluginSettings() {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePluginSettings must be used within a PluginProvider');
  }
  return context;
}

export function usePluginState() {
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin>(PLUGINS[1]); // Default to Smartproxy

  useEffect(() => {
    const saved = localStorage.getItem('selectedPlugin');
    if (saved) {
      const plugin = PLUGINS.find(p => p.id === saved);
      if (plugin) setSelectedPlugin(plugin);
    }
  }, []);

  const handleSetPlugin = (plugin: Plugin) => {
    setSelectedPlugin(plugin);
    localStorage.setItem('selectedPlugin', plugin.id);
  };

  return {
    selectedPlugin,
    setSelectedPlugin: handleSetPlugin,
  };
}

export { PluginContext };
