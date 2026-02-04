"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type FormErrorProps = React.HTMLAttributes<HTMLParagraphElement> & {
  message?: string | null;
};

export default function FormError({ className, message, ...props }: FormErrorProps) {
  if (!message) return null;

  return (
    <p className={cn("text-xs font-medium text-red-600", className)} {...props}>
      {message}
    </p>
  );
}
