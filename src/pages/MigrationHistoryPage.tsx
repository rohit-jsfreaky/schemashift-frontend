import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Loader2,
  Clock,
  Database,
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { PremiumTable } from "@/components/PremiumTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useMigration } from "@/context/MigrationContext";
import { getMigrationHistory, getMigrationDetails } from "@/services/api";
import type { MigrationRecord } from "@/types";

export default function MigrationHistoryPage() {
  const { devConnectionString } = useMigration();
  const [migrations, setMigrations] = useState<MigrationRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState<string | null>(null);
  const [selectedMigration, setSelectedMigration] =
    useState<MigrationRecord | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const limit = 10;

  useEffect(() => {
    if (devConnectionString) {
      fetchMigrations();
    }
  }, [devConnectionString, page]);

  const fetchMigrations = async () => {
    if (!devConnectionString) return;

    setLoading(true);
    try {
      const result = await getMigrationHistory(
        devConnectionString,
        limit,
        (page - 1) * limit
      );
      setMigrations(result.migrations);
      setTotal(result.total);
    } catch (error) {
      console.error("Failed to fetch migrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (migration: MigrationRecord) => {
    if (!devConnectionString) return;

    setViewLoading(migration.id);
    try {
      const details = await getMigrationDetails(
        devConnectionString,
        migration.id
      );
      setSelectedMigration(details);
      setShowDetails(true);
    } catch (error) {
      console.error("Failed to fetch migration details:", error);
      setSelectedMigration(migration);
      setShowDetails(true);
    } finally {
      setViewLoading(null);
    }
  };

  const filteredMigrations = search
    ? migrations.filter(
        (m) =>
          m.migrationName.toLowerCase().includes(search.toLowerCase()) ||
          m.targetDatabase.toLowerCase().includes(search.toLowerCase())
      )
    : migrations;

  const columns = [
    {
      header: "Timestamp",
      cell: (m: MigrationRecord) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs text-zinc-400">
            {new Date(m.timestamp).toLocaleDateString()}
          </span>
          <span className="text-xs text-zinc-500">
            {new Date(m.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ),
    },
    {
      header: "Migration Name",
      cell: (m: MigrationRecord) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-zinc-200">{m.migrationName}</span>
        </div>
      ),
    },
    {
      header: "Target DB",
      cell: (m: MigrationRecord) => (
        <Badge
          variant="outline"
          className="font-mono text-xs border-zinc-700 text-zinc-400 bg-zinc-900/50"
        >
          {m.targetDatabase}
        </Badge>
      ),
    },
    {
      header: "Direction",
      cell: (m: MigrationRecord) => (
        <div
          className={`flex items-center gap-1.5 text-xs font-medium ${
            m.direction === "up" ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          {m.direction === "up" ? (
            <ArrowUpCircle className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownCircle className="h-3.5 w-3.5" />
          )}
          <span className="uppercase">{m.direction}</span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (m: MigrationRecord) => (
        <div
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
            m.status === "success"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {m.status === "success" ? (
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
          ) : (
            <div className="h-1.5 w-1.5 rounded-full bg-red-400 mr-1.5" />
          )}
          {m.status === "success" ? "Success" : "Failed"}
        </div>
      ),
    },
    {
      header: "Duration",
      cell: (m: MigrationRecord) => (
        <span className="font-mono text-xs text-zinc-500 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {m.duration}ms
        </span>
      ),
    },
    {
      header: "",
      className: "w-[80px]",
      cell: (m: MigrationRecord) => (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(m);
            }}
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full"
            disabled={viewLoading === m.id}
          >
            {viewLoading === m.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
              Migration History
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Audit log of all database schema changes.
            </p>
          </div>
          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
            <Input
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-zinc-900/50 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus:ring-zinc-700 focus:border-zinc-700 transition-all"
            />
          </div>
        </div>

        {!devConnectionString ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
              <Database className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No Database Connected
            </h3>
            <p className="text-zinc-500 max-w-sm mx-auto mb-6">
              Connect to a database to verify schemas and view migration
              history.
            </p>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Connect Database
            </Button>
          </div>
        ) : (
          <>
            <PremiumTable
              data={filteredMigrations}
              columns={columns}
              isLoading={loading}
              emptyMessage="No migrations recorded yet."
              onRowClick={(m) => handleViewDetails(m)}
            />
          </>
        )}

        {/* Migration Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-3xl max-h-[85vh] bg-[#0a0a0a] border-zinc-800 text-zinc-200 flex flex-col overflow-hidden shadow-2xl shadow-black/90">
            <DialogHeader className="shrink-0 border-b border-zinc-900 pb-4">
              <DialogTitle className="text-xl text-white flex items-center gap-3">
                <span className="font-mono text-zinc-500">
                  #{selectedMigration?.id.slice(0, 6)}
                </span>
                {selectedMigration?.migrationName}
                {selectedMigration?.status === "success" ? (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-none hover:bg-emerald-500/20">
                    Success
                  </Badge>
                ) : (
                  <Badge
                    variant="destructive"
                    className="bg-red-500/10 text-red-400 border-none"
                  >
                    Failed
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {selectedMigration &&
                    new Date(selectedMigration.timestamp).toLocaleString()}
                </span>
                <span>•</span>
                <span>{selectedMigration?.targetDatabase}</span>
              </DialogDescription>
            </DialogHeader>

            {selectedMigration && (
              <div className="flex-1 overflow-y-auto space-y-6 pt-6 pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">
                      Direction
                    </p>
                    <div
                      className={`flex items-center gap-2 font-medium ${
                        selectedMigration.direction === "up"
                          ? "text-emerald-400"
                          : "text-amber-400"
                      }`}
                    >
                      {selectedMigration.direction === "up" ? (
                        <ArrowUpCircle className="h-4 w-4" />
                      ) : (
                        <ArrowDownCircle className="h-4 w-4" />
                      )}
                      <span className="uppercase">
                        {selectedMigration.direction}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-2">
                      Duration
                    </p>
                    <div className="flex items-center gap-2 font-mono text-zinc-300">
                      <Clock className="h-4 w-4 text-zinc-600" />
                      {selectedMigration.duration}ms
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {selectedMigration.errorMessage && (
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40">
                    <p className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                      <XCircle className="h-4 w-4" /> Error Details
                    </p>
                    <p className="text-sm text-red-300/70 font-mono break-all leading-relaxed">
                      {selectedMigration.errorMessage}
                    </p>
                  </div>
                )}

                {/* SQL Executed */}
                {selectedMigration.sqlExecuted && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                        SQL Statement
                      </p>
                      <Badge
                        variant="outline"
                        className="border-zinc-800 text-zinc-600 text-[10px] font-mono"
                      >
                        Read-only
                      </Badge>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-[#050505] overflow-hidden">
                      <SyntaxHighlighter
                        language="sql"
                        style={oneDark}
                        showLineNumbers
                        customStyle={{
                          margin: 0,
                          padding: "1.5rem",
                          fontSize: "0.80rem",
                          lineHeight: "1.5",
                          background: "transparent",
                        }}
                      >
                        {selectedMigration.sqlExecuted}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
