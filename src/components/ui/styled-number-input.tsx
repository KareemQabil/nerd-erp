import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StyledNumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string | number;
  onChange: (value: string) => void;
  icon?: LucideIcon;
  iconColor?: string;
  error?: boolean;
}

export function StyledNumberInput({
  value,
  onChange,
  icon: Icon,
  iconColor = "text-text-secondary",
  error,
  className,
  dir = "rtl",
  ...props
}: StyledNumberInputProps) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          className={cn(
            "absolute top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors",
            iconColor,
            dir === "rtl" ? "right-3" : "left-3"
          )}
        />
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full py-3 bg-surface-overlay border rounded-xl text-text-primary font-['Arial'] placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors",
          Icon ? (dir === "rtl" ? "pr-11 pl-4" : "pl-11 pr-4") : "px-4",
          error ? "border-brand-error" : "border-border-subtle",
          className
        )}
        dir={dir}
        {...props}
      />
    </div>
  );
}
