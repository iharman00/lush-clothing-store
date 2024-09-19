"use client";

import { usePathname } from "next/navigation";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { User } from "lucide-react";

const LoginOrRegisterButton = ({
  textVisibily = true,
}: {
  textVisibily?: boolean;
}) => {
  const pathname = usePathname();
  return (
    <Link
      href={pathname === "/login" ? "/register" : "login"}
      className={`${buttonVariants({
        variant: "ghost",
      })} gap-2`}
    >
      <User />
      {textVisibily && (pathname === "/login" ? "Register" : "Log In")}
    </Link>
  );
};

export default LoginOrRegisterButton;
