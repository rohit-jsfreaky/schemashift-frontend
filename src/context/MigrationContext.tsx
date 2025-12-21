import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  Schema,
  DiffResult,
  MigrationExecutionResult,
  GeneratedMigration,
} from "../types";

interface MigrationContextType {
  // Connections
  stagingConnectionString: string;
  devConnectionString: string;
  setStagingConnectionString: (value: string) => void;
  setDevConnectionString: (value: string) => void;

  // Connection info
  stagingDatabase: string | null;
  devDatabase: string | null;
  stagingHost: string | null;
  devHost: string | null;
  setConnectionInfo: (
    staging: { database: string; host: string },
    dev: { database: string; host: string }
  ) => void;

  // Schemas
  stagingSchema: Schema | null;
  devSchema: Schema | null;
  setSchemas: (staging: Schema, dev: Schema) => void;

  // Diff
  diff: DiffResult | null;
  setDiff: (diff: DiffResult) => void;

  // Generated migrations
  upMigration: GeneratedMigration | null;
  downMigration: GeneratedMigration | null;
  setMigrations: (up: GeneratedMigration, down: GeneratedMigration) => void;

  // Execution results
  executionResult: MigrationExecutionResult | null;
  setExecutionResult: (result: MigrationExecutionResult) => void;

  // Reset
  reset: () => void;
}

const MigrationContext = createContext<MigrationContextType | undefined>(
  undefined
);

export function MigrationProvider({ children }: { children: ReactNode }) {
  const [stagingConnectionString, setStagingConnectionString] = useState("");
  const [devConnectionString, setDevConnectionString] = useState("");
  const [stagingDatabase, setStagingDatabase] = useState<string | null>(null);
  const [devDatabase, setDevDatabase] = useState<string | null>(null);
  const [stagingHost, setStagingHost] = useState<string | null>(null);
  const [devHost, setDevHost] = useState<string | null>(null);
  const [stagingSchema, setStagingSchema] = useState<Schema | null>(null);
  const [devSchema, setDevSchema] = useState<Schema | null>(null);
  const [diff, setDiff] = useState<DiffResult | null>(null);
  const [upMigration, setUpMigration] = useState<GeneratedMigration | null>(
    null
  );
  const [downMigration, setDownMigration] = useState<GeneratedMigration | null>(
    null
  );
  const [executionResult, setExecutionResult] =
    useState<MigrationExecutionResult | null>(null);

  const setConnectionInfo = (
    staging: { database: string; host: string },
    dev: { database: string; host: string }
  ) => {
    setStagingDatabase(staging.database);
    setStagingHost(staging.host);
    setDevDatabase(dev.database);
    setDevHost(dev.host);
  };

  const setSchemas = (staging: Schema, dev: Schema) => {
    setStagingSchema(staging);
    setDevSchema(dev);
  };

  const setMigrations = (up: GeneratedMigration, down: GeneratedMigration) => {
    setUpMigration(up);
    setDownMigration(down);
  };

  const reset = () => {
    setStagingConnectionString("");
    setDevConnectionString("");
    setStagingDatabase(null);
    setDevDatabase(null);
    setStagingHost(null);
    setDevHost(null);
    setStagingSchema(null);
    setDevSchema(null);
    setDiff(null);
    setUpMigration(null);
    setDownMigration(null);
    setExecutionResult(null);
  };

  const value: MigrationContextType = {
    stagingConnectionString,
    devConnectionString,
    setStagingConnectionString,
    setDevConnectionString,
    stagingDatabase,
    devDatabase,
    stagingHost,
    devHost,
    setConnectionInfo,
    stagingSchema,
    devSchema,
    setSchemas,
    diff,
    setDiff,
    upMigration,
    downMigration,
    setMigrations,
    executionResult,
    setExecutionResult,
    reset,
  };

  return (
    <MigrationContext.Provider value={value}>
      {children}
    </MigrationContext.Provider>
  );
}

export function useMigration() {
  const context = useContext(MigrationContext);
  if (!context) {
    throw new Error("useMigration must be used within MigrationProvider");
  }
  return context;
}
