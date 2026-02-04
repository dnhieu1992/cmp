"use client";

import * as React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { cn } from "@/lib/cn";

export type InputProps = TextFieldProps;

const Input = React.forwardRef<HTMLDivElement, InputProps>(
  ({ className, variant = "outlined", size = "medium", ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        variant={variant}
        size={size}
        className={cn("w-full", className)}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
