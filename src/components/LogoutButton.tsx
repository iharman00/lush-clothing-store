"use client";

import logout from "@/auth/actions/logout";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const LogoutButton = async () => {
  const router = useRouter();
  const { toast } = useToast();

  return (
    <Button
      onClick={async () => {
        const res = await logout();
        if (res?.success) {
          router.refresh();
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
