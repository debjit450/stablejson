import React, { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FoldableJsonViewerProps {
  json: string;
  className?: string;
  foldThreshold?: { arrays: number; objects: number };
  onExtract?: (path: string, value: unknown) => void;
}

interface FoldState {
  [key: string]: boolean;
}

export function FoldableJsonViewer({
  json,
  className,
  foldThreshold = { arrays: 5, objects: 8 },
  onExtract,
}: FoldableJsonViewerProps) {
  const [foldState, setFoldState] = useState<FoldState>({});
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const parsed = useMemo(() => {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }, [json]);

  const toggleFold = useCallback((path: string) => {
    setFoldState((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  }, []);

  const shouldAutoFold = useCallback(
    (value: unknown, path: string): boolean => {
      // Check if manually toggled
      if (path in foldState) {
        return foldState[path];
      }
      // Auto-fold based on threshold
      if (Array.isArray(value)) {
        return value.length > foldThreshold.arrays;
      }
      if (typeof value === "object" && value !== null) {
        return Object.keys(value).length > foldThreshold.objects;
      }
      return false;
    },
    [foldState, foldThreshold]
  );

  const isFolded = useCallback(
    (value: unknown, path: string): boolean => {
      if (path in foldState) {
        return foldState[path];
      }
      return shouldAutoFold(value, path);
    },
    [foldState, shouldAutoFold]
  );

  const handleCopyPath = useCallback(async (path: string) => {
    await navigator.clipboard.writeText(path);
  }, []);

  const handleExtract = useCallback(
    (path: string, value: unknown) => {
      onExtract?.(path, value);
    },
    [onExtract]
  );

  const renderValue = useCallback(
    (value: unknown, path: string, indent: number, key?: string): React.ReactNode => {
      const paddingLeft = indent * 16;
      const isHovered = hoveredPath === path;

      if (value === null) {
        return (
          <div style={{ paddingLeft }} className="flex items-center group">
            {key !== undefined && (
              <span className="syntax-key">&quot;{key}&quot;</span>
            )}
            {key !== undefined && <span className="text-foreground">: </span>}
            <span className="syntax-null">null</span>
          </div>
        );
      }

      if (typeof value === "string") {
        return (
          <div style={{ paddingLeft }} className="flex items-center group">
            {key !== undefined && (
              <span className="syntax-key">&quot;{key}&quot;</span>
            )}
            {key !== undefined && <span className="text-foreground">: </span>}
            <span className="syntax-string">&quot;{value}&quot;</span>
          </div>
        );
      }

      if (typeof value === "number") {
        return (
          <div style={{ paddingLeft }} className="flex items-center group">
            {key !== undefined && (
              <span className="syntax-key">&quot;{key}&quot;</span>
            )}
            {key !== undefined && <span className="text-foreground">: </span>}
            <span className="syntax-number">{value}</span>
          </div>
        );
      }

      if (typeof value === "boolean") {
        return (
          <div style={{ paddingLeft }} className="flex items-center group">
            {key !== undefined && (
              <span className="syntax-key">&quot;{key}&quot;</span>
            )}
            {key !== undefined && <span className="text-foreground">: </span>}
            <span className="syntax-boolean">{String(value)}</span>
          </div>
        );
      }

      if (Array.isArray(value)) {
        const folded = isFolded(value, path);
        return (
          <div>
            <div
              style={{ paddingLeft }}
              className={cn(
                "flex items-center cursor-pointer hover:bg-muted/50 rounded -mx-1 px-1 group",
                isHovered && "bg-muted/30"
              )}
              onClick={() => toggleFold(path)}
              onMouseEnter={() => setHoveredPath(path)}
              onMouseLeave={() => setHoveredPath(null)}
            >
              <span className="w-4 h-4 flex items-center justify-center shrink-0 text-muted-foreground">
                {folded ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </span>
              {key !== undefined && (
                <span className="syntax-key">&quot;{key}&quot;</span>
              )}
              {key !== undefined && <span className="text-foreground">: </span>}
              <span className="syntax-bracket">[</span>
              {folded ? (
                <span className="text-muted-foreground text-xs ml-1">
                  {value.length} item{value.length !== 1 ? "s" : ""}
                </span>
              ) : null}
              {folded && <span className="syntax-bracket">]</span>}
              {isHovered && (
                <div className="ml-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyPath(path);
                    }}
                    title="Copy path"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  {onExtract && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExtract(path, value);
                      }}
                      title="Extract"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            {!folded && (
              <>
                {value.map((item, index) => (
                  <React.Fragment key={index}>
                    {renderValue(item, `${path}[${index}]`, indent + 1)}
                    {index < value.length - 1 && (
                      <span style={{ paddingLeft: (indent + 1) * 16 }} className="text-foreground">,</span>
                    )}
                  </React.Fragment>
                ))}
                <div style={{ paddingLeft }} className="syntax-bracket">]</div>
              </>
            )}
          </div>
        );
      }

      if (typeof value === "object") {
        const entries = Object.entries(value);
        const folded = isFolded(value, path);
        return (
          <div>
            <div
              style={{ paddingLeft }}
              className={cn(
                "flex items-center cursor-pointer hover:bg-muted/50 rounded -mx-1 px-1 group",
                isHovered && "bg-muted/30"
              )}
              onClick={() => toggleFold(path)}
              onMouseEnter={() => setHoveredPath(path)}
              onMouseLeave={() => setHoveredPath(null)}
            >
              <span className="w-4 h-4 flex items-center justify-center shrink-0 text-muted-foreground">
                {folded ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </span>
              {key !== undefined && (
                <span className="syntax-key">&quot;{key}&quot;</span>
              )}
              {key !== undefined && <span className="text-foreground">: </span>}
              <span className="syntax-bracket">{"{"}</span>
              {folded ? (
                <span className="text-muted-foreground text-xs ml-1">
                  {entries.length} key{entries.length !== 1 ? "s" : ""}
                </span>
              ) : null}
              {folded && <span className="syntax-bracket">{"}"}</span>}
              {isHovered && (
                <div className="ml-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyPath(path);
                    }}
                    title="Copy path"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  {onExtract && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExtract(path, value);
                      }}
                      title="Extract"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            {!folded && (
              <>
                {entries.map(([k, v], index) => (
                  <React.Fragment key={k}>
                    {renderValue(v, path ? `${path}.${k}` : k, indent + 1, k)}
                    {index < entries.length - 1 && (
                      <span className="text-foreground">,</span>
                    )}
                  </React.Fragment>
                ))}
                <div style={{ paddingLeft }} className="syntax-bracket">{"}"}</div>
              </>
            )}
          </div>
        );
      }

      return null;
    },
    [isFolded, toggleFold, hoveredPath, handleCopyPath, handleExtract, onExtract]
  );

  if (!parsed) {
    return (
      <div className={cn("p-4 text-muted-foreground", className)}>
        Invalid JSON
      </div>
    );
  }

  return (
    <div className={cn("font-mono text-sm leading-relaxed overflow-auto scrollbar-thin p-4", className)}>
      {renderValue(parsed, "", 0)}
    </div>
  );
}
