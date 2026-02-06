import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type FeedbackDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (issueType: string, details: string) => void;
};

export function FeedbackDialog({ open, onClose, onSubmit }: FeedbackDialogProps) {
  const [issueType, setIssueType] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = () => {
    onSubmit(issueType, details);
    setIssueType('');
    setDetails('');
    onClose();
  };

  const handleCancel = () => {
    setIssueType('');
    setDetails('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              What type of issue do you wish to report? (optional)
            </label>
            <Select value={issueType} onValueChange={setIssueType}>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="problem-with-app">Problem with app</SelectItem>
                <SelectItem value="not-factually-correct">Not factually correct</SelectItem>
                <SelectItem value="didnt-follow-instruction">Didn't follow instruction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">
              Please provide details: (optional)
            </label>
            <Textarea
              placeholder="What was unsatisfying about this response?"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Submitting this report will send the entire current conversation for future improvements.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleSubmit}>Submit</Button>
          <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
