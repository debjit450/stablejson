import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        action: "border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground shadow-sm backdrop-blur-sm",
        premium: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 shadow-md",
        brand: "bg-[hsl(var(--brand))] text-[hsl(var(--brand-foreground))] hover:bg-[hsl(var(--brand)/0.9)] shadow-sm",
        info: "bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))] hover:bg-[hsl(var(--info)/0.9)] shadow-sm",
        "accent-secondary": "bg-[hsl(var(--accent-secondary))] text-[hsl(var(--accent-secondary-foreground))] hover:bg-[hsl(var(--accent-secondary)/0.9)] shadow-sm",
      },
      size: {
        default: "h-8 px-3 py-2 text-sm sm:h-9 sm:px-4",
        sm: "h-7 rounded-md px-2 text-xs sm:h-8 sm:px-3",
        lg: "h-10 rounded-md px-4 text-sm sm:h-11 sm:px-6 sm:text-base",
        icon: "h-8 w-8 sm:h-9 sm:w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
