import * as React from "react";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <div className="relative inline-block">{children}</div>;
}

export function TooltipTrigger({
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export function TooltipContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute z-50 mt-1 rounded-md border bg-black px-2 py-1 text-xs text-white">
      {children}
    </div>
  );
}
