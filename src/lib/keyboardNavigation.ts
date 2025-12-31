import { useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: () => void;
  category: string;
  disabled?: boolean;
}

export interface KeyboardNavigationOptions {
  shortcuts: KeyboardShortcut[];
  enableGlobalShortcuts?: boolean;
  enableArrowNavigation?: boolean;
  enableTabNavigation?: boolean;
  enableEscapeHandling?: boolean;
  focusTrapContainer?: string;
}

export class KeyboardNavigationManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private focusableElements: HTMLElement[] = [];
  private currentFocusIndex = -1;
  private focusTrapContainer: HTMLElement | null = null;
  private isEnabled = true;

  constructor(private options: KeyboardNavigationOptions) {
    this.registerShortcuts(options.shortcuts);
    this.setupEventListeners();
    
    if (options.focusTrapContainer) {
      this.focusTrapContainer = document.querySelector(options.focusTrapContainer);
    }
  }

  private registerShortcuts(shortcuts: KeyboardShortcut[]) {
    shortcuts.forEach(shortcut => {
      const key = this.getShortcutKey(shortcut);
      this.shortcuts.set(key, shortcut);
    });
  }

  private getShortcutKey(shortcut: KeyboardShortcut): string {
    const modifiers = [];
    if (shortcut.ctrlKey) modifiers.push('ctrl');
    if (shortcut.shiftKey) modifiers.push('shift');
    if (shortcut.altKey) modifiers.push('alt');
    if (shortcut.metaKey) modifiers.push('meta');
    
    return [...modifiers, shortcut.key.toLowerCase()].join('+');
  }

  private setupEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    
    // Update focusable elements periodically
    setInterval(() => {
      this.updateFocusableElements();
    }, 1000);
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.isEnabled) return;

    // Handle shortcuts
    if (this.options.enableGlobalShortcuts !== false) {
      const shortcutKey = this.getShortcutKey({
        key: event.key,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
      } as KeyboardShortcut);

      const shortcut = this.shortcuts.get(shortcutKey);
      if (shortcut && !shortcut.disabled) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }

    // Handle arrow navigation
    if (this.options.enableArrowNavigation !== false) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (this.handleArrowNavigation(event.key === 'ArrowDown')) {
          event.preventDefault();
        }
      }
    }

    // Handle tab navigation
    if (this.options.enableTabNavigation !== false) {
      if (event.key === 'Tab') {
        this.handleTabNavigation(event.shiftKey);
      }
    }

    // Handle escape
    if (this.options.enableEscapeHandling !== false) {
      if (event.key === 'Escape') {
        this.handleEscape();
      }
    }
  }

  private handleFocusIn(event: FocusEvent) {
    const target = event.target as HTMLElement;
    const index = this.focusableElements.indexOf(target);
    if (index !== -1) {
      this.currentFocusIndex = index;
    }
  }

  private updateFocusableElements() {
    const container = this.focusTrapContainer || document.body;
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    this.focusableElements = Array.from(container.querySelectorAll(selector))
      .filter(el => {
        const element = el as HTMLElement;
        return element.offsetParent !== null && // visible
               !element.hasAttribute('aria-hidden') &&
               element.tabIndex !== -1;
      }) as HTMLElement[];
  }

  private handleArrowNavigation(down: boolean): boolean {
    this.updateFocusableElements();
    
    if (this.focusableElements.length === 0) return false;

    const direction = down ? 1 : -1;
    let newIndex = this.currentFocusIndex + direction;

    if (newIndex >= this.focusableElements.length) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = this.focusableElements.length - 1;
    }

    const element = this.focusableElements[newIndex];
    if (element) {
      element.focus();
      this.currentFocusIndex = newIndex;
      return true;
    }

    return false;
  }

  private handleTabNavigation(reverse: boolean) {
    // Let browser handle tab navigation, but track focus
    this.updateFocusableElements();
  }

  private handleEscape() {
    // Close modals, dropdowns, etc.
    const activeElement = document.activeElement as HTMLElement;
    
    // Try to find and close any open modals or dropdowns
    const modals = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
    const dropdowns = document.querySelectorAll('[role="menu"], [role="listbox"]');
    
    if (modals.length > 0) {
      const lastModal = modals[modals.length - 1] as HTMLElement;
      const closeButton = lastModal.querySelector('[aria-label*="close"], [data-dismiss]') as HTMLElement;
      if (closeButton) {
        closeButton.click();
      }
    } else if (dropdowns.length > 0) {
      const lastDropdown = dropdowns[dropdowns.length - 1] as HTMLElement;
      const trigger = document.querySelector(`[aria-controls="${lastDropdown.id}"]`) as HTMLElement;
      if (trigger) {
        trigger.focus();
      }
    } else if (activeElement && activeElement.blur) {
      activeElement.blur();
    }
  }

  public addShortcut(shortcut: KeyboardShortcut) {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  public removeShortcut(shortcut: KeyboardShortcut) {
    const key = this.getShortcutKey(shortcut);
    this.shortcuts.delete(key);
  }

  public enable() {
    this.isEnabled = true;
  }

  public disable() {
    this.isEnabled = false;
  }

  public getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  public focusFirst() {
    this.updateFocusableElements();
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
      this.currentFocusIndex = 0;
    }
  }

  public focusLast() {
    this.updateFocusableElements();
    if (this.focusableElements.length > 0) {
      const lastIndex = this.focusableElements.length - 1;
      this.focusableElements[lastIndex].focus();
      this.currentFocusIndex = lastIndex;
    }
  }

  public destroy() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('focusin', this.handleFocusIn.bind(this));
    this.shortcuts.clear();
    this.focusableElements = [];
  }
}

