import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowLeftRight,
  Code2,
  Play,
  AlertTriangle,
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import ChangesSummary from "@/components/ChangesSummary";
import SchemaTable from "@/components/SchemaTable";
import SQLPreviewModal from "@/components/SQLPreviewModal";
import ExecutionConfirmation from "@/components/ExecutionConfirmation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMigration } from "@/context/MigrationContext";
import { useSchemaDiff, useMigrationExecution } from "@/hooks";
import type { Table } from "@/types";

export default function DiffViewerPage() {
  const navigate = useNavigate();
  const {
    stagingConnectionString,
    devConnectionString,
    devDatabase,
    devHost,
    setSchemas,
    setDiff,
    setMigrations,
    setExecutionResult,
  } = useMigration();

  const {
    isLoading,
    stagingSchema,
    devSchema,
    diff,
    upMigration,
    downMigration,
    error,
    extractAndDiff,
  } = useSchemaDiff();

  const { execute } = useMigrationExecution();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("tables");
  const [showSQLPreview, setShowSQLPreview] = useState(false);
  const [showExecuteConfirm, setShowExecuteConfirm] = useState(false);

  // Redirect if no connection strings
  useEffect(() => {
    if (!stagingConnectionString || !devConnectionString) {
      navigate("/connect");
      return;
    }

    // Extract and diff schemas on mount
    extractAndDiff(stagingConnectionString, devConnectionString)
      .then((result) => {
        if (result) {
          setSchemas(result.staging, result.dev);
          setDiff(result.diff);
        }
      })
      .catch(() => {
        // Error handled by hook
      });
  }, [stagingConnectionString, devConnectionString]);

  // Update context when migrations are generated
  useEffect(() => {
    if (upMigration && downMigration) {
      setMigrations(upMigration, downMigration);
    }
  }, [upMigration, downMigration]);

  const handleExecute = async () => {
    if (!upMigration || !devDatabase) return;

    const result = await execute(
      devConnectionString,
      upMigration.fullSql,
      `migration_${Date.now()}`,
      "up",
      devDatabase
    );

    // Only navigate on success
    setExecutionResult(result);
    setShowExecuteConfirm(false);
    navigate("/results");
  };

  // Filter tables by search term
  const filterTables = (tables: Table[]) => {
    if (!tables) return [];
    if (!searchTerm) return tables;
    return tables.filter((t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const stagingFiltered = filterTables(stagingSchema?.tables || []);
  const devFiltered = filterTables(devSchema?.tables || []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          {/* Skeleton for Summary */}
          <div className="space-y-3">
            <div className="h-20 bg-zinc-900/50 border border-zinc-800 rounded-lg animate-pulse" />
            <div className="h-20 bg-zinc-900/50 border border-zinc-800 rounded-lg animate-pulse" />
          </div>

          {/* Skeleton for Main Card */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse" />
                <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Skeleton for tabs */}
              <div className="flex gap-4 mb-4">
                <div className="h-9 w-24 bg-zinc-800 rounded animate-pulse" />
                <div className="h-9 w-24 bg-zinc-800 rounded animate-pulse" />
              </div>

              {/* Skeleton for table grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="h-5 w-32 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-48 bg-zinc-900/50 rounded-lg animate-pulse" />
                  <div className="h-48 bg-zinc-900/50 rounded-lg animate-pulse" />
                </div>
                <div className="space-y-4">
                  <div className="h-5 w-40 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-48 bg-zinc-900/50 rounded-lg animate-pulse" />
                  <div className="h-48 bg-zinc-900/50 rounded-lg animate-pulse" />
                  <div className="h-48 bg-zinc-900/50 rounded-lg animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-zinc-500 animate-pulse">
            Analyzing schemas and generating diff...
          </p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-1000" />
            <div className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full backdrop-blur-xl">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/30">
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Connection Failed
              </h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                {error ||
                  "Unable to establish a connection to the database. Please check your network and try again."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-white text-black hover:bg-zinc-200"
                >
                  Retry Connection
                </Button>
                <Button
                  onClick={() => navigate("/connect")}
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                >
                  Back to Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Changes Summary */}
        {diff && <ChangesSummary summary={diff.summary} />}

        {/* Main Content */}
        <Card className="bg-zinc-900/30 border-zinc-800 backdrop-blur-sm text-zinc-200">
          <CardHeader className="border-b border-zinc-800/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white text-lg">
                <ArrowLeftRight className="h-5 w-5 text-zinc-400" />
                Schema Comparison
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="bg-emerald-950/20 text-emerald-400 border-emerald-900/50 font-mono"
                >
                  {stagingSchema?.database || "Source"}
                </Badge>
                <span className="text-zinc-600">→</span>
                <Badge
                  variant="outline"
                  className="bg-amber-950/20 text-amber-400 border-amber-900/50 font-mono"
                >
                  {devSchema?.database || "Target"}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <TabsList className="bg-zinc-950 border border-zinc-800">
                  <TabsTrigger
                    value="tables"
                    className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                  >
                    Tables View
                  </TabsTrigger>
                  <TabsTrigger
                    value="summary"
                    className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                  >
                    Summary View
                  </TabsTrigger>
                </TabsList>

                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input
                    placeholder="Search tables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-zinc-950/50 border-zinc-800 text-zinc-300 placeholder:text-zinc-600 focus:ring-zinc-700"
                  />
                </div>
              </div>

              {/* Color Legend */}
              <div className="flex flex-wrap items-center gap-4 py-3 px-4 rounded-lg bg-zinc-950/50 border border-zinc-800/50 mb-6">
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wide">
                  Legend:
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-zinc-400">Added</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs text-zinc-400">Modified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-xs text-zinc-400">Removed</span>
                </div>
              </div>

              <TabsContent value="tables" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Source Schema */}
                  <div className="space-y-4 min-w-0">
                    <h3 className="font-semibold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Source Schema ({stagingFiltered.length} tables)
                    </h3>
                    <div className="h-[600px] overflow-auto rounded-lg border border-zinc-800 bg-zinc-950/30 p-2">
                      <div className="space-y-4">
                        {stagingFiltered.map((table) => {
                          // Tables that exist only in Source = will be ADDED to Target
                          const isAdded = diff?.differences.addedTables.some(
                            (t) => t.name === table.name
                          );
                          // Columns in Source that don't exist in Target = will be ADDED
                          const addedCols =
                            diff?.differences.addedColumns
                              .filter((c) => c.table === table.name)
                              .map((c) => c.column.name) || [];
                          // Modified columns
                          const modifiedCols =
                            diff?.differences.modifiedColumns
                              .filter((c) => c.table === table.name)
                              .map((c) => c.columnName) || [];
                          return (
                            <SchemaTable
                              key={table.name}
                              table={table}
                              highlightType={isAdded ? "added" : undefined}
                              addedColumns={addedCols}
                              modifiedColumns={modifiedCols}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Target Schema */}
                  <div className="space-y-4 min-w-0">
                    <h3 className="font-semibold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      Target Schema ({devFiltered.length} tables)
                    </h3>
                    <div className="h-[600px] overflow-auto rounded-lg border border-zinc-800 bg-zinc-950/30 p-2">
                      <div className="space-y-4">
                        {devFiltered.map((table) => {
                          const isAdded = diff?.differences.addedTables.some(
                            (t) => t.name === table.name
                          );
                          const addedCols =
                            diff?.differences.addedColumns
                              .filter((c) => c.table === table.name)
                              .map((c) => c.column.name) || [];
                          const modifiedCols =
                            diff?.differences.modifiedColumns
                              .filter((c) => c.table === table.name)
                              .map((c) => c.columnName) || [];

                          return (
                            <SchemaTable
                              key={table.name}
                              table={table}
                              highlightType={isAdded ? "added" : undefined}
                              addedColumns={addedCols}
                              modifiedColumns={modifiedCols}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <div className="p-12 text-center text-zinc-500 border border-zinc-800 border-dashed rounded-xl bg-zinc-950/30">
                  {diff?.summary.changesSummary || "No changes detected"}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sticky bottom-6 bg-black/80 backdrop-blur p-4 rounded-xl border border-zinc-800 shadow-2xl">
          <Button
            variant="outline"
            onClick={() => setShowSQLPreview(true)}
            disabled={!upMigration}
            className="gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <Code2 className="h-4 w-4" /> Review SQL
          </Button>
          <Button
            onClick={() => setShowExecuteConfirm(true)}
            disabled={!upMigration || !diff?.summary.hasChanges}
            className="gap-2 bg-white text-black hover:bg-zinc-200"
          >
            <Play className="h-4 w-4" /> Execute Migration →
          </Button>
        </div>
      </div>

      {/* SQL Preview Modal */}
      <SQLPreviewModal
        isOpen={showSQLPreview}
        onClose={() => setShowSQLPreview(false)}
        onExecute={() => {
          setShowSQLPreview(false);
          setShowExecuteConfirm(true);
        }}
        upMigration={upMigration}
        downMigration={downMigration}
      />

      {/* Execution Confirmation */}
      <ExecutionConfirmation
        isOpen={showExecuteConfirm}
        onClose={() => setShowExecuteConfirm(false)}
        onConfirm={handleExecute}
        targetDatabase={devDatabase || "development"}
        targetHost={devHost || "unknown"}
        migrationSummary={diff?.summary.changesSummary || ""}
        sqlPreview={upMigration?.fullSql || ""}
        isDestructive={upMigration?.hasDestructiveChanges || false}
        statementCount={upMigration?.statementCount || 0}
      />
    </MainLayout>
  );
}
