import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { JsonEditor } from "@/components/JsonEditor";
import { DiffViewer } from "@/components/DiffViewer";
import { TableViewer } from "@/components/TableViewer";
import { TypesViewer } from "@/components/TypesViewer";
import { FoldableJsonViewer } from "@/components/FoldableJsonViewer";
import { JsonQuery } from "@/components/JsonQuery";
import { JsonAnalyzer } from "@/components/JsonAnalyzer";
import { JsonTransformer } from "@/components/JsonTransformer";
import { JsonValidator } from "@/components/JsonValidator";
import { CommandPalette, createCommands } from "@/components/CommandPalette";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTheme } from "@/hooks/useTheme";
import {
  validateJson,
  formatJson,
  minifyJson,
  sortJsonKeys,
  cleanJson,
  diffJson,
  jsonToTableData,
  highlightJson,
  jsonToTypeScript,
  jsonToZod,
  inferSchemaFromJson,
  canonicalJson,
  extractAtPath,
  SAMPLE_JSON,
  DiffResult,
} from "@/lib/jsonUtils";
import {
  Sparkles,
  ArrowDownAZ,
  Eraser,
  Copy,
  GitCompare,
  Table,
  RotateCcw,
  FileCode,
  Minimize2,
  FileJson,
  Hash,
  Layers,
  Code,
  Search,
  BarChart3,
  Shuffle,
  Shield,
} from "lucide-react";

type ViewMode = "formatted" | "diff" | "table" | "types" | "foldable" | "query" | "analyze" | "transform" | "validate";

