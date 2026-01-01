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
} from "lucide-react";

type ViewMode = "formatted" | "diff" | "table" | "types" | "foldable" | "query" | "analyze" | "transform" | "validate" | "batch" | "export" | "enhanced-diff";

export default function Index() {
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
  const shortcuts = DEFAULT_JSON_SHORTCUTS.map(shortcut => ({
    ...shortcut,
    action: () => {
      switch (shortcut.key) {
        case 'f':
          if (shortcut.ctrlKey) handleFormat();
          break;
        case 'm':
          if (shortcut.ctrlKey) handleMinify();
          break;
        case 's':
          if (shortcut.ctrlKey) handleSort();
          break;
        case 'c':
          if (shortcut.ctrlKey && shortcut.shiftKey) handleClean();
          break;
        case 'd':
          if (shortcut.ctrlKey) handleDiff();
          break;
        case 't':
          if (shortcut.ctrlKey) handleTable();
          break;
        case 'g':
          if (shortcut.ctrlKey) handleTypes();
          break;
        case 'k':
          if (shortcut.ctrlKey) setCommandOpen(true);
          break;
        case '/':
          if (shortcut.ctrlKey) showShortcutsHelp();
          break;
        case 'r':
          if (shortcut.ctrlKey) handleClear();
          break;
        case 'l':
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
    const timer = PerformanceMonitor.startTimer('format');
    try {
      let formatted: string;
      
      if (performanceMode && input.length > 100000) {
        // Use memory-efficient processing for large JSON
        formatted = await MemoryEfficientJson.processLargeJson(input, 'format');
      } else {
        formatted = canonicalMode ? canonicalJson(input) : formatJson(input);
      }
      
      setOutput(formatted);
      setViewMode("formatted");
      
      const duration = timer();
      setProcessingStats(PerformanceMonitor.getMetrics('format'));
      
      toast({ description: `${canonicalMode ? "JSON canonicalized" : "JSON formatted"} (${duration.toFixed(2)}ms)` });
    } catch (e) {
      timer();
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "Failed to format" });
    }
  }, [input, canonicalMode, performanceMode, toast]);

  const handleMinify = useCallback(async () => {
    const timer = PerformanceMonitor.startTimer('minify');
    try {
      let minified: string;
      
      if (performanceMode && input.length > 100000) {
        minified = await MemoryEfficientJson.processLargeJson(input, 'minify');
      } else {
        minified = minifyJson(input);
      }
      
      setOutput(minified);
      setViewMode("formatted");
      
      const duration = timer();
      toast({ description: `JSON minified (${duration.toFixed(2)}ms)` });
    } catch (e) {
      timer();
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "Failed to minify" });
    }
  }, [input, performanceMode, toast]);

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
    <Layout showCommandButton onOpenCommand={() => setCommandOpen(true)}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 text-foreground selection:bg-primary/20 selection:text-primary">

        {/* Floating Action Bar - Modern & Clean */}
        <div className="sticky top-0 z-50 border-b border-border/20 bg-background/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              
              {/* Primary Actions */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-muted/30 rounded-xl p-1 border border-border/40">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleFormat} 
                    disabled={!validation.valid} 
                    className="h-8 px-3 gap-2 hover:bg-background/80 hover:shadow-sm font-medium text-xs rounded-lg transition-all duration-200"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> 
                    Format
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleMinify} 
                    disabled={!validation.valid} 
                    className="h-8 px-3 gap-2 hover:bg-background/80 hover:shadow-sm font-medium text-xs rounded-lg transition-all duration-200"
                  >
                    <Minimize2 className="w-3.5 h-3.5" /> 
                    Minify
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClean} 
                    disabled={!validation.valid} 
                    className="h-8 px-3 gap-2 hover:bg-background/80 hover:shadow-sm font-medium text-xs rounded-lg transition-all duration-200"
                  >
                    <Eraser className="w-3.5 h-3.5" /> 
                    Clean
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSort} 
                    disabled={!validation.valid} 
                    className="h-8 px-3 gap-2 hover:bg-background/80 hover:shadow-sm font-medium text-xs rounded-lg transition-all duration-200"
                  >
                    <ArrowDownAZ className="w-3.5 h-3.5" /> 
                    Sort
                  </Button>
                </div>

                {/* View Mode Selector */}
                <div className="flex items-center bg-muted/30 rounded-xl p-1 border border-border/40">
                  <Button
                    variant={viewMode === "table" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={handleTable}
                    disabled={!validation.valid}
                    className={`h-8 px-3 gap-2 text-xs rounded-lg transition-all duration-200 ${viewMode === "table" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Table className="w-3.5 h-3.5" /> Table
                  </Button>
                  <Button
                    variant={viewMode === "types" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={handleTypes}
                    disabled={!validation.valid}
                    className={`h-8 px-3 gap-2 text-xs rounded-lg transition-all duration-200 ${viewMode === "types" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <FileCode className="w-3.5 h-3.5" /> Types
                  </Button>
                  <Button
                    variant={viewMode === "analyze" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("analyze")}
                    disabled={!validation.valid}
                    className={`h-8 px-3 gap-2 text-xs rounded-lg transition-all duration-200 ${viewMode === "analyze" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> Analyze
                  </Button>
                </div>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "diff" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={handleDiff}
                  disabled={!validateJson(input).valid}
                  className={`h-8 px-3 gap-2 text-xs rounded-lg transition-all duration-200 ${viewMode === "diff" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "text-muted-foreground hover:text-amber-500"}`}
                >
                  <GitCompare className="w-3.5 h-3.5" /> Diff
                </Button>

                <Button
                  variant={canonicalMode ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleCanonical}
                  className={`h-8 px-3 gap-2 text-xs font-mono rounded-lg transition-all duration-200 ${canonicalMode ? "bg-primary text-primary-foreground shadow-sm" : "border-border/40 text-muted-foreground hover:text-foreground"}`}
                >
                  <Hash className="w-3.5 h-3.5" />
                  Canonical
                </Button>

                <div className="flex items-center bg-muted/30 rounded-xl border border-border/40">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLoadSample} 
                    className="h-8 px-3 gap-2 text-xs font-medium rounded-l-lg hover:bg-background/80"
                  >
                    <FileJson className="w-3.5 h-3.5" /> Sample
                  </Button>
                  <div className="w-px h-4 bg-border/40" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClear} 
                    className="h-8 px-3 gap-2 text-muted-foreground hover:text-destructive text-xs font-medium rounded-r-lg hover:bg-background/80"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Clear
                  </Button>
                </div>

                <Button
                  onClick={handleCopy}
                  disabled={!output && viewMode === "formatted"}
                  className="h-8 px-4 gap-2 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-lg shadow-primary/20 transition-all duration-200"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy
                </Button>
              </div>
            </div>

            {/* Extended Mode Selector */}
            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/20 text-xs">
              <span className="text-muted-foreground/60 font-medium mr-3">Advanced:</span>
              {[
                { key: "query", label: "Query", icon: Search },
                { key: "transform", label: "Transform", icon: Shuffle },
                { key: "validate", label: "Validate", icon: Shield },
                { key: "batch", label: "Batch", icon: Package },
                { key: "export", label: "Export", icon: FileOutput },
                { key: "enhanced-diff", label: "Enhanced Diff", icon: Layers2 },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key as ViewMode)}
                  disabled={key !== "batch" && !validation.valid}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    viewMode === key 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Workspace - Clean & Spacious */}
        <div className="container mx-auto px-4 py-6 h-[calc(100vh-16rem)] min-h-[600px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">

            {/* Input Panel - Elegant Design */}
            <div className="flex flex-col gap-4 h-full">
              <div className="flex-1 relative group rounded-2xl border border-border/30 bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
                {/* Refined Header */}
                <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-muted/40 to-muted/20 border-b border-border/20 flex items-center px-4 z-10 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60 group-hover:bg-red-500 transition-colors" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60 group-hover:bg-yellow-500 transition-colors" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60 group-hover:bg-green-500 transition-colors" />
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-mono font-medium text-foreground/80">input.json</span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    {!validation.valid && input && (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20">
                        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                        <span className="text-xs font-medium text-destructive">Invalid JSON</span>
                      </div>
                    )}
                    {validation.valid && input && (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-emerald-600">Valid JSON</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-12 h-full">
                  <JsonEditor
                    value={input}
                    onChange={setInput}
                    label=""
                    onExtract={handleExtract}
                    placeholder="Paste your JSON here to get started..."
                  />
                </div>
              </div>

              {/* Comparison Panel - Conditional */}
              {(viewMode === "diff" || viewMode === "enhanced-diff" || secondInput) && (
                <div className="flex-1 relative rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-amber-500/2 backdrop-blur-sm overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-b border-amber-500/20 flex items-center px-4 z-10 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <GitCompare className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-mono font-medium text-amber-700 dark:text-amber-400">comparison.json</span>
                    </div>
                  </div>
                  <div className="pt-12 h-full">
                    <JsonEditor
                      value={secondInput}
                      onChange={setSecondInput}
                      label=""
                      placeholder="Paste second JSON for comparison..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Output Panel - Premium Design */}
            <div className="flex flex-col h-full rounded-2xl border border-border/30 bg-gradient-to-br from-card/50 to-background/30 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/5">

              {/* Sophisticated Header */}
              <div className="h-12 border-b border-border/30 bg-gradient-to-r from-muted/30 to-muted/10 flex items-center px-4 justify-between backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                    {viewMode === "formatted" && <Code className="w-4 h-4 text-primary" />}
                    {viewMode === "diff" && <GitCompare className="w-4 h-4 text-amber-500" />}
                    {viewMode === "table" && <Table className="w-4 h-4 text-blue-500" />}
                    {viewMode === "types" && <FileCode className="w-4 h-4 text-purple-500" />}
                    {viewMode === "foldable" && <Layers className="w-4 h-4 text-green-500" />}
                    {viewMode === "query" && <Search className="w-4 h-4 text-pink-500" />}
                    {viewMode === "analyze" && <BarChart3 className="w-4 h-4 text-indigo-500" />}
                    {viewMode === "transform" && <Shuffle className="w-4 h-4 text-orange-500" />}
                    {viewMode === "validate" && <Shield className="w-4 h-4 text-red-500" />}
                    {viewMode === "batch" && <Package className="w-4 h-4 text-purple-500" />}
                    {viewMode === "export" && <FileOutput className="w-4 h-4 text-cyan-500" />}
                    {viewMode === "enhanced-diff" && <Layers2 className="w-4 h-4 text-amber-500" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
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
                    </h3>
                    {canonicalMode && viewMode === "formatted" && (
                      <span className="text-xs text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">Canonical Mode</span>
                    )}
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-muted/40 rounded-lg p-1 border border-border/30">
                  <button
                    onClick={() => setViewMode("formatted")}
                    className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'formatted' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    title="Code View"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => output && setViewMode("foldable")}
                    disabled={!output}
                    className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'foldable' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground disabled:opacity-30'}`}
                    title="Tree View"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'table' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    title="Table View"
                  >
                    <Table className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content Area - Clean & Focused */}
              <div className="flex-1 overflow-hidden relative">
                {viewMode === "formatted" && (
                  output ? (
                    <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-border/50 p-6">
                      <pre className="font-mono text-sm leading-relaxed text-foreground/90" dangerouslySetInnerHTML={{ __html: highlightJson(output) }} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl rounded-full" />
                        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/30">
                          <Code className="w-12 h-12 text-primary" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">Ready to Process</h3>
                        <p className="text-sm text-muted-foreground max-w-md">
                          Paste JSON in the input panel to see formatted output, or use the toolbar to explore different processing modes.
                        </p>
                      </div>
                    </div>
                  )
                )}

                {/* Dynamic Content Views */}
                <div className="h-full overflow-auto">
                  {viewMode === "foldable" && output && <FoldableJsonViewer json={output} onExtract={handleFoldableExtract} />}
                  {viewMode === "diff" && <DiffViewer diffs={diffResults} structuralMode={structuralDiff} onToggleStructural={setStructuralDiff} />}
                  {viewMode === "enhanced-diff" && <EnhancedDiffViewer diffs={diffResults} structuralMode={structuralDiff} onToggleStructural={setStructuralDiff} leftJson={input} rightJson={secondInput} />}
                  {viewMode === "table" && tableData && <TableViewer headers={tableData.headers} rows={tableData.rows} />}
                  {viewMode === "types" && <TypesViewer typescript={typescriptOutput} zod={zodOutput} schema={schemaOutput} />}
                  {viewMode === "query" && <JsonQuery json={input} />}
                  {viewMode === "analyze" && <JsonAnalyzer json={input} />}
                  {viewMode === "transform" && <JsonTransformer json={input} secondJson={secondInput} onResult={setOutput} />}
                  {viewMode === "validate" && <CustomValidator json={input} />}
                  {viewMode === "batch" && <BatchProcessor onResult={(results) => toast({ description: `Processed ${results.length} files` })} />}
                  {viewMode === "export" && <AdvancedExporter json={input} filename="stablejson-export" />}
                </div>
              </div>
            </div>
          </div>
        </div>

        <CommandPalette commands={commands} open={commandOpen} onOpenChange={setCommandOpen} />
      </div>
    </Layout>
  );
}