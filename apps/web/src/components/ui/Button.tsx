import * as React from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";
export type ButtonRadius = "md" | "full";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  fullWidth?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  outline:
    "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300",
  ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

const sizeClass: Record<ButtonSize, string> = {
  // Match the app control sizing guideline (38px, 14px).
  sm: "h-[38px] px-4 text-sm",
  md: "h-11 px-5 text-sm",
};

const radiusClass: Record<ButtonRadius, string> = {
  md: "rounded",
  full: "rounded-full",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "sm",
      radius = "md",
      fullWidth,
      type = "button",
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 font-semibold leading-none transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantClass[variant],
        sizeClass[size],
        radiusClass[radius],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";

export default Button;
