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
          "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg relative overflow-hidden",
          "hover:-translate-y-0.5 active:translate-y-0",
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
