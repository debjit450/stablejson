import { Copy, Check, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PathInspectorProps {
  path: string;
  value?: unknown;
  onClose: () => void;
  onExtract?: (path: string) => void;
  className?: string;
}

export function PathInspector({ path, value, onClose, onExtract, className }: PathInspectorProps) {
  const [copied, setCopied] = useState<"path" | "value" | null>(null);

  const handleCopyPath = async () => {
    await navigator.clipboard.writeText(path);
    setCopied("path");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyValue = async () => {
    if (value === undefined) return;
    const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
    await navigator.clipboard.writeText(text);
    setCopied("value");
    setTimeout(() => setCopied(null), 2000);
  };

  const formatValue = (val: unknown): string => {
    if (val === undefined) return "";
    if (typeof val === "string") return `"${val}"`;
    if (typeof val === "object") return JSON.stringify(val).slice(0, 50) + (JSON.stringify(val).length > 50 ? "..." : "");
    return String(val);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 bg-primary/10 border-t border-primary/20 animate-fade-in",
        className
      )}
    >
      <MapPin className="w-4 h-4 text-primary shrink-0" />
      <code className="flex-1 font-mono text-sm text-primary truncate">
        {path}
      </code>
      {value !== undefined && (
        <span className="text-xs text-muted-foreground max-w-32 truncate hidden sm:block">
          = {formatValue(value)}
        </span>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyPath}
        className="h-7 gap-1.5 text-primary hover:text-primary"
      >
        {copied === "path" ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Copied
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Path
          </>
        )}
      </Button>
      {value !== undefined && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyValue}
          className="h-7 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          {copied === "value" ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Value
            </>
          )}
        </Button>
      )}
      {onExtract && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onExtract(path)}
          className="h-7 gap-1.5 text-accent hover:text-accent"
          title="Extract subtree as JSON"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Extract
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="h-7 text-muted-foreground"
      >
        Dismiss
      </Button>
    </div>
  );
}
