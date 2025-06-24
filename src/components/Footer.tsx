import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { fetchNavigationData } from "@/sanity/staticQueries";
import { NAVIGATION_DATA_QUERYResult } from "@/sanity/types";

const Footer = async () => {
  let navData: NAVIGATION_DATA_QUERYResult = [];

  try {
    navData = await fetchNavigationData();
  } catch (error) {}

  return (
    <footer className="bg-primary text-primary-foreground pt-12 pb-8">
      <div className="container flex flex-col gap-10">
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:justify-items-center ">
          {/* Company Information */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">About Us</h3>
            <p className="text-muted-foreground text-sm">
              We are not a real company, this is a portfolio project.
              <Link
                href="https://iharman.dev/"
                target="_blank"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-muted-foreground underline text-sm px-0 h-auto"
                )}
              >
                Visit my portfolio here.
              </Link>
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="text-muted-foreground flex flex-col gap-2">
              {navData.map((navCategory) => (
                <li key={navCategory._id}>
                  {navCategory.slug?.current && (
                    <Link
                      href={`/${navCategory.slug?.current}`}
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "text-muted-foreground text-sm p-0 h-auto"
                      )}
                    >
                      {navCategory.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="text-muted-foreground flex flex-col gap-2">
              {[
                { name: "Shipping Info", slug: "shipping" },
                { name: "Returns and Refunds", slug: "returns-and-refunds" },
                { name: "Contact us", slug: "contact-us" },
                { name: "FAQS", slug: "faqs" },
              ].map((info, index) => (
                <li key={index}>
                  <Button
                    variant={"link"}
                    className={"text-muted-foreground text-sm p-0 h-auto"}
                  >
                    {info.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                className="text-gray-400 hover:text-white"
              >
                <Facebook size={24} />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-gray-400 hover:text-white"
              >
                <Instagram size={24} />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-gray-400 hover:text-white"
              >
                <Twitter size={24} />
              </Link>
            </div>
          </div>
        </div>
        <Separator className="bg-muted-foreground" />
        {/* Footer Bottom */}
        <p className="text-muted-foreground text-center text-sm">
          &copy; {new Date().getFullYear()} Lush. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
