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
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Menu } from "lucide-react";
import { DesktopSearchInput, MobileSearchInput } from "./ui/search-input";
import AccountMenu from "./AccountMenu";
import { getCurrentClientSideUser } from "@/data_access/user";
import LoginOrRegisterButton from "./LoginOrRegisterButton";
import { sanityClient } from "@/sanity/lib/client";
import { NAVIGATION_DATA_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

const Navbar = async () => {
  let user;
  try {
    user = await getCurrentClientSideUser();
  } catch (error) {
    // If there's an error, the user is not logged in
    // We do nothing
  }

  const navData = await sanityClient.fetch(NAVIGATION_DATA_QUERY);

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
                {navData.map((category) => (
                  <NavigationMenuItem key={category._id}>
                    <NavigationMenuTrigger>
                      {category.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-max px-14 py-12 flex gap-16">
                        {category.image && category.image.alt && (
                          <Image
                            src={urlFor(category.image?.asset).url()}
                            alt={category.image?.alt}
                            width={250}
                            height={250}
                          />
                        )}
                        <div className="flex flex-col gap-6">
                          <p className="text-3xl font-bold">{category.name}</p>
                          <div className="flex gap-20">
                            {category.subCategories.map((subCategory) => (
                              <div
                                key={subCategory._id}
                                className="flex flex-col flex-wrap"
                              >
                                <p className="uppercase font-bold text-sm">
                                  {subCategory.name}
                                </p>
                                <ul className="flex flex-col">
                                  {subCategory.productTypes.map(
                                    (productType) => (
                                      <li
                                        key={productType.name}
                                        className={cn(
                                          buttonVariants({
                                            variant: "link",
                                          }),
                                          "text-xs font-light p-0 cursor-pointer justify-start mb-[-1rem]"
                                        )}
                                      >
                                        <NavigationMenuLink
                                          href={`${category.slug?.current}/${productType.slug?.current}`}
                                        >
                                          {productType.name}
                                        </NavigationMenuLink>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            ))}
                          </div>
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
                {user && <AccountMenu user={user} />}
                {!user && <LoginOrRegisterButton />}
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
