"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export default function FormLabel({ className, ...props }: FormLabelProps) {
  return <label className={cn("text-sm font-medium text-zinc-700", className)} {...props} />;
}
