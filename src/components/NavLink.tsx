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
          "px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg whitespace-nowrap hover-lift",
          isActive
            ? "text-primary bg-primary/10 border border-primary/20 shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          className
        )
      }
    >
      {children}
    </RouterNavLink>
  );
}
