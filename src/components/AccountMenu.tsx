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
import { logout } from "@/auth/actions/logout";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User as UserType } from "@prisma/client";
import { User } from "lucide-react";

const AccountMenu = async ({ user }: { user: UserType }) => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={buttonVariants({
          variant: "ghost",
          className: "gap-2 capitalize",
        })}
      >
        <User />
        {user.firstName}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Orders</DropdownMenuItem>
        <DropdownMenuItem>Wishlist</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            const res = await logout();
            if (res?.success) {
              router.push("/");
              router.refresh();
              toast.success(res.message);
            }
            toast.error(res?.message);
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountMenu;
