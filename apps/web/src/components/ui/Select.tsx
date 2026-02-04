"use client";

import * as React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { cn } from "@/lib/cn";

export type SelectProps = TextFieldProps;

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, variant = "outlined", size = "medium", children, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        select
        variant={variant}
        size={size}
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </TextField>
    );
  },
);

Select.displayName = "Select";

export default Select;
