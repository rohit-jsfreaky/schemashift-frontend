import { Key, Link2, Fingerprint, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

      <div className="border-t border-zinc-800 overflow-x-auto">
        <table className="w-full min-w-[500px] text-sm">
          <thead className="bg-zinc-900/50">
            <tr className="border-b border-zinc-800">
              <th className="w-[140px] px-4 py-3 text-left text-zinc-400 font-medium whitespace-nowrap">
                Column
              </th>
              <th className="w-[160px] px-4 py-3 text-left text-zinc-400 font-medium whitespace-nowrap">
                Type
              </th>
              <th className="min-w-[200px] px-4 py-3 text-left text-zinc-400 font-medium whitespace-nowrap">
                Constraints
              </th>
            </tr>
          </thead>
          <tbody>
            {table.columns.map((column) => (
              <tr
                key={column.name}
                className={`border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors ${getRowClass(
                  column.name
                )}`}
              >
                <td className="px-4 py-2 font-medium font-mono text-sm text-zinc-200 whitespace-nowrap">
                  {column.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <Badge
                    variant="outline"
                    className="font-mono text-xs whitespace-nowrap bg-zinc-900 border-zinc-700 text-zinc-400"
                  >
                    {column.type}
                  </Badge>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <ConstraintBadges column={column} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConstraintBadges({ column }: { column: Column }) {
  return (
    <div className="flex gap-1">
      {column.isPrimaryKey && (
        <Badge variant="secondary" className="text-xs gap-1 whitespace-nowrap">
          <Key className="h-3 w-3" /> PK
        </Badge>
      )}
      {column.isForeignKey && (
        <Badge variant="secondary" className="text-xs gap-1 whitespace-nowrap">
          <Link2 className="h-3 w-3" /> FK
        </Badge>
      )}
      {column.isUnique && !column.isPrimaryKey && (
        <Badge variant="secondary" className="text-xs gap-1 whitespace-nowrap">
          <Fingerprint className="h-3 w-3" /> UNIQUE
        </Badge>
      )}
      {!column.nullable && (
        <Badge
          variant="outline"
          className="text-xs gap-1 border-amber-500/50 text-amber-400 whitespace-nowrap"
        >
          <Ban className="h-3 w-3" /> NOT NULL
        </Badge>
      )}
      {column.default && (
        <Badge variant="outline" className="text-xs font-mono whitespace-nowrap">
          = {column.default}
        </Badge>
      )}
    </div>
  );
}
