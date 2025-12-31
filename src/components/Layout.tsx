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
      <header className="border-b border-border/50 sticky top-0 z-10 glass-effect">
        <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-all duration-200 group">
            <div className="p-1 sm:p-1.5 rounded-lg bg-[hsl(var(--brand)/0.1)] group-hover:bg-[hsl(var(--brand)/0.2)] transition-colors">
              <Braces className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(var(--brand))]" />
            </div>
            <span className="text-base sm:text-lg font-display text-foreground tracking-tight">StableJSON</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            <div className="hidden md:flex items-center">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/app">App</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/privacy">Privacy</NavLink>
              <NavLink to="/open-source">Philosophy</NavLink>
              <NavLink to="/contributing">Contributing</NavLink>
              <NavLink to="/release-notes">Release Notes</NavLink>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
              {showCommandButton && onOpenCommand && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenCommand}
                  className="hidden lg:flex h-8 sm:h-9 gap-2 text-xs text-muted-foreground hover:text-[hsl(var(--accent-secondary))] font-code"
                >
                  <Command className="w-3 h-3 sm:w-4 sm:h-4" />
                  <kbd className="text-[10px] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-border bg-muted/50 font-code">⌘K</kbd>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground"
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </Button>
            </div>
          </nav>
        </div>

        {/* Mobile nav */}
        <nav className="flex md:hidden items-center gap-1 px-4 pb-3 overflow-x-auto scrollbar-thin">
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