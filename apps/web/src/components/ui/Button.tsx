"use client";

import * as React from "react";
import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { cn } from "@/lib/cn";

export type ButtonProps = MuiButtonProps;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "contained", color = "primary", disableElevation = true, ...props },
    ref,
  ) => {
    return (
      <MuiButton
        ref={ref}
        variant={variant}
        color={color}
        disableElevation={disableElevation}
        className={cn("normal-case", className)}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export default Button;
