import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import {
  Database,
  GitCompare,
  History,
  ArrowRight,
  Shield,
  Zap,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="border-b border-border/40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">SchemaShift</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              to="/history"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              History
            </Link>
            <Link to="/connect">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-24 px-6">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              PostgreSQL Schema Migration Tool
            </div>

            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Compare Schemas.
              <br />
              <span className="text-primary">Generate Migrations.</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Safely compare PostgreSQL database schemas between environments
              and generate migration scripts with a single click. Built for
              freelance developers.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link to="/connect">
                <Button size="lg" className="gap-2">
                  Start Comparing <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="outline" size="lg" className="gap-2">
                  <History className="h-4 w-4" /> View History
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything you need for safe migrations
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Database className="h-6 w-6" />}
                title="Schema Extraction"
                description="Extract complete schema including tables, columns, indexes, constraints, and foreign keys."
              />
              <FeatureCard
                icon={<GitCompare className="h-6 w-6" />}
                title="Visual Diff"
                description="Side-by-side comparison showing exactly what changed between your databases."
              />
              <FeatureCard
                icon={<Code2 className="h-6 w-6" />}
                title="SQL Generation"
                description="Generate UP and DOWN migration scripts with proper dependency ordering."
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="Safe Execution"
                description="Execute migrations within transactions with automatic rollback on errors."
              />
              <FeatureCard
                icon={<History className="h-6 w-6" />}
                title="Migration History"
                description="Track all migrations for audit, debugging, and compliance."
              />
              <FeatureCard
                icon={<Zap className="h-6 w-6" />}
                title="NeonDB Ready"
                description="Optimized for PostgreSQL on NeonDB, Supabase, and other cloud providers."
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              How it works
            </h2>

            <div className="space-y-8">
              <Step
                number={1}
                title="Connect your databases"
                description="Enter connection strings for your staging and development databases."
              />
              <Step
                number={2}
                title="Review the differences"
                description="See exactly what changed - new tables, modified columns, dropped indexes."
              />
              <Step
                number={3}
                title="Generate migration SQL"
                description="Get production-ready UP and DOWN migration scripts with syntax highlighting."
              />
              <Step
                number={4}
                title="Execute safely"
                description="Apply migrations with transaction safety and automatic rollback on errors."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="container mx-auto text-center max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to migrate?</h2>
            <p className="text-muted-foreground mb-8">
              Start comparing your database schemas in seconds.
            </p>
            <Link to="/connect">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>SchemaShift — PostgreSQL Schema Migration Tool</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
