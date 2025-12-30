import { DiffResult } from "@/lib/jsonUtils";
import { cn } from "@/lib/utils";
import { Plus, Minus, RefreshCw, ArrowRight, Shapes } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface DiffViewerProps {
  diffs: DiffResult[];
  className?: string;
  structuralMode?: boolean;
  onToggleStructural?: (enabled: boolean) => void;
}

export function DiffViewer({ diffs, className, structuralMode = false, onToggleStructural }: DiffViewerProps) {
  if (diffs.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-full text-muted-foreground", className)}>
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No differences found</p>
          <p className="text-sm opacity-70">Both JSON inputs are identical</p>
        </div>
      </div>
    );
  }

  const formatValue = (value: unknown): string => {
    if (value === undefined) return "undefined";
    return JSON.stringify(value, null, 2);
  };

  const added = diffs.filter(d => d.type === "added");
  const removed = diffs.filter(d => d.type === "removed");
  const changed = diffs.filter(d => d.type === "changed");
  const structural = diffs.filter(d => d.structural);

  return (
    <div className={cn("h-full overflow-auto scrollbar-thin p-4 space-y-4", className)}>
      {onToggleStructural && (
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Switch
            id="structural-mode"
            checked={structuralMode}
            onCheckedChange={onToggleStructural}
          />
          <Label htmlFor="structural-mode" className="text-sm text-muted-foreground">
            Structural diff mode
          </Label>
        </div>
      )}
      
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-1.5 text-success">
          <Plus className="w-4 h-4" />
          {added.length} added
        </span>
        <span className="flex items-center gap-1.5 text-destructive">
          <Minus className="w-4 h-4" />
          {removed.length} removed
        </span>
        <span className="flex items-center gap-1.5 text-warning">
          <RefreshCw className="w-4 h-4" />
          {changed.length} changed
        </span>
        {structuralMode && structural.length > 0 && (
          <span className="flex items-center gap-1.5 text-primary">
            <Shapes className="w-4 h-4" />
            {structural.length} structural
          </span>
        )}
      </div>

      <div className="space-y-2">
        {diffs.map((diff, index) => (
          <div
            key={index}
            className={cn(
              "rounded-lg border p-3 font-mono text-sm animate-fade-in",
              diff.type === "added" && "border-success/30 bg-success/5",
              diff.type === "removed" && "border-destructive/30 bg-destructive/5",
              diff.type === "changed" && "border-warning/30 bg-warning/5"
            )}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="flex items-start gap-2">
              <span
                className={cn(
                  "shrink-0 mt-0.5",
                  diff.type === "added" && "text-success",
                  diff.type === "removed" && "text-destructive",
                  diff.type === "changed" && "text-warning"
                )}
              >
                {diff.type === "added" && <Plus className="w-4 h-4" />}
                {diff.type === "removed" && <Minus className="w-4 h-4" />}
                {diff.type === "changed" && <RefreshCw className="w-4 h-4" />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-foreground font-medium truncate">{diff.path}</div>
                
                {/* Structural change indicator */}
                {diff.structural && structuralMode && (
                  <div className="flex items-center gap-2 mt-1 mb-2 text-xs">
                    <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                      {diff.structural.kind === "type_change" ? "Type Change" : "Shape Change"}
                    </span>
                    <span className="text-muted-foreground">{diff.structural.oldType}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <span className="text-primary">{diff.structural.newType}</span>
                  </div>
                )}
                
                {diff.type === "added" && (
                  <pre className="mt-1 text-success whitespace-pre-wrap break-all">
                    {formatValue(diff.newValue)}
                  </pre>
                )}
                {diff.type === "removed" && (
                  <pre className="mt-1 text-destructive whitespace-pre-wrap break-all">
                    {formatValue(diff.oldValue)}
                  </pre>
                )}
                {diff.type === "changed" && (
                  <div className="mt-1 space-y-1">
                    <pre className="text-destructive whitespace-pre-wrap break-all line-through opacity-70">
                      {formatValue(diff.oldValue)}
                    </pre>
                    <pre className="text-success whitespace-pre-wrap break-all">
                      {formatValue(diff.newValue)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
