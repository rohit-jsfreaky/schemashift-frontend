import { useState, useCallback } from "react";
import { testConnections } from "../services/api";
import type { ConnectionTestResult } from "../types";

export function useConnectionValidation() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConnectionTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(
    async (stagingConnectionString: string, devConnectionString: string) => {
      setIsLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await testConnections(
          stagingConnectionString,
          devConnectionString
        );
        setResult(response);
        return response;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Connection test failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isLoading,
    result,
    error,
    validate,
    reset,
  };
}
