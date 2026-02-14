import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { PromptTemplate, PromptRule, InputVariable, RuleType, ContextRules, ModelConfig } from './types';

type Props = {
  open: boolean;
  onClose: () => void;
  template: PromptTemplate | null;
  onSave: (template: PromptTemplate) => void;
};

const RULE_TYPES: RuleType[] = ['Format', 'Tone', 'Word Limit', 'Safety Constraint', 'Custom'];
const MODELS = ['gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];

const emptyTemplate = (): PromptTemplate => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  useCase: '',
  version: '1.0',
  status: 'draft',
  systemPrompt: '',
  rules: [],
  contextRules: {
    includeChatHistory: false,
    chatHistoryCount: 5,
    includeVectorResults: false,
    vectorResultsCount: 3,
    includeStructuredData: false,
  },
  inputVariables: [],
  modelConfig: { model: 'gpt-5', temperature: 0.5, maxTokens: 1024 },
  lastUpdated: new Date().toISOString().slice(0, 10),
  versionHistory: [],
});

export function TemplateEditor({ open, onClose, template, onSave }: Props) {
  const [form, setForm] = useState<PromptTemplate>(emptyTemplate());

  useEffect(() => {
    setForm(template ? { ...template } : emptyTemplate());
  }, [template, open]);

  const update = <K extends keyof PromptTemplate>(key: K, value: PromptTemplate[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateContext = <K extends keyof ContextRules>(key: K, value: ContextRules[K]) =>
    setForm((prev) => ({ ...prev, contextRules: { ...prev.contextRules, [key]: value } }));

  const updateModel = <K extends keyof ModelConfig>(key: K, value: ModelConfig[K]) =>
    setForm((prev) => ({ ...prev, modelConfig: { ...prev.modelConfig, [key]: value } }));

  // Rules
  const addRule = () =>
    update('rules', [...form.rules, { id: crypto.randomUUID(), type: 'Custom', value: '' }]);
  const removeRule = (id: string) => update('rules', form.rules.filter((r) => r.id !== id));
  const updateRule = (id: string, patch: Partial<PromptRule>) =>
    update('rules', form.rules.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  // Variables
  const addVariable = () =>
    update('inputVariables', [...form.inputVariables, { id: crypto.randomUUID(), name: '', description: '' }]);
  const removeVariable = (id: string) => update('inputVariables', form.inputVariables.filter((v) => v.id !== id));
  const updateVariable = (id: string, patch: Partial<InputVariable>) =>
    update('inputVariables', form.inputVariables.map((v) => (v.id === id ? { ...v, ...patch } : v)));

  const handleSave = (activate: boolean) => {
    const saved = {
      ...form,
      status: activate ? 'active' as const : 'draft' as const,
      lastUpdated: new Date().toISOString().slice(0, 10),
    };
    onSave(saved);
    onClose();
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">{children}</h3>
  );

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b sticky top-0 bg-background z-10">
          <SheetTitle>{template ? 'Edit Template' : 'Create Prompt Template'}</SheetTitle>
        </SheetHeader>

        <div className="px-6 py-6 space-y-8">
          {/* BLOCK 1 */}
          <section className="space-y-4">
            <SectionTitle>Basic Information</SectionTitle>
            <div className="grid gap-4">
              <div className="space-y-1.5">
                <Label>Template Name</Label>
                <Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. HR Assistant" />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Brief description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Use Case</Label>
                  <Input value={form.useCase} onChange={(e) => update('useCase', e.target.value)} placeholder="e.g. HR Support" />
                </div>
                <div className="space-y-1.5">
                  <Label>Version</Label>
                  <Input value={form.version} onChange={(e) => update('version', e.target.value)} />
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* BLOCK 2 */}
          <section className="space-y-4">
            <SectionTitle>System Prompt</SectionTitle>
            <div className="space-y-1.5">
              <Label>System Role Definition</Label>
              <Textarea
                value={form.systemPrompt}
                onChange={(e) => update('systemPrompt', e.target.value)}
                placeholder='Define how the AI should behave. Example: "You are an HR assistant..."'
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Define how the AI should behave. This sets the personality and boundaries.
              </p>
            </div>
          </section>

          <Separator />

          {/* BLOCK 3 */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <SectionTitle>Prompt Rules</SectionTitle>
              <Button variant="outline" size="sm" onClick={addRule}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Rule
              </Button>
            </div>
            {form.rules.length === 0 && (
              <p className="text-sm text-muted-foreground">No rules defined yet.</p>
            )}
            <div className="space-y-3">
              {form.rules.map((rule) => (
                <div key={rule.id} className="flex items-start gap-3">
                  <Select value={rule.type} onValueChange={(v) => updateRule(rule.id, { type: v as RuleType })}>
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RULE_TYPES.map((rt) => (
                        <SelectItem key={rt} value={rt}>{rt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    className="flex-1"
                    value={rule.value}
                    onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                    placeholder="Rule value"
                  />
                  <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-destructive" onClick={() => removeRule(rule.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* BLOCK 4 */}
          <section className="space-y-4">
            <SectionTitle>Context Rules</SectionTitle>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="chatHistory"
                  checked={form.contextRules.includeChatHistory}
                  onCheckedChange={(c) => updateContext('includeChatHistory', !!c)}
                />
                <div className="space-y-1.5 flex-1">
                  <Label htmlFor="chatHistory" className="cursor-pointer">Include Chat History</Label>
                  {form.contextRules.includeChatHistory && (
                    <div className="flex items-center gap-2 mt-1">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">Messages to include:</Label>
                      <Input
                        type="number"
                        className="w-20 h-8"
                        value={form.contextRules.chatHistoryCount}
                        onChange={(e) => updateContext('chatHistoryCount', Number(e.target.value))}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="vectorResults"
                  checked={form.contextRules.includeVectorResults}
                  onCheckedChange={(c) => updateContext('includeVectorResults', !!c)}
                />
                <div className="space-y-1.5 flex-1">
                  <Label htmlFor="vectorResults" className="cursor-pointer">Include Vector Search Results</Label>
                  {form.contextRules.includeVectorResults && (
                    <div className="flex items-center gap-2 mt-1">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">Documents to retrieve:</Label>
                      <Input
                        type="number"
                        className="w-20 h-8"
                        value={form.contextRules.vectorResultsCount}
                        onChange={(e) => updateContext('vectorResultsCount', Number(e.target.value))}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  id="structuredData"
                  checked={form.contextRules.includeStructuredData}
                  onCheckedChange={(c) => updateContext('includeStructuredData', !!c)}
                />
                <Label htmlFor="structuredData" className="cursor-pointer">Include Structured Database Data</Label>
              </div>
            </div>
          </section>

          <Separator />

          {/* BLOCK 5 */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <SectionTitle>Input Variables</SectionTitle>
              <Button variant="outline" size="sm" onClick={addVariable}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Variable
              </Button>
            </div>
            {form.inputVariables.length === 0 && (
              <p className="text-sm text-muted-foreground">No input variables defined yet.</p>
            )}
            <div className="space-y-3">
              {form.inputVariables.map((v) => (
                <div key={v.id} className="flex items-start gap-3">
                  <Input
                    className="w-48"
                    value={v.name}
                    onChange={(e) => updateVariable(v.id, { name: e.target.value })}
                    placeholder="{{variable_name}}"
                  />
                  <Input
                    className="flex-1"
                    value={v.description}
                    onChange={(e) => updateVariable(v.id, { description: e.target.value })}
                    placeholder="Description"
                  />
                  <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-destructive" onClick={() => removeVariable(v.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* BLOCK 6 */}
          <section className="space-y-4">
            <SectionTitle>Model Configuration</SectionTitle>
            <div className="grid gap-4">
              <div className="space-y-1.5">
                <Label>Model</Label>
                <Select value={form.modelConfig.model} onValueChange={(v) => updateModel('model', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODELS.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Temperature</Label>
                  <span className="text-xs text-muted-foreground font-mono">{form.modelConfig.temperature.toFixed(2)}</span>
                </div>
                <Slider
                  value={[form.modelConfig.temperature]}
                  onValueChange={([v]) => updateModel('temperature', v)}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Max Tokens</Label>
                <Input
                  type="number"
                  value={form.modelConfig.maxTokens}
                  onChange={(e) => updateModel('maxTokens', Number(e.target.value))}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Bottom actions */}
        <div className="sticky bottom-0 border-t bg-background px-6 py-4 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="secondary" onClick={() => handleSave(false)}>Save as Draft</Button>
          <Button onClick={() => handleSave(true)}>Activate Template</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
