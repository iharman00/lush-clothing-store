import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLOrSVGElement> {}

const LoadingSpinner = ({
  children,
  className,
  ...props
}: LoadingSpinnerProps) => {
  return (
    <Loader2 className={cn("ml-2 h-4 w-4 animate-spin", className)} {...props}>
      {children}
    </Loader2>
  );
};

export default LoadingSpinner;
