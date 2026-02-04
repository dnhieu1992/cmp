"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type FormHelperProps = React.HTMLAttributes<HTMLParagraphElement>;

export default function FormHelper({ className, ...props }: FormHelperProps) {
  return <p className={cn("text-xs text-zinc-500", className)} {...props} />;
}
