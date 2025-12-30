import React, { useRef, useEffect, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { highlightJson, validateJson, getJsonPath } from "@/lib/jsonUtils";
import { SearchBar } from "./SearchBar";
import { PathInspector } from "./PathInspector";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchMatch, searchJson } from "@/lib/jsonUtils";

interface JsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  className?: string;
  showLineNumbers?: boolean;
  label?: string;
  searchTerm?: string;
  onExtract?: (path: string) => void;
}

export function JsonEditor({
  value,
  onChange,
  readOnly = false,
  placeholder = "Paste your JSON here...",
  className,
  showLineNumbers = true,
  label,
  searchTerm = "",
  onExtract,
}: JsonEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [searchMatches, setSearchMatches] = useState<SearchMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [selectedPath, setSelectedPath] = useState<{ path: string; value?: unknown } | null>(null);

  const validation = validateJson(value);
  const lineCount = value.split("\n").length;

  const effectiveSearchTerm = searchTerm || localSearchTerm;

  useEffect(() => {
    if (effectiveSearchTerm) {
      const matches = searchJson(value, effectiveSearchTerm);
      setSearchMatches(matches);
      setCurrentMatchIndex(0);
    } else {
      setSearchMatches([]);
    }
  }, [value, effectiveSearchTerm]);

  useEffect(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, [value]);

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange?.(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "f") {
      e.preventDefault();
      setShowSearch(true);
    }
  };

  const handleSearch = useCallback((term: string) => {
    setLocalSearchTerm(term);
  }, []);

  const handleNavigateMatch = useCallback((index: number) => {
    setCurrentMatchIndex(index);
    // Scroll to the match line
    if (searchMatches[index] && textareaRef.current) {
      const lines = value.split("\n");
      const targetLine = searchMatches[index].line - 1;
      const lineHeight = 26; // approximate line height
      textareaRef.current.scrollTop = Math.max(0, targetLine * lineHeight - 100);
      if (highlightRef.current) {
        highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      }
    }
  }, [searchMatches, value]);

  const handleCloseSearch = useCallback(() => {
    setShowSearch(false);
    setLocalSearchTerm("");
  }, []);

  const handleHighlightClick = useCallback((e: React.MouseEvent<HTMLPreElement>) => {
    const target = e.target as HTMLElement;
    
    // Check if clicked on a key
    if (target.classList.contains("syntax-key")) {
      const keyMatch = target.textContent?.match(/"([^"]+)"/);
      if (keyMatch) {
        const clickedKey = keyMatch[1];
        // Find the path by traversing the JSON
        try {
          const parsed = JSON.parse(value);
          const path = findPathForKey(parsed, clickedKey, e);
          if (path) {
            const pathValue = getValueAtPath(parsed, path.split("."));
            setSelectedPath({ path, value: pathValue });
          }
        } catch {
          // Ignore parsing errors
        }
      }
    }
  }, [value]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {label && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/50">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setShowSearch(!showSearch)}
              title="Search (Ctrl+F)"
            >
              <Search className="w-4 h-4" />
            </Button>
            {value && (
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  validation.valid
                    ? "bg-success/20 text-success"
                    : "bg-destructive/20 text-destructive"
                )}
              >
                {validation.valid ? "Valid" : "Invalid"}
              </span>
            )}
          </div>
        </div>
      )}
      {showSearch && (
        <SearchBar
          matches={searchMatches}
          currentIndex={currentMatchIndex}
          onSearch={handleSearch}
          onNavigate={handleNavigateMatch}
          onClose={handleCloseSearch}
        />
      )}
      <div className="relative flex-1 overflow-hidden">
        {showLineNumbers && (
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-muted/30 border-r border-border flex flex-col items-end pr-2 pt-3 text-xs text-muted-foreground font-mono select-none overflow-hidden">
            {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
              <div 
                key={i} 
                className={cn(
                  "leading-relaxed h-[1.625rem]",
                  validation.line === i + 1 && "text-destructive font-bold"
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <div className={cn("relative h-full", showLineNumbers && "ml-10")}>
          <pre
            ref={highlightRef}
            onClick={handleHighlightClick}
            className="absolute inset-0 p-3 font-mono text-sm leading-relaxed overflow-auto pointer-events-auto whitespace-pre scrollbar-thin cursor-text"
            aria-hidden="true"
            dangerouslySetInnerHTML={{
              __html: value ? highlightJson(value, effectiveSearchTerm) : "",
            }}
          />
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            readOnly={readOnly}
            placeholder={placeholder}
            spellCheck={false}
            className={cn(
              "absolute inset-0 w-full h-full p-3 bg-transparent text-transparent caret-foreground font-mono text-sm leading-relaxed resize-none outline-none scrollbar-thin",
              readOnly && "cursor-default"
            )}
          />
        </div>
      </div>
      {selectedPath && (
        <PathInspector
          path={selectedPath.path}
          value={selectedPath.value}
          onClose={() => setSelectedPath(null)}
          onExtract={onExtract}
        />
      )}
      {!validation.valid && value && (
        <div className="px-3 py-2 border-t border-destructive/30 bg-destructive/10 text-sm text-destructive animate-fade-in">
          <span className="font-medium">Error:</span> {validation.error}
        </div>
      )}
    </div>
  );
}

// Helper to find path for a clicked key
function findPathForKey(obj: unknown, key: string, event: React.MouseEvent): string | null {
  const paths: string[] = [];
  
  function traverse(current: unknown, path: string[]) {
    if (current === null || current === undefined) return;
    
    if (Array.isArray(current)) {
      current.forEach((item, index) => {
        traverse(item, [...path, String(index)]);
      });
    } else if (typeof current === "object") {
      for (const k of Object.keys(current as Record<string, unknown>)) {
        const newPath = [...path, k];
        if (k === key) {
          paths.push(newPath.join("."));
        }
        traverse((current as Record<string, unknown>)[k], newPath);
      }
    }
  }
  
  traverse(obj, []);
  
  // Return the first matching path (in a real impl, we'd use position to disambiguate)
  return paths[0] || null;
}

function getValueAtPath(obj: unknown, path: string[]): unknown {
  let current = obj;
  for (const key of path) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}
