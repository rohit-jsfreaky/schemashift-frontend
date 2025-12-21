import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, ArrowLeftRight, Code2, Play } from "lucide-react";
import TopNavbar from "@/components/TopNavbar";
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

    try {
      const result = await execute(
        devConnectionString,
        upMigration.fullSql,
        `migration_${Date.now()}`,
        "up",
        devDatabase
      );
      setExecutionResult(result);
      setShowExecuteConfirm(false);
      navigate("/results");
    } catch {
      // Error handled by hook
    }
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
      <div className="min-h-screen bg-background flex flex-col">
        <TopNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-lg">Extracting and comparing schemas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => navigate("/connect")}>
                ← Back to Connections
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar />

      <main className="flex-1 container mx-auto p-6 space-y-6">
        {/* Changes Summary */}
        {diff && <ChangesSummary summary={diff.summary} />}

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5" />
                Schema Comparison
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {stagingSchema?.database || "Staging"}
                </Badge>
                <span className="text-muted-foreground">→</span>
                <Badge variant="outline">{devSchema?.database || "Dev"}</Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="tables">Tables View</TabsTrigger>
                  <TabsTrigger value="summary">Summary View</TabsTrigger>
                </TabsList>

                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <TabsContent value="tables">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Staging Schema */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Staging ({stagingFiltered.length} tables)
                    </h3>
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-4">
                        {stagingFiltered.map((table) => {
                          const isRemoved =
                            diff?.differences.removedTables.some(
                              (t) => t.name === table.name
                            );
                          return (
                            <SchemaTable
                              key={table.name}
                              table={table}
                              highlightType={isRemoved ? "removed" : undefined}
                            />
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Dev Schema */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Development ({devFiltered.length} tables)
                    </h3>
                    <ScrollArea className="h-[600px] pr-4">
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
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="summary">
                <div className="p-8 text-center text-muted-foreground">
                  {diff?.summary.changesSummary || "No changes detected"}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setShowSQLPreview(true)}
            disabled={!upMigration}
            className="gap-2"
          >
            <Code2 className="h-4 w-4" /> Review SQL
          </Button>
          <Button
            onClick={() => setShowExecuteConfirm(true)}
            disabled={!upMigration || !diff?.summary.hasChanges}
            className="gap-2"
          >
            <Play className="h-4 w-4" /> Execute Migration →
          </Button>
        </div>
      </main>

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
    </div>
  );
}
