import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Download,
  FileText,
  Code,
  Database,
  Table,
  Settings,
  Copy,
  Eye,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as yaml from 'js-yaml';
import { Parser as XMLParser, Builder as XMLBuilder } from 'xml2js';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  mimeType: string;
  description: string;
  icon: React.ReactNode;
  supportsOptions: boolean;
}

interface ExportOptions {
  format: string;
  filename: string;
  indent: number;
  includeMetadata: boolean;
  flattenArrays: boolean;
  customDelimiter?: string;
  xmlRootElement?: string;
  yamlFlowStyle?: boolean;
  csvHeaders?: boolean;
  csvQuoteAll?: boolean;
  tomlArrayOfTables?: boolean;
}

interface AdvancedExporterProps {
  json: string;
  filename?: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'json',
    name: 'JSON',
    extension: 'json',
    mimeType: 'application/json',
    description: 'JavaScript Object Notation',
    icon: <Code className="w-4 h-4" />,
    supportsOptions: true,
  },
  {
    id: 'yaml',
    name: 'YAML',
    extension: 'yaml',
    mimeType: 'text/yaml',
    description: 'YAML Ain\'t Markup Language',
    icon: <FileText className="w-4 h-4" />,
    supportsOptions: true,
  },
  {
    id: 'xml',
    name: 'XML',
    extension: 'xml',
    mimeType: 'application/xml',
    description: 'eXtensible Markup Language',
    icon: <Code className="w-4 h-4" />,
    supportsOptions: true,
  },
  {
    id: 'csv',
    name: 'CSV',
    extension: 'csv',
    mimeType: 'text/csv',
    description: 'Comma-Separated Values',
    icon: <Table className="w-4 h-4" />,
    supportsOptions: true,
  },
  {
    id: 'tsv',
    name: 'TSV',
    extension: 'tsv',
    mimeType: 'text/tab-separated-values',
    description: 'Tab-Separated Values',
    icon: <Table className="w-4 h-4" />,
    supportsOptions: true,
  },
  {
    id: 'toml',
    name: 'TOML',
    extension: 'toml',
    mimeType: 'text/plain',
    description: 'Tom\'s Obvious Minimal Language',
    icon: <FileText className="w-4 h-4" />,
    supportsOptions: true,
  },
  {
    id: 'properties',
    name: 'Properties',
    extension: 'properties',
    mimeType: 'text/plain',
    description: 'Java Properties File',
    icon: <Database className="w-4 h-4" />,
    supportsOptions: false,
  },
  {
    id: 'env',
    name: 'Environment',
    extension: 'env',
    mimeType: 'text/plain',
    description: 'Environment Variables',
    icon: <Settings className="w-4 h-4" />,
    supportsOptions: false,
  },
];

