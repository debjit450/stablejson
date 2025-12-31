import { Link } from "react-router-dom";
import { Braces, Sun, Moon, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useTheme } from "@/hooks/useTheme";
import { useViewCounter } from "@/hooks/useViewCounter";

interface LayoutProps {
  children: React.ReactNode;
  onOpenCommand?: () => void;
  showCommandButton?: boolean;
}

export function Layout({ children, onOpenCommand, showCommandButton = false }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const viewCount = useViewCounter();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - premium, glass effect */}
      <header className="border-b border-border/30 sticky top-0 z-50 bg-background/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 group-hover:border-primary/30 group-hover:bg-primary/15 transition-all duration-200">
              <Braces className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-display font-bold text-foreground tracking-tight">StableJSON</span>
              <span className="text-xs text-muted-foreground font-medium -mt-1">JSON Processor</span>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-muted/30 rounded-xl p-1 border border-border/40">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/app">App</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/privacy">Privacy</NavLink>
              <NavLink to="/open-source">Philosophy</NavLink>
              <NavLink to="/contributing">Contributing</NavLink>
              <NavLink to="/release-notes">Release Notes</NavLink>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {showCommandButton && onOpenCommand && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenCommand}
                  className="hidden lg:flex h-9 gap-2 text-xs text-muted-foreground hover:text-primary font-mono bg-muted/30 border border-border/40 rounded-lg"
                >
                  <Command className="w-4 h-4" />
                  <kbd className="text-xs px-2 py-1 rounded-md border border-border bg-background/50 font-mono">⌘K</kbd>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 text-muted-foreground hover:text-foreground bg-muted/30 border border-border/40 rounded-lg hover:bg-muted/50 transition-all"
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </nav>
        </div>

        {/* Mobile nav */}
        <nav className="flex md:hidden items-center gap-1 px-4 pb-3 overflow-x-auto scrollbar-thin bg-muted/20 border-t border-border/30">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/app">App</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/privacy">Privacy</NavLink>
          <NavLink to="/open-source">Philosophy</NavLink>
          <NavLink to="/contributing">Contributing</NavLink>
          <NavLink to="/release-notes">Release Notes</NavLink>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer - refined */}
      <footer className="border-t border-border/50 py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="font-body text-center sm:text-left">StableJSON — Client-side JSON utility</p>
              <div className="flex items-center gap-4 text-xs">
                <span>{viewCount.toLocaleString()} views</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link to="/privacy" className="hover:text-[hsl(var(--info))] transition-colors font-body">Privacy</Link>
              <Link to="/open-source" className="hover:text-[hsl(var(--brand))] transition-colors font-body">Philosophy</Link>
              <Link to="/contributing" className="hover:text-[hsl(var(--accent-secondary))] transition-colors font-body">Contributing</Link>
              <Link to="/release-notes" className="hover:text-[hsl(var(--success))] transition-colors font-body">Release Notes</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}