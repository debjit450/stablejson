export interface ValidationResult {
  valid: boolean;
  error?: string;
  parsed?: unknown;
  line?: number;
  column?: number;
}

export function validateJson(input: string): ValidationResult {
  if (!input.trim()) {
    return { valid: false, error: "Empty input" };
  }
  
  try {
    const parsed = JSON.parse(input);
    return { valid: true, parsed };
  } catch (e) {
    if (e instanceof SyntaxError) {
      const message = e.message;
      // Try to extract position from error message
      const posMatch = message.match(/position\s+(\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const lines = input.substring(0, pos).split("\n");
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        
        // Provide friendly error messages
        let friendlyError = message;
        if (message.includes("Unexpected token")) {
          if (input.substring(pos - 1, pos + 1).includes(",}") || input.substring(pos - 1, pos + 1).includes(",]")) {
            friendlyError = "Trailing comma found";
          } else if (input.substring(pos, pos + 1) === "'") {
            friendlyError = "Use double quotes instead of single quotes";
          }
        } else if (message.includes("Unexpected end")) {
          friendlyError = "Unexpected end of JSON - missing closing bracket or brace";
        }
        
        return { valid: false, error: `${friendlyError} (line ${line}, column ${column})`, line, column };
      }
      return { valid: false, error: message };
    }
    return { valid: false, error: "Invalid JSON" };
  }
}

export function formatJson(input: string, indent: number = 2): string {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    throw new Error(result.error || "Invalid JSON");
  }
  return JSON.stringify(result.parsed, null, indent);
}

export function minifyJson(input: string): string {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    throw new Error(result.error || "Invalid JSON");
  }
  return JSON.stringify(result.parsed);
}

export function sortKeys(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sortKeys);
  }
  
  if (typeof obj === "object") {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj as Record<string, unknown>).sort();
    for (const key of keys) {
      sorted[key] = sortKeys((obj as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  
  return obj;
}

export function sortJsonKeys(input: string): string {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    throw new Error(result.error || "Invalid JSON");
  }
  const sorted = sortKeys(result.parsed);
  return JSON.stringify(sorted, null, 2);
}

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (value === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === "object" && Object.keys(value as object).length === 0) return true;
  return false;
}

export function cleanObject(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return undefined;
  }
  
  if (Array.isArray(obj)) {
    const cleaned = obj
      .map(cleanObject)
      .filter(item => !isEmptyValue(item));
    return cleaned.length > 0 ? cleaned : undefined;
  }
  
  if (typeof obj === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const cleanedValue = cleanObject(value);
      if (!isEmptyValue(cleanedValue)) {
        cleaned[key] = cleanedValue;
      }
    }
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }
  
  return obj;
}

export function cleanJson(input: string): string {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    throw new Error(result.error || "Invalid JSON");
  }
  const cleaned = cleanObject(result.parsed);
  return JSON.stringify(cleaned ?? {}, null, 2);
}

export interface DiffResult {
  type: "added" | "removed" | "changed" | "unchanged";
  path: string;
  oldValue?: unknown;
  newValue?: unknown;
  structural?: {
    kind: "type_change" | "shape_change";
    oldType: string;
    newType: string;
  };
}

// Canonical JSON - deterministic output for hashing/diffing
export function canonicalJson(input: string): string {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    throw new Error(result.error || "Invalid JSON");
  }
  return canonicalStringify(result.parsed);
}

function canonicalStringify(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") {
    // Normalize numbers: handle -0, Infinity, NaN
    if (Object.is(value, -0)) return "0";
    if (!Number.isFinite(value)) return "null";
    return String(value);
  }
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return "[" + value.map(canonicalStringify).join(",") + "]";
  }
  if (typeof value === "object") {
    const keys = Object.keys(value as Record<string, unknown>).sort();
    const pairs = keys.map(
      (key) => JSON.stringify(key) + ":" + canonicalStringify((value as Record<string, unknown>)[key])
    );
    return "{" + pairs.join(",") + "}";
  }
  return "null";
}

