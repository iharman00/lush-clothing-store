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
import { ShoppingCart, Menu } from "lucide-react";
import { DesktopSearchInput, MobileSearchInput } from "./ui/search-input";
import AccountMenu from "./AccountMenu";
import LoginOrRegisterButton from "./LoginOrRegisterButton";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import { getCurrentClientSideUser } from "@/data_access/user";
import { sanityClient } from "@/sanity/lib/client";
import { NAVIGATION_DATA_QUERY } from "@/sanity/queries";

const Header = async () => {
  let user;
  try {
    user = await getCurrentClientSideUser();
  } catch (error) {
    // If there's an error, the user is not logged in
    // We do nothing
  }

  const navData = await sanityClient.fetch(NAVIGATION_DATA_QUERY);

  return (
    <nav className="container flex justify-between py-4 ">
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
              className="mr-4"
            />
          </Link>
        </div>
        <ul className="flex">
          {/* Mobile Search input*/}
          <li>
            <MobileSearchInput
              type="search"
              placeholder="Search"
              className="mr-2"
            />
          </li>
          {/* Mobile Account menu */}
          <li>
            {user && <AccountMenu user={user} userNameVisibility={false} />}
            {!user && <LoginOrRegisterButton textVisibily={false} />}
          </li>
          {/* Shopping Cart */}
          <li>
            <Button variant="ghost" className="gap-2">
              <ShoppingCart />
            </Button>
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
              className="mr-4"
            />
          </Link>
          <Separator orientation="vertical"></Separator>
          {/* Desktop Mega Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              {navData.map((category) => (
                <NavigationMenuItem key={category._id}>
                  <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="min-w-[50rem] w-max max-w-[80rem] px-12 py-10 flex gap-16">
                      {/* Category Image */}
                      {category.image && category.image.alt && (
                        <Image
                          src={urlFor(category.image?.asset).url()}
                          alt={category.image?.alt}
                          width={250}
                          height={250}
                          className="max-h-[22rem]"
                        />
                      )}
                      {/* Product links */}
                      <div className="flex flex-col gap-6">
                        <p className="text-3xl font-bold">{category.name}</p>
                        <div className="flex flex-wrap h-full gap-20">
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
                                {subCategory.productTypes.map((productType) => (
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
                                ))}
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
          {/* Desktop Search Input */}
          <DesktopSearchInput
            type="search"
            placeholder="Search"
            className="mr-2"
          />
          <Separator orientation="vertical" />
          <ul className="flex justify-self-end">
            <li>
              {/* Desktop Account menu */}
              {user && <AccountMenu user={user} />}
              {!user && <LoginOrRegisterButton />}
            </li>
            <li>
              {/* Shopping Cart */}
              <Button variant="ghost" className="gap-2">
                <ShoppingCart />
                Cart
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;