import { Link } from "react-router-dom";
import { Braces, Sun, Moon, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useTheme } from "@/hooks/useTheme";

interface LayoutProps {
  children: React.ReactNode;
  onOpenCommand?: () => void;
  showCommandButton?: boolean;
}

export function Layout({ children, onOpenCommand, showCommandButton = false }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - premium, glass effect */}
      <header className="border-b border-border/50 sticky top-0 z-10 glass-effect">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 group">
            <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Braces className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-display text-foreground tracking-tight">StableJSON</span>
          </Link>
          
          <nav className="flex items-center gap-2">
            <div className="hidden sm:flex items-center">
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
                  className="hidden md:flex h-9 gap-2 text-xs text-muted-foreground hover:text-foreground font-mono"
                >
                  <Command className="w-4 h-4" />
                  <kbd className="text-[10px] px-2 py-1 rounded-md border border-border bg-muted/50 font-mono">⌘K</kbd>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 text-muted-foreground hover:text-foreground"
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
          </nav>
        </div>
        
        {/* Mobile nav */}
        <nav className="flex sm:hidden items-center gap-2 px-4 pb-4 overflow-x-auto">
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
      <main className="flex-1 animate-fade-in">
        {children}
      </main>

      {/* Footer - refined */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="font-body">StableJSON — Client-side JSON utility</p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-foreground transition-colors font-body">Privacy</Link>
              <Link to="/open-source" className="hover:text-foreground transition-colors font-body">Philosophy</Link>
              <Link to="/contributing" className="hover:text-foreground transition-colors font-body">Contributing</Link>
              <Link to="/release-notes" className="hover:text-foreground transition-colors font-body">Release Notes</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
