import { Copy, Check, FileCode, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TypesViewerProps {
  typescript: string;
  zod: string;
  schema: string;
  className?: string;
}

type TabType = "typescript" | "zod" | "schema";

export function TypesViewer({ typescript, zod, schema, className }: TypesViewerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("typescript");
  const [copied, setCopied] = useState(false);

  const content = {
    typescript,
    zod,
    schema,
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: TabType; label: string; icon: typeof FileCode }[] = [
    { id: "typescript", label: "TypeScript", icon: FileCode },
    { id: "zod", label: "Zod", icon: FileCode },
    { id: "schema", label: "Schema", icon: FileJson },
  ];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/50">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="h-7 gap-1.5"
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="flex-1 overflow-auto scrollbar-thin p-4">
        <pre className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap">
          {content[activeTab] || "Generate types by clicking the Types button"}
        </pre>
      </div>
    </div>
  );
}
