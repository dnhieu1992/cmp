"use client";

import * as React from "react";
import CircularProgress, { type CircularProgressProps } from "@mui/material/CircularProgress";
import { cn } from "@/lib/cn";

export type SpinnerProps = CircularProgressProps;

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size = 24, ...props }, ref) => {
    return (
      <CircularProgress
        ref={ref}
        size={size}
        className={cn("text-current", className)}
        {...props}
      />
    );
  },
);

Spinner.displayName = "Spinner";

export default Spinner;
