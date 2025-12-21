import { Key, Link2, Fingerprint, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Table, Column } from "@/types";

interface SchemaTableProps {
  table: Table;
  highlightType?: "added" | "removed" | "modified";
  modifiedColumns?: string[];
  addedColumns?: string[];
  removedColumns?: string[];
}

export default function SchemaTable({
  table,
  highlightType,
  modifiedColumns = [],
  addedColumns = [],
  removedColumns = [],
}: SchemaTableProps) {
  const getRowClass = (columnName: string) => {
    if (addedColumns.includes(columnName)) return "bg-emerald-500/10";
    if (removedColumns.includes(columnName)) return "bg-destructive/10";
    if (modifiedColumns.includes(columnName)) return "bg-amber-500/10";
    return "";
  };

  const getHeaderClass = () => {
    if (highlightType === "added") return "bg-emerald-500/20 text-emerald-400";
    if (highlightType === "removed")
      return "bg-destructive/20 text-destructive";
    return "";
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className={`px-4 py-3 border-b border-border ${getHeaderClass()}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{table.name}</h3>
          {highlightType === "added" && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
              NEW
            </Badge>
          )}
          {highlightType === "removed" && (
            <Badge variant="destructive">DROPPED</Badge>
          )}
        </div>
      </div>

      <ScrollArea className="max-h-[400px]">
        <UITable>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[180px]">Column</TableHead>
              <TableHead className="w-[150px]">Type</TableHead>
              <TableHead>Constraints</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.columns.map((column) => (
              <TableRow key={column.name} className={getRowClass(column.name)}>
                <TableCell className="font-medium font-mono text-sm">
                  {column.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {column.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ConstraintBadges column={column} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </UITable>
      </ScrollArea>
    </div>
  );
}

function ConstraintBadges({ column }: { column: Column }) {
  return (
    <div className="flex flex-wrap gap-1">
      {column.isPrimaryKey && (
        <Badge variant="secondary" className="text-xs gap-1">
          <Key className="h-3 w-3" /> PK
        </Badge>
      )}
      {column.isForeignKey && (
        <Badge variant="secondary" className="text-xs gap-1">
          <Link2 className="h-3 w-3" /> FK
        </Badge>
      )}
      {column.isUnique && !column.isPrimaryKey && (
        <Badge variant="secondary" className="text-xs gap-1">
          <Fingerprint className="h-3 w-3" /> UNIQUE
        </Badge>
      )}
      {!column.nullable && (
        <Badge
          variant="outline"
          className="text-xs gap-1 border-amber-500/50 text-amber-400"
        >
          <Ban className="h-3 w-3" /> NOT NULL
        </Badge>
      )}
      {column.default && (
        <Badge variant="outline" className="text-xs font-mono">
          = {column.default}
        </Badge>
      )}
    </div>
  );
}
