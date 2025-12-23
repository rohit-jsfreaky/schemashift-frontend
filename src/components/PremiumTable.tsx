import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface PremiumTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
  }[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function PremiumTable<T extends { id: string | number }>({
  data,
  columns,
  isLoading,
  emptyMessage = "No data found",
  onRowClick,
}: PremiumTableProps<T>) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-zinc-900/50 border-b border-zinc-800">
          <TableRow className="hover:bg-transparent border-zinc-800">
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                className={cn(
                  "h-10 text-xs font-medium text-zinc-500 uppercase tracking-wider",
                  col.className
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading State
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-zinc-800/50">
                {columns.map((_, j) => (
                  <TableCell key={j} className="py-4">
                    <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            // Empty State
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-64 text-center text-zinc-500"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-2">
                    <div className="h-2 w-2 rounded-full bg-zinc-700" />
                  </div>
                  <p className="text-sm font-medium">{emptyMessage}</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            // Data Rows
            data.map((item) => (
              <TableRow
                key={item.id}
                className={cn(
                  "border-zinc-800/50 transition-colors hover:bg-white/[0.02]",
                  onRowClick && "cursor-pointer"
                )}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col, idx) => (
                  <TableCell
                    key={idx}
                    className={cn("py-4 text-sm text-zinc-300", col.className)}
                  >
                    {col.cell
                      ? col.cell(item)
                      : col.accessorKey
                      ? (item[col.accessorKey] as React.ReactNode)
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
