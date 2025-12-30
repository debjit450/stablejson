import { useEffect, useState, useMemo } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Sparkles,
  ArrowDownAZ,
  Eraser,
  Copy,
  GitCompare,
  Table,
  FileCode,
  Minimize2,
  RotateCcw,
  Hash,
  Sun,
  Moon,
  FileJson,
} from "lucide-react";

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  action: () => void;
  disabled?: boolean;
}

interface CommandPaletteProps {
  commands: Command[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ commands, open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    const lower = search.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lower) ||
        cmd.description?.toLowerCase().includes(lower)
    );
  }, [commands, search]);

  const handleSelect = (command: Command) => {
    if (command.disabled) return;
    onOpenChange(false);
    // Small delay to allow dialog to close
    setTimeout(() => command.action(), 50);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No commands found.</CommandEmpty>
        <CommandGroup heading="Actions">
          {filteredCommands.map((command) => (
            <CommandItem
              key={command.id}
              onSelect={() => handleSelect(command)}
              disabled={command.disabled}
              className="gap-2"
            >
              {command.icon}
              <div className="flex-1">
                <div>{command.label}</div>
                {command.description && (
                  <div className="text-xs text-muted-foreground">
                    {command.description}
                  </div>
                )}
              </div>
              {command.shortcut && (
                <CommandShortcut>{command.shortcut}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

// Factory for common commands
export function createCommands(handlers: {
  onFormat: () => void;
  onMinify: () => void;
  onSort: () => void;
  onClean: () => void;
  onDiff: () => void;
  onTable: () => void;
  onTypes: () => void;
  onCanonical: () => void;
  onCopy: () => void;
  onClear: () => void;
  onLoadSample: () => void;
  onToggleTheme: () => void;
  isValid: boolean;
  isCanonical: boolean;
  theme: "light" | "dark";
}): Command[] {
  return [
    {
      id: "format",
      label: "Format JSON",
      description: "Pretty print with indentation",
      icon: <Sparkles className="w-4 h-4" />,
      action: handlers.onFormat,
      disabled: !handlers.isValid,
    },
    {
      id: "minify",
      label: "Minify JSON",
      description: "Remove whitespace",
      icon: <Minimize2 className="w-4 h-4" />,
      action: handlers.onMinify,
      disabled: !handlers.isValid,
    },
    {
      id: "sort",
      label: "Sort Keys",
      description: "Alphabetically sort object keys",
      icon: <ArrowDownAZ className="w-4 h-4" />,
      action: handlers.onSort,
      disabled: !handlers.isValid,
    },
    {
      id: "clean",
      label: "Clean JSON",
      description: "Remove null, empty values",
      icon: <Eraser className="w-4 h-4" />,
      action: handlers.onClean,
      disabled: !handlers.isValid,
    },
    {
      id: "canonical",
      label: handlers.isCanonical ? "Disable Canonical Mode" : "Enable Canonical Mode",
      description: "Deterministic output for hashing/diffing",
      icon: <Hash className="w-4 h-4" />,
      action: handlers.onCanonical,
    },
    {
      id: "diff",
      label: "Compare JSON",
      description: "Diff two JSON inputs",
      icon: <GitCompare className="w-4 h-4" />,
      action: handlers.onDiff,
    },
    {
      id: "table",
      label: "View as Table",
      description: "Render JSON as table",
      icon: <Table className="w-4 h-4" />,
      action: handlers.onTable,
      disabled: !handlers.isValid,
    },
    {
      id: "types",
      label: "Generate Types",
      description: "TypeScript interfaces and Zod schemas",
      icon: <FileCode className="w-4 h-4" />,
      action: handlers.onTypes,
      disabled: !handlers.isValid,
    },
    {
      id: "copy",
      label: "Copy Output",
      description: "Copy result to clipboard",
      icon: <Copy className="w-4 h-4" />,
      shortcut: "⌘C",
      action: handlers.onCopy,
    },
    {
      id: "clear",
      label: "Clear All",
      description: "Reset inputs and output",
      icon: <RotateCcw className="w-4 h-4" />,
      action: handlers.onClear,
    },
    {
      id: "sample",
      label: "Load Sample JSON",
      description: "Load example data",
      icon: <FileJson className="w-4 h-4" />,
      action: handlers.onLoadSample,
    },
    {
      id: "theme",
      label: handlers.theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      description: "Toggle color theme",
      icon: handlers.theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      action: handlers.onToggleTheme,
    },
  ];
}