function getTypeDescription(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function getValueAtPath(obj: unknown, path: string[]): unknown {
  let current = obj;
  for (const key of path) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function getAllPaths(obj: unknown, prefix: string[] = []): string[][] {
  const paths: string[][] = [];
  
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return [prefix];
  }
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      paths.push(prefix);
    }
    obj.forEach((_, index) => {
      paths.push(...getAllPaths(obj[index], [...prefix, String(index)]));
    });
  } else {
    const keys = Object.keys(obj as Record<string, unknown>);
    if (keys.length === 0) {
      paths.push(prefix);
    }
    for (const key of keys) {
      paths.push(...getAllPaths((obj as Record<string, unknown>)[key], [...prefix, key]));
    }
  }
  
  return paths;
}

export function diffJson(oldInput: string, newInput: string, structural: boolean = false): DiffResult[] {
  const oldResult = validateJson(oldInput);
  const newResult = validateJson(newInput);
  
  if (!oldResult.valid) {
    throw new Error(`Old JSON: ${oldResult.error}`);
  }
  if (!newResult.valid) {
    throw new Error(`New JSON: ${newResult.error}`);
  }
  
  const oldObj = oldResult.parsed;
  const newObj = newResult.parsed;
  
  const oldPaths = getAllPaths(oldObj);
  const newPaths = getAllPaths(newObj);
  
  const oldPathSet = new Set(oldPaths.map(p => p.join(".")));
  const newPathSet = new Set(newPaths.map(p => p.join(".")));
  
  const allPaths = new Set([...oldPathSet, ...newPathSet]);
  const results: DiffResult[] = [];
  
  for (const pathStr of allPaths) {
    const path = pathStr.split(".").filter(Boolean);
    const oldValue = getValueAtPath(oldObj, path);
    const newValue = getValueAtPath(newObj, path);
    
    const inOld = oldPathSet.has(pathStr);
    const inNew = newPathSet.has(pathStr);
    
    if (!inOld && inNew) {
      results.push({ type: "added", path: pathStr || "(root)", newValue });
    } else if (inOld && !inNew) {
      results.push({ type: "removed", path: pathStr || "(root)", oldValue });
    } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      const diff: DiffResult = { type: "changed", path: pathStr || "(root)", oldValue, newValue };
      
      // Check for structural changes
      if (structural) {
        const oldType = getTypeDescription(oldValue);
        const newType = getTypeDescription(newValue);
        
        if (oldType !== newType) {
          diff.structural = {
            kind: "type_change",
            oldType,
            newType,
          };
        } else if (
          (Array.isArray(oldValue) && Array.isArray(newValue) && oldValue.length !== newValue.length) ||
          (typeof oldValue === "object" && typeof newValue === "object" && oldValue && newValue &&
           Object.keys(oldValue).length !== Object.keys(newValue).length)
        ) {
          diff.structural = {
            kind: "shape_change",
            oldType: Array.isArray(oldValue) ? `array[${oldValue.length}]` : `object{${Object.keys(oldValue as object).length}}`,
            newType: Array.isArray(newValue) ? `array[${newValue.length}]` : `object{${Object.keys(newValue as object).length}}`,
          };
        }
      }
      
      results.push(diff);
    }
  }
  
  return results.sort((a, b) => a.path.localeCompare(b.path));
}

// Extract subtree at path
export function extractAtPath(input: string, pathStr: string): string {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    throw new Error(result.error || "Invalid JSON");
  }
  
  // Parse path string - handle both dot notation and bracket notation
  const path: string[] = [];
  let current = "";
  let inBracket = false;
  
  for (let i = 0; i < pathStr.length; i++) {
    const char = pathStr[i];
    if (char === "[") {
      if (current) {
        path.push(current);
        current = "";
      }
      inBracket = true;
    } else if (char === "]") {
      if (current) {
        path.push(current);
        current = "";
      }
      inBracket = false;
    } else if (char === "." && !inBracket) {
      if (current) {
        path.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }
  if (current) {
    path.push(current);
  }
  
  const value = getValueAtPath(result.parsed, path);
  if (value === undefined) {
    throw new Error(`Path not found: ${pathStr}`);
  }
  
  return JSON.stringify(value, null, 2);
}

export function jsonToTableData(input: string): { headers: string[]; rows: Record<string, unknown>[] } | null {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    return null;
  }
  
  const data = result.parsed;
  
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object" && data[0] !== null) {
    const headers = new Set<string>();
    for (const item of data) {
      if (typeof item === "object" && item !== null) {
        Object.keys(item as Record<string, unknown>).forEach(key => headers.add(key));
      }
    }
    return {
      headers: Array.from(headers).sort(),
      rows: data as Record<string, unknown>[],
    };
  }
  
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    return {
      headers: ["Key", "Value"],
      rows: Object.entries(obj).map(([key, value]) => ({ Key: key, Value: value })),
    };
  }
  
  return null;
}

