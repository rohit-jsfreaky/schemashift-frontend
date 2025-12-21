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
  const [status, setStatus] = useState<
    "idle" | "running" | "success" | "error"
  >("idle");

  const handleExecute = async () => {
    setExecuting(true);
    setError(null);
    setProgress(0);
    setStatus("running");

    // Simulate progress (slower to match real execution time)
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 5, 85));
    }, 500);

    try {
      await onConfirm();
      clearInterval(progressInterval);
      setProgress(100);
      setStatus("success");
      // Let success state show briefly before closing
    } catch (err) {
      clearInterval(progressInterval);
      const errorMessage =
        err instanceof Error ? err.message : "Execution failed";
      setError(errorMessage);
      setProgress(0);
      setStatus("error");
      setExecuting(false);
    }
  };

  const handleClose = () => {
    if (!executing || status === "error") {
      setConfirmed(false);
      setProgress(0);
      setError(null);
      setStatus("idle");
      setExecuting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-white">Execute Migration</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Review and confirm before executing
          </DialogDescription>
        </DialogHeader>

        {!executing ? (
          <>
            <div className="space-y-4">
              {/* Target Info */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                <div>
                  <p className="text-sm text-zinc-400">Target Database</p>
                  <p className="font-medium text-white">{targetDatabase}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Host</p>
                  <p className="font-medium font-mono text-sm text-white">
                    {targetHost}
                  </p>
                </div>
              </div>

              {/* Migration Summary */}
              <div>
                <p className="text-sm text-zinc-400 mb-1">Migration Summary</p>
                <p className="text-sm text-white">{migrationSummary}</p>
              </div>

              {/* SQL Preview */}
              <div>
                <p className="text-sm text-zinc-400 mb-1">
                  SQL Preview (first 10 lines)
                </p>
                <ScrollArea className="h-32 rounded-lg border border-zinc-700 bg-zinc-800/50 p-3">
                  <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap">
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
                  className="border-zinc-600 data-[state=checked]:bg-primary"
                />
                <Label
                  htmlFor="confirm"
                  className="text-sm cursor-pointer text-zinc-200"
                >
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
              <Button
                onClick={handleExecute}
                disabled={!confirmed}
                className={
                  !confirmed
                    ? "opacity-50 bg-zinc-600 text-zinc-400 cursor-not-allowed"
                    : ""
                }
              >
                Execute Migration →
              </Button>
            </DialogFooter>
          </>
        ) : status === "error" ? (
          <div className="py-8 space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-lg text-white font-medium">Migration Failed</p>
              <p className="text-sm text-red-400 text-center max-w-md">
                {error}
              </p>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="py-8 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-lg text-white">Running migration...</p>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-zinc-400 text-center">
              Executing {statementCount} statements...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
