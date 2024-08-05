import Image from "next/image";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Menu, User } from "lucide-react";
import { DesktopSearchInput, MobileSearchInput } from "./ui/search-input";
import AccountMenu from "./AccountMenu";
import { getUser } from "@/data/user";

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

const Navbar = async () => {
  const { user } = await getUser();
  return (
    <header className="container">
      <nav className="flex justify-between py-4">
        {/* Mobile */}
        <div className="md:hidden w-full flex justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger className="justify-self-start md:hidden">
                <Menu />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="flex flex-col gap-2 items-start"
              >
                <Button variant="ghost">Men</Button>
                <Button variant="ghost">Women</Button>
                <Button variant="ghost">Kids</Button>
              </SheetContent>
            </Sheet>
            <Link href="/">
              <Image
                src="/lush_logo.svg"
                alt="lush logo"
                width={50}
                height={50}
              />
            </Link>
          </div>
          <div className="flex">
            <MobileSearchInput
              type="search"
              placeholder="Search"
              className="mr-2"
            />
            <Button variant="ghost">
              <ShoppingCart />
            </Button>
          </div>
          {/* Mobile Account menu */}
          {/* <ul className="flex">
            {user ? (
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={buttonVariants({
                      variant: "ghost",
                      className: "gap-2",
                    })}
                  >
                    <User />
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
                  className={buttonVariants({ variant: "ghost" })}
                >
                  <User />
                  Log In
                </Link>
              </li>
            )}
            <li>
              
            </li>
          </ul> */}
        </div>

        {/* Desktop */}
        <div className="hidden w-full md:flex justify-between">
          {/* Desktop Navigation menu */}
          <div className="flex items-center gap-2">
            {/* Brand logo */}
            <Link href="/">
              <Image
                src="/lush_logo.svg"
                alt="lush logo"
                width={50}
                height={50}
                className="mr-4"
              />
            </Link>
            <Separator orientation="vertical"></Separator>
            <NavigationMenu className="justify-self-start">
              <NavigationMenuList>
                {navigation.map((navItem) => (
                  <NavigationMenuItem key={navItem.title.id}>
                    <NavigationMenuTrigger>
                      {navItem.title.value}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="px-8 py-9">
                      <div className="flex w-max gap-4">
                        <Image
                          src={navItem.imageUrl}
                          alt="Mens poster"
                          width={300}
                          height={300}
                          className="shrink-0"
                        />
                        <Separator
                          orientation="vertical"
                          className="bg-red-900 "
                        />
                        <div>
                          <h2 className="text-3xl font-bold pl-2 mt-4">
                            {navItem.title.value}
                          </h2>
                          <ul className="grid grid-cols-3 gap-2 mt-4 ">
                            {navItem.content.map((navContent) => (
                              <li key={navContent.id}>
                                <NavigationMenuLink
                                  className={`${buttonVariants({
                                    variant: "ghost",
                                  })}`}
                                >
                                  <Link
                                    href={
                                      navItem.title.value.toLowerCase() +
                                      "/" +
                                      navContent.value.toLowerCase()
                                    }
                                  >
                                    {navContent.value}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex gap-2">
            <DesktopSearchInput
              type="search"
              placeholder="Search"
              className="mr-2"
            />
            <Separator orientation="vertical" />
            {/* Desktop Account menu */}
            <ul className="hidden md:flex justify-self-end">
              <li>
                {user ? (
                  <AccountMenu user={user} />
                ) : (
                  <Link
                    href="/login"
                    className={`${buttonVariants({ variant: "ghost" })} gap-2`}
                  >
                    <User />
                    Log In
                  </Link>
                )}
              </li>
              <li>
                <Button variant="ghost" className="gap-2">
                  <ShoppingCart />
                  Cart
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
