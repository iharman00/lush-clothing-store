"use client";

import logout from "@/auth/actions/logout";
import { useToast } from "@/components/ui/use-toast";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

export interface LogoutButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const LogoutButton = (props: LogoutButtonProps) => {
  const { toast } = useToast();

  return (
    <Button
      {...props}
      onClick={async () => {
        const res = await logout();
        if (res?.success) {
          toast({
            description: res.message,
          });
          return;
        }
        toast({
          variant: "destructive",
          description: res?.message,
        });
      }}
    >
      Log out
    </Button>
  );
};

export default LogoutButton;
