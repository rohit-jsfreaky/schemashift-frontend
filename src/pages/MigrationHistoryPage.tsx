import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import TopNavbar from "@/components/TopNavbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    }
  };

  const filteredMigrations = search
    ? migrations.filter(
        (m) =>
          m.migrationName.toLowerCase().includes(search.toLowerCase()) ||
          m.targetDatabase.toLowerCase().includes(search.toLowerCase())
      )
    : migrations;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar />

      <main className="flex-1 container mx-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Migration History</CardTitle>
                <CardDescription>View all past migrations</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search migrations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {!devConnectionString ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Connect to a database to view migration history.</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Direction</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filteredMigrations.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No migrations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMigrations.map((migration) => (
                        <TableRow key={migration.id}>
                          <TableCell className="text-sm">
                            {new Date(migration.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium text-sm">
                            {migration.migrationName}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {migration.targetDatabase}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                migration.direction === "up"
                                  ? "default"
                                  : "secondary"
                              }
                              className="gap-1"
                            >
                              {migration.direction === "up" ? (
                                <ArrowUpCircle className="h-3 w-3" />
                              ) : (
                                <ArrowDownCircle className="h-3 w-3" />
                              )}
                              {migration.direction.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                migration.status === "success"
                                  ? "default"
                                  : "destructive"
                              }
                              className="gap-1"
                            >
                              {migration.status === "success" ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {migration.status === "success" ? "OK" : "Failed"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {migration.duration}ms
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(migration)}
                              className="gap-1"
                            >
                              <Eye className="h-4 w-4" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * limit + 1}-
                      {Math.min(page * limit, total)} of {total}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Migration Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Migration Details</DialogTitle>
            <DialogDescription>
              {selectedMigration?.migrationName}
            </DialogDescription>
          </DialogHeader>

          {selectedMigration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-mono text-sm">{selectedMigration.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Timestamp</p>
                  <p className="text-sm">
                    {new Date(selectedMigration.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      selectedMigration.status === "success"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {selectedMigration.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-sm">{selectedMigration.duration}ms</p>
                </div>
              </div>

              {selectedMigration.errorMessage && (
                <div>
                  <p className="text-sm font-medium text-destructive mb-1">
                    Error
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedMigration.errorMessage}
                  </p>
                </div>
              )}

              {selectedMigration.sqlExecuted && (
                <div>
                  <p className="text-sm font-medium mb-2">SQL Executed</p>
                  <ScrollArea className="h-64 rounded-lg border">
                    <SyntaxHighlighter
                      language="sql"
                      style={oneDark}
                      showLineNumbers
                      customStyle={{
                        margin: 0,
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                      }}
                    >
                      {selectedMigration.sqlExecuted}
                    </SyntaxHighlighter>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
