import { useState } from "react";
import { Copy, Check, AlertTriangle } from "lucide-react";
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
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            SQL Migration Preview
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Review the generated SQL before executing
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col min-h-0"
        >
          <TabsList className="w-full justify-start bg-zinc-800">
            <TabsTrigger value="up" className="gap-2">
              UP Migration
              {upMigration && (
                <Badge variant="secondary" className="text-xs">
                  {upMigration.statementCount} statements
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="down" className="gap-2">
              DOWN Migration
              {downMigration?.riskLevel && (
                <Badge
                  variant={
                    downMigration.riskLevel === "high"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {downMigration.riskLevel} risk
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="up"
            className="flex-1 flex flex-col min-h-0 mt-4 space-y-3"
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
            className="flex-1 flex flex-col min-h-0 mt-4 space-y-3"
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
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Destructive Changes</AlertTitle>
            <AlertDescription>
              This migration contains DROP statements that will permanently
              delete data.
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onExecute} disabled={!upMigration}>
            Execute Migration →
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
    <div className="flex flex-col gap-3">
      {/* SQL Code */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10 text-zinc-300 hover:text-white"
          onClick={onCopy}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" /> Copy
            </>
          )}
        </Button>
        <ScrollArea
          className={`${sqlHeight} rounded-lg border border-zinc-700`}
        >
          <SyntaxHighlighter
            language="sql"
            style={oneDark}
            showLineNumbers
            wrapLongLines
            customStyle={{
              margin: 0,
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              minHeight: "100%",
              background: "#1a1a1a",
            }}
          >
            {sql || "-- No SQL generated"}
          </SyntaxHighlighter>
        </ScrollArea>
      </div>

      {/* Warnings - separate scrollable section */}
      {hasWarnings && (
        <ScrollArea className="h-[100px] rounded-lg">
          <div className="space-y-2 pr-4">
            {warnings.map((warning, index) => (
              <Alert
                key={index}
                className="border-amber-500/50 bg-amber-500/10 py-2"
              >
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <AlertDescription className="text-amber-300/80 text-xs">
                  {warning}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