export function highlightJson(json: string, searchTerm?: string): string {
  let highlighted = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"([^"]+)":/g, '<span class="syntax-key">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span class="syntax-string">"$1"</span>')
    .replace(/: (-?\d+\.?\d*)/g, ': <span class="syntax-number">$1</span>')
    .replace(/: (true|false)/g, ': <span class="syntax-boolean">$1</span>')
    .replace(/: (null)/g, ': <span class="syntax-null">$1</span>')
    .replace(/([{}\\[\]])/g, '<span class="syntax-bracket">$1</span>');

  if (searchTerm && searchTerm.trim()) {
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");
    highlighted = highlighted.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  return highlighted;
}

// Schema inference
export interface InferredSchema {
  type: string;
  properties?: Record<string, InferredSchema>;
  items?: InferredSchema;
  nullable?: boolean;
}

function getType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function mergeSchemas(a: InferredSchema, b: InferredSchema): InferredSchema {
  if (a.type !== b.type) {
    return { type: `${a.type} | ${b.type}` };
  }

  if (a.type === "object" && a.properties && b.properties) {
    const merged: Record<string, InferredSchema> = { ...a.properties };
    for (const [key, schema] of Object.entries(b.properties)) {
      if (merged[key]) {
        merged[key] = mergeSchemas(merged[key], schema);
      } else {
        merged[key] = { ...schema, nullable: true };
      }
    }
    // Mark properties only in 'a' as nullable
    for (const key of Object.keys(a.properties)) {
      if (!b.properties[key]) {
        merged[key] = { ...merged[key], nullable: true };
      }
    }
    return { type: "object", properties: merged };
  }

  if (a.type === "array" && a.items && b.items) {
    return { type: "array", items: mergeSchemas(a.items, b.items) };
  }

  return a;
}

export function inferSchema(value: unknown): InferredSchema {
  const type = getType(value);

  if (type === "null") {
    return { type: "null" };
  }

  if (type === "array") {
    const arr = value as unknown[];
    if (arr.length === 0) {
      return { type: "array", items: { type: "unknown" } };
    }
    let itemSchema = inferSchema(arr[0]);
    for (let i = 1; i < arr.length; i++) {
      itemSchema = mergeSchemas(itemSchema, inferSchema(arr[i]));
    }
    return { type: "array", items: itemSchema };
  }

  if (type === "object") {
    const obj = value as Record<string, unknown>;
    const properties: Record<string, InferredSchema> = {};
    for (const [key, val] of Object.entries(obj)) {
      properties[key] = inferSchema(val);
    }
    return { type: "object", properties };
  }

  return { type };
}

export function schemaToString(schema: InferredSchema, indent: number = 0): string {
  const pad = "  ".repeat(indent);
  
  if (schema.type === "object" && schema.properties) {
    const props = Object.entries(schema.properties)
      .map(([key, val]) => {
        const optional = val.nullable ? "?" : "";
        return `${pad}  "${key}"${optional}: ${schemaToString(val, indent + 1)}`;
      })
      .join(",\n");
    return `{\n${props}\n${pad}}`;
  }

  if (schema.type === "array" && schema.items) {
    return `${schemaToString(schema.items, indent)}[]`;
  }

  return `"${schema.type}"`;
}

export function inferSchemaFromJson(input: string): string {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    throw new Error(result.error || "Invalid JSON");
  }
  const schema = inferSchema(result.parsed);
  return JSON.stringify(schema, null, 2);
}

// TypeScript interface generation
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sanitizeKey(key: string): string {
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
    return key;
  }
  return `"${key}"`;
}

function valueToTsType(value: unknown, name: string, interfaces: Map<string, string>): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  
  const type = typeof value;
  
  if (type === "string") return "string";
  if (type === "number") return "number";
  if (type === "boolean") return "boolean";
  
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const itemType = valueToTsType(value[0], `${name}Item`, interfaces);
    return `${itemType}[]`;
  }
  
  if (type === "object") {
    const interfaceName = capitalize(name);
    const obj = value as Record<string, unknown>;
    const props = Object.entries(obj)
      .map(([key, val]) => {
        const propType = valueToTsType(val, key, interfaces);
        return `  ${sanitizeKey(key)}: ${propType};`;
      })
      .join("\n");
    
    interfaces.set(interfaceName, `interface ${interfaceName} {\n${props}\n}`);
    return interfaceName;
  }
  
  return "unknown";
}

