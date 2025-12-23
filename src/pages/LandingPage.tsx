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
import LightRays from "@/components/LightRays";
import logo from "@/assets/logo.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden">
      {/* LightRays Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <LightRays
          raysColor="#ffffff"
          raysOrigin="top-center"
          raysSpeed={0.2}
          lightSpread={0.6}
          rayLength={0.8}
          pulsating={true}
          fadeDistance={0.6}
          saturation={0}
          mouseInfluence={0.05}
          className="opacity-100 mix-blend-screen"
        />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center overflow-hidden rounded-md border border-white/10">
              <img
                src={logo}
                alt="SchemaShift"
                className="h-8 w-8 object-cover"
              />
            </div>
            <span className="text-sm font-medium tracking-wide">
              SchemaShift
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/history"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              History
            </Link>
            <Link to="/connect">
              <Button
                variant="outline"
                className="h-9 px-4 text-sm bg-white text-black hover:bg-zinc-200 border-0 rounded-full font-medium transition-transform active:scale-95"
              >
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="px-6 mb-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-zinc-300 mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Zap className="h-3 w-3" />
              <span>PostgreSQL Schema Migration Tool</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-white leading-[0.9] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
              Stop guessing.
              <br />
              <span className="text-zinc-500">Start migrating.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              The professional way to compare, diff, and sync PostgreSQL
              schemas. Safe, reliable, and transaction-ready.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Link to="/connect" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-black hover:bg-zinc-200 transition-all text-base font-medium"
                >
                  Start Comparing
                </Button>
              </Link>
              <Link to="/history" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 rounded-full border-zinc-800 bg-transparent text-white hover:bg-zinc-900 transition-all text-base font-medium"
                >
                  View History
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 mb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-800">
              {[
                {
                  icon: <GitCompare className="h-5 w-5" />,
                  title: "Visual Diff",
                  desc: "Side-by-side schema comparison.",
                },
                {
                  icon: <Code2 className="h-5 w-5" />,
                  title: "SQL Generation",
                  desc: "Auto-generated migration scripts.",
                },
                {
                  icon: <Shield className="h-5 w-5" />,
                  title: "Safe Execution",
                  desc: "Transaction-wrapped deployments.",
                },
                {
                  icon: <Database className="h-5 w-5" />,
                  title: "Full Extraction",
                  desc: "Tables, functions, triggers, and more.",
                },
                {
                  icon: <History className="h-5 w-5" />,
                  title: "Audit Logs",
                  desc: "Complete history of all changes.",
                },
                {
                  icon: <Zap className="h-5 w-5" />,
                  title: "Instant Sync",
                  desc: "Deploy significantly faster.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-black p-8 group hover:bg-zinc-950 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="px-6 py-20 border-t border-zinc-900 bg-zinc-950/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Workflow
              </h2>
              <p className="text-zinc-500">Simple, predictable, and robust.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  num: "01",
                  title: "Connect",
                  desc: "Link your DBs securely.",
                },
                { num: "02", title: "Compare", desc: "Review schema drift." },
                { num: "03", title: "Generate", desc: "Get SQL scripts." },
                { num: "04", title: "Execute", desc: "Apply with safety." },
              ].map((step, i) => (
                <div
                  key={i}
                  className="relative pl-6 md:pl-0 md:text-center border-l-2 md:border-l-0 md:border-t-2 border-zinc-800 pt-0 md:pt-6"
                >
                  <div className="text-xs font-mono text-zinc-600 mb-3">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-32 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-8 text-white">
            Ready to ship?
          </h2>
          <Link to="/connect">
            <Button
              variant="outline"
              className="h-12 px-8 rounded-full border-zinc-700 bg-black text-white hover:bg-zinc-900 hover:border-zinc-500 transition-all text-base"
            >
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-wide text-zinc-500">
              SchemaShift
            </span>
          </div>
          <div className="flex gap-6 text-sm text-zinc-600">
            <a href="#" className="hover:text-zinc-300 transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-zinc-300 transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-zinc-300 transition-colors">
              Support
            </a>
          </div>
          <div className="text-xs text-zinc-800">
            © 2024 SchemaShift. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
