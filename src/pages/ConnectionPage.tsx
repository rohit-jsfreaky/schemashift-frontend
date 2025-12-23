import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Database,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
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
    <MainLayout>
      <div className="flex items-center justify-center p-3 md:p-6 min-h-[calc(100vh-100px)]">
        <Card className="w-full max-w-2xl bg-zinc-900/50 border-zinc-800 text-zinc-200 shadow-2xl">
          <CardHeader className="text-center px-4 pt-6 md:px-6">
            <CardTitle className="text-2xl md:text-3xl text-white">
              Connect Databases
            </CardTitle>
            <CardDescription className="text-sm md:text-base text-zinc-400">
              Enter your PostgreSQL connection strings to compare schemas
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 md:space-y-6 px-4 pb-6 md:px-6 md:pb-6">
            {/* Help Banner */}
            <div className="p-3 md:p-4 rounded-lg bg-zinc-950/50 border border-zinc-800 text-xs md:text-sm">
              <p className="text-zinc-300 mb-2">
                <strong className="text-white">How it works:</strong>{" "}
                SchemaShift compares the{" "}
                <strong className="text-emerald-400">Source</strong> database
                schema with the{" "}
                <strong className="text-amber-400">Target</strong> database and
                generates SQL to make Target match Source.
              </p>
            </div>

            {/* Source Connection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Label
                  htmlFor="staging"
                  className="text-sm md:text-base font-medium text-emerald-400"
                >
                  🟢 Source Database
                </Label>
                <span className="text-[10px] md:text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded bg-zinc-900">
                  Your source of truth
                </span>
              </div>
              <p className="text-[10px] md:text-xs text-zinc-500 -mt-1">
                The database with the NEW schema structure
              </p>
              <Textarea
                id="staging"
                placeholder="postgresql://user:password@host:5432/source_db"
                value={staging}
                onChange={(e) => setStaging(e.target.value)}
                className="font-mono text-sm h-16 md:h-20 resize-none bg-black border-zinc-800 text-zinc-300 placeholder:text-zinc-700 focus:ring-emerald-500/20 focus:border-emerald-500/50"
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
              <div className="flex items-center gap-2 flex-wrap">
                <Label
                  htmlFor="dev"
                  className="text-sm md:text-base font-medium text-amber-400"
                >
                  🟠 Target Database
                </Label>
                <span className="text-[10px] md:text-xs text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded bg-zinc-900">
                  To be updated
                </span>
              </div>
              <p className="text-[10px] md:text-xs text-zinc-500 -mt-1">
                The database you want to generate migrations FOR
              </p>
              <Textarea
                id="dev"
                placeholder="postgresql://user:password@host:5432/target_db"
                value={dev}
                onChange={(e) => setDev(e.target.value)}
                className="font-mono text-sm h-16 md:h-20 resize-none bg-black border-zinc-800 text-zinc-300 placeholder:text-zinc-700 focus:ring-amber-500/20 focus:border-amber-500/50"
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
              <Alert
                variant="destructive"
                className="bg-red-950/20 border-red-900/50 text-red-200"
              >
                <XCircle className="h-4 w-4 text-red-400" />
                <AlertTitle className="text-red-400">
                  Connection Error
                </AlertTitle>
                <AlertDescription className="text-red-300/70">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleTestConnections}
                disabled={isLoading || !staging || !dev}
                variant="outline"
                className="w-full border-zinc-700 hover:bg-zinc-800 text-zinc-300"
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
                className="w-full gap-2 bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                Continue to Diff <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-xs text-zinc-600 text-center">
              Connection strings are not stored. They are only used during this
              session.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
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
      <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-950/30 px-3 py-2 rounded-md border border-emerald-900/50">
        <CheckCircle2 className="h-4 w-4" />
        <span>
          Connected to <span className="font-medium">{database}</span>
          {host && <span className="text-emerald-500/50"> @ {host}</span>}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 px-3 py-2 rounded-md border border-red-900/50">
      <XCircle className="h-4 w-4" />
      <span>{error || "Connection failed"}</span>
    </div>
  );
}
