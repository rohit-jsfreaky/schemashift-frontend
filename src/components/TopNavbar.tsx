import { Link } from "react-router-dom";
import { Database, History } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TopNavbar() {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Database className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">SchemaShift</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/history">
            <Button variant="ghost" size="sm" className="gap-2">
              <History className="h-4 w-4" /> History
            </Button>
          </Link>
          <Link to="/connect">
            <Button variant="outline" size="sm">
              New Comparison
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
