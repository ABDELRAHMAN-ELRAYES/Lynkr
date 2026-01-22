import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md bg-background px-3 py-2 text-sm shadow-sm focus-visible:border-[#7682e8] focus-visible:ring-none border border-gray-100",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
