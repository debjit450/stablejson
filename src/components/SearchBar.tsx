import { useState, useEffect, useCallback } from "react";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SearchMatch } from "@/lib/jsonUtils";

interface SearchBarProps {
  matches: SearchMatch[];
  currentIndex: number;
  onSearch: (term: string) => void;
  onNavigate: (index: number) => void;
  onClose: () => void;
  className?: string;
}

export function SearchBar({
  matches,
  currentIndex,
  onSearch,
  onNavigate,
  onClose,
  className,
}: SearchBarProps) {
  const [term, setTerm] = useState("");

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(term);
    }, 150);
    return () => clearTimeout(debounce);
  }, [term, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.shiftKey) {
        onNavigate(currentIndex > 0 ? currentIndex - 1 : matches.length - 1);
      } else {
        onNavigate(currentIndex < matches.length - 1 ? currentIndex + 1 : 0);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  }, [currentIndex, matches.length, onNavigate, onClose]);

  return (
    <div className={cn("flex items-center gap-2 px-3 py-2 bg-muted/50 border-b border-border", className)}>
      <Search className="w-4 h-4 text-muted-foreground shrink-0" />
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search keys and values..."
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        autoFocus
      />
      {matches.length > 0 && (
        <span className="text-xs text-muted-foreground shrink-0">
          {currentIndex + 1} of {matches.length}
        </span>
      )}
      {term && matches.length === 0 && (
        <span className="text-xs text-muted-foreground shrink-0">No matches</span>
      )}
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onNavigate(currentIndex > 0 ? currentIndex - 1 : matches.length - 1)}
          disabled={matches.length === 0}
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onNavigate(currentIndex < matches.length - 1 ? currentIndex + 1 : 0)}
          disabled={matches.length === 0}
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
