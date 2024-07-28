import Image from "next/image";
import Link from "next/link";

import { Button, buttonVariants } from "./ui/button";
import { User } from "lucide-react";
import { link } from "fs";

const navLinks = ["Men", "Women", "Kids"];

const Navbar = () => {
  return (
    <header className="container">
      <nav className="grid grid-cols-3 justify-items-center items-center py-4">
        <ul className="flex justify-self-start">
          {navLinks.map((navLink) => (
            <li key={navLink}>
              <Button variant="link">{navLink}</Button>
            </li>
          ))}
        </ul>
        <Link href="/">
          <Image src="/lush_logo.svg" alt="lush logo" width={50} height={50} />
        </Link>
        <ul className="flex justify-self-end">
          <li>
            <Link
              href="/login"
              className={`${buttonVariants({ variant: "link" })} gap-2`}
            >
              <User />
              Log In
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
