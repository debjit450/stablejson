import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  Download,
  Play,
  Pause,
  Square,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  FolderOpen,
  Archive,
  Settings,
  BarChart3,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { JsonWorker, PerformanceMonitor } from '@/lib/performance';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface BatchFile {
  id: string;
  name: string;
  size: number;
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: string;
  error?: string;
  processingTime?: number;
}

interface BatchOperation {
  type: 'format' | 'minify' | 'validate' | 'clean' | 'sort' | 'transform';
  options?: Record<string, any>;
}

interface BatchProcessorProps {
  onResult?: (results: BatchFile[]) => void;
}

export function BatchProcessor({ onResult }: BatchProcessorProps) {
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [operation, setOperation] = useState<BatchOperation>({ type: 'format' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [concurrency, setConcurrency] = useState(3);
  const [continueOnError, setContinueOnError] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<JsonWorker | null>(null);
  const { toast } = useToast();

  // File handling
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    
    const newFiles: BatchFile[] = uploadedFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      content: '',
      status: 'pending',
    }));

    // Read file contents
    Promise.all(
      uploadedFiles.map((file, index) => {
        return new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            newFiles[index].content = e.target?.result as string;
            resolve();
          };
          reader.readAsText(file);
        });
      })
    ).then(() => {
      setFiles(prev => [...prev, ...newFiles]);
      toast({ description: `Added ${newFiles.length} files` });
    });

    // Reset input
    if (event.target) {
      event.target.value = '';
    }
  }, [toast]);

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const clearAllFiles = useCallback(() => {
    setFiles([]);
    setProgress(0);
    setCurrentFileIndex(0);
  }, []);

  // Processing
  const processFile = useCallback(async (file: BatchFile): Promise<BatchFile> => {
    const timer = PerformanceMonitor.startTimer(`batch-${operation.type}`);
    
    try {
      if (!workerRef.current) {
        workerRef.current = new JsonWorker();
      }

      let result: string;
      
      switch (operation.type) {
        case 'format':
          result = await workerRef.current.processJson('format', file.content);
          break;
        case 'minify':
          result = await workerRef.current.processJson('minify', file.content);
          break;
        case 'validate':
          const validation = await workerRef.current.processJson('validate', file.content);
          result = JSON.stringify(validation, null, 2);
          break;
        case 'clean':
          const parsed = JSON.parse(file.content);
          const cleaned = removeNullAndEmpty(parsed);
          result = JSON.stringify(cleaned, null, 2);
          break;
        case 'sort':
          const sortedParsed = JSON.parse(file.content);
          const sorted = sortObjectKeys(sortedParsed);
          result = JSON.stringify(sorted, null, 2);
          break;
        default:
          throw new Error(`Unknown operation: ${operation.type}`);
      }

      const processingTime = timer();
      
      return {
        ...file,
        status: 'completed',
        result,
        processingTime,
      };
    } catch (error) {
      const processingTime = timer();
      
      return {
        ...file,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime,
      };
    }
  }, [operation]);

  const startProcessing = useCallback(async () => {
    if (files.length === 0) {
      toast({ variant: 'destructive', description: 'No files to process' });
      return;
    }

    setIsProcessing(true);
    setIsPaused(false);
    setProgress(0);
    setCurrentFileIndex(0);

    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');
    const totalFiles = pendingFiles.length;
    let completedFiles = 0;
    let currentIndex = 0;

    // Process files with concurrency control
    const processQueue = async () => {
      const activePromises: Promise<void>[] = [];

      while (currentIndex < pendingFiles.length && !isPaused) {
        // Maintain concurrency limit
        while (activePromises.length < concurrency && currentIndex < pendingFiles.length) {
          const fileIndex = currentIndex++;
          const file = pendingFiles[fileIndex];

          setCurrentFileIndex(fileIndex);
          
          // Update file status to processing
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'processing' } : f
          ));

          const promise = processFile(file).then(processedFile => {
            // Update file with result
            setFiles(prev => prev.map(f => 
              f.id === processedFile.id ? processedFile : f
            ));

            completedFiles++;
            setProgress((completedFiles / totalFiles) * 100);

            if (processedFile.status === 'error' && !continueOnError) {
              setIsPaused(true);
              toast({ 
                variant: 'destructive', 
                description: `Processing stopped due to error in ${processedFile.name}` 
              });
            }
          });

          activePromises.push(promise);
        }

        // Wait for at least one promise to complete
        if (activePromises.length > 0) {
          await Promise.race(activePromises);
          // Remove completed promises
          for (let i = activePromises.length - 1; i >= 0; i--) {
            if (await Promise.race([activePromises[i], Promise.resolve('pending')]) !== 'pending') {
              activePromises.splice(i, 1);
            }
          }
        }
      }

      // Wait for all remaining promises
      await Promise.all(activePromises);
    };

    try {
      await processQueue();
      
      if (!isPaused) {
        toast({ description: `Processing completed: ${completedFiles}/${totalFiles} files` });
        
        if (autoDownload) {
          await downloadResults();
        }
        
        onResult?.(files);
      }
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        description: `Batch processing failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsProcessing(false);
      setIsPaused(false);
    }
  }, [files, operation, concurrency, continueOnError, autoDownload, isPaused, processFile, toast, onResult]);

  const pauseProcessing = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeProcessing = useCallback(() => {
    setIsPaused(false);
    startProcessing();
  }, [startProcessing]);

  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
    setIsPaused(false);
    
    // Reset processing files to pending
    setFiles(prev => prev.map(f => 
      f.status === 'processing' ? { ...f, status: 'pending' } : f
    ));
    
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  // Download results
  const downloadResults = useCallback(async () => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.result);
    
    if (completedFiles.length === 0) {
      toast({ variant: 'destructive', description: 'No completed files to download' });
      return;
    }

    if (completedFiles.length === 1) {
      // Single file download
      const file = completedFiles[0];
      const blob = new Blob([file.result!], { type: 'application/json' });
      saveAs(blob, `processed-${file.name}`);
    } else {
      // Multiple files - create ZIP
      const zip = new JSZip();
      
      completedFiles.forEach(file => {
        const fileName = file.name.replace(/\.[^/.]+$/, '') + `-${operation.type}.json`;
        zip.file(fileName, file.result!);
      });

      // Add processing report
      const report = {
        timestamp: new Date().toISOString(),
        operation: operation.type,
        totalFiles: files.length,
        completedFiles: completedFiles.length,
        errorFiles: files.filter(f => f.status === 'error').length,
        processingTime: completedFiles.reduce((sum, f) => sum + (f.processingTime || 0), 0),
        files: files.map(f => ({
          name: f.name,
          status: f.status,
          processingTime: f.processingTime,
          error: f.error,
        })),
      };
      
      zip.file('processing-report.json', JSON.stringify(report, null, 2));

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `batch-processed-${operation.type}-${Date.now()}.zip`);
    }

    toast({ description: 'Results downloaded successfully' });
  }, [files, operation.type, toast]);

  // Statistics
  const stats = {
    total: files.length,
    pending: files.filter(f => f.status === 'pending').length,
    processing: files.filter(f => f.status === 'processing').length,
    completed: files.filter(f => f.status === 'completed').length,
    errors: files.filter(f => f.status === 'error').length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
    avgProcessingTime: files.filter(f => f.processingTime).reduce((sum, f) => sum + f.processingTime!, 0) / Math.max(1, files.filter(f => f.processingTime).length),
  };

  // Helper functions
  const removeNullAndEmpty = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(removeNullAndEmpty).filter(item => item !== null && item !== undefined && item !== '');
    } else if (obj !== null && typeof obj === 'object') {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const cleanedValue = removeNullAndEmpty(value);
        if (cleanedValue !== null && cleanedValue !== undefined && cleanedValue !== '') {
          cleaned[key] = cleanedValue;
        }
      }
      return cleaned;
    }
    return obj;
  };

  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    } else if (obj !== null && typeof obj === 'object') {
      const sorted: any = {};
      Object.keys(obj).sort().forEach(key => {
        sorted[key] = sortObjectKeys(obj[key]);
      });
      return sorted;
    }
    return obj;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'processing':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
      default:
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border/40 bg-muted/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Batch Processor</h2>
            <Badge variant="outline">{stats.total} files</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Add Files
            </Button>
            <Button variant="outline" size="sm" onClick={downloadResults} disabled={stats.completed === 0}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={clearAllFiles} disabled={files.length === 0}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Operation Settings */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="operation">Operation</Label>
            <Select value={operation.type} onValueChange={(value) => setOperation({ type: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="format">Format JSON</SelectItem>
                <SelectItem value="minify">Minify JSON</SelectItem>
                <SelectItem value="validate">Validate JSON</SelectItem>
                <SelectItem value="clean">Clean JSON</SelectItem>
                <SelectItem value="sort">Sort Keys</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="concurrency">Concurrency</Label>
            <Select value={concurrency.toString()} onValueChange={(value) => setConcurrency(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 file at a time</SelectItem>
                <SelectItem value="2">2 files at a time</SelectItem>
                <SelectItem value="3">3 files at a time</SelectItem>
                <SelectItem value="5">5 files at a time</SelectItem>
                <SelectItem value="10">10 files at a time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="continue-on-error"
              checked={continueOnError}
              onCheckedChange={setContinueOnError}
            />
            <Label htmlFor="continue-on-error" className="text-sm">
              Continue on error
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="auto-download"
              checked={autoDownload}
              onCheckedChange={setAutoDownload}
            />
            <Label htmlFor="auto-download" className="text-sm">
              Auto download
            </Label>
          </div>
        </div>

        {/* Progress */}
        {isProcessing && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Processing file {currentFileIndex + 1} of {stats.total}
              </span>
              <span className="text-sm font-mono">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2 mt-4">
          {!isProcessing ? (
            <Button onClick={startProcessing} disabled={files.length === 0}>
              <Play className="w-4 h-4 mr-2" />
              Start Processing
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button variant="outline" onClick={pauseProcessing}>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button onClick={resumeProcessing}>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              )}
              <Button variant="destructive" onClick={stopProcessing}>
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="files" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="files">Files ({stats.total})</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="files" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {files.map((file) => (
                  <Card key={file.id} className={`transition-all hover:shadow-md ${getStatusColor(file.status)}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(file.status)}
                          <div>
                            <h4 className="font-semibold text-sm">{file.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024).toFixed(1)} KB
                              {file.processingTime && ` • ${file.processingTime.toFixed(2)}ms`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {file.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            disabled={isProcessing}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {file.error && (
                      <CardContent className="pt-0">
                        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                          <AlertTriangle className="w-4 h-4" />
                          <AlertDescription className="text-sm">
                            {file.error}
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    )}
                  </Card>
                ))}
                
                {files.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No files added yet</p>
                    <Button variant="outline" className="mt-2" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Add JSON Files
                    </Button>
                  </div>
                )}
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
                      Processing Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Files:</span>
                          <span className="font-mono">{stats.total}</span>
                        </div>
                        <div className="flex justify-between text-yellow-600">
                          <span className="text-sm">Pending:</span>
                          <span className="font-mono">{stats.pending}</span>
                        </div>
                        <div className="flex justify-between text-blue-600">
                          <span className="text-sm">Processing:</span>
                          <span className="font-mono">{stats.processing}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-green-600">
                          <span className="text-sm">Completed:</span>
                          <span className="font-mono">{stats.completed}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span className="text-sm">Errors:</span>
                          <span className="font-mono">{stats.errors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Success Rate:</span>
                          <span className="font-mono">
                            {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Size:</span>
                        <span className="font-mono">{(stats.totalSize / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Avg Processing Time:</span>
                        <span className="font-mono">{stats.avgProcessingTime.toFixed(2)} ms</span>
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