// React hook for keyboard navigation
export function useKeyboardNavigation(options: KeyboardNavigationOptions) {
  const managerRef = useRef<KeyboardNavigationManager | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    managerRef.current = new KeyboardNavigationManager(options);

    return () => {
      if (managerRef.current) {
        managerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (managerRef.current) {
      // Update shortcuts when they change
      managerRef.current.destroy();
      managerRef.current = new KeyboardNavigationManager(options);
    }
  }, [options.shortcuts]);

  const addShortcut = useCallback((shortcut: KeyboardShortcut) => {
    if (managerRef.current) {
      managerRef.current.addShortcut(shortcut);
    }
  }, []);

  const removeShortcut = useCallback((shortcut: KeyboardShortcut) => {
    if (managerRef.current) {
      managerRef.current.removeShortcut(shortcut);
    }
  }, []);

  const showShortcutsHelp = useCallback(() => {
    if (managerRef.current) {
      const shortcuts = managerRef.current.getShortcuts();
      const categories = shortcuts.reduce((acc, shortcut) => {
        if (!acc[shortcut.category]) {
          acc[shortcut.category] = [];
        }
        acc[shortcut.category].push(shortcut);
        return acc;
      }, {} as Record<string, KeyboardShortcut[]>);

      let helpText = 'Keyboard Shortcuts:\n\n';
      Object.entries(categories).forEach(([category, categoryShortcuts]) => {
        helpText += `${category}:\n`;
        categoryShortcuts.forEach(shortcut => {
          const keys = [];
          if (shortcut.ctrlKey) keys.push('Ctrl');
          if (shortcut.shiftKey) keys.push('Shift');
          if (shortcut.altKey) keys.push('Alt');
          if (shortcut.metaKey) keys.push('Cmd');
          keys.push(shortcut.key);
          
          helpText += `  ${keys.join(' + ')}: ${shortcut.description}\n`;
        });
        helpText += '\n';
      });

      toast({
        title: 'Keyboard Shortcuts',
        description: helpText,
        duration: 10000,
      });
    }
  }, [toast]);

  const enable = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.enable();
    }
  }, []);

  const disable = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.disable();
    }
  }, []);

  const focusFirst = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.focusFirst();
    }
  }, []);

  const focusLast = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.focusLast();
    }
  }, []);

  return {
    addShortcut,
    removeShortcut,
    showShortcutsHelp,
    enable,
    disable,
    focusFirst,
    focusLast,
  };
}

// Predefined shortcut sets
export const DEFAULT_JSON_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'f',
    ctrlKey: true,
    description: 'Format JSON',
    action: () => {},
    category: 'JSON Operations',
  },
  {
    key: 'm',
    ctrlKey: true,
    description: 'Minify JSON',
    action: () => {},
    category: 'JSON Operations',
  },
  {
    key: 's',
    ctrlKey: true,
    description: 'Sort keys',
    action: () => {},
    category: 'JSON Operations',
  },
  {
    key: 'c',
    ctrlKey: true,
    shiftKey: true,
    description: 'Clean JSON',
    action: () => {},
    category: 'JSON Operations',
  },
  {
    key: 'd',
    ctrlKey: true,
    description: 'Show diff',
    action: () => {},
    category: 'JSON Operations',
  },
  {
    key: 't',
    ctrlKey: true,
    description: 'Table view',
    action: () => {},
    category: 'View Modes',
  },
  {
    key: 'g',
    ctrlKey: true,
    description: 'Generate types',
    action: () => {},
    category: 'Code Generation',
  },
  {
    key: 'k',
    ctrlKey: true,
    description: 'Command palette',
    action: () => {},
    category: 'Navigation',
  },
  {
    key: '/',
    ctrlKey: true,
    description: 'Show shortcuts',
    action: () => {},
    category: 'Help',
  },
  {
    key: 'r',
    ctrlKey: true,
    description: 'Clear all',
    action: () => {},
    category: 'Utility',
  },
  {
    key: 'l',
    ctrlKey: true,
    description: 'Load sample',
    action: () => {},
    category: 'Utility',
  },
  {
    key: 'Enter',
    ctrlKey: true,
    description: 'Execute action',
    action: () => {},
    category: 'Navigation',
  },
  {
    key: 'ArrowUp',
    description: 'Previous item',
    action: () => {},
    category: 'Navigation',
  },
  {
    key: 'ArrowDown',
    description: 'Next item',
    action: () => {},
    category: 'Navigation',
  },
  {
    key: 'Home',
    description: 'First item',
    action: () => {},
    category: 'Navigation',
  },
  {
    key: 'End',
    description: 'Last item',
    action: () => {},
    category: 'Navigation',
  },
  {
    key: 'Escape',
    description: 'Close/Cancel',
    action: () => {},
    category: 'Navigation',
  },
];

// Accessibility helpers
export function announceToScreenReader(message: string) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function setFocusVisible(element: HTMLElement) {
  element.setAttribute('data-focus-visible', 'true');
  element.addEventListener('blur', () => {
    element.removeAttribute('data-focus-visible');
  }, { once: true });
}

export function trapFocus(container: HTMLElement) {
  const focusableElements = container.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}