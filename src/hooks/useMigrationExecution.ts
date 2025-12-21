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
      } catch (err: unknown) {
        // Extract meaningful error from axios response
        let message = "Migration execution failed";

        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as {
            response?: { data?: { error?: string; message?: string } };
          };
          const data = axiosError.response?.data;
          if (data?.error) {
            message = data.error;
          } else if (data?.message) {
            message = data.message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        }

        setError(message);
        throw new Error(message);
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
