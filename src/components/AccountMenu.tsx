"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "./ui/button";
import logout from "@/auth/actions/logout";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { UserDTO } from "@/data_access/user/userDTO";
import { User } from "lucide-react";
import Link from "next/link";

const AccountMenu = ({
  user,
  userNameVisibility = true,
}: {
  user: Omit<UserDTO, "password">;
  userNameVisibility?: boolean;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={buttonVariants({
          variant: "ghost",
          className: "gap-2 capitalize",
        })}
      >
        <User />
        {userNameVisibility && user.firstName}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/orders">Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Wishlist</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            const res = await logout();
            if (res?.success) {
              router.push("/");
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
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountMenu;
