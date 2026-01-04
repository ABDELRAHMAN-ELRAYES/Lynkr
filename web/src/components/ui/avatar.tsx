export function Avatar({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted ${className || ""
        }`}
    >
      {children}
    </div>
  );
}

export function AvatarImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      className={`h-full w-full rounded-full object-cover ${props.className || ""
        }`}
    />
  );
}

export function AvatarFallback({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-xs font-medium ${className || ""}`}>{children}</span>;
}
