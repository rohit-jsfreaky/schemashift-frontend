/**
 * Database connection info
 */
export interface ConnectionInfo {
  connected: boolean;
  database?: string;
  host?: string;
  port?: number;
  error?: string;
}

/**
 * Connection test result
 */
export interface ConnectionTestResult {
  success: boolean;
  staging: ConnectionInfo;
  dev: ConnectionInfo;
}

/**
 * Generated migration
 */
export interface GeneratedMigration {
  fullSql: string;
  statements: string[];
  statementCount: number;
  hasDestructiveChanges: boolean;
  warnings: string[];
  riskLevel?: "low" | "medium" | "high";
}

/**
 * Migration execution result
 */
export interface MigrationExecutionResult {
  success: boolean;
  migrationId: string | null;
  timestamp: string;
  executedStatements: number;
  totalStatements: number;
  direction: "up" | "down";
  targetDatabase: string;
  duration: {
    ms: number;
    seconds: number;
  };
  message: string;
  failedAtStatement?: number;
  failedStatement?: string;
  error?: string;
  errorCode?: string;
}

/**
 * Migration history record
 */
export interface MigrationRecord {
  id: string;
  timestamp: string;
  migrationName: string;
  targetDatabase: string;
  direction: "up" | "down";
  status: "success" | "failed";
  executedStatements: number;
  totalStatements: number;
  duration: number;
  errorMessage: string | null;
  sqlExecuted?: string;
}

/**
 * Migration history response
 */
export interface MigrationHistoryResult {
  success: boolean;
  total: number;
  limit: number;
  offset: number;
  migrations: MigrationRecord[];
}
