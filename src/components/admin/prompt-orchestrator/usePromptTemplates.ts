import { useState } from 'react';
import { PromptTemplate, TemplateStatus } from './types';

const SAMPLE_TEMPLATES: PromptTemplate[] = [
  {
    id: '1',
    name: 'HR Assistant',
    description: 'Handles employee queries about policies and benefits.',
    useCase: 'HR Support',
    version: '1.2',
    status: 'active',
    systemPrompt: 'You are an HR assistant. Help employees with policy questions, benefits, and leave management. Always be professional and cite the relevant policy document.',
    rules: [
      { id: 'r1', type: 'Tone', value: 'Professional and empathetic' },
      { id: 'r2', type: 'Format', value: 'Use bullet points for multi-step answers' },
    ],
    contextRules: {
      includeChatHistory: true,
      chatHistoryCount: 5,
      includeVectorResults: true,
      vectorResultsCount: 3,
      includeStructuredData: false,
    },
    inputVariables: [
      { id: 'v1', name: '{{user_question}}', description: 'The employee question' },
      { id: 'v2', name: '{{department}}', description: 'Employee department' },
    ],
    modelConfig: { model: 'gpt-5', temperature: 0.3, maxTokens: 1024 },
    lastUpdated: '2026-02-12',
    versionHistory: [
      { version: '1.2', changedBy: 'Admin', date: '2026-02-12' },
      { version: '1.1', changedBy: 'Admin', date: '2026-02-01' },
      { version: '1.0', changedBy: 'Admin', date: '2026-01-15' },
    ],
  },
  {
    id: '2',
    name: 'Vendor Lookup',
    description: 'Retrieves vendor details from structured data.',
    useCase: 'Procurement',
    version: '1.0',
    status: 'draft',
    systemPrompt: 'You are a procurement assistant. Help users find vendor information and compare options.',
    rules: [
      { id: 'r3', type: 'Format', value: 'Always present results in a table' },
    ],
    contextRules: {
      includeChatHistory: false,
      chatHistoryCount: 0,
      includeVectorResults: false,
      vectorResultsCount: 0,
      includeStructuredData: true,
    },
    inputVariables: [
      { id: 'v3', name: '{{vendor_name}}', description: 'Name of vendor to look up' },
    ],
    modelConfig: { model: 'gemini-2.5-flash', temperature: 0.2, maxTokens: 2048 },
    lastUpdated: '2026-02-10',
    versionHistory: [
      { version: '1.0', changedBy: 'Admin', date: '2026-02-10' },
    ],
  },
  {
    id: '3',
    name: 'Compliance Checker',
    description: 'Validates documents against regulatory standards.',
    useCase: 'Legal & Compliance',
    version: '2.1',
    status: 'inactive',
    systemPrompt: 'You are a compliance officer assistant. Analyze documents for regulatory compliance.',
    rules: [
      { id: 'r4', type: 'Safety Constraint', value: 'Never provide legal advice' },
      { id: 'r5', type: 'Word Limit', value: '500 words maximum' },
    ],
    contextRules: {
      includeChatHistory: true,
      chatHistoryCount: 3,
      includeVectorResults: true,
      vectorResultsCount: 5,
      includeStructuredData: true,
    },
    inputVariables: [],
    modelConfig: { model: 'gpt-5', temperature: 0.1, maxTokens: 4096 },
    lastUpdated: '2026-01-28',
    versionHistory: [
      { version: '2.1', changedBy: 'Admin', date: '2026-01-28' },
      { version: '2.0', changedBy: 'Admin', date: '2026-01-10' },
    ],
  },
];

export function usePromptTemplates() {
  const [templates, setTemplates] = useState<PromptTemplate[]>(SAMPLE_TEMPLATES);

  const addTemplate = (template: PromptTemplate) => {
    setTemplates((prev) => [template, ...prev]);
  };

  const updateTemplate = (updated: PromptTemplate) => {
    setTemplates((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const toggleStatus = (id: string, status: TemplateStatus) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, lastUpdated: new Date().toISOString().slice(0, 10) } : t
      )
    );
  };

  return { templates, addTemplate, updateTemplate, toggleStatus };
}
