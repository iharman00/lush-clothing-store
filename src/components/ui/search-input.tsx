import * as React from "react";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const DesktopSearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-4 h-10 rounded-md border border-input bg-background px-3 py-5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
          className
        )}
      >
        <Search className="text-foreground" />
        <input
          type={type}
          className="flex w-full text-sm placeholder:text-muted-foreground focus-visible:outline-0  disabled:cursor-not-allowed disabled:opacity-50"
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
DesktopSearchInput.displayName = "DesktopSearchInput";

const MobileSearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className={cn("group flex items-center gap-4 h-10 ", className)}>
        <Search className="text-foreground" />
        <input
          type={type}
          className="hidden group-focus:flex w-full text-sm placeholder:text-muted-foreground focus-visible:outline-0  disabled:cursor-not-allowed disabled:opacity-50"
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
MobileSearchInput.displayName = "DesktopSearchInput";

export { DesktopSearchInput, MobileSearchInput };
