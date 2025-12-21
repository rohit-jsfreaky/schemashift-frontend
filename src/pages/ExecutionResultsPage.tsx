import { Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  ArrowLeft,
  History,
  RefreshCw,
} from "lucide-react";
import TopNavbar from "@/components/TopNavbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMigration } from "@/context/MigrationContext";

export default function ExecutionResultsPage() {
  const { executionResult } = useMigration();

  if (!executionResult) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>No Results</CardTitle>
              <CardDescription>
                No migration has been executed yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/connect">
                <Button className="w-full">Start New Migration</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isSuccess = executionResult.success;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar />

      <main className="flex-1 container mx-auto p-6 max-w-3xl">
        {/* Status Alert */}
        {isSuccess ? (
          <Alert className="mb-6 border-emerald-500/50 bg-emerald-500/10">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <AlertTitle className="text-emerald-400 text-lg">
              Migration Applied Successfully
            </AlertTitle>
            <AlertDescription className="text-emerald-300/80">
              All statements executed without errors
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-5 w-5" />
            <AlertTitle className="text-lg">Migration Failed</AlertTitle>
            <AlertDescription>
              {executionResult.error || "An error occurred during execution"}
            </AlertDescription>
          </Alert>
        )}

        {/* Result Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Execution Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Migration ID</p>
                <p className="font-mono text-sm truncate">
                  {executionResult.migrationId || "N/A"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Timestamp</p>
                <p className="text-sm">
                  {new Date(executionResult.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Duration
                </p>
                <p className="font-medium">{executionResult.duration.ms}ms</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Statements</p>
                <p className="font-medium">
                  {executionResult.executedStatements} /{" "}
                  {executionResult.totalStatements}
                </p>
              </div>
            </div>

            {/* Target Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Target:</span>
                <Badge variant="outline">
                  {executionResult.targetDatabase}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Direction:
                </span>
                <Badge
                  variant={
                    executionResult.direction === "up" ? "default" : "secondary"
                  }
                >
                  {executionResult.direction.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Error Details (if failed) */}
            {!isSuccess && executionResult.failedStatement && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-destructive">
                  Failed at statement {executionResult.failedAtStatement}
                </p>
                <ScrollArea className="h-32 rounded-lg border border-destructive/50 p-3">
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                    {executionResult.failedStatement}
                  </pre>
                </ScrollArea>
                {executionResult.errorCode && (
                  <p className="text-xs text-muted-foreground">
                    Error code: <code>{executionResult.errorCode}</code>
                  </p>
                )}
                <Alert className="border-amber-500/50 bg-amber-500/10 mt-4">
                  <RefreshCw className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-amber-300/80">
                    Transaction was rolled back. No changes were made to the
                    database.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link to="/connect">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> New Comparison
            </Button>
          </Link>
          <Link to="/history">
            <Button variant="outline" className="gap-2">
              <History className="h-4 w-4" /> View History
            </Button>
          </Link>
          {!isSuccess && (
            <Link to="/diff">
              <Button className="gap-2">
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
