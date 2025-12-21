import type { Column, Index, Table } from "./schema";

/**
 * Added column with table context
 */
export interface AddedColumn {
  table: string;
  column: Column;
}

/**
 * Removed column with table context
 */
export interface RemovedColumn {
  table: string;
  column: {
    name: string;
    type: string;
  };
}

/**
 * Column modification details
 */
export interface ModifiedColumn {
  table: string;
  columnName: string;
  from: {
    type: string;
    nullable: boolean;
    default: string | null;
  };
  to: {
    type: string;
    nullable: boolean;
    default: string | null;
  };
  changes: ("type_changed" | "nullable_changed" | "default_changed")[];
}

/**
 * Added index with table context
 */
export interface AddedIndex {
  table: string;
  index: Index;
}

/**
 * Removed index reference
 */
export interface RemovedIndex {
  table: string;
  indexName: string;
}

/**
 * Added foreign key
 */
export interface AddedForeignKey {
  table: string;
  column: string;
  referencedTable: string;
  referencedColumn: string;
}

/**
 * Removed foreign key reference
 */
export interface RemovedForeignKey {
  table: string;
  column: string;
}

/**
 * All schema differences between staging and dev
 */
export interface SchemaDifferences {
  addedTables: Table[];
  removedTables: { name: string }[];
  addedColumns: AddedColumn[];
  removedColumns: RemovedColumn[];
  modifiedColumns: ModifiedColumn[];
  addedIndexes: AddedIndex[];
  removedIndexes: RemovedIndex[];
  addedForeignKeys: AddedForeignKey[];
  removedForeignKeys: RemovedForeignKey[];
}

/**
 * Summary statistics of schema differences
 */
export interface DiffSummary {
  hasChanges: boolean;
  addedTableCount: number;
  removedTableCount: number;
  addedColumnCount: number;
  removedColumnCount: number;
  modifiedColumnCount: number;
  hasDestructiveChanges: boolean;
  changesSummary: string;
}

/**
 * Complete diff result
 */
export interface DiffResult {
  success: boolean;
  differences: SchemaDifferences;
  summary: DiffSummary;
  error?: string;
}
