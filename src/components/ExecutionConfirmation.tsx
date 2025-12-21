import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExecutionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  targetDatabase: string;
  targetHost: string;
  migrationSummary: string;
  sqlPreview: string;
  isDestructive: boolean;
  statementCount: number;
}

export default function ExecutionConfirmation({
  isOpen,
  onClose,
  onConfirm,
  targetDatabase,
  targetHost,
  migrationSummary,
  sqlPreview,
  isDestructive,
  statementCount,
}: ExecutionConfirmationProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    setExecuting(true);
    setError(null);

    // Simulate progress (actual progress would come from backend)
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      await onConfirm();
      setProgress(100);
      clearInterval(progressInterval);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Execution failed");
      clearInterval(progressInterval);
      setExecuting(false);
    }
  };

  const handleClose = () => {
    if (!executing) {
      setConfirmed(false);
      setProgress(0);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Execute Migration</DialogTitle>
          <DialogDescription>
            Review and confirm before executing
          </DialogDescription>
        </DialogHeader>

        {!executing ? (
          <>
            <div className="space-y-4">
              {/* Target Info */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Target Database
                  </p>
                  <p className="font-medium">{targetDatabase}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Host</p>
                  <p className="font-medium font-mono text-sm">{targetHost}</p>
                </div>
              </div>

              {/* Migration Summary */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Migration Summary
                </p>
                <p className="text-sm">{migrationSummary}</p>
              </div>

              {/* SQL Preview */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  SQL Preview (first 10 lines)
                </p>
                <ScrollArea className="h-32 rounded-lg border border-border p-3">
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                    {sqlPreview.split("\n").slice(0, 10).join("\n")}
                    {sqlPreview.split("\n").length > 10 && "\n... [truncated]"}
                  </pre>
                </ScrollArea>
              </div>

              {/* Destructive Warning */}
              {isDestructive && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    This migration contains destructive changes (DROP). Ensure
                    you have backups.
                  </AlertDescription>
                </Alert>
              )}

              {/* Confirmation Checkbox */}
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="confirm"
                  checked={confirmed}
                  onCheckedChange={(checked) => setConfirmed(checked === true)}
                />
                <Label htmlFor="confirm" className="text-sm cursor-pointer">
                  I understand and confirm this migration
                </Label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Execution Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleExecute} disabled={!confirmed}>
                Execute Migration →
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-lg">Running migration...</p>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              {Math.round((progress / 100) * statementCount)} / {statementCount}{" "}
              statements completed
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
