import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LightRays from "@/components/LightRays";
import logo from "@/assets/logo.png";
import {
  Database,
  Home,
  History,
  GitCompare,
  Zap,
  Menu,
  X,
} from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
  showRays?: boolean;
}

export default function MainLayout({
  children,
  showRays = true,
}: MainLayoutProps) {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      {/* Background Rays */}
      {showRays && (
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
            className="opacity-40 mix-blend-screen"
          />
        </div>
      )}

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group z-50">
            <div className="flex items-center justify-center overflow-hidden rounded-md border border-white/10 bg-black">
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/50 p-1 rounded-full border border-white/5">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 rounded-full text-xs font-medium ${
                  isActive("/")
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Home className="mr-2 h-3.5 w-3.5" />
                Home
              </Button>
            </Link>
            <Link to="/connect">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 rounded-full text-xs font-medium ${
                  isActive("/connect")
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Zap className="mr-2 h-3.5 w-3.5" />
                Connect
              </Button>
            </Link>
            <Link to="/diff">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 rounded-full text-xs font-medium ${
                  isActive("/diff")
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <GitCompare className="mr-2 h-3.5 w-3.5" />
                Diff
              </Button>
            </Link>
            <Link to="/history">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 rounded-full text-xs font-medium ${
                  isActive("/history")
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <History className="mr-2 h-3.5 w-3.5" />
                History
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden z-[70]">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-zinc-400 hover:text-white relative"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12 px-6 min-h-[calc(100vh-64px)]">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      {/* Mobile Nav Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[90] bg-zinc-950 flex items-center justify-center animate-in fade-in duration-300">
          <nav className="flex flex-col gap-6 w-full max-w-sm px-6 text-center">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full h-14 text-2xl font-light tracking-tight transition-all duration-300 ${
                  isActive("/")
                    ? "text-white scale-105 font-medium"
                    : "text-zinc-500 hover:text-white hover:scale-110"
                }`}
              >
                Home
              </Button>
            </Link>
            <Link to="/connect" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full h-14 text-2xl font-light tracking-tight transition-all duration-300 ${
                  isActive("/connect")
                    ? "text-white scale-105 font-medium"
                    : "text-zinc-500 hover:text-white hover:scale-110"
                }`}
              >
                Connect
              </Button>
            </Link>
            <Link to="/diff" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full h-14 text-2xl font-light tracking-tight transition-all duration-300 ${
                  isActive("/diff")
                    ? "text-white scale-105 font-medium"
                    : "text-zinc-500 hover:text-white hover:scale-110"
                }`}
              >
                Diff
              </Button>
            </Link>
            <Link to="/history" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="ghost"
                className={`w-full h-14 text-2xl font-light tracking-tight transition-all duration-300 ${
                  isActive("/history")
                    ? "text-white scale-105 font-medium"
                    : "text-zinc-500 hover:text-white hover:scale-110"
                }`}
              >
                History
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
