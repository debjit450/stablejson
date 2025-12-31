import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { JsonEditor } from "@/components/JsonEditor";
import { DiffViewer } from "@/components/DiffViewer";
import { EnhancedDiffViewer } from "@/components/EnhancedDiffViewer";
import { TableViewer } from "@/components/TableViewer";
import { TypesViewer } from "@/components/TypesViewer";
import { FoldableJsonViewer } from "@/components/FoldableJsonViewer";
import { JsonQuery } from "@/components/JsonQuery";
import { JsonAnalyzer } from "@/components/JsonAnalyzer";
import { JsonTransformer } from "@/components/JsonTransformer";
import { JsonValidator } from "@/components/JsonValidator";
import { CustomValidator } from "@/components/CustomValidator";
import { BatchProcessor } from "@/components/BatchProcessor";
import { AdvancedExporter } from "@/components/AdvancedExporter";
import { CommandPalette, createCommands } from "@/components/CommandPalette";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboardNavigation, DEFAULT_JSON_SHORTCUTS } from "@/lib/keyboardNavigation";
import { PerformanceMonitor, MemoryEfficientJson, debounce } from "@/lib/performance";
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
  CheckCircle2,
  FileSearch,
  Binary,
  Search,
  BarChart3,
  Shuffle,
  Shield,
  Zap,
  Cpu,
  Terminal,
  Layers2,
  Package,
  FileOutput,
  ChevronDown,
} from "lucide-react";

type ViewMode =
  | "formatted"
  | "diff"
  | "table"
  | "types"
  | "foldable"
  | "query"
  | "analyze"
  | "transform"
  | "validate"
  | "batch"
  | "export"
  | "enhanced-diff";

