"use client";

import * as React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { cn } from "@/lib/cn";

export type TextareaProps = TextFieldProps;

const Textarea = React.forwardRef<HTMLDivElement, TextareaProps>(
  ({ className, variant = "outlined", size = "medium", minRows = 3, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        variant={variant}
        size={size}
        className={cn("w-full", className)}
        multiline
        minRows={minRows}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
