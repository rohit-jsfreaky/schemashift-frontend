import { useState, useCallback } from "react";
import { executeMigration } from "../services/api";
import type { MigrationExecutionResult } from "../types";

export function useMigrationExecution() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<MigrationExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (
      connectionString: string,
      sql: string,
      migrationName: string,
      direction: "up" | "down",
      targetDatabase: string
    ) => {
      setIsExecuting(true);
      setError(null);
      setResult(null);

      try {
        const response = await executeMigration(
          connectionString,
          sql,
          migrationName,
          direction,
          targetDatabase
        );
        setResult(response);
        return response;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Migration execution failed";
        setError(message);
        throw err;
      } finally {
        setIsExecuting(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isExecuting,
    result,
    error,
    execute,
    reset,
  };
}
