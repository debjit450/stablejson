import { useMemo } from "react";
import { analyzeJson, JsonStats } from "@/lib/jsonUtils";
import { BarChart3, Hash, Layers, FileText } from "lucide-react";

interface JsonAnalyzerProps {
  json: string;
}

export function JsonAnalyzer({ json }: JsonAnalyzerProps) {
  const stats = useMemo(() => {
    try {
      return analyzeJson(json);
    } catch {
      return null;
    }
  }, [json]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <BarChart3 className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Invalid JSON</p>
        </div>
      </div>
    );
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="h-full overflow-auto scrollbar-thin p-4">
      <div className="space-y-6">
        {/* Overview */}
        <div className="premium-card p-4">
          <h3 className="font-display text-sm font-medium mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Overview
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-display font-semibold">{formatBytes(stats.size)}</div>
              <div className="text-xs text-muted-foreground">Size</div>
            </div>
            <div>
              <div className="text-2xl font-display font-semibold">{stats.depth}</div>
              <div className="text-xs text-muted-foreground">Max Depth</div>
            </div>
            <div>
              <div className="text-2xl font-display font-semibold">{stats.keys}</div>
              <div className="text-xs text-muted-foreground">Keys</div>
            </div>
            <div>
              <div className="text-2xl font-display font-semibold">{stats.values}</div>
              <div className="text-xs text-muted-foreground">Values</div>
            </div>
          </div>
        </div>

        {/* Structure */}
        <div className="premium-card p-4">
          <h3 className="font-display text-sm font-medium mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Structure
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-display font-semibold">{stats.objects}</div>
              <div className="text-xs text-muted-foreground">Objects</div>
            </div>
            <div>
              <div className="text-2xl font-display font-semibold">{stats.arrays}</div>
              <div className="text-xs text-muted-foreground">Arrays</div>
            </div>
          </div>
        </div>

        {/* Data Types */}
        <div className="premium-card p-4">
          <h3 className="font-display text-sm font-medium mb-4 flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Data Types
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.types)
              .sort(([,a], [,b]) => b - a)
              .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      type === 'string' ? 'bg-green-500' :
                      type === 'number' ? 'bg-blue-500' :
                      type === 'boolean' ? 'bg-purple-500' :
                      type === 'object' ? 'bg-orange-500' :
                      type === 'array' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`} />
                    <span className="text-sm font-medium capitalize">{type}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}