import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  active: string | undefined;
  setActive: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

export function Tabs({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
}: any) {
  const [internal, setInternal] = React.useState(defaultValue);
  const active = value ?? internal;
  const setActive = (val: string) => {
    if (onValueChange) onValueChange(val);
    else setInternal(val);
  };
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn(className)} data-active={active}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: any) {
  return (
    <div className={cn("inline-flex rounded-md bg-muted p-1", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children }: any) {
  const ctx = React.useContext(TabsContext);
  const isActive = ctx?.active === value;
  return (
    <button
      className={cn(
        "px-3 py-2 text-sm font-medium",
        isActive && "bg-background shadow",
        className
      )}
      onClick={() => ctx?.setActive(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }: any) {
  const ctx = React.useContext(TabsContext);
  if (ctx?.active !== value) return null;
  return <div className={cn(className)}>{children}</div>;
}
