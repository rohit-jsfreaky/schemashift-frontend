import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Database,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useConnectionValidation } from "@/hooks";
import { useMigration } from "@/context/MigrationContext";

export default function ConnectionPage() {
  const navigate = useNavigate();
  const {
    setStagingConnectionString,
    setDevConnectionString,
    setConnectionInfo,
  } = useMigration();

  const [staging, setStaging] = useState("");
  const [dev, setDev] = useState("");

  const { isLoading, result, error, validate } = useConnectionValidation();

  const handleTestConnections = async () => {
    try {
      await validate(staging, dev);
    } catch {
      // Error is handled by the hook
    }
  };

  const handleContinue = () => {
    if (result?.success && result.staging.database && result.dev.database) {
      setStagingConnectionString(staging);
      setDevConnectionString(dev);
      setConnectionInfo(
        { database: result.staging.database, host: result.staging.host || "" },
        { database: result.dev.database, host: result.dev.host || "" }
      );
      navigate("/diff");
    }
  };

  const bothConnected = result?.staging.connected && result?.dev.connected;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Database className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SchemaShift</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Connect to Databases</CardTitle>
            <CardDescription className="text-base">
              Enter your PostgreSQL connection strings to compare schemas
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Help Banner */}
            <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 text-sm">
              <p className="text-zinc-300 mb-2">
                <strong className="text-white">How it works:</strong>{" "}
                SchemaShift compares the{" "}
                <strong className="text-emerald-400">Source</strong> database
                schema with the{" "}
                <strong className="text-amber-400">Target</strong> database and
                generates SQL to make Target match Source.
              </p>
              <p className="text-zinc-400 text-xs">
                Example: If Source has a new "phone" column that Target doesn't
                have, we'll generate ALTER TABLE to add it to Target.
              </p>
            </div>

            {/* Source Connection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="staging"
                  className="text-base font-medium text-emerald-400"
                >
                  🟢 Source Database
                </Label>
                <span className="text-xs text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded">
                  Your latest/newer schema
                </span>
              </div>
              <p className="text-xs text-zinc-400 -mt-1">
                This is the database with the NEWER schema (e.g., your local dev
                or the branch with new features)
              </p>
              <Textarea
                id="staging"
                placeholder="postgresql://user:password@host:5432/source_db"
                value={staging}
                onChange={(e) => setStaging(e.target.value)}
                className="font-mono text-sm h-20 resize-none"
              />
              {result?.staging && (
                <ConnectionStatus
                  connected={result.staging.connected}
                  database={result.staging.database}
                  host={result.staging.host}
                  error={result.staging.error}
                />
              )}
            </div>

            {/* Target Connection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="dev"
                  className="text-base font-medium text-amber-400"
                >
                  🟠 Target Database
                </Label>
                <span className="text-xs text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded">
                  Where to apply changes
                </span>
              </div>
              <p className="text-xs text-zinc-400 -mt-1">
                This is the database you want to UPDATE (e.g.,
                production/staging that needs the new schema)
              </p>
              <Textarea
                id="dev"
                placeholder="postgresql://user:password@host:5432/target_db"
                value={dev}
                onChange={(e) => setDev(e.target.value)}
                className="font-mono text-sm h-20 resize-none"
              />
              {result?.dev && (
                <ConnectionStatus
                  connected={result.dev.connected}
                  database={result.dev.database}
                  host={result.dev.host}
                  error={result.dev.error}
                />
              )}
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleTestConnections}
                disabled={isLoading || !staging || !dev}
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing Connections...
                  </>
                ) : (
                  "Test Connections"
                )}
              </Button>

              <Button
                onClick={handleContinue}
                disabled={!bothConnected}
                className="w-full gap-2"
              >
                Continue to Diff <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-muted-foreground text-center">
              Connection strings are not stored. They are only used during this
              session.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function ConnectionStatus({
  connected,
  database,
  host,
  error,
}: {
  connected: boolean;
  database?: string;
  host?: string;
  error?: string;
}) {
  if (connected) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        <span>
          Connected to <span className="font-medium">{database}</span>
          {host && <span className="text-muted-foreground"> @ {host}</span>}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-destructive">
      <XCircle className="h-4 w-4" />
      <span>{error || "Connection failed"}</span>
    </div>
  );
}
