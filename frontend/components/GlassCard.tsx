import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  strong?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  strong = false,
}: GlassCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 ${strong ? "glass-strong" : "glass"} ${className}`}
    >
      {children}
    </div>
  );
}