export function jsonToTypeScript(input: string, rootName: string = "Root"): string {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    throw new Error(result.error || "Invalid JSON");
  }
  
  const interfaces = new Map<string, string>();
  valueToTsType(result.parsed, rootName, interfaces);
  
  // Collect all interfaces, with Root last
  const allInterfaces: string[] = [];
  const rootInterface = interfaces.get(capitalize(rootName));
  
  interfaces.forEach((value, key) => {
    if (key !== capitalize(rootName)) {
      allInterfaces.push(value);
    }
  });
  
  if (rootInterface) {
    allInterfaces.push(rootInterface);
  }
  
  return allInterfaces.join("\n\n");
}

// Zod schema generation
function valueToZodType(value: unknown, name: string): string {
  if (value === null) return "z.null()";
  if (value === undefined) return "z.undefined()";
  
  const type = typeof value;
  
  if (type === "string") return "z.string()";
  if (type === "number") return "z.number()";
  if (type === "boolean") return "z.boolean()";
  
  if (Array.isArray(value)) {
    if (value.length === 0) return "z.array(z.unknown())";
    const itemType = valueToZodType(value[0], `${name}Item`);
    return `z.array(${itemType})`;
  }
  
  if (type === "object") {
    const obj = value as Record<string, unknown>;
    const props = Object.entries(obj)
      .map(([key, val]) => {
        const propType = valueToZodType(val, key);
        return `  ${sanitizeKey(key)}: ${propType},`;
      })
      .join("\n");
    return `z.object({\n${props}\n})`;
  }
  
  return "z.unknown()";
}

export function jsonToZod(input: string, schemaName: string = "schema"): string {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    throw new Error(result.error || "Invalid JSON");
  }
  
  const zodType = valueToZodType(result.parsed, schemaName);
  return `import { z } from "zod";\n\nconst ${schemaName} = ${zodType};\n\ntype ${capitalize(schemaName)} = z.infer<typeof ${schemaName}>;`;
}

// Path utilities
export function getJsonPath(obj: unknown, targetPath: string[]): string {
  return targetPath.reduce((path, key, index) => {
    const isArrayIndex = /^\d+$/.test(key);
    if (isArrayIndex) {
      return `${path}[${key}]`;
    }
    if (index === 0) {
      return key;
    }
    return `${path}.${key}`;
  }, "");
}

// Search utilities
export interface SearchMatch {
  path: string;
  key?: string;
  value?: string;
  line: number;
}

export function searchJson(input: string, term: string): SearchMatch[] {
  if (!term.trim()) return [];
  
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) return [];
  
  const matches: SearchMatch[] = [];
  const lowerTerm = term.toLowerCase();
  const lines = input.split("\n");

  function search(obj: unknown, path: string[] = []) {
    if (obj === null || obj === undefined) return;

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        search(item, [...path, String(index)]);
      });
      return;
    }

    if (typeof obj === "object") {
      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        const currentPath = [...path, key];
        const pathStr = getJsonPath(obj, currentPath);

        if (key.toLowerCase().includes(lowerTerm)) {
          const lineIndex = lines.findIndex(l => l.includes(`"${key}"`));
          matches.push({ path: pathStr, key, line: lineIndex + 1 });
        }

        if (typeof value === "string" && value.toLowerCase().includes(lowerTerm)) {
          const lineIndex = lines.findIndex(l => l.includes(`"${value}"`));
          matches.push({ path: pathStr, value, line: lineIndex + 1 });
        }

        search(value, currentPath);
      }
    }
  }

  search(result.parsed);
  return matches;
}

// Advanced JSON utilities

