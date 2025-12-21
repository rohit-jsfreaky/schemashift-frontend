import { useState, useCallback } from "react";
import {
  extractSchema,
  generateDiff,
  generateUpMigration,
  generateDownMigration,
} from "../services/api";
import type { Schema, DiffResult, GeneratedMigration } from "../types";

export function useSchemaDiff() {
  const [isLoading, setIsLoading] = useState(false);
  const [stagingSchema, setStagingSchema] = useState<Schema | null>(null);
  const [devSchema, setDevSchema] = useState<Schema | null>(null);
  const [diff, setDiff] = useState<DiffResult | null>(null);
  const [upMigration, setUpMigration] = useState<GeneratedMigration | null>(
    null
  );
  const [downMigration, setDownMigration] = useState<GeneratedMigration | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const extractAndDiff = useCallback(
    async (stagingConnectionString: string, devConnectionString: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Extract schemas in parallel
        const [staging, dev] = await Promise.all([
          extractSchema(stagingConnectionString),
          extractSchema(devConnectionString),
        ]);

        setStagingSchema(staging);
        setDevSchema(dev);

        // Generate diff
        const diffResult = await generateDiff(staging, dev);
        setDiff(diffResult);

        // Generate migrations if there are changes
        if (diffResult.summary.hasChanges) {
          const [up, down] = await Promise.all([
            generateUpMigration(diffResult.differences),
            generateDownMigration(diffResult.differences),
          ]);
          setUpMigration(up);
          setDownMigration(down);
        }

        return { staging, dev, diff: diffResult };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Schema extraction failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStagingSchema(null);
    setDevSchema(null);
    setDiff(null);
    setUpMigration(null);
    setDownMigration(null);
    setError(null);
  }, []);

  return {
    isLoading,
    stagingSchema,
    devSchema,
    diff,
    upMigration,
    downMigration,
    error,
    extractAndDiff,
    reset,
  };
}
