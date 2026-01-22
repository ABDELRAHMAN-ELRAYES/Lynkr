import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: string;
}

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border border-gray-100",
        className
      )}
      {...props}
    />
  );
}
