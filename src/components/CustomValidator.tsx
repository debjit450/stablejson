import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Plus,
  Trash2,
  Play,
  Save,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Code,
  FileText,
  Zap,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  type: 'schema' | 'custom' | 'regex' | 'range' | 'required' | 'format';
  path: string;
  condition: string;
  severity: 'error' | 'warning' | 'info';
  enabled: boolean;
  created: string;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  info: ValidationError[];
  executionTime: number;
}

interface ValidationError {
  ruleId: string;
  ruleName: string;
  path: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  value?: any;
}

interface CustomValidatorProps {
  json: string;
}

const DEFAULT_RULES: ValidationRule[] = [
  {
    id: 'required-fields',
    name: 'Required Fields',
    description: 'Ensure required fields are present',
    type: 'required',
    path: '$.name',
    condition: 'exists',
    severity: 'error',
    enabled: true,
    created: new Date().toISOString(),
  },
  {
    id: 'email-format',
    name: 'Email Format',
    description: 'Validate email format',
    type: 'regex',
    path: '$.email',
    condition: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
    severity: 'error',
    enabled: true,
    created: new Date().toISOString(),
  },
  {
    id: 'age-range',
    name: 'Age Range',
    description: 'Age should be between 0 and 150',
    type: 'range',
    path: '$.age',
    condition: '0,150',
    severity: 'warning',
    enabled: true,
    created: new Date().toISOString(),
  },
];

