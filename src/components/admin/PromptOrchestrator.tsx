import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PromptTemplate } from './prompt-orchestrator/types';
import { usePromptTemplates } from './prompt-orchestrator/usePromptTemplates';
import { TemplateTable } from './prompt-orchestrator/TemplateTable';
import { TemplateEditor } from './prompt-orchestrator/TemplateEditor';
import { VersionHistory } from './prompt-orchestrator/VersionHistory';

export function PromptOrchestrator() {
  const { templates, addTemplate, updateTemplate, toggleStatus } = usePromptTemplates();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [historyTemplate, setHistoryTemplate] = useState<PromptTemplate | null>(null);

  const handleCreate = () => {
    setEditingTemplate(null);
    setEditorOpen(true);
  };

  const handleEdit = (t: PromptTemplate) => {
    setEditingTemplate(t);
    setEditorOpen(true);
  };

  const handleView = (t: PromptTemplate) => {
    setHistoryTemplate(t);
  };

  const handleSave = (t: PromptTemplate) => {
    if (editingTemplate) {
      updateTemplate(t);
    } else {
      addTemplate(t);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Prompt Orchestrator</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, manage and control AI prompt templates and runtime rules.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" /> Create Prompt Template
        </Button>
      </div>

      {/* Table */}
      <TemplateTable
        templates={templates}
        onView={handleView}
        onEdit={handleEdit}
        onToggleStatus={toggleStatus}
        onCreate={handleCreate}
      />

      {/* Editor side panel */}
      <TemplateEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        template={editingTemplate}
        onSave={handleSave}
      />

      {/* Version history dialog */}
      <VersionHistory
        open={!!historyTemplate}
        onClose={() => setHistoryTemplate(null)}
        template={historyTemplate}
      />
    </div>
  );
}
