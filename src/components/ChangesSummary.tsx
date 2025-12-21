import {
  Plus,
  Minus,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
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

  // Calculate what will happen TO the Target
  // Source has MORE columns than Target = columns will be ADDED to Target
  // Source has FEWER columns than Target = columns will be REMOVED from Target
  const willAddTables = summary.addedTableCount;
  const willAddColumns = summary.addedColumnCount;
  const willModifyColumns = summary.modifiedColumnCount;
  const willRemoveTables = summary.removedTableCount;
  const willRemoveColumns = summary.removedColumnCount;

  return (
    <div className="space-y-3">
      {/* What will be ADDED to Target */}
      {(willAddTables > 0 || willAddColumns > 0) && (
        <Alert className="border-emerald-500/50 bg-emerald-500/10">
          <Plus className="h-4 w-4 text-emerald-400" />
          <AlertTitle className="text-emerald-400 flex items-center gap-2">
            Will Add to Target
            <ArrowRight className="h-3 w-3" />
          </AlertTitle>
          <AlertDescription className="text-emerald-300/80">
            <div className="flex flex-wrap gap-2 mt-1">
              {willAddTables > 0 && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/50 text-emerald-400"
                >
                  + {willAddTables} new table{willAddTables !== 1 ? "s" : ""}
                </Badge>
              )}
              {willAddColumns > 0 && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/50 text-emerald-400"
                >
                  + {willAddColumns} new column{willAddColumns !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* What will be MODIFIED in Target */}
      {willModifyColumns > 0 && (
        <Alert className="border-amber-500/50 bg-amber-500/10">
          <RefreshCw className="h-4 w-4 text-amber-400" />
          <AlertTitle className="text-amber-400 flex items-center gap-2">
            Will Modify in Target
            <ArrowRight className="h-3 w-3" />
          </AlertTitle>
          <AlertDescription className="text-amber-300/80">
            <div className="flex flex-wrap gap-2 mt-1">
              <Badge
                variant="outline"
                className="border-amber-500/50 text-amber-400"
              >
                ↻ {willModifyColumns} column{willModifyColumns !== 1 ? "s" : ""}{" "}
                (type/constraint changes)
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* What will be REMOVED from Target (destructive) */}
      {(willRemoveTables > 0 || willRemoveColumns > 0) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            ⚠️ Will Remove from Target (Destructive!)
          </AlertTitle>
          <AlertDescription>
            <div className="flex flex-wrap gap-2 mt-1">
              {willRemoveTables > 0 && (
                <Badge variant="destructive">
                  <Minus className="h-3 w-3 mr-1" />− {willRemoveTables} table
                  {willRemoveTables !== 1 ? "s" : ""} will be DROPPED
                </Badge>
              )}
              {willRemoveColumns > 0 && (
                <Badge variant="destructive">
                  <Minus className="h-3 w-3 mr-1" />− {willRemoveColumns} column
                  {willRemoveColumns !== 1 ? "s" : ""} will be DROPPED
                </Badge>
              )}
            </div>
            <p className="text-xs mt-2 text-red-300">
              This will permanently delete data. Make sure you have backups!
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
