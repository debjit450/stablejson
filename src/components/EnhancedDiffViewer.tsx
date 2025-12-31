import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  GitCompare,
  Plus,
  Minus,
  Edit,
  Move,
  Eye,
  EyeOff,
  Filter,
  Download,
  Copy,
  BarChart3,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { DiffResult } from '@/lib/jsonUtils';
import { useToast } from '@/hooks/use-toast';
import * as Diff from 'diff';

interface EnhancedDiffViewerProps {
  diffs: DiffResult[];
  structuralMode: boolean;
  onToggleStructural: (enabled: boolean) => void;
  leftJson?: string;
  rightJson?: string;
}

type DiffViewMode = 'side-by-side' | 'unified' | 'inline' | 'stats';
type DiffFilterType = 'all' | 'added' | 'removed' | 'modified' | 'moved';

interface DiffStats {
  total: number;
  added: number;
  removed: number;
  modified: number;
  moved: number;
  unchanged: number;
}

export function EnhancedDiffViewer({
  diffs,
  structuralMode,
  onToggleStructural,
  leftJson = '',
  rightJson = '',
}: EnhancedDiffViewerProps) {
  const [viewMode, setViewMode] = useState<DiffViewMode>('side-by-side');
  const [filterType, setFilterType] = useState<DiffFilterType>('all');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showWhitespace, setShowWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [contextLines, setContextLines] = useState(3);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Calculate diff statistics
  const stats: DiffStats = useMemo(() => {
    const result = {
      total: diffs.length,
      added: 0,
      removed: 0,
      modified: 0,
      moved: 0,
      unchanged: 0,
    };

    diffs.forEach((diff) => {
      switch (diff.type) {
        case 'added':
          result.added++;
          break;
        case 'removed':
          result.removed++;
          break;
        case 'modified':
          result.modified++;
          break;
        case 'moved':
          result.moved++;
          break;
        default:
          result.unchanged++;
      }
    });

    return result;
  }, [diffs]);

  // Filter diffs based on selected filter
  const filteredDiffs = useMemo(() => {
    if (filterType === 'all') return diffs;
    return diffs.filter((diff) => {
      switch (filterType) {
        case 'added':
          return diff.type === 'added';
        case 'removed':
          return diff.type === 'removed';
        case 'modified':
          return diff.type === 'modified';
        case 'moved':
          return diff.type === 'moved';
        default:
          return true;
      }
    });
  }, [diffs, filterType]);

  // Generate unified diff using diff library
  const unifiedDiff = useMemo(() => {
    if (!leftJson || !rightJson) return '';
    
    const options = {
      ignoreCase,
      ignoreWhitespace: !showWhitespace,
      context: contextLines,
    };
    
    return Diff.createPatch('comparison', leftJson, rightJson, 'Original', 'Modified', options);
  }, [leftJson, rightJson, ignoreCase, showWhitespace, contextLines]);

  const togglePathExpansion = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const handleCopyDiff = async () => {
    try {
      const diffText = filteredDiffs
        .map((diff) => `${diff.type.toUpperCase()}: ${diff.path}\n${diff.message}`)
        .join('\n\n');
      
      await navigator.clipboard.writeText(diffText);
      toast({ description: 'Diff copied to clipboard' });
    } catch (error) {
      toast({ variant: 'destructive', description: 'Failed to copy diff' });
    }
  };

  const handleExportDiff = () => {
    const diffData = {
      timestamp: new Date().toISOString(),
      stats,
      diffs: filteredDiffs,
      options: {
        structuralMode,
        ignoreCase,
        showWhitespace,
        contextLines,
      },
    };

    const blob = new Blob([JSON.stringify(diffData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `json-diff-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDiffIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'removed':
        return <Minus className="w-4 h-4 text-red-500" />;
      case 'modified':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'moved':
        return <Move className="w-4 h-4 text-purple-500" />;
      default:
        return <GitCompare className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getDiffColor = (type: string) => {
    switch (type) {
      case 'added':
        return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
      case 'removed':
        return 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800';
      case 'modified':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
      case 'moved':
        return 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800';
      default:
        return 'bg-muted/50 border-border';
    }
  };

  if (diffs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <GitCompare className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">No Differences Found</h3>
        <p className="text-sm text-center">
          The JSON objects are identical or no comparison has been performed yet.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with controls */}
      <div className="border-b border-border/40 bg-muted/20 p-4 space-y-4">
        {/* Stats Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-primary" />
              <span className="font-semibold">
                {stats.total} difference{stats.total !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Plus className="w-3 h-3 mr-1" />
                {stats.added}
              </Badge>
              <Badge variant="outline" className="text-red-600 border-red-200">
                <Minus className="w-3 h-3 mr-1" />
                {stats.removed}
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <Edit className="w-3 h-3 mr-1" />
                {stats.modified}
              </Badge>
              {stats.moved > 0 && (
                <Badge variant="outline" className="text-purple-600 border-purple-200">
                  <Move className="w-3 h-3 mr-1" />
                  {stats.moved}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyDiff}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportDiff}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="structural-mode"
              checked={structuralMode}
              onCheckedChange={onToggleStructural}
            />
            <Label htmlFor="structural-mode" className="text-sm">
              Structural diff
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="line-numbers"
              checked={showLineNumbers}
              onCheckedChange={setShowLineNumbers}
            />
            <Label htmlFor="line-numbers" className="text-sm">
              Line numbers
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="whitespace"
              checked={showWhitespace}
              onCheckedChange={setShowWhitespace}
            />
            <Label htmlFor="whitespace" className="text-sm">
              Show whitespace
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ignore-case"
              checked={ignoreCase}
              onCheckedChange={setIgnoreCase}
            />
            <Label htmlFor="ignore-case" className="text-sm">
              Ignore case
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as DiffFilterType)}
              className="text-sm border border-border rounded px-2 py-1 bg-background"
            >
              <option value="all">All changes</option>
              <option value="added">Added only</option>
              <option value="removed">Removed only</option>
              <option value="modified">Modified only</option>
              <option value="moved">Moved only</option>
            </select>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as DiffViewMode)} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 mx-4 mt-2">
          <TabsTrigger value="side-by-side" className="text-xs">
            <Layers className="w-4 h-4 mr-1" />
            Side by Side
          </TabsTrigger>
          <TabsTrigger value="unified" className="text-xs">
            <GitCompare className="w-4 h-4 mr-1" />
            Unified
          </TabsTrigger>
          <TabsTrigger value="inline" className="text-xs">
            <ArrowRight className="w-4 h-4 mr-1" />
            Inline
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-xs">
            <BarChart3 className="w-4 h-4 mr-1" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="side-by-side" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {filteredDiffs.map((diff, index) => (
                  <Card key={index} className={`${getDiffColor(diff.type)} transition-all hover:shadow-md`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getDiffIcon(diff.type)}
                          <code className="text-sm font-mono bg-background/50 px-2 py-1 rounded">
                            {diff.path}
                          </code>
                          <Badge variant="secondary" className="text-xs">
                            {diff.type}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePathExpansion(diff.path)}
                        >
                          {expandedPaths.has(diff.path) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-2">{diff.message}</p>
                      {expandedPaths.has(diff.path) && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Before</Label>
                            <pre className="text-xs bg-background/50 p-2 rounded border mt-1 overflow-x-auto">
                              {diff.oldValue !== undefined ? JSON.stringify(diff.oldValue, null, 2) : 'N/A'}
                            </pre>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">After</Label>
                            <pre className="text-xs bg-background/50 p-2 rounded border mt-1 overflow-x-auto">
                              {diff.newValue !== undefined ? JSON.stringify(diff.newValue, null, 2) : 'N/A'}
                            </pre>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unified" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                <pre className="text-xs font-mono bg-muted/20 p-4 rounded border overflow-x-auto">
                  {unifiedDiff || 'No unified diff available'}
                </pre>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="inline" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-1">
                {filteredDiffs.map((diff, index) => (
                  <div key={index} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-muted/50">
                    {showLineNumbers && (
                      <span className="text-xs text-muted-foreground w-8 text-right">
                        {index + 1}
                      </span>
                    )}
                    {getDiffIcon(diff.type)}
                    <code className="text-xs font-mono flex-1">{diff.path}</code>
                    <span className="text-xs text-muted-foreground">{diff.message}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stats" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Diff Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Changes:</span>
                          <span className="font-mono">{stats.total}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                          <span className="text-sm">Added:</span>
                          <span className="font-mono">{stats.added}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span className="text-sm">Removed:</span>
                          <span className="font-mono">{stats.removed}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-blue-600">
                          <span className="text-sm">Modified:</span>
                          <span className="font-mono">{stats.modified}</span>
                        </div>
                        <div className="flex justify-between text-purple-600">
                          <span className="text-sm">Moved:</span>
                          <span className="font-mono">{stats.moved}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span className="text-sm">Unchanged:</span>
                          <span className="font-mono">{stats.unchanged}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Change Distribution</h4>
                      <div className="space-y-1">
                        {[
                          { label: 'Added', count: stats.added, color: 'bg-green-500' },
                          { label: 'Removed', count: stats.removed, color: 'bg-red-500' },
                          { label: 'Modified', count: stats.modified, color: 'bg-blue-500' },
                          { label: 'Moved', count: stats.moved, color: 'bg-purple-500' },
                        ].map(({ label, count, color }) => (
                          <div key={label} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded ${color}`} />
                            <span className="text-sm flex-1">{label}</span>
                            <span className="text-sm font-mono">{count}</span>
                            <span className="text-xs text-muted-foreground">
                              ({stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}