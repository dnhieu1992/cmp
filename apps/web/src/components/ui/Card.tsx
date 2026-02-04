"use client";

import * as React from "react";
import MuiCard, { type CardProps as MuiCardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { cn } from "@/lib/cn";

export type CardProps = MuiCardProps & {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    return (
      <MuiCard ref={ref} className={cn(className)} {...props}>
        {(title || subtitle || action) && (
          <CardHeader title={title} subheader={subtitle} action={action} />
        )}
        <CardContent>{children}</CardContent>
      </MuiCard>
    );
  },
);

Card.displayName = "Card";

export default Card;
