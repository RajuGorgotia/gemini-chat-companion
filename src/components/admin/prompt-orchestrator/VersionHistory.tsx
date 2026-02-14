import { History, RotateCcw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PromptTemplate } from './types';

type Props = {
  open: boolean;
  onClose: () => void;
  template: PromptTemplate | null;
};

export function VersionHistory({ open, onClose, template }: Props) {
  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History — {template.name}
          </DialogTitle>
        </DialogHeader>

        {template.versionHistory.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No version history available.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Changed By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {template.versionHistory.map((v, i) => (
                <TableRow key={v.version}>
                  <TableCell className="font-medium">v{v.version}</TableCell>
                  <TableCell className="text-muted-foreground">{v.changedBy}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{v.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs" title="View">
                        <Eye className="h-3 w-3 mr-1" /> View
                      </Button>
                      {i > 0 && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs" title="Rollback">
                          <RotateCcw className="h-3 w-3 mr-1" /> Rollback
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