export function AdvancedExporter({ json, filename = 'export' }: AdvancedExporterProps) {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'json',
    filename,
    indent: 2,
    includeMetadata: false,
    flattenArrays: false,
    xmlRootElement: 'root',
    yamlFlowStyle: false,
    csvHeaders: true,
    csvQuoteAll: false,
    tomlArrayOfTables: false,
  });
  const [preview, setPreview] = useState<string>('');
  const [previewError, setPreviewError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Parse JSON safely
  const parsedJson = React.useMemo(() => {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }, [json]);

  // Generate preview
  const generatePreview = useCallback(async () => {
    if (!parsedJson) {
      setPreviewError('Invalid JSON input');
      return;
    }

    setIsGenerating(true);
    setPreviewError('');

    try {
      const result = await convertToFormat(parsedJson, options);
      setPreview(result);
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Conversion failed');
      setPreview('');
    } finally {
      setIsGenerating(false);
    }
  }, [parsedJson, options]);

  // Convert to format
  const convertToFormat = useCallback(async (data: any, opts: ExportOptions): Promise<string> => {
    switch (opts.format) {
      case 'json':
        return JSON.stringify(data, null, opts.indent);

      case 'yaml':
        return yaml.dump(data, {
          indent: opts.indent,
          flowLevel: opts.yamlFlowStyle ? 0 : -1,
          noRefs: true,
        });

      case 'xml':
        const builder = new XMLBuilder({
          format: true,
          indentBy: ' '.repeat(opts.indent),
          suppressEmptyNode: true,
        });
        const xmlData = { [opts.xmlRootElement || 'root']: data };
        return builder.build(xmlData);

      case 'csv':
      case 'tsv':
        const delimiter = opts.format === 'tsv' ? '\t' : (opts.customDelimiter || ',');
        
        if (Array.isArray(data)) {
          return Papa.unparse(data, {
            delimiter,
            header: opts.csvHeaders,
            quoteChar: '"',
            quotes: opts.csvQuoteAll,
          });
        } else {
          // Convert object to array of key-value pairs
          const kvPairs = Object.entries(data).map(([key, value]) => ({
            key,
            value: typeof value === 'object' ? JSON.stringify(value) : String(value),
          }));
          return Papa.unparse(kvPairs, {
            delimiter,
            header: opts.csvHeaders,
            quoteChar: '"',
            quotes: opts.csvQuoteAll,
          });
        }

      case 'toml':
        return convertToTOML(data, opts);

      case 'properties':
        return convertToProperties(data);

      case 'env':
        return convertToEnv(data);

      default:
        throw new Error(`Unsupported format: ${opts.format}`);
    }
  }, []);

  // TOML converter
  const convertToTOML = (data: any, opts: ExportOptions): string => {
    const lines: string[] = [];
    
    const convertValue = (value: any): string => {
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '\\"')}"`;
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      } else if (Array.isArray(value)) {
        return `[${value.map(convertValue).join(', ')}]`;
      } else if (value instanceof Date) {
        return value.toISOString();
      } else {
        return `"${JSON.stringify(value)}"`;
      }
    };

    const processObject = (obj: any, prefix = ''): void => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          if (opts.tomlArrayOfTables && Array.isArray(Object.values(value)[0])) {
            lines.push(`\n[[${fullKey}]]`);
            processObject(value, '');
          } else {
            lines.push(`\n[${fullKey}]`);
            processObject(value, '');
          }
        } else {
          lines.push(`${key} = ${convertValue(value)}`);
        }
      }
    };

    processObject(data);
    return lines.join('\n').trim();
  };

  // Properties converter
  const convertToProperties = (data: any, prefix = ''): string => {
    const lines: string[] = [];
    
    const flatten = (obj: any, currentPrefix = ''): void => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key;
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          flatten(value, fullKey);
        } else {
          const stringValue = Array.isArray(value) ? value.join(',') : String(value);
          lines.push(`${fullKey}=${stringValue}`);
        }
      }
    };

    flatten(data, prefix);
    return lines.join('\n');
  };

  // Environment variables converter
  const convertToEnv = (data: any, prefix = ''): string => {
    const lines: string[] = [];
    
    const flatten = (obj: any, currentPrefix = ''): void => {
      for (const [key, value] of Object.entries(obj)) {
        const envKey = (currentPrefix ? `${currentPrefix}_${key}` : key).toUpperCase();
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          flatten(value, envKey);
        } else {
          const stringValue = Array.isArray(value) ? value.join(',') : String(value);
          lines.push(`${envKey}="${stringValue}"`);
        }
      }
    };

    flatten(data, prefix);
    return lines.join('\n');
  };

  // Export file
  const exportFile = useCallback(async () => {
    if (!parsedJson) {
      toast({ variant: 'destructive', description: 'Invalid JSON input' });
      return;
    }

    try {
      const content = await convertToFormat(parsedJson, options);
      const format = EXPORT_FORMATS.find(f => f.id === options.format)!;
      const filename = `${options.filename}.${format.extension}`;
      
      const blob = new Blob([content], { type: format.mimeType });
      saveAs(blob, filename);
      
      toast({ description: `Exported as ${filename}` });
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        description: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  }, [parsedJson, options, toast]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    if (!preview) {
      toast({ variant: 'destructive', description: 'No preview to copy' });
      return;
    }

    try {
      await navigator.clipboard.writeText(preview);
      toast({ description: 'Copied to clipboard' });
    } catch (error) {
      toast({ variant: 'destructive', description: 'Failed to copy' });
    }
  }, [preview, toast]);

  // Auto-generate preview when options change
  React.useEffect(() => {
    if (parsedJson) {
      generatePreview();
    }
  }, [generatePreview, parsedJson]);

  const selectedFormat = EXPORT_FORMATS.find(f => f.id === options.format)!;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border/40 bg-muted/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Advanced Export</h2>
            <Badge variant="outline">{selectedFormat.name}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!preview}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button onClick={exportFile} disabled={!parsedJson}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="options" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="options">Export Options</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="options" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {/* Format Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Export Format</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {EXPORT_FORMATS.map((format) => (
                        <Button
                          key={format.id}
                          variant={options.format === format.id ? 'default' : 'outline'}
                          className="h-auto p-3 flex flex-col items-center gap-2"
                          onClick={() => setOptions({ ...options, format: format.id })}
                        >
                          {format.icon}
                          <div className="text-center">
                            <div className="font-semibold text-xs">{format.name}</div>
                            <div className="text-xs text-muted-foreground">.{format.extension}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {selectedFormat.description}
                    </div>
                  </CardContent>
                </Card>

                {/* General Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">General Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="filename">Filename</Label>
                        <Input
                          id="filename"
                          value={options.filename}
                          onChange={(e) => setOptions({ ...options, filename: e.target.value })}
                          placeholder="export"
                        />
                      </div>
                      <div>
                        <Label htmlFor="indent">Indentation</Label>
                        <Select 
                          value={options.indent.toString()} 
                          onValueChange={(value) => setOptions({ ...options, indent: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">No indentation</SelectItem>
                            <SelectItem value="2">2 spaces</SelectItem>
                            <SelectItem value="4">4 spaces</SelectItem>
                            <SelectItem value="8">8 spaces</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="include-metadata"
                        checked={options.includeMetadata}
                        onCheckedChange={(checked) => setOptions({ ...options, includeMetadata: checked })}
                      />
                      <Label htmlFor="include-metadata">Include metadata</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="flatten-arrays"
                        checked={options.flattenArrays}
                        onCheckedChange={(checked) => setOptions({ ...options, flattenArrays: checked })}
                      />
                      <Label htmlFor="flatten-arrays">Flatten nested arrays</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Format-specific Options */}
                {selectedFormat.supportsOptions && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{selectedFormat.name} Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {options.format === 'xml' && (
                        <div>
                          <Label htmlFor="xml-root">Root Element</Label>
                          <Input
                            id="xml-root"
                            value={options.xmlRootElement || ''}
                            onChange={(e) => setOptions({ ...options, xmlRootElement: e.target.value })}
                            placeholder="root"
                          />
                        </div>
                      )}

                      {options.format === 'yaml' && (
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="yaml-flow"
                            checked={options.yamlFlowStyle || false}
                            onCheckedChange={(checked) => setOptions({ ...options, yamlFlowStyle: checked })}
                          />
                          <Label htmlFor="yaml-flow">Use flow style</Label>
                        </div>
                      )}

                      {(options.format === 'csv' || options.format === 'tsv') && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="csv-headers"
                              checked={options.csvHeaders || false}
                              onCheckedChange={(checked) => setOptions({ ...options, csvHeaders: checked })}
                            />
                            <Label htmlFor="csv-headers">Include headers</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              id="csv-quote-all"
                              checked={options.csvQuoteAll || false}
                              onCheckedChange={(checked) => setOptions({ ...options, csvQuoteAll: checked })}
                            />
                            <Label htmlFor="csv-quote-all">Quote all fields</Label>
                          </div>

                          {options.format === 'csv' && (
                            <div>
                              <Label htmlFor="csv-delimiter">Custom Delimiter</Label>
                              <Input
                                id="csv-delimiter"
                                value={options.customDelimiter || ''}
                                onChange={(e) => setOptions({ ...options, customDelimiter: e.target.value })}
                                placeholder=","
                                maxLength={1}
                              />
                            </div>
                          )}
                        </>
                      )}

                      {options.format === 'toml' && (
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="toml-array-tables"
                            checked={options.tomlArrayOfTables || false}
                            onCheckedChange={(checked) => setOptions({ ...options, tomlArrayOfTables: checked })}
                          />
                          <Label htmlFor="toml-array-tables">Use array of tables</Label>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="preview" className="h-full m-0">
            <div className="h-full flex flex-col">
              <div className="border-b border-border/40 bg-muted/20 p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Preview</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedFormat.name}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={generatePreview} disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : 'Refresh'}
                </Button>
              </div>

              <div className="flex-1 overflow-hidden">
                {previewError ? (
                  <div className="p-4">
                    <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription>
                        {previewError}
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : preview ? (
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <pre className="text-xs font-mono bg-muted/20 p-4 rounded border overflow-x-auto">
                        {preview}
                      </pre>
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Preview will appear here</p>
                      <p className="text-sm">Select a format and options to generate preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}