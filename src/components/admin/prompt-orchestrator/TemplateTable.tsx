import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, Pencil, Power, PowerOff, Workflow } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PromptTemplate, TemplateStatus } from './types';
import { cn } from '@/lib/utils';

type Props = {
  templates: PromptTemplate[];
  onView: (t: PromptTemplate) => void;
  onEdit: (t: PromptTemplate) => void;
  onToggleStatus: (id: string, status: TemplateStatus) => void;
  onCreate: () => void;
};

const statusBadge = (status: TemplateStatus) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Active</Badge>;
    case 'draft':
      return <Badge variant="secondary">Draft</Badge>;
    case 'inactive':
      return <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>;
  }
};

export function TemplateTable({ templates, onView, onEdit, onToggleStatus, onCreate }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (templates.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center space-y-4 bg-card">
        <Workflow className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <p className="text-muted-foreground">No prompt templates created yet.</p>
        <Button onClick={onCreate}>Create Prompt Template</Button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-8" />
            <TableHead>Template Name</TableHead>
            <TableHead>Use Case</TableHead>
            <TableHead className="text-center">Version</TableHead>
            <TableHead>Model</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((t) => {
            const isExpanded = expandedId === t.id;
            return (
              <>
                <TableRow
                  key={t.id}
                  className="cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : t.id)}
                >
                  <TableCell className="w-8 px-3">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-muted-foreground">{t.useCase}</TableCell>
                  <TableCell className="text-center">v{t.version}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{t.modelConfig.model}</TableCell>
                  <TableCell className="text-center">{statusBadge(t.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{t.lastUpdated}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="View" onClick={() => onView(t)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => onEdit(t)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {t.status === 'active' ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          title="Deactivate"
                          onClick={() => onToggleStatus(t.id, 'inactive')}
                        >
                          <PowerOff className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600"
                          title="Activate"
                          onClick={() => onToggleStatus(t.id, 'active')}
                        >
                          <Power className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>

                {isExpanded && (
                  <TableRow key={`${t.id}-expand`} className="bg-muted/20 hover:bg-muted/20">
                    <TableCell colSpan={8} className="px-10 py-4">
                      <div className="grid grid-cols-4 gap-6 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">System Prompt</p>
                          <p className="line-clamp-3">{t.systemPrompt}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Rules</p>
                          <p className="font-medium">{t.rules.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Context Rules</p>
                          <p className="font-medium">
                            {[
                              t.contextRules.includeChatHistory && 'Chat History',
                              t.contextRules.includeVectorResults && 'Vector Search',
                              t.contextRules.includeStructuredData && 'Structured Data',
                            ]
                              .filter(Boolean)
                              .join(', ') || 'None'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Input Variables</p>
                          <p className="font-medium">{t.inputVariables.length}</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
