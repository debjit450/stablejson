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
} from "lucide-react";

type ViewMode = "formatted" | "diff" | "table" | "types" | "foldable" | "query" | "analyze" | "transform" | "validate";

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
  ];

  return (
    <Layout showCommandButton onOpenCommand={() => setCommandOpen(true)}>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">



        {/* Toolbar - Sticky & Glassmorphic */}
        <div className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-2 sm:px-4 py-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              {/* Operations Group */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40 border border-border/20 overflow-x-auto scrollbar-none w-full sm:w-auto">
                <Button variant="ghost" size="sm" onClick={handleFormat} disabled={!validation.valid} className="h-7 sm:h-8 gap-1 sm:gap-2 hover:bg-background hover:shadow-sm font-medium text-xs px-2 sm:px-3">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Format</span>
                </Button>
                <div className="w-px h-4 bg-border/50 mx-0.5 sm:mx-1" />
                <Button variant="ghost" size="sm" onClick={handleMinify} disabled={!validation.valid} className="h-7 sm:h-8 gap-1 sm:gap-2 hover:bg-background hover:shadow-sm font-medium text-xs px-2 sm:px-3">
                  <Minimize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Minify</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClean} disabled={!validation.valid} className="h-7 sm:h-8 gap-1 sm:gap-2 hover:bg-background hover:shadow-sm font-medium text-xs px-2 sm:px-3">
                  <Eraser className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Clean</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSort} disabled={!validation.valid} className="h-7 sm:h-8 gap-1 sm:gap-2 hover:bg-background hover:shadow-sm font-medium text-xs px-2 sm:px-3">
                  <ArrowDownAZ className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Sort</span>
                </Button>
              </div>

              {/* View Modes Group */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40 border border-border/20 overflow-x-auto scrollbar-none w-full sm:w-auto">
                <Button
                  variant={viewMode === "table" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={handleTable}
                  disabled={!validation.valid}
                  className={`h-7 sm:h-8 gap-1 sm:gap-2 text-xs px-2 sm:px-3 transition-all ${viewMode === "table" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
                >
                  <Table className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Table</span>
                </Button>
                <Button
                  variant={viewMode === "types" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={handleTypes}
                  disabled={!validation.valid}
                  className={`h-7 sm:h-8 gap-1 sm:gap-2 text-xs px-2 sm:px-3 transition-all ${viewMode === "types" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
                >
                  <FileCode className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Types</span>
                </Button>
                <Button
                  variant={viewMode === "analyze" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("analyze")}
                  disabled={!validation.valid}
                  className={`h-7 sm:h-8 gap-1 sm:gap-2 text-xs px-2 sm:px-3 transition-all ${viewMode === "analyze" ? "bg-background shadow-sm text-primary" : "text-muted-foreground"}`}
                >
                  <BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Analyze</span>
                </Button>

                <div className="w-px h-4 bg-border/50 mx-0.5 sm:mx-1" />

                <Button
                  variant={viewMode === "diff" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={handleDiff}
                  disabled={!validateJson(input).valid}
                  className={`h-7 sm:h-8 gap-1 sm:gap-2 text-xs px-2 sm:px-3 transition-all ${viewMode === "diff" ? "bg-background shadow-sm text-amber-500" : "text-muted-foreground hover:text-amber-500"}`}
                >
                  <GitCompare className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Diff</span>
                </Button>
              </div>

              {/* Utility Actions */}
              <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
                <Button
                  variant={canonicalMode ? "default" : "outline"}
                  size="sm"
                  onClick={handleToggleCanonical}
                  className={`h-7 sm:h-8 gap-1 sm:gap-2 text-xs font-mono transition-all px-2 sm:px-3 ${canonicalMode ? "bg-primary text-primary-foreground" : "border-border/40 text-muted-foreground"}`}
                >
                  <Hash className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Canonical</span>
                </Button>

                <div className="flex items-center rounded-md border border-border/40 bg-background/50">
                  <Button variant="info" size="sm" onClick={handleLoadSample} className="h-7 sm:h-8 px-2 sm:px-3 text-xs font-medium">
                    <FileJson className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Sample</span>
                  </Button>
                  <div className="w-px h-4 bg-border/40" />
                  <Button variant="ghost" size="sm" onClick={handleClear} className="h-7 sm:h-8 px-2 sm:px-3 text-muted-foreground hover:text-destructive text-xs font-medium">
                    <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Clear</span>
                  </Button>
                </div>

                <Button
                  variant="brand"
                  onClick={handleCopy}
                  disabled={!output && viewMode === "formatted"}
                  className="h-7 sm:h-8 px-2 sm:px-4 text-xs font-bold shadow-lg"
                >
                  <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-2" /> Copy
                </Button>
              </div>
            </div>

            {/* Extended Toolbar (Second Row) */}
            <div className="flex items-center gap-1 mt-2 pb-1 overflow-x-auto scrollbar-none text-xs text-muted-foreground/60 font-mono">
              <span className="px-2 whitespace-nowrap">Modes:</span>
              <button onClick={() => setViewMode("query")} disabled={!validation.valid} className={`hover:text-primary px-2 py-0.5 rounded transition-colors whitespace-nowrap ${viewMode === 'query' ? 'text-primary bg-primary/10' : ''}`}>Query</button>
              <span className="opacity-20">|</span>
              <button onClick={() => setViewMode("transform")} disabled={!validation.valid} className={`hover:text-primary px-2 py-0.5 rounded transition-colors whitespace-nowrap ${viewMode === 'transform' ? 'text-primary bg-primary/10' : ''}`}>Transform</button>
              <span className="opacity-20">|</span>
              <button onClick={() => setViewMode("validate")} disabled={!validation.valid} className={`hover:text-primary px-2 py-0.5 rounded transition-colors whitespace-nowrap ${viewMode === 'validate' ? 'text-primary bg-primary/10' : ''}`}>Validate</button>
              <span className="opacity-20">|</span>
              <button onClick={handleFoldable} disabled={!validation.valid} className={`hover:text-primary px-2 py-0.5 rounded transition-colors whitespace-nowrap ${viewMode === 'foldable' ? 'text-primary bg-primary/10' : ''}`}>Tree View</button>
            </div>
          </div>
        </div>

        {/* Main Work Area */}
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 h-[calc(100vh-12rem)] sm:h-[calc(100vh-10rem)] min-h-[400px] sm:min-h-[600px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 h-full">

            {/* LEFT PANEL: Input */}
            <div className="flex flex-col gap-2 sm:gap-4 h-full">
              <div className="flex-1 relative group rounded-xl border border-border/40 bg-card/20 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/20">
                {/* Panel Header */}
                <div className="absolute top-0 left-0 right-0 h-8 sm:h-9 bg-muted/30 border-b border-border/20 flex items-center px-2 sm:px-3 z-10">
                  <div className="flex gap-1 sm:gap-1.5 mr-2 sm:mr-4">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-border/40 transition-colors"></div>
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-border/40 transition-colors"></div>
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-border/40 transition-colors"></div>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">Input.json</span>
                  <div className="ml-auto">
                    {!validation.valid && input && (
                      <span className="flex items-center text-[9px] sm:text-[10px] text-destructive bg-destructive/10 px-1.5 sm:px-2 py-0.5 rounded-full">
                        <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" /> <span className="hidden sm:inline">Invalid Syntax</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-8 sm:pt-9 h-full">
                  <JsonEditor
                    value={input}
                    onChange={setInput}
                    label=""
                    onExtract={handleExtract}
                    placeholder="Paste JSON here..."
                  />
                </div>
              </div>

              {/* Second input for diff (Conditional) */}
              {(viewMode === "diff" || secondInput) && (
                <div className="flex-1 relative rounded-xl border border-border/40 bg-card/20 backdrop-blur-sm overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-8 sm:h-9 bg-amber-500/5 border-b border-amber-500/20 flex items-center px-2 sm:px-3 z-10">
                    <GitCompare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 mr-1 sm:mr-2" />
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-amber-500 font-semibold">Comparison.json</span>
                  </div>
                  <div className="pt-8 sm:pt-9 h-full">
                    <JsonEditor
                      value={secondInput}
                      onChange={setSecondInput}
                      label=""
                      placeholder="Paste second JSON to compare..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT PANEL: Output */}
            <div className="flex flex-col h-full rounded-xl border border-border/40 bg-gradient-to-b from-card/30 to-background/50 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/5">

              {/* Output Header */}
              <div className="h-8 sm:h-10 border-b border-border/40 bg-muted/20 flex items-center px-2 justify-between">
                <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2">
                  <div className="p-0.5 sm:p-1 rounded bg-primary/10">
                    {viewMode === "formatted" && <Code className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />}
                    {viewMode === "diff" && <GitCompare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />}
                    {viewMode === "table" && <Table className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />}
                    {viewMode === "types" && <FileCode className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-500" />}
                    {viewMode === "foldable" && <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />}
                    {viewMode === "query" && <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-500" />}
                    {viewMode === "analyze" && <BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-500" />}
                    {viewMode === "transform" && <Shuffle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500" />}
                    {viewMode === "validate" && <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500" />}
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold font-mono tracking-tight text-foreground/80">
                    {viewMode === "formatted" && "Output"}
                    {viewMode === "diff" && "Differences"}
                    {viewMode === "table" && "Table View"}
                    {viewMode === "types" && "Type Definitions"}
                    {viewMode === "foldable" && "Tree Explorer"}
                    {viewMode === "query" && "JSON Query"}
                    {viewMode === "analyze" && "Structure Analysis"}
                    {viewMode === "transform" && "Transformation"}
                    {viewMode === "validate" && "Validation Rules"}
                  </span>
                  {canonicalMode && viewMode === "formatted" && (
                    <div className="px-1 sm:px-1.5 py-0.5 rounded border border-primary/30 bg-primary/5 text-[8px] sm:text-[10px] text-primary font-mono uppercase tracking-widest">Canonical</div>
                  )}
                </div>

                <div className="flex bg-muted/50 p-0.5 rounded-lg border border-border/20">
                  <button
                    onClick={() => setViewMode("formatted")}
                    className={`p-1 sm:p-1.5 rounded-md transition-all ${viewMode === 'formatted' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    title="Code View"
                  >
                    <Code className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <button
                    onClick={() => output && setViewMode("foldable")}
                    disabled={!output}
                    className={`p-1 sm:p-1.5 rounded-md transition-all ${viewMode === 'foldable' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground disabled:opacity-30'}`}
                    title="Tree View"
                  >
                    <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-1 sm:p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    title="Table View"
                  >
                    <Table className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              </div>

              {/* Output Content Area */}
              <div className="flex-1 overflow-hidden relative">
                {viewMode === "formatted" && (
                  output ? (
                    <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-border/50 p-2 sm:p-4">
                      <pre className="font-mono text-xs leading-relaxed text-foreground/90" dangerouslySetInnerHTML={{ __html: highlightJson(output) }} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 gap-2 sm:gap-4 p-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                        <Code className="w-8 h-8 sm:w-12 sm:h-12 relative z-10" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs sm:text-sm font-medium text-foreground/60">Ready to process</p>
                        <p className="text-xs font-mono">Output will appear here</p>
                      </div>
                    </div>
                  )
                )}

                {/* Other Views Rendered Here */}
                <div className="h-full overflow-auto bg-card/10">
                  {viewMode === "foldable" && output && <FoldableJsonViewer json={output} onExtract={handleFoldableExtract} />}
                  {viewMode === "diff" && <DiffViewer diffs={diffResults} structuralMode={structuralDiff} onToggleStructural={setStructuralDiff} />}
                  {viewMode === "table" && tableData && <TableViewer headers={tableData.headers} rows={tableData.rows} />}
                  {viewMode === "types" && <TypesViewer typescript={typescriptOutput} zod={zodOutput} schema={schemaOutput} />}
                  {viewMode === "query" && <JsonQuery json={input} />}
                  {viewMode === "analyze" && <JsonAnalyzer json={input} />}
                  {viewMode === "transform" && <JsonTransformer json={input} secondJson={secondInput} onResult={setOutput} />}
                  {viewMode === "validate" && <JsonValidator json={input} />}
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