// JSON Path query (JSONPath-like syntax)
export function queryJsonPath(input: string, query: string): unknown[] {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    throw new Error(result.error || "Invalid JSON");
  }
  
  const results: unknown[] = [];
  
  function traverse(obj: unknown, path: string[] = []) {
    if (query === "$" && path.length === 0) {
      results.push(obj);
      return;
    }
    
    if (query.startsWith("$..")) {
      const key = query.slice(3);
      if (typeof obj === "object" && obj !== null) {
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            traverse(item, [...path, String(index)]);
          });
        } else {
          const record = obj as Record<string, unknown>;
          Object.entries(record).forEach(([k, v]) => {
            if (k === key) results.push(v);
            traverse(v, [...path, k]);
          });
        }
      }
    } else if (query.startsWith("$.")) {
      const parts = query.slice(2).split(".");
      let current = obj;
      for (const part of parts) {
        if (current === null || typeof current !== "object") break;
        if (Array.isArray(current)) {
          const index = parseInt(part, 10);
          if (!isNaN(index) && index >= 0 && index < current.length) {
            current = current[index];
          } else break;
        } else {
          current = (current as Record<string, unknown>)[part];
        }
      }
      if (current !== undefined) results.push(current);
    }
  }
  
  traverse(result.parsed);
  return results;
}

// JSON transformation with simple rules
export function transformJson(input: string, rules: Record<string, string>): string {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    throw new Error(result.error || "Invalid JSON");
  }
  
  function transform(obj: unknown): unknown {
    if (obj === null || typeof obj !== "object") return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(transform);
    }
    
    const transformed: Record<string, unknown> = {};
    const record = obj as Record<string, unknown>;
    
    Object.entries(record).forEach(([key, value]) => {
      const newKey = rules[key] || key;
      transformed[newKey] = transform(value);
    });
    
    return transformed;
  }
  
  return JSON.stringify(transform(result.parsed), null, 2);
}

// JSON flattening
export function flattenJson(input: string, separator: string = ".", maxDepth: number = 10): string {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    throw new Error(result.error || "Invalid JSON");
  }
  
  function flatten(obj: unknown, prefix: string = "", depth: number = 0): Record<string, unknown> {
    const flattened: Record<string, unknown> = {};
    
    if (depth >= maxDepth || obj === null || typeof obj !== "object") {
      flattened[prefix || "root"] = obj;
      return flattened;
    }
    
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const key = prefix ? `${prefix}${separator}${index}` : String(index);
        Object.assign(flattened, flatten(item, key, depth + 1));
      });
    } else {
      Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
        const newKey = prefix ? `${prefix}${separator}${key}` : key;
        Object.assign(flattened, flatten(value, newKey, depth + 1));
      });
    }
    
    return flattened;
  }
  
  return JSON.stringify(flatten(result.parsed), null, 2);
}

// JSON merge (deep merge)
export function mergeJson(input1: string, input2: string): string {
  const result1 = validateJson(input1);
  const result2 = validateJson(input2);
  
  if (!result1.valid) throw new Error(`First JSON: ${result1.error}`);
  if (!result2.valid) throw new Error(`Second JSON: ${result2.error}`);
  
  function deepMerge(obj1: unknown, obj2: unknown): unknown {
    if (obj2 === null || obj2 === undefined) return obj1;
    if (obj1 === null || obj1 === undefined) return obj2;
    
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      return [...obj1, ...obj2];
    }
    
    if (typeof obj1 === "object" && typeof obj2 === "object" && !Array.isArray(obj1) && !Array.isArray(obj2)) {
      const merged = { ...obj1 } as Record<string, unknown>;
      Object.entries(obj2 as Record<string, unknown>).forEach(([key, value]) => {
        merged[key] = deepMerge(merged[key], value);
      });
      return merged;
    }
    
    return obj2;
  }
  
  return JSON.stringify(deepMerge(result1.parsed, result2.parsed), null, 2);
}

// JSON statistics
export interface JsonStats {
  size: number;
  depth: number;
  keys: number;
  values: number;
  types: Record<string, number>;
  arrays: number;
  objects: number;
}

export function analyzeJson(input: string): JsonStats {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    throw new Error(result.error || "Invalid JSON");
  }
  
  const stats: JsonStats = {
    size: input.length,
    depth: 0,
    keys: 0,
    values: 0,
    types: {},
    arrays: 0,
    objects: 0
  };
  
  function analyze(obj: unknown, depth: number = 0) {
    stats.depth = Math.max(stats.depth, depth);
    
    if (obj === null) {
      stats.types.null = (stats.types.null || 0) + 1;
      stats.values++;
      return;
    }
    
    const type = Array.isArray(obj) ? "array" : typeof obj;
    stats.types[type] = (stats.types[type] || 0) + 1;
    
    if (Array.isArray(obj)) {
      stats.arrays++;
      obj.forEach(item => analyze(item, depth + 1));
    } else if (typeof obj === "object") {
      stats.objects++;
      Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
        stats.keys++;
        analyze(value, depth + 1);
      });
    } else {
      stats.values++;
    }
  }
  
  analyze(result.parsed);
  return stats;
}

