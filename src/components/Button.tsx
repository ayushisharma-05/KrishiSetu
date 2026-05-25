import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "info" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-dark border border-transparent",
  secondary: "bg-transparent text-muted-foreground border border-muted-foreground/40 hover:bg-muted",
  danger: "bg-danger-bg text-danger-fg border border-danger",
  info: "bg-info-bg text-info-fg border border-info",
  ghost: "bg-transparent hover:bg-muted text-foreground border border-transparent",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-5 text-[13px]",
  lg: "h-12 px-6 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", loading, fullWidth, leftIcon, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant], sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : leftIcon}
      {children}
    </button>
  );
});