export function CustomValidator({ json }: CustomValidatorProps) {
  const [rules, setRules] = useLocalStorage<ValidationRule[]>('stablejson-validation-rules', DEFAULT_RULES);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [newRule, setNewRule] = useState<Partial<ValidationRule>>({
    name: '',
    description: '',
    type: 'required',
    path: '$.',
    condition: '',
    severity: 'error',
    enabled: true,
  });
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [showRuleEditor, setShowRuleEditor] = useState(false);
  const { toast } = useToast();

  // Parse JSON safely
  const parsedJson = useMemo(() => {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }, [json]);

  // Get value at JSONPath
  const getValueAtPath = useCallback((obj: any, path: string): any => {
    if (path === '$' || path === '$.') return obj;
    
    const parts = path.replace(/^\$\.?/, '').split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      
      // Handle array indices
      if (part.includes('[') && part.includes(']')) {
        const [key, indexStr] = part.split('[');
        const index = parseInt(indexStr.replace(']', ''));
        
        if (key) current = current[key];
        if (Array.isArray(current) && !isNaN(index)) {
          current = current[index];
        }
      } else {
        current = current[part];
      }
    }
    
    return current;
  }, []);

  // Validate a single rule
  const validateRule = useCallback((rule: ValidationRule, data: any): ValidationError | null => {
    if (!rule.enabled) return null;
    
    const value = getValueAtPath(data, rule.path);
    
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '') {
          return {
            ruleId: rule.id,
            ruleName: rule.name,
            path: rule.path,
            message: `Required field is missing: ${rule.path}`,
            severity: rule.severity,
            value,
          };
        }
        break;
        
      case 'regex':
        if (value !== undefined && value !== null) {
          const regex = new RegExp(rule.condition);
          if (!regex.test(String(value))) {
            return {
              ruleId: rule.id,
              ruleName: rule.name,
              path: rule.path,
              message: `Value does not match pattern: ${rule.condition}`,
              severity: rule.severity,
              value,
            };
          }
        }
        break;
        
      case 'range':
        if (value !== undefined && value !== null) {
          const [min, max] = rule.condition.split(',').map(Number);
          const numValue = Number(value);
          if (!isNaN(numValue) && (numValue < min || numValue > max)) {
            return {
              ruleId: rule.id,
              ruleName: rule.name,
              path: rule.path,
              message: `Value ${numValue} is outside range [${min}, ${max}]`,
              severity: rule.severity,
              value,
            };
          }
        }
        break;
        
      case 'custom':
        try {
          // Create a safe evaluation context
          const context = { value, data, path: rule.path };
          const func = new Function('context', `
            const { value, data, path } = context;
            return ${rule.condition};
          `);
          
          if (!func(context)) {
            return {
              ruleId: rule.id,
              ruleName: rule.name,
              path: rule.path,
              message: `Custom validation failed: ${rule.condition}`,
              severity: rule.severity,
              value,
            };
          }
        } catch (error) {
          return {
            ruleId: rule.id,
            ruleName: rule.name,
            path: rule.path,
            message: `Custom validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            severity: 'error',
            value,
          };
        }
        break;
        
      case 'format':
        if (value !== undefined && value !== null) {
          const formats = {
            email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            url: /^https?:\/\/.+/,
            uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
            date: /^\d{4}-\d{2}-\d{2}$/,
            time: /^\d{2}:\d{2}:\d{2}$/,
            datetime: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
          };
          
          const format = rule.condition as keyof typeof formats;
          if (formats[format] && !formats[format].test(String(value))) {
            return {
              ruleId: rule.id,
              ruleName: rule.name,
              path: rule.path,
              message: `Invalid ${format} format`,
              severity: rule.severity,
              value,
            };
          }
        }
        break;
    }
    
    return null;
  }, [getValueAtPath]);

  // Run all validations
  const runValidation = useCallback(async () => {
    if (!parsedJson) {
      toast({ variant: 'destructive', description: 'Invalid JSON' });
      return;
    }
    
    setIsValidating(true);
    const startTime = performance.now();
    
    try {
      const errors: ValidationError[] = [];
      const warnings: ValidationError[] = [];
      const info: ValidationError[] = [];
      
      for (const rule of rules) {
        const error = validateRule(rule, parsedJson);
        if (error) {
          switch (error.severity) {
            case 'error':
              errors.push(error);
              break;
            case 'warning':
              warnings.push(error);
              break;
            case 'info':
              info.push(error);
              break;
          }
        }
      }
      
      const executionTime = performance.now() - startTime;
      
      setValidationResult({
        valid: errors.length === 0,
        errors,
        warnings,
        info,
        executionTime,
      });
      
      toast({
        description: `Validation completed in ${executionTime.toFixed(2)}ms`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        description: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setIsValidating(false);
    }
  }, [parsedJson, rules, validateRule, toast]);

  // Add new rule
  const addRule = useCallback(() => {
    if (!newRule.name || !newRule.path) {
      toast({ variant: 'destructive', description: 'Name and path are required' });
      return;
    }
    
    const rule: ValidationRule = {
      id: `rule-${Date.now()}`,
      name: newRule.name,
      description: newRule.description || '',
      type: newRule.type || 'required',
      path: newRule.path,
      condition: newRule.condition || '',
      severity: newRule.severity || 'error',
      enabled: newRule.enabled !== false,
      created: new Date().toISOString(),
    };
    
    setRules([...rules, rule]);
    setNewRule({
      name: '',
      description: '',
      type: 'required',
      path: '$.',
      condition: '',
      severity: 'error',
      enabled: true,
    });
    setShowRuleEditor(false);
    
    toast({ description: 'Rule added successfully' });
  }, [newRule, rules, setRules, toast]);

  // Delete rule
  const deleteRule = useCallback((ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    toast({ description: 'Rule deleted' });
  }, [rules, setRules, toast]);

  // Toggle rule
  const toggleRule = useCallback((ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  }, [rules, setRules]);

  // Export rules
  const exportRules = useCallback(() => {
    const blob = new Blob([JSON.stringify(rules, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-rules-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [rules]);

  // Import rules
  const importRules = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedRules = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedRules)) {
          setRules([...rules, ...importedRules]);
          toast({ description: `Imported ${importedRules.length} rules` });
        } else {
          toast({ variant: 'destructive', description: 'Invalid rules file' });
        }
      } catch (error) {
        toast({ variant: 'destructive', description: 'Failed to import rules' });
      }
    };
    reader.readAsText(file);
  }, [rules, setRules, toast]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950';
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950';
      default:
        return 'border-border bg-muted/50';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border/40 bg-muted/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Custom Validation</h2>
            <Badge variant="outline">{rules.filter(r => r.enabled).length} active rules</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".json"
              onChange={importRules}
              className="hidden"
              id="import-rules"
            />
            <Button variant="outline" size="sm" onClick={() => document.getElementById('import-rules')?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={exportRules}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowRuleEditor(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
            <Button onClick={runValidation} disabled={isValidating || !parsedJson}>
              <Play className="w-4 h-4 mr-2" />
              {isValidating ? 'Validating...' : 'Validate'}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="rules" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="rules">Rules ({rules.length})</TabsTrigger>
          <TabsTrigger value="results">
            Results {validationResult && `(${validationResult.errors.length + validationResult.warnings.length + validationResult.info.length})`}
          </TabsTrigger>
          <TabsTrigger value="editor">Rule Editor</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="rules" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {rules.map((rule) => (
                  <Card key={rule.id} className="transition-all hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={() => toggleRule(rule.id)}
                          />
                          <div>
                            <h4 className="font-semibold">{rule.name}</h4>
                            <p className="text-sm text-muted-foreground">{rule.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {rule.type}
                          </Badge>
                          <Badge variant={rule.severity === 'error' ? 'destructive' : rule.severity === 'warning' ? 'secondary' : 'default'} className="text-xs">
                            {rule.severity}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRule(rule.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-xs text-muted-foreground">Path</Label>
                          <code className="block bg-muted/50 p-1 rounded text-xs">{rule.path}</code>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Condition</Label>
                          <code className="block bg-muted/50 p-1 rounded text-xs">{rule.condition || 'N/A'}</code>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {rules.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No validation rules defined</p>
                    <Button variant="outline" className="mt-2" onClick={() => setShowRuleEditor(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Rule
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="results" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                {validationResult ? (
                  <div className="space-y-4">
                    {/* Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {validationResult.valid ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          Validation {validationResult.valid ? 'Passed' : 'Failed'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-500">{validationResult.errors.length}</div>
                            <div className="text-muted-foreground">Errors</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-500">{validationResult.warnings.length}</div>
                            <div className="text-muted-foreground">Warnings</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">{validationResult.info.length}</div>
                            <div className="text-muted-foreground">Info</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{validationResult.executionTime.toFixed(2)}ms</div>
                            <div className="text-muted-foreground">Time</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Issues */}
                    <div className="space-y-2">
                      {[...validationResult.errors, ...validationResult.warnings, ...validationResult.info].map((issue, index) => (
                        <Alert key={index} className={getSeverityColor(issue.severity)}>
                          <div className="flex items-start gap-2">
                            {getSeverityIcon(issue.severity)}
                            <div className="flex-1">
                              <AlertDescription>
                                <div className="font-semibold">{issue.ruleName}</div>
                                <div className="text-sm">{issue.message}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Path: <code>{issue.path}</code>
                                  {issue.value !== undefined && (
                                    <span> | Value: <code>{JSON.stringify(issue.value)}</code></span>
                                  )}
                                </div>
                              </AlertDescription>
                            </div>
                          </div>
                        </Alert>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No validation results yet</p>
                    <p className="text-sm">Run validation to see results</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="editor" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Validation Rule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rule-name">Rule Name</Label>
                        <Input
                          id="rule-name"
                          value={newRule.name || ''}
                          onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                          placeholder="Enter rule name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rule-type">Rule Type</Label>
                        <Select value={newRule.type} onValueChange={(value) => setNewRule({ ...newRule, type: value as any })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="required">Required Field</SelectItem>
                            <SelectItem value="regex">Regular Expression</SelectItem>
                            <SelectItem value="range">Numeric Range</SelectItem>
                            <SelectItem value="format">Format Validation</SelectItem>
                            <SelectItem value="custom">Custom Logic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="rule-description">Description</Label>
                      <Input
                        id="rule-description"
                        value={newRule.description || ''}
                        onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                        placeholder="Describe what this rule validates"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rule-path">JSONPath</Label>
                        <Input
                          id="rule-path"
                          value={newRule.path || ''}
                          onChange={(e) => setNewRule({ ...newRule, path: e.target.value })}
                          placeholder="$.field.path"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rule-severity">Severity</Label>
                        <Select value={newRule.severity} onValueChange={(value) => setNewRule({ ...newRule, severity: value as any })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="error">Error</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="info">Info</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="rule-condition">Condition</Label>
                      <Textarea
                        id="rule-condition"
                        value={newRule.condition || ''}
                        onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                        placeholder={
                          newRule.type === 'regex' ? 'Regular expression pattern' :
                          newRule.type === 'range' ? 'min,max (e.g., 0,100)' :
                          newRule.type === 'format' ? 'email, url, uuid, date, time, datetime' :
                          newRule.type === 'custom' ? 'JavaScript expression (e.g., value > 0 && value < 100)' :
                          'Condition for validation'
                        }
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="rule-enabled"
                        checked={newRule.enabled !== false}
                        onCheckedChange={(checked) => setNewRule({ ...newRule, enabled: checked })}
                      />
                      <Label htmlFor="rule-enabled">Enable this rule</Label>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={addRule}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Rule
                      </Button>
                      <Button variant="outline" onClick={() => setNewRule({
                        name: '',
                        description: '',
                        type: 'required',
                        path: '$.',
                        condition: '',
                        severity: 'error',
                        enabled: true,
                      })}>
                        Clear
                      </Button>
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