export type TemplateStatus = 'active' | 'draft' | 'inactive';

export type RuleType = 'Format' | 'Tone' | 'Word Limit' | 'Safety Constraint' | 'Custom';

export type PromptRule = {
  id: string;
  type: RuleType;
  value: string;
};

export type ContextRules = {
  includeChatHistory: boolean;
  chatHistoryCount: number;
  includeVectorResults: boolean;
  vectorResultsCount: number;
  includeStructuredData: boolean;
};

export type InputVariable = {
  id: string;
  name: string;
  description: string;
};

export type ModelConfig = {
  model: string;
  temperature: number;
  maxTokens: number;
};

export type VersionEntry = {
  version: string;
  changedBy: string;
  date: string;
};

export type PromptTemplate = {
  id: string;
  name: string;
  description: string;
  useCase: string;
  version: string;
  status: TemplateStatus;
  systemPrompt: string;
  rules: PromptRule[];
  contextRules: ContextRules;
  inputVariables: InputVariable[];
  modelConfig: ModelConfig;
  lastUpdated: string;
  versionHistory: VersionEntry[];
};
