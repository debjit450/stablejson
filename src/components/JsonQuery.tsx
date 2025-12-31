import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Copy } from "lucide-react";
import { queryJsonPath, highlightJson } from "@/lib/jsonUtils";
import { useToast } from "@/hooks/use-toast";

interface JsonQueryProps {
  json: string;
}

export function JsonQuery({ json }: JsonQueryProps) {
  const [query, setQuery] = useState("$");
  const [results, setResults] = useState<unknown[]>([]);
  const { toast } = useToast();

  const handleQuery = () => {
    try {
      const queryResults = queryJsonPath(json, query);
      setResults(queryResults);
      toast({ description: `Found ${queryResults.length} result${queryResults.length !== 1 ? 's' : ''}` });
    } catch (e) {
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "Query failed" });
    }
  };

  const handleCopy = async (result: unknown) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      toast({ description: "Copied" });
    } catch {
      toast({ variant: "destructive", description: "Failed to copy" });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-2 p-4 border-b border-border/50">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="$.users[0].name or $..email"
          className="font-mono text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleQuery()}
        />
        <Button onClick={handleQuery} size="sm" variant="default">
          <Search className="w-4 h-4" />
          Query
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto scrollbar-thin p-4">
        {results.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Enter a JSONPath query</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Examples: $.users[0] or $..name
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="premium-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Result {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(result)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <pre 
                  className="font-mono text-sm leading-relaxed overflow-auto"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightJson(JSON.stringify(result, null, 2)) 
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}