export default function App() {
  const [input, setInput] = useLocalStorage("stablejson-input", "");
  const [secondInput, setSecondInput] = useLocalStorage("stablejson-second-input", "");
  const [output, setOutput] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("formatted");
  const [diffResults, setDiffResults] = useState<DiffResult[]>([]);
  const [tableData, setTableData] = useState<{ headers: string[]; rows: Record<string, unknown>[] } | null>(null);
  const [typescriptOutput, setTypescriptOutput] = useState("");
  const [zodOutput, setZodOutput] = useState("");
  const [schemaOutput, setSchemaOutput] = useState("");
  const [canonicalMode, setCanonicalMode] = useLocalStorage("stablejson-canonical", false);
  const [structuralDiff, setStructuralDiff] = useLocalStorage("stablejson-structural-diff", false);
  const [commandOpen, setCommandOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleFormat = useCallback(() => {
    try {
      const formatted = canonicalMode ? canonicalJson(input) : formatJson(input);
      setOutput(formatted);
      setViewMode("formatted");
      toast({ description: canonicalMode ? "JSON canonicalized" : "JSON formatted" });
    } catch (e) {
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "Failed to format" });
    }
  }, [input, canonicalMode, toast]);

  const handleMinify = useCallback(() => {
    try {
      const minified = minifyJson(input);
      setOutput(minified);
      setViewMode("formatted");
      toast({ description: "JSON minified" });
    } catch (e) {
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "Failed to minify" });
    }
  }, [input, toast]);

  const handleSort = useCallback(() => {
    try {
      const sorted = sortJsonKeys(input);
      setOutput(sorted);
      setViewMode("formatted");
      toast({ description: "Keys sorted" });
    } catch (e) {
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "Failed to sort" });
    }
  }, [input, toast]);

  const handleClean = useCallback(() => {
    try {
      const cleaned = cleanJson(input);
      setOutput(cleaned);
      setViewMode("formatted");
      toast({ description: "Cleaned" });
    } catch (e) {
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "Failed to clean" });
    }
  }, [input, toast]);

  const handleDiff = useCallback(() => {
    try {
      const results = diffJson(input, secondInput, structuralDiff);
      setDiffResults(results);
      setViewMode("diff");
      toast({ description: `${results.length} difference${results.length !== 1 ? "s" : ""}` });
    } catch (e) {
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "Failed to diff" });
    }
  }, [input, secondInput, structuralDiff, toast]);

  const handleTable = useCallback(() => {
    const data = jsonToTableData(input);
    if (data) {
      setTableData(data);
      setViewMode("table");
    } else {
      toast({ variant: "destructive", description: "Cannot convert to table" });
    }
  }, [input, toast]);

  const handleTypes = useCallback(() => {
    try {
      const ts = jsonToTypeScript(input);
      const zod = jsonToZod(input);
      const schema = inferSchemaFromJson(input);
      setTypescriptOutput(ts);
      setZodOutput(zod);
      setSchemaOutput(schema);
      setViewMode("types");
    } catch (e) {
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "Failed to generate" });
    }
  }, [input, toast]);

  const handleFoldable = useCallback(() => {
    if (validateJson(input).valid) {
      setOutput(input);
      setViewMode("foldable");
    } else {
      toast({ variant: "destructive", description: "Invalid JSON" });
    }
  }, [input, toast]);

  const handleCopy = useCallback(async () => {
    const textToCopy = viewMode === "formatted" ? output : input;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({ description: "Copied" });
    } catch {
      toast({ variant: "destructive", description: "Failed to copy" });
    }
  }, [output, input, viewMode, toast]);

  const handleClear = useCallback(() => {
    setInput("");
    setSecondInput("");
    setOutput("");
    setDiffResults([]);
    setTableData(null);
    setTypescriptOutput("");
    setZodOutput("");
    setSchemaOutput("");
    setViewMode("formatted");
  }, [setInput, setSecondInput]);

  const handleLoadSample = useCallback(() => {
    setInput(SAMPLE_JSON);
  }, [setInput]);

  const handleExtract = useCallback((path: string) => {
    try {
      const extracted = extractAtPath(input, path);
      setOutput(extracted);
      setViewMode("formatted");
      toast({ description: `Extracted ${path}` });
    } catch (e) {
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "Failed to extract" });
    }
  }, [input, toast]);

  const handleToggleCanonical = useCallback(() => {
    setCanonicalMode((prev) => !prev);
  }, [setCanonicalMode]);

  const handleFoldableExtract = useCallback((path: string, value: unknown) => {
    setOutput(JSON.stringify(value, null, 2));
    setViewMode("formatted");
    toast({ description: `Extracted ${path}` });
  }, [toast]);

  const validation = validateJson(input);

  const commands = createCommands({
    onFormat: handleFormat,
    onMinify: handleMinify,
    onSort: handleSort,
    onClean: handleClean,
    onDiff: handleDiff,
    onTable: handleTable,
    onTypes: handleTypes,
    onCanonical: handleToggleCanonical,
    onCopy: handleCopy,
    onClear: handleClear,
    onLoadSample: handleLoadSample,
    onToggleTheme: toggleTheme,
    isValid: validation.valid,
    isCanonical: canonicalMode,
    theme,
  });

  return (
    <Layout showCommandButton onOpenCommand={() => setCommandOpen(true)}>
      {/* Toolbar */}
      <div className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="action" size="sm" onClick={handleFormat} disabled={!validation.valid} className="font-medium">
              <Sparkles className="w-4 h-4" />
              Format
            </Button>
            <Button variant="action" size="sm" onClick={handleMinify} disabled={!validation.valid} className="font-medium">
              <Minimize2 className="w-4 h-4" />
              Minify
            </Button>
            <Button variant="action" size="sm" onClick={handleSort} disabled={!validation.valid} className="font-medium">
              <ArrowDownAZ className="w-4 h-4" />
              Sort
            </Button>
            <Button variant="action" size="sm" onClick={handleClean} disabled={!validation.valid} className="font-medium">
              <Eraser className="w-4 h-4" />
              Clean
            </Button>
            <Button variant="action" size="sm" onClick={handleTable} disabled={!validation.valid} className="font-medium">
              <Table className="w-4 h-4" />
              Table
            </Button>
            <Button variant="action" size="sm" onClick={handleTypes} disabled={!validation.valid} className="font-medium">
              <FileCode className="w-4 h-4" />
              Types
            </Button>
            <Button variant="action" size="sm" onClick={handleFoldable} disabled={!validation.valid} className="font-medium">
              <Layers className="w-4 h-4" />
              Fold
            </Button>
            
            <div className="h-6 w-px bg-border/50 mx-2 hidden sm:block" />
            
            <Button variant="action" size="sm" onClick={() => setViewMode("query")} disabled={!validation.valid} className="font-medium">
              <Search className="w-4 h-4" />
              Query
            </Button>
            <Button variant="action" size="sm" onClick={() => setViewMode("analyze")} disabled={!validation.valid} className="font-medium">
              <BarChart3 className="w-4 h-4" />
              Analyze
            </Button>
            <Button variant="action" size="sm" onClick={() => setViewMode("transform")} disabled={!validation.valid} className="font-medium">
              <Shuffle className="w-4 h-4" />
              Transform
            </Button>
            <Button variant="action" size="sm" onClick={() => setViewMode("validate")} disabled={!validation.valid} className="font-medium">
              <Shield className="w-4 h-4" />
              Validate
            </Button>
            
            <div className="h-6 w-px bg-border/50 mx-2 hidden sm:block" />
            
            <Button
              variant={canonicalMode ? "premium" : "action"}
              size="sm"
              onClick={handleToggleCanonical}
              className="font-medium"
            >
              <Hash className="w-4 h-4" />
              <span className="hidden sm:inline">Canonical</span>
            </Button>
            
            <Button
              variant={viewMode === "diff" ? "premium" : "action"}
              size="sm"
              onClick={handleDiff}
              disabled={!validateJson(input).valid || !validateJson(secondInput).valid}
              className="font-medium"
            >
              <GitCompare className="w-4 h-4" />
              Diff
            </Button>
            
            <div className="flex-1" />
            
            <Button variant="ghost" size="sm" onClick={handleLoadSample} className="text-muted-foreground hidden sm:flex font-medium">
              <FileJson className="w-4 h-4" />
              Sample
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!output && viewMode === "formatted"} className="text-muted-foreground font-medium">
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copy</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground hover:text-destructive font-medium">
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]" style={{ minHeight: "500px" }}>
          {/* Input Panel */}
          <div className="flex flex-col gap-4">
            <div className="flex-1 premium-card overflow-hidden">
              <JsonEditor
                value={input}
                onChange={setInput}
                label="Input"
                onExtract={handleExtract}
                placeholder="Paste JSON here..."
              />
            </div>
            
            {/* Second input for diff */}
            {(viewMode === "diff" || secondInput) && (
              <div className="flex-1 premium-card overflow-hidden animate-slide-up">
                <JsonEditor
                  value={secondInput}
                  onChange={setSecondInput}
                  label="Compare"
                  placeholder="Paste second JSON to compare..."
                />
              </div>
            )}
          </div>

          {/* Output Panel */}
          <div className="premium-card overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-muted/30">
              <span className="text-sm font-medium text-foreground font-display">
                {viewMode === "formatted" && "Output"}
                {viewMode === "diff" && "Differences"}
                {viewMode === "table" && "Table"}
                {viewMode === "types" && "Types"}
                {viewMode === "foldable" && "Tree"}
                {viewMode === "query" && "Query"}
                {viewMode === "analyze" && "Analysis"}
                {viewMode === "transform" && "Transform"}
                {viewMode === "validate" && "Validate"}
              </span>
              {canonicalMode && viewMode === "formatted" && (
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Canonical</span>
              )}
              <div className="flex-1" />
              <div className="flex gap-1">
                <Button variant={viewMode === "formatted" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("formatted")} className="h-7 w-7 p-0">
                  <Code className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === "foldable" ? "secondary" : "ghost"} size="sm" onClick={() => output && setViewMode("foldable")} className="h-7 w-7 p-0" disabled={!output}>
                  <Layers className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === "diff" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("diff")} className="h-7 w-7 p-0">
                  <GitCompare className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === "table" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("table")} className="h-7 w-7 p-0">
                  <Table className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === "types" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("types")} className="h-7 w-7 p-0">
                  <FileCode className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === "query" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("query")} className="h-7 w-7 p-0">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === "analyze" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("analyze")} className="h-7 w-7 p-0">
                  <BarChart3 className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === "transform" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("transform")} className="h-7 w-7 p-0">
                  <Shuffle className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === "validate" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("validate")} className="h-7 w-7 p-0">
                  <Shield className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {viewMode === "formatted" && (
                output ? (
                  <div className="h-full overflow-auto scrollbar-thin p-5">
                    <pre className="font-mono text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: highlightJson(output) }} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                        <Code className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium">Output will appear here</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">Process your JSON to see results</p>
                    </div>
                  </div>
                )
              )}
              {viewMode === "foldable" && output && (
                <FoldableJsonViewer json={output} onExtract={handleFoldableExtract} />
              )}
              {viewMode === "diff" && (
                <DiffViewer diffs={diffResults} structuralMode={structuralDiff} onToggleStructural={setStructuralDiff} />
              )}
              {viewMode === "table" && tableData && (
                <TableViewer headers={tableData.headers} rows={tableData.rows} />
              )}
              {viewMode === "types" && (
                <TypesViewer typescript={typescriptOutput} zod={zodOutput} schema={schemaOutput} />
              )}
              {viewMode === "query" && (
                <JsonQuery json={input} />
              )}
              {viewMode === "analyze" && (
                <JsonAnalyzer json={input} />
              )}
              {viewMode === "transform" && (
                <JsonTransformer json={input} secondJson={secondInput} onResult={setOutput} />
              )}
              {viewMode === "validate" && (
                <JsonValidator json={input} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette commands={commands} open={commandOpen} onOpenChange={setCommandOpen} />
    </Layout>
  );
}