import Image from "next/image";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Menu, User } from "lucide-react";
import AccountMenu from "./AccountMenu";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { getCurrentClientSideUser } from "@/data_access/user";
import { fetchNavigationData } from "@/sanity/staticQueries";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { NAVIGATION_DATA_QUERYResult } from "@/sanity/types";
import Cart from "./Cart";

const Header = async () => {
  let user;
  try {
    user = await getCurrentClientSideUser();
  } catch (error) {
    // If there's an error, the user is not logged in
    // We do nothing
  }

  let navData: NAVIGATION_DATA_QUERYResult = [];

  try {
    navData = await fetchNavigationData();
  } catch (error) {}

  return (
    <nav className="container flex justify-between py-4 border-b-2">
      {/* Mobile */}
      <div className="lg:hidden w-full flex justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Mega Menu/Accordion */}
          <Sheet>
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-[60vw]">
              <Accordion type="single" collapsible className="w-full mt-10">
                {navData.map((category) => (
                  <AccordionItem
                    key={category._id}
                    value={category._id}
                    className="border-b-0"
                  >
                    <AccordionTrigger className="text-xl uppercase font-bold">
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <Accordion
                        type="single"
                        collapsible
                        className="mt-[-0.5rem] ml-4"
                      >
                        {category.subCategories.map((subCategory) => (
                          <AccordionItem
                            key={subCategory._id}
                            value={subCategory._id}
                            className="border-b-0"
                          >
                            <AccordionTrigger className="uppercase">
                              {subCategory.name}
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 ml-4">
                              {subCategory.productTypes.map((productType) => (
                                <Link
                                  key={productType._id}
                                  href={`${category.slug?.current}/${productType.slug?.current}`}
                                >
                                  {productType.name}
                                </Link>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </SheetContent>
          </Sheet>
          {/* Brand logo */}
          <Link href="/">
            <Image
              src="/lush_logo.svg"
              alt="lush logo"
              width={50}
              height={50}
              className="h-full mr-4"
            />
          </Link>
        </div>
        <ul className="flex">
          {/* Mobile Account menu */}
          <li>
            {user && <AccountMenu user={user} userNameVisibility={false} />}
            {!user && (
              <Link
                href="/login"
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "gap-2"
                )}
              >
                Log In
              </Link>
            )}
          </li>
          {/* Shopping Cart */}
          <li>
            <Cart />
          </li>
        </ul>
      </div>

      {/* Desktop */}
      <div className="hidden w-full lg:flex justify-between">
        {/* Desktop Navigation menu */}
        <div className="flex items-center gap-2">
          {/* Brand logo */}
          <Link href="/">
            <Image
              src="/lush_logo.svg"
              alt="lush logo"
              width={50}
              height={50}
              className="h-full mr-4"
            />
          </Link>
          <Separator orientation="vertical"></Separator>
          {/* Desktop Mega Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              {navData.map((category) => (
                <NavigationMenuItem key={category._id}>
                  <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-background">
                    <div className="w-[60rem] px-10 py-8 grid grid-cols-3 gap-16">
                      {/* Category Image */}
                      {category.image && category.image.alt && (
                        <Image
                          src={urlFor(category.image?.asset).url()}
                          alt={category.image?.alt}
                          width={1000}
                          height={1000}
                          className="w-full h-full"
                        />
                      )}
                      <div className="flex flex-col gap-6 col-span-2">
                        <p className="text-3xl font-bold">{category.name}</p>
                        <ScrollArea className="h-full">
                          <div className="flex h-full gap-20">
                            {category.subCategories.map((subCategory) => (
                              <div
                                key={subCategory._id}
                                className="flex flex-col flex-wrap gap-2"
                              >
                                {/* Sub Category */}
                                <p className="uppercase font-bold">
                                  {subCategory.name}
                                </p>
                                {/* Products */}

                                <ul className="flex flex-col gap-2">
                                  {subCategory.productTypes.map(
                                    (productType) => (
                                      <li
                                        key={productType.name}
                                        className={cn(
                                          buttonVariants({
                                            variant: "link",
                                          }),
                                          "font-light p-0 cursor-pointer justify-start mb-[-1rem]"
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
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex gap-2">
          <ul className="flex justify-self-end">
            <li>
              {/* Desktop Account menu */}
              {user && <AccountMenu user={user} />}
              {!user && (
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                    }),
                    "gap-2"
                  )}
                >
                  <User />
                  Log In
                </Link>
              )}
            </li>
            <li>
              {/* Shopping Cart */}
              <Cart />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
