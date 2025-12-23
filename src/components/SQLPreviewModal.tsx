import { useState } from "react";
import { Copy, Check, AlertTriangle, Code2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { GeneratedMigration } from "@/types";

interface SQLPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: () => void;
  upMigration: GeneratedMigration | null;
  downMigration: GeneratedMigration | null;
}

export default function SQLPreviewModal({
  isOpen,
  onClose,
  onExecute,
  upMigration,
  downMigration,
}: SQLPreviewModalProps) {
  const [activeTab, setActiveTab] = useState("up");
  const [copied, setCopied] = useState(false);

  const handleCopy = async (sql: string) => {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentMigration = activeTab === "up" ? upMigration : downMigration;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[85vh] flex flex-col bg-zinc-950 border-zinc-800 p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <DialogTitle className="flex items-center gap-3 text-xl font-medium text-white">
            <Code2 className="h-5 w-5 text-zinc-400" />
            SQL Migration Preview
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Review the generated SQL statements before executing.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col p-6 bg-zinc-950/50">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-zinc-900 border border-zinc-800">
                <TabsTrigger
                  value="up"
                  className="gap-2 px-4 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                >
                  UP Migration
                  {upMigration && (
                    <Badge
                      variant="outline"
                      className="ml-2 bg-emerald-950/30 text-emerald-400 border-none"
                    >
                      {upMigration.statementCount} stmts
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="down"
                  className="gap-2 px-4 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
                >
                  DOWN Migration
                  {downMigration?.riskLevel && (
                    <Badge
                      className={`ml-2 border-none ${
                        downMigration.riskLevel === "high"
                          ? "bg-red-950/30 text-red-400"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {downMigration.riskLevel.toUpperCase()}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="up"
              className="flex-1 flex flex-col min-h-0 mt-0"
            >
              <SQLContent
                sql={upMigration?.fullSql || ""}
                onCopy={() => handleCopy(upMigration?.fullSql || "")}
                copied={copied}
                warnings={upMigration?.warnings}
              />
            </TabsContent>

            <TabsContent
              value="down"
              className="flex-1 flex flex-col min-h-0 mt-0"
            >
              <SQLContent
                sql={downMigration?.fullSql || ""}
                onCopy={() => handleCopy(downMigration?.fullSql || "")}
                copied={copied}
                warnings={downMigration?.warnings}
              />
            </TabsContent>
          </Tabs>

          {currentMigration?.hasDestructiveChanges && activeTab === "up" && (
            <div className="mt-4 rounded-lg border border-red-900/50 bg-red-950/20 p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
              <div>
                <h4 className="font-medium text-red-400 text-sm">
                  Destructive Changes Detected
                </h4>
                <p className="text-red-400/70 text-sm mt-0.5">
                  This migration contains DROP statements that will permanently
                  delete data.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={onExecute}
            disabled={!upMigration}
            className="bg-white text-black hover:bg-zinc-200 min-w-[150px]"
          >
            Execute Migration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SQLContent({
  sql,
  onCopy,
  copied,
  warnings,
}: {
  sql: string;
  onCopy: () => void;
  copied: boolean;
  warnings?: string[];
}) {
  const hasWarnings = warnings && warnings.length > 0;
  const sqlHeight = hasWarnings ? "h-[280px]" : "h-[350px]";


  return (
    <div className="flex flex-col gap-4 h-full">
      {/* SQL Code */}
      <div className="relative flex-1 min-h-0 border border-zinc-800 rounded-lg overflow-hidden bg-[#1a1a1a]">
        <div className="absolute top-0 right-0 p-2 z-10 bg-gradient-to-l from-[#1a1a1a] via-[#1a1a1a] to-transparent pl-8">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={onCopy}
          >
            {copied ? (
              <span className="flex items-center text-emerald-400">
                <Check className="h-3.5 w-3.5 mr-1" /> Copied
              </span>
            ) : (
              <span className="flex items-center">
                <Copy className="h-3.5 w-3.5 mr-1" /> Copy SQL
              </span>
            )}
          </Button>
        </div>

        <div className="h-full overflow-auto custom-scrollbar">
          <SyntaxHighlighter
            language="sql"
            style={oneDark}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: "1.5rem",
              fontSize: "0.875rem",
              lineHeight: "1.5",
              minHeight: "100%",
              background: "transparent",
            }}
          >
            {sql || "-- No SQL generated"}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Warnings */}
      {hasWarnings && (
        <div className="shrink-0 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-2">
            {warnings.map((warning, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5"
              >
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-amber-400/90 text-sm">{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
