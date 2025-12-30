import { cn } from "@/lib/utils";
import { Table as TableIcon } from "lucide-react";

interface TableViewerProps {
  headers: string[];
  rows: Record<string, unknown>[];
  className?: string;
}

export function TableViewer({ headers, rows, className }: TableViewerProps) {
  if (headers.length === 0 || rows.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-full text-muted-foreground", className)}>
        <div className="text-center">
          <TableIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No table data</p>
          <p className="text-sm opacity-70">JSON must be an array of objects or a single object</p>
        </div>
      </div>
    );
  }

  const formatCell = (value: unknown): string => {
    if (value === null) return "null";
    if (value === undefined) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className={cn("h-full overflow-auto scrollbar-thin", className)}>
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-muted/90 backdrop-blur-sm">
          <tr>
            <th className="text-left p-3 border-b border-border text-muted-foreground font-medium w-12">
              #
            </th>
            {headers.map((header) => (
              <th
                key={header}
                className="text-left p-3 border-b border-border text-muted-foreground font-medium"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-fade-in"
              style={{ animationDelay: `${rowIndex * 20}ms` }}
            >
              <td className="p-3 text-muted-foreground font-mono text-xs">
                {rowIndex + 1}
              </td>
              {headers.map((header) => (
                <td
                  key={header}
                  className="p-3 font-mono text-foreground max-w-xs truncate"
                  title={formatCell(row[header])}
                >
                  <span
                    className={cn(
                      row[header] === null && "text-syntax-null",
                      typeof row[header] === "number" && "text-syntax-number",
                      typeof row[header] === "boolean" && "text-syntax-boolean",
                      typeof row[header] === "string" && "text-syntax-string"
                    )}
                  >
                    {formatCell(row[header])}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