// JSON validation with custom rules
export interface ValidationRule {
  path: string;
  type?: string;
  required?: boolean;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface ValidationError {
  path: string;
  message: string;
}

export function validateWithRules(input: string, rules: ValidationRule[]): ValidationError[] {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    return [{ path: "root", message: result.error || "Invalid JSON" }];
  }
  
  const errors: ValidationError[] = [];
  
  rules.forEach(rule => {
    try {
      const value = rule.path === "$" ? result.parsed : queryJsonPath(input, rule.path)[0];
      
      if (rule.required && (value === undefined || value === null)) {
        errors.push({ path: rule.path, message: "Required field is missing" });
        return;
      }
      
      if (value !== undefined && rule.type) {
        const actualType = Array.isArray(value) ? "array" : typeof value;
        if (actualType !== rule.type) {
          errors.push({ path: rule.path, message: `Expected ${rule.type}, got ${actualType}` });
        }
      }
      
      if (rule.pattern && typeof value === "string") {
        const regex = new RegExp(rule.pattern);
        if (!regex.test(value)) {
          errors.push({ path: rule.path, message: `Value does not match pattern: ${rule.pattern}` });
        }
      }
      
      if (rule.min !== undefined) {
        if (typeof value === "number" && value < rule.min) {
          errors.push({ path: rule.path, message: `Value ${value} is less than minimum ${rule.min}` });
        }
        if (typeof value === "string" && value.length < rule.min) {
          errors.push({ path: rule.path, message: `String length ${value.length} is less than minimum ${rule.min}` });
        }
      }
      
      if (rule.max !== undefined) {
        if (typeof value === "number" && value > rule.max) {
          errors.push({ path: rule.path, message: `Value ${value} is greater than maximum ${rule.max}` });
        }
        if (typeof value === "string" && value.length > rule.max) {
          errors.push({ path: rule.path, message: `String length ${value.length} is greater than maximum ${rule.max}` });
        }
      }
    } catch (e) {
      errors.push({ path: rule.path, message: `Path not found: ${rule.path}` });
    }
  });
  
  return errors;
}

// JSON to CSV conversion
export function jsonToCsv(input: string): string {
  const result = validateJson(input);
  if (!result.valid || result.parsed === undefined) {
    throw new Error(result.error || "Invalid JSON");
  }
  
  const data = result.parsed;
  
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("JSON must be an array of objects for CSV conversion");
  }
  
  const headers = new Set<string>();
  data.forEach(item => {
    if (typeof item === "object" && item !== null) {
      Object.keys(item as Record<string, unknown>).forEach(key => headers.add(key));
    }
  });
  
  const headerArray = Array.from(headers).sort();
  const csvRows = [headerArray.join(",")];
  
  data.forEach(item => {
    if (typeof item === "object" && item !== null) {
      const row = headerArray.map(header => {
        const value = (item as Record<string, unknown>)[header];
        if (value === null || value === undefined) return "";
        const str = String(value);
        return str.includes(",") || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
      });
      csvRows.push(row.join(","));
    }
  });
  
  return csvRows.join("\n");
}

// Generate hash for JSON (for caching/comparison)
export async function hashJson(input: string): Promise<string> {
  const canonical = canonicalJson(input);
  const encoder = new TextEncoder();
  const data = encoder.encode(canonical);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Sample JSON
export const SAMPLE_JSON = `{
  "users": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "admin",
      "active": true,
      "metadata": {
        "lastLogin": "2024-01-15T10:30:00Z",
        "preferences": {
          "theme": "dark",
          "notifications": true
        }
      }
    },
    {
      "id": 2,
      "name": "Bob Smith",
      "email": "bob@example.com",
      "role": "user",
      "active": false,
      "metadata": null
    }
  ],
  "settings": {
    "version": "2.0.0",
    "features": ["auth", "api", "webhooks"],
    "limits": {
      "maxUsers": 100,
      "maxStorage": 5368709120
    }
  },
  "emptyArray": [],
  "emptyObject": {},
  "nullValue": null
}`;
