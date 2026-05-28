/**
 * Performance optimization utilities for large JSON processing
 * Version 1.5.0 - Enhanced performance features
 */

type JsonWorkerPayload = string | { value: unknown; space?: string | number };

interface JsonWorkerMessage {
  id: string;
  success: boolean;
  result?: unknown;
  error?: string;
}

export interface PerformanceMetrics {
  avg: number;
  min: number;
  max: number;
  count: number;
}

// Web Worker for heavy JSON processing
export class JsonWorker {
  private worker: Worker | null = null;
  
  constructor() {
    if (typeof Worker !== 'undefined') {
      const workerCode = `
        self.onmessage = function(e) {
          const { type, data, id } = e.data;
          
          try {
            let result;
            
            switch (type) {
              case 'parse':
                result = JSON.parse(data);
                break;
              case 'stringify':
                result = JSON.stringify(data.value, null, data.space);
                break;
              case 'format':
                const parsed = JSON.parse(data);
                result = JSON.stringify(parsed, null, 2);
                break;
              case 'minify':
                const minified = JSON.parse(data);
                result = JSON.stringify(minified);
                break;
              case 'validate':
                JSON.parse(data);
                result = { valid: true };
                break;
              default:
                throw new Error('Unknown operation');
            }
            
            self.postMessage({ id, result, success: true });
          } catch (error) {
            self.postMessage({ 
              id, 
              error: error.message, 
              success: false 
            });
          }
        };
      `;
      
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
    }
  }
  
  async processJson<T = unknown>(type: string, data: JsonWorkerPayload): Promise<T> {
    if (!this.worker) {
      // Fallback to main thread
      return this.fallbackProcess<T>(type, data);
    }
    
    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substr(2, 9);
      
      const handleMessage = (e: MessageEvent) => {
        const message = e.data as JsonWorkerMessage;
        if (message.id === id) {
          this.worker!.removeEventListener('message', handleMessage);
          if (message.success) {
            resolve(message.result as T);
          } else {
            reject(new Error(message.error));
          }
        }
      };
      
      this.worker.addEventListener('message', handleMessage);
      this.worker.postMessage({ type, data, id });
      
      // Timeout after 30 seconds
      setTimeout(() => {
        this.worker!.removeEventListener('message', handleMessage);
        reject(new Error('Worker timeout'));
      }, 30000);
    });
  }
  
  private fallbackProcess<T = unknown>(type: string, data: JsonWorkerPayload): T {
    switch (type) {
      case 'parse':
        return JSON.parse(data as string) as T;
      case 'stringify':
        return JSON.stringify(
          (data as { value: unknown; space?: string | number }).value,
          null,
          (data as { value: unknown; space?: string | number }).space,
        ) as T;
      case 'format':
        return JSON.stringify(JSON.parse(data as string), null, 2) as T;
      case 'minify':
        return JSON.stringify(JSON.parse(data as string)) as T;
      case 'validate':
        JSON.parse(data as string);
        return { valid: true } as T;
      default:
        throw new Error('Unknown operation');
    }
  }
  
  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Streaming JSON parser for large files
export class StreamingJsonParser {
  private buffer = '';
  private depth = 0;
  private inString = false;
  private escaped = false;
  
  parseChunk(chunk: string, onObject?: (obj: unknown) => void): void {
    this.buffer += chunk;
    
    let i = 0;
    while (i < this.buffer.length) {
      const char = this.buffer[i];
      
      if (this.escaped) {
        this.escaped = false;
        i++;
        continue;
      }
      
      if (char === '\\' && this.inString) {
        this.escaped = true;
        i++;
        continue;
      }
      
      if (char === '"') {
        this.inString = !this.inString;
      }
      
      if (!this.inString) {
        if (char === '{' || char === '[') {
          this.depth++;
        } else if (char === '}' || char === ']') {
          this.depth--;
          
          if (this.depth === 0) {
            // Complete object found
            const objectStr = this.buffer.substring(0, i + 1);
            try {
              const obj = JSON.parse(objectStr) as unknown;
              onObject?.(obj);
            } catch (e) {
              // Invalid JSON, continue
            }
            this.buffer = this.buffer.substring(i + 1);
            i = -1; // Reset counter
          }
        }
      }
      
      i++;
    }
  }
  
  flush(): string {
    const remaining = this.buffer;
    this.buffer = '';
    this.depth = 0;
    this.inString = false;
    this.escaped = false;
    return remaining;
  }
}

// Memory-efficient JSON operations
export class MemoryEfficientJson {
  static async processLargeJson(
    json: string,
    operation: 'format' | 'minify' | 'validate',
    chunkSize = 1024 * 1024 // 1MB chunks
  ): Promise<string> {
    if (json.length < chunkSize) {
      // Small JSON, process normally
      const worker = new JsonWorker();
      try {
        return await worker.processJson<string>(operation, json);
      } finally {
        worker.terminate();
      }
    }
    
    // Large JSON, use streaming approach
    const parser = new StreamingJsonParser();
    const results: unknown[] = [];
    
    for (let i = 0; i < json.length; i += chunkSize) {
      const chunk = json.substring(i, i + chunkSize);
      parser.parseChunk(chunk, (obj) => {
        results.push(obj);
      });
    }
    
    // Process remaining buffer
    const remaining = parser.flush();
    if (remaining.trim()) {
      try {
        results.push(JSON.parse(remaining) as unknown);
      } catch (e) {
        // Ignore invalid remaining JSON
      }
    }
    
    // Combine results based on operation
    switch (operation) {
      case 'format':
        return results.map(obj => JSON.stringify(obj, null, 2)).join('\n');
      case 'minify':
        return results.map(obj => JSON.stringify(obj)).join('');
      case 'validate':
        return JSON.stringify({ valid: true, objects: results.length });
      default:
        return JSON.stringify(results);
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();
  
  static startTimer(operation: string): () => number {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      
      if (!this.metrics.has(operation)) {
        this.metrics.set(operation, []);
      }
      
      this.metrics.get(operation)!.push(duration);
      return duration;
    };
  }
  
  static getMetrics(operation: string): PerformanceMetrics | null {
    const times = this.metrics.get(operation) || [];
    if (times.length === 0) return null;
    
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    
    return { avg, min, max, count: times.length };
  }
  
  static getAllMetrics(): Record<string, PerformanceMetrics | null> {
    const result: Record<string, PerformanceMetrics | null> = {};
    
    for (const [operation, times] of this.metrics.entries()) {
      result[operation] = this.getMetrics(operation);
    }
    
    return result;
  }
  
  static clearMetrics() {
    this.metrics.clear();
  }
}

// Debounced processing for real-time editing
export function debounce<Args extends unknown[]>(
  func: (...args: Args) => unknown,
  wait: number
): (...args: Args) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttled processing for continuous operations
export function throttle<Args extends unknown[]>(
  func: (...args: Args) => unknown,
  limit: number
): (...args: Args) => void {
  let inThrottle: boolean;
  
  return (...args: Args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
