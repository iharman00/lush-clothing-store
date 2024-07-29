"use client";

import Image from "next/image";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { User, ShoppingCart, Heart } from "lucide-react";

const navigation = [
  {
    title: { id: 1, value: "Men" },
    content: [
      { id: 1, value: "Hoodies" },
      { id: 2, value: "Top" },
      { id: 3, value: "Pants" },
      { id: 4, value: "Jeans" },
      { id: 5, value: "Polos" },
      { id: 6, value: "Sweaters" },
      { id: 7, value: "Jackets" },
      { id: 8, value: "Shorts" },
      { id: 9, value: "Swimwears" },
      { id: 10, value: "Underwears" },
    ],
    imageUrl: "/nav-men-poster.webp",
  },
  {
    title: { id: 2, value: "Women" },
    content: [
      { id: 1, value: "Hoodies" },
      { id: 2, value: "Top" },
      { id: 3, value: "Pants" },
      { id: 4, value: "Jeans" },
      { id: 5, value: "Polos" },
      { id: 6, value: "Sweaters" },
      { id: 7, value: "Jackets" },
      { id: 8, value: "Shorts" },
      { id: 9, value: "Swimwears" },
      { id: 10, value: "Underwears" },
    ],
    imageUrl: "/nav-women-poster.webp",
  },
  {
    title: { id: 3, value: "Kids" },
    content: [
      { id: 1, value: "Hoodies" },
      { id: 2, value: "Top" },
      { id: 3, value: "Pants" },
      { id: 4, value: "Jeans" },
      { id: 5, value: "Polos" },
      { id: 6, value: "Sweaters" },
      { id: 7, value: "Jackets" },
      { id: 8, value: "Shorts" },
      { id: 9, value: "Swimwears" },
      { id: 10, value: "Underwears" },
    ],
    imageUrl: "/nav-kids-poster.webp",
  },
];

const user = {
  name: "Jay",
};

const Navbar = () => {
  return (
    <header className="container">
      <nav className="grid grid-cols-3 justify-items-center items-center py-4">
        <NavigationMenu>
          <NavigationMenuList>
            {navigation.map((navItem) => (
              <NavigationMenuItem key={navItem.title.id}>
                <NavigationMenuTrigger>
                  {navItem.title.value}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex w-max ">
                    <Image
                      src={navItem.imageUrl}
                      alt="Mens poster"
                      width={300}
                      height={300}
                      className="shrink-0"
                    />
                    <Separator orientation="vertical" />
                    <ul className="grid w-max h-min grid-cols-3 place-items-start gap-1 shrink-0 px-5 py-8">
                      <h2 className="col-span-3 text-3xl font-bold pl-4 mb-4 ">
                        {navItem.title.value}
                      </h2>
                      {navItem.content.map((navContent) => (
                        <li key={navContent.id}>
                          <Link
                            href={
                              navItem.title.value.toLowerCase() +
                              "/" +
                              navContent.value.toLowerCase()
                            }
                            legacyBehavior
                            passHref
                          >
                            <NavigationMenuLink
                              className={`${navigationMenuTriggerStyle()}`}
                            >
                              {navContent.value}
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* <ul className="flex justify-self-start">
          {navLinks.map((navLink) => (
            <li key={navLink}>
              <Button variant="link">{navLink}</Button>
            </li>
          ))}
        </ul> */}
        <Link href="/">
          <Image src="/lush_logo.svg" alt="lush logo" width={50} height={50} />
        </Link>
        <ul className="flex justify-self-end">
          {user ? (
            <li className={` gap-2`}>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={buttonVariants({
                    variant: "link",
                    className: "gap-2",
                  })}
                >
                  <User />
                  {user.name}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Orders</DropdownMenuItem>
                  <DropdownMenuItem>Wishlist</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ) : (
            <li>
              <Link
                href="/login"
                className={`${buttonVariants({ variant: "link" })} gap-2`}
              >
                <User />
                Log In
              </Link>
            </li>
          )}
          {user && (
            <li>
              <Button variant="link" className="gap-2">
                <Heart />
                Wishlist
              </Button>
            </li>
          )}
          <li>
            <Button variant="link" className="gap-2">
              <ShoppingCart />
              Cart
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
