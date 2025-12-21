import { Plus, Minus, RefreshCw, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { DiffSummary } from "@/types";

interface ChangesSummaryProps {
  summary: DiffSummary;
}

export default function ChangesSummary({ summary }: ChangesSummaryProps) {
  if (!summary.hasChanges) {
    return (
      <Alert className="bg-muted/50">
        <RefreshCw className="h-4 w-4" />
        <AlertTitle>No Changes Detected</AlertTitle>
        <AlertDescription>
          The schemas are identical. Nothing to migrate.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {/* Additions */}
      {(summary.addedTableCount > 0 || summary.addedColumnCount > 0) && (
        <Alert className="border-emerald-500/50 bg-emerald-500/10">
          <Plus className="h-4 w-4 text-emerald-400" />
          <AlertTitle className="text-emerald-400">Additions</AlertTitle>
          <AlertDescription className="text-emerald-300/80">
            <div className="flex flex-wrap gap-2 mt-1">
              {summary.addedTableCount > 0 && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/50 text-emerald-400"
                >
                  {summary.addedTableCount} new table
                  {summary.addedTableCount !== 1 ? "s" : ""}
                </Badge>
              )}
              {summary.addedColumnCount > 0 && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/50 text-emerald-400"
                >
                  {summary.addedColumnCount} new column
                  {summary.addedColumnCount !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Modifications */}
      {summary.modifiedColumnCount > 0 && (
        <Alert className="border-amber-500/50 bg-amber-500/10">
          <RefreshCw className="h-4 w-4 text-amber-400" />
          <AlertTitle className="text-amber-400">Modifications</AlertTitle>
          <AlertDescription className="text-amber-300/80">
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge
                variant="outline"
                className="border-amber-500/50 text-amber-400"
              >
                {summary.modifiedColumnCount} modified column
                {summary.modifiedColumnCount !== 1 ? "s" : ""}
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Destructive Changes */}
      {summary.hasDestructiveChanges && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Destructive Changes</AlertTitle>
          <AlertDescription>
            <div className="flex flex-wrap gap-2 mt-1">
              {summary.removedTableCount > 0 && (
                <Badge variant="destructive">
                  <Minus className="h-3 w-3 mr-1" />
                  {summary.removedTableCount} dropped table
                  {summary.removedTableCount !== 1 ? "s" : ""}
                </Badge>
              )}
              {summary.removedColumnCount > 0 && (
                <Badge variant="destructive">
                  <Minus className="h-3 w-3 mr-1" />
                  {summary.removedColumnCount} dropped column
                  {summary.removedColumnCount !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
