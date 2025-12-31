import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({ to, children, className }: NavLinkProps) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors duration-200 rounded-lg whitespace-nowrap",
          isActive
            ? "text-foreground bg-[hsl(var(--brand)/0.1)] shadow-sm"
            : "text-muted-foreground hover:text-[hsl(var(--info))] hover:bg-[hsl(var(--accent-secondary)/0.1)]",
          className
        )
      }
    >
      {children}
    </RouterNavLink>
  );
}
