import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateWithRules, ValidationRule, ValidationError } from "@/lib/jsonUtils";
import { useToast } from "@/hooks/use-toast";
import { Shield, Plus, X, AlertCircle } from "lucide-react";

interface JsonValidatorProps {
  json: string;
}

export function JsonValidator({ json }: JsonValidatorProps) {
  const [rules, setRules] = useState<ValidationRule[]>([
    { path: "$.users[0].email", type: "string", required: true, pattern: "^[^@]+@[^@]+\\.[^@]+$" }
  ]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const { toast } = useToast();

  const addRule = () => {
    setRules([...rules, { path: "$.", required: false }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, field: keyof ValidationRule, value: string | boolean | number) => {
    const newRules = [...rules];
    (newRules[index] as Record<string, unknown>)[field] = value;
    setRules(newRules);
  };

  const validate = () => {
    try {
      const validationErrors = validateWithRules(json, rules);
      setErrors(validationErrors);
      if (validationErrors.length === 0) {
        toast({ description: "All validation rules passed!" });
      } else {
        toast({ 
          variant: "destructive", 
          description: `${validationErrors.length} validation error${validationErrors.length !== 1 ? 's' : ''} found` 
        });
      }
    } catch (e) {
      toast({ variant: "destructive", description: e instanceof Error ? e.message : "Validation failed" });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm font-medium">Validation Rules</h3>
          <Button onClick={addRule} size="sm" variant="ghost">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-auto">
          {rules.map((rule, index) => (
            <div key={index} className="premium-card p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  value={rule.path}
                  onChange={(e) => updateRule(index, "path", e.target.value)}
                  placeholder="$.path.to.field"
                  className="font-mono text-xs flex-1"
                />
                <Button
                  onClick={() => removeRule(index)}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={rule.type || ""}
                  onChange={(e) => updateRule(index, "type", e.target.value)}
                  className="h-8 px-2 rounded-md border border-border bg-background text-xs"
                >
                  <option value="">Any type</option>
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="object">Object</option>
                  <option value="array">Array</option>
                </select>
                
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={rule.required || false}
                    onChange={(e) => updateRule(index, "required", e.target.checked)}
                    className="rounded"
                  />
                  Required
                </label>
              </div>
              
              {rule.type === "string" && (
                <Input
                  value={rule.pattern || ""}
                  onChange={(e) => updateRule(index, "pattern", e.target.value)}
                  placeholder="Regex pattern"
                  className="text-xs font-mono"
                />
              )}
              
              {(rule.type === "number" || rule.type === "string") && (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    value={rule.min || ""}
                    onChange={(e) => updateRule(index, "min", parseFloat(e.target.value))}
                    placeholder="Min"
                    className="text-xs"
                  />
                  <Input
                    type="number"
                    value={rule.max || ""}
                    onChange={(e) => updateRule(index, "max", parseFloat(e.target.value))}
                    placeholder="Max"
                    className="text-xs"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <Button onClick={validate} className="w-full mt-4" variant="premium">
          <Shield className="w-4 h-4" />
          Validate
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto scrollbar-thin p-4">
        {errors.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No validation errors</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {errors.map((error, index) => (
              <div key={index} className="premium-card p-3 border-l-4 border-l-destructive">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <div>
                    <div className="font-mono text-xs text-muted-foreground mb-1">{error.path}</div>
                    <div className="text-sm">{error.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}