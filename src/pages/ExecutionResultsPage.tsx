import { Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  ArrowLeft,
  History,
  RefreshCw,
  Terminal,
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMigration } from "@/context/MigrationContext";

export default function ExecutionResultsPage() {
  const { executionResult } = useMigration();

  if (!executionResult) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="max-w-md w-full bg-zinc-900 border-zinc-800 text-center p-6">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
              <Database className="h-8 w-8 text-zinc-500" />
            </div>
            <CardTitle className="text-white mb-2">No Active Result</CardTitle>
            <p className="text-zinc-500 mb-6">
              No migration has been executed recently.
            </p>
            <Link to="/connect" className="block">
              <Button className="w-full bg-white text-black hover:bg-zinc-200">
                Start New Migration
              </Button>
            </Link>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const isSuccess = executionResult.success;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Status Alert */}
        {isSuccess ? (
          <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-400">
                Migration Applied Successfully
              </h3>
              <p className="text-emerald-300/60 mt-1">
                All SQL statements executed without errors.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-400">
                Migration Failed
              </h3>
              <p className="text-red-300/60 mt-1">
                {executionResult.error || "An error occurred during execution."}
              </p>
            </div>
          </div>
        )}

        {/* Result Details */}
        <Card className="bg-zinc-900/40 border-zinc-800 text-zinc-200 backdrop-blur-sm">
          <CardHeader className="border-b border-zinc-800/50 pb-4">
            <CardTitle className="flex items-center gap-2 text-white">
              <Terminal className="h-5 w-5 text-zinc-400" />
              Execution Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">
                  Migration ID
                </p>
                <p
                  className="font-mono text-xs text-zinc-300 truncate"
                  title={executionResult.migrationId || ""}
                >
                  {executionResult.migrationId || "N/A"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">
                  Timestamp
                </p>
                <p className="text-sm text-zinc-300">
                  {new Date(executionResult.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                  Duration
                </p>
                <p className="text-sm text-zinc-300 font-medium">
                  {executionResult.duration.ms}ms
                </p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">
                  Success Rate
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        isSuccess ? "bg-emerald-500" : "bg-red-500"
                      }`}
                      style={{
                        width: `${
                          (executionResult.executedStatements /
                            executionResult.totalStatements) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-zinc-300 whitespace-nowrap">
                    {executionResult.executedStatements}/
                    {executionResult.totalStatements}
                  </span>
                </div>
              </div>
            </div>

            {/* Target Info */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950/30 border border-zinc-800/50">
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-500 font-medium">
                  Target Database:
                </span>
                <Badge
                  variant="outline"
                  className="border-zinc-700 bg-zinc-900 text-zinc-300 font-mono"
                >
                  {executionResult.targetDatabase}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-500 font-medium">
                  Operation:
                </span>
                <Badge
                  className={
                    executionResult.direction === "up"
                      ? "bg-emerald-900/30 text-emerald-400 border-none hover:bg-emerald-900/40"
                      : "bg-amber-900/30 text-amber-400 border-none"
                  }
                >
                  {executionResult.direction.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Error Details (if failed) */}
            {!isSuccess && executionResult.failedStatement && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-red-400 flex items-center gap-2">
                  <XCircle className="h-4 w-4" /> Failed at statement #
                  {executionResult.failedAtStatement}
                </p>
                <ScrollArea className="h-40 rounded-xl border border-red-900/30 bg-red-950/10 p-4">
                  <pre className="text-xs font-mono text-red-200/80 whitespace-pre-wrap leading-relaxed">
                    {executionResult.failedStatement}
                  </pre>
                </ScrollArea>
                {executionResult.errorCode && (
                  <p className="text-xs text-zinc-500 mt-2 font-mono">
                    Postgres Error Code:{" "}
                    <span className="text-zinc-300">
                      {executionResult.errorCode}
                    </span>
                  </p>
                )}

                <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-950/20 border border-amber-900/30 mt-4">
                  <RefreshCw className="h-4 w-4 text-amber-500" />
                  <p className="text-xs text-amber-400">
                    Automatic Rollback: Transaction was reverted. No partial
                    changes were applied.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link to="/connect">
            <Button
              variant="outline"
              className="gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" /> New Comparison
            </Button>
          </Link>
          <Link to="/history">
            <Button
              variant="outline"
              className="gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              <History className="h-4 w-4" /> View History
            </Button>
          </Link>
          {!isSuccess && (
            <Link to="/diff">
              <Button className="gap-2 bg-white text-black hover:bg-zinc-200">
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
            </Link>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