export default function Index() {
  const [input, setInput] = useLocalStorage("stablejson-input", "");
  const [secondInput, setSecondInput] = useLocalStorage("stablejson-second-input", "");
  const [output, setOutput] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("formatted");
  const [diffResults, setDiffResults] = useState<DiffResult[]>([]);
  const [tableData, setTableData] = useState<{ headers: string[]; rows: Record<string, any>[] } | null>(null);
  const [typescriptOutput, setTypescriptOutput] = useState("");
  const [zodOutput, setZodOutput] = useState("");
  const [schemaOutput, setSchemaOutput] = useState("");
  const [canonicalMode, setCanonicalMode] = useLocalStorage("stablejson-canonical", false);
  const [structuralDiff, setStructuralDiff] = useLocalStorage("stablejson-structural-diff", false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [performanceMode, setPerformanceMode] = useLocalStorage("stablejson-performance", false);
  const [processingStats, setProcessingStats] = useState<any>(null);
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

  // Setup keyboard navigation
  const shortcuts = DEFAULT_JSON_SHORTCUTS.map((shortcut) => ({
    ...shortcut,
    action: () => {
      switch (shortcut.key) {
        case "f":
          if (shortcut.ctrlKey) handleFormat();
          break;
        case "m":
          if (shortcut.ctrlKey) handleMinify();
          break;
        case "s":
          if (shortcut.ctrlKey) handleSort();
          break;
        case "c":
          if (shortcut.ctrlKey && shortcut.shiftKey) handleClean();
          break;
        case "d":
          if (shortcut.ctrlKey) handleDiff();
          break;
        case "t":
          if (shortcut.ctrlKey) handleTable();
          break;
        case "g":
          if (shortcut.ctrlKey) handleTypes();
          break;
        case "k":
          if (shortcut.ctrlKey) setCommandOpen(true);
          break;
        case "/":
          if (shortcut.ctrlKey) showShortcutsHelp();
          break;
        case "r":
          if (shortcut.ctrlKey) handleClear();
          break;
        case "l":
          if (shortcut.ctrlKey) handleLoadSample();
          break;
      }
    },
  }));

  const { showShortcutsHelp } = useKeyboardNavigation({
    shortcuts,
    enableGlobalShortcuts: true,
    enableArrowNavigation: true,
    enableTabNavigation: true,
    enableEscapeHandling: true,
  });

  const handleFormat = useCallback(async () => {
    const timer = PerformanceMonitor.startTimer("format");
    try {
      let formatted: string;
      if (performanceMode && input.length > 100000) {
        formatted = await MemoryEfficientJson.processLargeJson(input, "format");
      } else {
        formatted = canonicalMode ? canonicalJson(input) : formatJson(input);
      }
      setOutput(formatted);
      setViewMode("formatted");
      const duration = timer();
      setProcessingStats(PerformanceMonitor.getMetrics("format"));
      toast({
        description: `${canonicalMode ? "JSON canonicalized" : "JSON formatted"} (${duration.toFixed(2)}ms)`,
      });
    } catch (e) {
      timer();
      toast({
        variant: "destructive",
        description: e instanceof Error ? e.message : "Failed to format",
      });
    }
  }, [input, canonicalMode, performanceMode, toast]);

  const handleMinify = useCallback(async () => {
    const timer = PerformanceMonitor.startTimer("minify");
    try {
      let minified: string;
      if (performanceMode && input.length > 100000) {
        minified = await MemoryEfficientJson.processLargeJson(input, "minify");
      } else {
        minified = minifyJson(input);
      }
      setOutput(minified);
      setViewMode("formatted");
      const duration = timer();
      toast({ description: `JSON minified (${duration.toFixed(2)}ms)` });
    } catch (e) {
      timer();
      toast({
        variant: "destructive",
        description: e instanceof Error ? e.message : "Failed to minify",
      });
    }
  }, [input, performanceMode, toast]);

  const handleSort = useCallback(() => {
    try {
      const sorted = sortJsonKeys(input);
      setOutput(sorted);
      setViewMode("formatted");
      toast({ description: "Keys sorted" });
    } catch (e) {
      toast({
        variant: "destructive",
        description: e instanceof Error ? e.message : "Failed to sort",
      });
    }
  }, [input, toast]);

  const handleClean = useCallback(() => {
    try {
      const cleaned = cleanJson(input);
      setOutput(cleaned);
      setViewMode("formatted");
      toast({ description: "Cleaned" });
    } catch (e) {
      toast({
        variant: "destructive",
        description: e instanceof Error ? e.message : "Failed to clean",
      });
    }
  }, [input, toast]);

  const handleDiff = useCallback(() => {
    try {
      const results = diffJson(input, secondInput, structuralDiff);
      setDiffResults(results);
      setViewMode("diff");
      toast({
        description: `${results.length} difference${results.length !== 1 ? "s" : ""}`,
      });
    } catch (e) {
      toast({
        variant: "destructive",
        description: e instanceof Error ? e.message : "Failed to diff",
      });
    }
  }, [input, secondInput, structuralDiff, toast]);

  const handleTable = useCallback(() => {
    const data = jsonToTableData(input);
    if (data) {
      setTableData(data);
      setViewMode("table");
    } else {
      toast({
        variant: "destructive",
        description: "Cannot convert to table",
      });
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
      toast({
        variant: "destructive",
        description: e instanceof Error ? e.message : "Failed to generate",
      });
    }
  }, [input, toast]);

  const handleFoldable = useCallback(() => {
    if (validateJson(input).valid) {
      setOutput(input);
      setViewMode("foldable");
    } else {
      toast({
        variant: "destructive",
        description: "Invalid JSON",
      });
    }
  }, [input, toast]);

  const handleCopy = useCallback(async () => {
    const textToCopy = viewMode === "formatted" ? output : input;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({ description: "Copied" });
    } catch {
      toast({
        variant: "destructive",
        description: "Failed to copy",
      });
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

  const handleExtract = useCallback(
    (path: string) => {
      try {
        const extracted = extractAtPath(input, path);
        setOutput(extracted);
        setViewMode("formatted");
        toast({ description: `Extracted ${path}` });
      } catch (e) {
        toast({
          variant: "destructive",
          description: e instanceof Error ? e.message : "Failed to extract",
        });
      }
    },
    [input, toast]
  );

  const handleToggleCanonical = useCallback(() => {
    setCanonicalMode((prev) => !prev);
  }, [setCanonicalMode]);

  const handleFoldableExtract = useCallback(
    (path: string, value: unknown) => {
      setOutput(JSON.stringify(value, null, 2));
      setViewMode("formatted");
      toast({ description: `Extracted ${path}` });
    },
    [toast]
  );

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

  const features = [
    { icon: CheckCircle2, text: "Validate and format" },
    { icon: Eraser, text: "Clean null and empty values" },
    { icon: GitCompare, text: "Compare and diff" },
    { icon: FileSearch, text: "Inspect and extract paths" },
    { icon: FileCode, text: "Generate types" },
    { icon: Binary, text: "Canonical output" },
    { icon: Search, text: "JSONPath queries" },
    { icon: BarChart3, text: "Analyze structure" },
    { icon: Shuffle, text: "Transform data" },
    { icon: Shield, text: "Custom validation" },
    { icon: Package, text: "Batch processing" },
    { icon: FileOutput, text: "Advanced export" },
    { icon: Layers2, text: "Enhanced diff" },
    { icon: Zap, text: "Performance optimized" },
    { icon: Terminal, text: "Keyboard navigation" },
  ];

  return (
    <Layout features={features} onOpenCommands={() => setCommandOpen(true)}>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} commands={commands} />

      <div className="flex flex-col h-full">
        {/* Premium Toolbar - Ultra Minimalist */}
        <div className="px-8 py-5 border-b bg-gradient-to-b from-background/80 to-background backdrop-blur-xl">
          <div className="flex items-center justify-between gap-6 max-w-[2000px] mx-auto">
            {/* Primary Actions Group */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleFormat}
                disabled={!input}
                size="sm"
                className="h-9 px-4 gap-2 font-medium shadow-sm hover:shadow transition-all duration-200"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Format
              </Button>
              <Button
                onClick={handleMinify}
                disabled={!input}
                variant="outline"
                size="sm"
                className="h-9 px-4 gap-2 font-medium hover:bg-muted/50 transition-all duration-200"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                Minify
              </Button>
              <Button
                onClick={handleClean}
                disabled={!input}
                variant="outline"
                size="sm"
                className="h-9 px-4 gap-2 font-medium hover:bg-muted/50 transition-all duration-200"
              >
                <Eraser className="w-3.5 h-3.5" />
                Clean
              </Button>
              <Button
                onClick={handleSort}
                disabled={!input}
                variant="outline"
                size="sm"
                className="h-9 px-4 gap-2 font-medium hover:bg-muted/50 transition-all duration-200"
              >
                <ArrowDownAZ className="w-3.5 h-3.5" />
                Sort
              </Button>

              <div className="w-px h-6 bg-border mx-1" />

              {/* View Mode Pills */}
              <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
                <Button
                  onClick={handleTable}
                  disabled={!validation.valid}
                  variant="ghost"
                  size="sm"
                  className={`h-7 px-3 gap-1.5 text-xs font-medium rounded-md transition-all duration-200 ${viewMode === "table"
                      ? "bg-background shadow-sm"
                      : "hover:bg-background/50"
                    }`}
                >
                  <Table className="w-3 h-3" />
                  Table
                </Button>
                <Button
                  onClick={handleTypes}
                  disabled={!validation.valid}
                  variant="ghost"
                  size="sm"
                  className={`h-7 px-3 gap-1.5 text-xs font-medium rounded-md transition-all duration-200 ${viewMode === "types"
                      ? "bg-background shadow-sm"
                      : "hover:bg-background/50"
                    }`}
                >
                  <FileCode className="w-3 h-3" />
                  Types
                </Button>
                <Button
                  onClick={() => setViewMode("analyze")}
                  disabled={!validation.valid}
                  variant="ghost"
                  size="sm"
                  className={`h-7 px-3 gap-1.5 text-xs font-medium rounded-md transition-all duration-200 ${viewMode === "analyze"
                      ? "bg-background shadow-sm"
                      : "hover:bg-background/50"
                    }`}
                >
                  <BarChart3 className="w-3 h-3" />
                  Analyze
                </Button>
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleDiff}
                disabled={!input || !secondInput}
                variant="outline"
                size="sm"
                className="h-9 px-4 gap-2 font-medium hover:bg-muted/50 transition-all duration-200"
              >
                <GitCompare className="w-3.5 h-3.5" />
                Diff
              </Button>

              <Button
                onClick={handleToggleCanonical}
                variant={canonicalMode ? "default" : "outline"}
                size="sm"
                className="h-9 px-4 gap-2 font-medium transition-all duration-200"
              >
                <Hash className="w-3.5 h-3.5" />
                Canonical
              </Button>

              <div className="w-px h-6 bg-border mx-1" />

              <Button
                onClick={handleLoadSample}
                variant="outline"
                size="sm"
                className="h-9 px-3.5 gap-2 font-medium hover:bg-muted/50 transition-all duration-200"
              >
                <FileJson className="w-3.5 h-3.5" />
                Sample
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                size="sm"
                className="h-9 px-3.5 gap-2 font-medium hover:bg-muted/50 transition-all duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </Button>
              <Button
                onClick={handleCopy}
                disabled={!output && !input}
                variant="outline"
                size="sm"
                className="h-9 px-3.5 gap-2 font-medium hover:bg-muted/50 transition-all duration-200"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </Button>
            </div>
          </div>

          {/* Advanced Tools Dropdown */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Advanced Tools
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { key: "query", label: "Query", icon: Search },
                { key: "transform", label: "Transform", icon: Shuffle },
                { key: "validate", label: "Validate", icon: Shield },
                { key: "batch", label: "Batch", icon: Package },
                { key: "export", label: "Export", icon: FileOutput },
                { key: "enhanced-diff", label: "Enhanced Diff", icon: Layers2 },
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  onClick={() => setViewMode(key as ViewMode)}
                  disabled={key !== "batch" && !validation.valid}
                  variant="ghost"
                  size="sm"
                  className={`h-7 px-3 gap-1.5 text-xs font-medium rounded-md transition-all duration-200 ${viewMode === key
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Workspace - Premium Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Input Panel - Refined */}
          <div className="flex-1 flex flex-col border-r min-w-0">
            <div className="px-6 py-4 border-b bg-muted/20 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-semibold tracking-tight">input.json</span>
                  </div>
                  {!validation.valid && input && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-destructive/10 text-destructive">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                      <span className="text-xs font-medium">Invalid JSON</span>
                    </div>
                  )}
                  {validation.valid && input && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="text-xs font-medium">Valid JSON</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <JsonEditor value={input} onChange={setInput} placeholder="Paste your JSON here..." />
            </div>
          </div>

          {/* Comparison Panel - Conditional */}
          {(viewMode === "diff" || viewMode === "enhanced-diff" || secondInput) && (
            <div className="flex-1 flex flex-col border-r min-w-0">
              <div className="px-6 py-4 border-b bg-muted/20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm font-semibold tracking-tight">comparison.json</span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <JsonEditor
                  value={secondInput}
                  onChange={setSecondInput}
                  placeholder="Paste comparison JSON..."
                />
              </div>
            </div>
          )}

          {/* Output Panel - Premium Design */}
          <div className="flex-1 flex flex-col min-w-0 bg-muted/5">
            <div className="px-6 py-4 border-b bg-gradient-to-b from-muted/30 to-muted/10 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-foreground">
                    {viewMode === "formatted" && <Code className="w-4 h-4" />}
                    {viewMode === "diff" && <GitCompare className="w-4 h-4" />}
                    {viewMode === "table" && <Table className="w-4 h-4" />}
                    {viewMode === "types" && <FileCode className="w-4 h-4" />}
                    {viewMode === "foldable" && <Layers className="w-4 h-4" />}
                    {viewMode === "query" && <Search className="w-4 h-4" />}
                    {viewMode === "analyze" && <BarChart3 className="w-4 h-4" />}
                    {viewMode === "transform" && <Shuffle className="w-4 h-4" />}
                    {viewMode === "validate" && <Shield className="w-4 h-4" />}
                    {viewMode === "batch" && <Package className="w-4 h-4" />}
                    {viewMode === "export" && <FileOutput className="w-4 h-4" />}
                    {viewMode === "enhanced-diff" && <Layers2 className="w-4 h-4" />}
                    <span className="text-sm font-semibold tracking-tight">
                      {viewMode === "formatted" && "Formatted Output"}
                      {viewMode === "diff" && "JSON Differences"}
                      {viewMode === "table" && "Table View"}
                      {viewMode === "types" && "Type Definitions"}
                      {viewMode === "foldable" && "Tree Explorer"}
                      {viewMode === "query" && "JSONPath Query"}
                      {viewMode === "analyze" && "Structure Analysis"}
                      {viewMode === "transform" && "Data Transformation"}
                      {viewMode === "validate" && "Custom Validation"}
                      {viewMode === "batch" && "Batch Processing"}
                      {viewMode === "export" && "Advanced Export"}
                      {viewMode === "enhanced-diff" && "Enhanced Diff View"}
                    </span>
                  </div>
                  {canonicalMode && viewMode === "formatted" && (
                    <div className="px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                      <span className="text-xs font-medium">Canonical Mode</span>
                    </div>
                  )}
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1">
                  <Button
                    onClick={() => setViewMode("formatted")}
                    variant="ghost"
                    size="sm"
                    className={`h-7 w-7 p-0 rounded-md transition-all duration-200 ${viewMode === "formatted"
                        ? "bg-background shadow-sm text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                      }`}
                    title="Code View"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    onClick={() => output && setViewMode("foldable")}
                    disabled={!output}
                    variant="ghost"
                    size="sm"
                    className={`h-7 w-7 p-0 rounded-md transition-all duration-200 ${viewMode === "foldable"
                        ? "bg-background shadow-sm text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50 disabled:opacity-30"
                      }`}
                    title="Tree View"
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    onClick={() => setViewMode("table")}
                    variant="ghost"
                    size="sm"
                    className={`h-7 w-7 p-0 rounded-md transition-all duration-200 ${viewMode === "table"
                        ? "bg-background shadow-sm text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                      }`}
                    title="Table View"
                  >
                    <Table className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Area - Ultra Clean */}
            <div className="flex-1 overflow-auto">
              {viewMode === "formatted" &&
                (output ? (
                  <div className="p-6">
                    <pre className="text-sm font-mono leading-relaxed bg-muted/30 rounded-xl p-6 overflow-x-auto border shadow-sm">
                      <code>{output}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-12">
                    <div className="text-center space-y-4 max-w-md">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto">
                        <Sparkles className="w-8 h-8 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold tracking-tight">Ready to Process</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Paste JSON in the input panel to see formatted output, or use the toolbar to explore
                          different processing modes.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Dynamic Content Views */}
              {viewMode === "foldable" && output && (
                <FoldableJsonViewer json={output} onExtract={handleFoldableExtract} />
              )}
              {viewMode === "diff" && <DiffViewer input={input} secondInput={secondInput} results={diffResults} />}
              {viewMode === "enhanced-diff" && (
                <EnhancedDiffViewer input={input} secondInput={secondInput} structuralDiff={structuralDiff} />
              )}
              {viewMode === "table" && tableData && <TableViewer data={tableData} />}
              {viewMode === "types" && (
                <TypesViewer
                  typescriptOutput={typescriptOutput}
                  zodOutput={zodOutput}
                  schemaOutput={schemaOutput}
                />
              )}
              {viewMode === "query" && <JsonQuery input={input} onExtract={handleExtract} />}
              {viewMode === "analyze" && <JsonAnalyzer input={input} />}
              {viewMode === "transform" && <JsonTransformer input={input} />}
              {viewMode === "validate" && <JsonValidator input={input} />}
              {viewMode === "batch" && (
                <BatchProcessor
                  onBatchComplete={(results) =>
                    toast({
                      description: `Processed ${results.length} files`,
                    })
                  }
                />
              )}
              {viewMode === "export" && <AdvancedExporter input={input} />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}