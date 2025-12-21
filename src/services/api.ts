import axios from "axios";
import type {
  ConnectionTestResult,
  Schema,
  DiffResult,
  GeneratedMigration,
  MigrationExecutionResult,
  MigrationHistoryResult,
  MigrationRecord,
  SchemaDifferences,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Test connections to staging and dev databases
 */
export async function testConnections(
  stagingConnectionString: string,
  devConnectionString: string
): Promise<ConnectionTestResult> {
  const response = await apiClient.post<ConnectionTestResult>("/connect", {
    stagingConnectionString,
    devConnectionString,
  });
  return response.data;
}

/**
 * Extract schema from a database
 */
export async function extractSchema(connectionString: string): Promise<Schema> {
  const response = await apiClient.post<{ success: boolean; schema: Schema }>(
    "/schema/extract",
    { connectionString }
  );
  return response.data.schema;
}

/**
 * Compare two schemas and generate diff
 */
export async function generateDiff(
  stagingSchema: Schema,
  devSchema: Schema
): Promise<DiffResult> {
  const response = await apiClient.post<DiffResult>("/schema/diff", {
    stagingSchema,
    devSchema,
  });
  return response.data;
}

/**
 * Generate UP migration SQL
 */
export async function generateUpMigration(
  differences: SchemaDifferences
): Promise<GeneratedMigration> {
  const response = await apiClient.post<{
    success: boolean;
    upMigration: GeneratedMigration;
  }>("/migrations/generate-up", { differences });
  return response.data.upMigration;
}

/**
 * Generate DOWN migration SQL
 */
export async function generateDownMigration(
  differences: SchemaDifferences
): Promise<GeneratedMigration> {
  const response = await apiClient.post<{
    success: boolean;
    downMigration: GeneratedMigration;
  }>("/migrations/generate-down", { differences });
  return response.data.downMigration;
}

/**
 * Execute migration SQL
 */
export async function executeMigration(
  connectionString: string,
  sql: string,
  migrationName: string,
  direction: "up" | "down",
  targetDatabase: string
): Promise<MigrationExecutionResult> {
  const response = await apiClient.post<MigrationExecutionResult>(
    "/migrations/execute",
    {
      connectionString,
      sql,
      migrationName,
      direction,
      targetDatabase,
    }
  );
  return response.data;
}

/**
 * Get migration history
 */
export async function getMigrationHistory(
  connectionString: string,
  limit = 20,
  offset = 0,
  targetDatabase?: string,
  status?: "success" | "failed"
): Promise<MigrationHistoryResult> {
  const params = new URLSearchParams();
  params.set("limit", limit.toString());
  params.set("offset", offset.toString());
  if (targetDatabase) params.set("targetDatabase", targetDatabase);
  if (status) params.set("status", status);

  const response = await apiClient.get<MigrationHistoryResult>(
    `/migrations/history?${params.toString()}`,
    {
      headers: {
        "x-connection-string": connectionString,
      },
    }
  );
  return response.data;
}

/**
 * Get migration details by ID
 */
export async function getMigrationDetails(
  connectionString: string,
  migrationId: string
): Promise<MigrationRecord> {
  const response = await apiClient.get<{
    success: boolean;
    migration: MigrationRecord;
  }>(`/migrations/${migrationId}`, {
    headers: {
      "x-connection-string": connectionString,
    },
  });
  return response.data.migration;
}
