/**
 * Foreign key reference information
 */
export interface ForeignKeyReference {
  table: string;
  column: string;
}

/**
 * Column definition in a database table
 */
export interface Column {
  name: string;
  type: string;
  nullable: boolean;
  default: string | null;
  isPrimaryKey: boolean;
  isUnique: boolean;
  isForeignKey: boolean;
  foreignKeyReference: ForeignKeyReference | null;
}

/**
 * Index definition on a table
 */
export interface Index {
  name: string;
  columns: string[];
  isUnique: boolean;
  indexType: string;
}

/**
 * Constraint definition on a table
 */
export interface Constraint {
  name: string;
  type: "PRIMARY KEY" | "UNIQUE" | "FOREIGN KEY" | "CHECK";
  columns: string[];
  referencedTable?: string;
  referencedColumns?: string[];
}

/**
 * Table definition with columns, indexes, and constraints
 */
export interface Table {
  name: string;
  columns: Column[];
  indexes: Index[];
  constraints: Constraint[];
}

/**
 * Full database schema
 */
export interface Schema {
  database: string;
  tables: Table[];
}
