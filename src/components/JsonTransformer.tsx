import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { transformJson, flattenJson, mergeJson, jsonToCsv } from "@/lib/jsonUtils";
import { useToast } from "@/hooks/use-toast";
import { Shuffle, Layers2, Merge, FileSpreadsheet, Copy } from "lucide-react";

interface JsonTransformerProps {
  json: string;
  secondJson?: string;
  onResult: (result: string) => void;
}

export function JsonTransformer({ json, secondJson, onResult }: JsonTransformerProps) {
  const [transformRules, setTransformRules] = useState("{\n  \"oldKey\": \"newKey\"\n}");
  const [flattenSeparator, setFlattenSeparator] = useState(".");
  const [flattenDepth, setFlattenDepth] = useState("10");
  const { toast } = useToast();

  const handleTransform = () => {
    try {
      const rules = JSON.parse(transformRules);
      const result = transformJson(json, rules);
      onResult(result);
      toast({ description: "JSON transformed" });
    } catch (e) {
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "Transform failed" });
    }
  };

  const handleFlatten = () => {
    try {
      const depth = parseInt(flattenDepth, 10);
      const result = flattenJson(json, flattenSeparator, depth);
      onResult(result);
      toast({ description: "JSON flattened" });
    } catch (e) {
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "Flatten failed" });
    }
  };

  const handleMerge = () => {
    if (!secondJson) {
      toast({ variant: "destructive", description: "Second JSON required for merge" });
      return;
    }
    try {
      const result = mergeJson(json, secondJson);
      onResult(result);
      toast({ description: "JSONs merged" });
    } catch (e) {
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "Merge failed" });
    }
  };

  const handleToCsv = async () => {
    try {
      const csv = jsonToCsv(json);
      await navigator.clipboard.writeText(csv);
      toast({ description: "CSV copied to clipboard" });
    } catch (e) {
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "CSV conversion failed" });
    }
  };

  return (
    <div className="h-full">
      <Tabs defaultValue="transform" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mx-4 mt-4">
          <TabsTrigger value="transform" className="text-xs">Transform</TabsTrigger>
          <TabsTrigger value="flatten" className="text-xs">Flatten</TabsTrigger>
          <TabsTrigger value="merge" className="text-xs">Merge</TabsTrigger>
          <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transform" className="flex-1 p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Transformation Rules</label>
              <textarea
                value={transformRules}
                onChange={(e) => setTransformRules(e.target.value)}
                className="w-full h-32 p-3 rounded-md border border-border bg-background font-mono text-sm resize-none"
                placeholder='{"oldKey": "newKey"}'
              />
            </div>
            <Button onClick={handleTransform} className="w-full" variant="premium">
              <Shuffle className="w-4 h-4" />
              Transform Keys
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="flatten" className="flex-1 p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Separator</label>
              <Input
                value={flattenSeparator}
                onChange={(e) => setFlattenSeparator(e.target.value)}
                placeholder="."
                className="font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Max Depth</label>
              <Input
                value={flattenDepth}
                onChange={(e) => setFlattenDepth(e.target.value)}
                placeholder="10"
                type="number"
              />
            </div>
            <Button onClick={handleFlatten} className="w-full" variant="premium">
              <Layers2 className="w-4 h-4" />
              Flatten JSON
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="merge" className="flex-1 p-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Deep merge the current JSON with the second JSON input.
            </p>
            <Button 
              onClick={handleMerge} 
              className="w-full" 
              variant="premium"
              disabled={!secondJson}
            >
              <Merge className="w-4 h-4" />
              Merge JSONs
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="export" className="flex-1 p-4">
          <div className="space-y-4">
            <Button onClick={handleToCsv} className="w-full" variant="premium">
              <FileSpreadsheet className="w-4 h-4" />
              Copy as CSV
            </Button>
            <p className="text-xs text-muted-foreground">
              Converts array of objects to CSV format and copies to clipboard.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}