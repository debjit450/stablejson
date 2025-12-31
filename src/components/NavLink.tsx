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
            ? "text-foreground bg-primary/10 shadow-sm" 
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
          className
        )
      }
    >
      {children}
    </RouterNavLink>
  );
}
