import Link from "next/link";
import { Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { sanityClient } from "@/sanity/lib/client";
import { NAVIGATION_DATA_QUERY } from "@/sanity/queries";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const Footer = async () => {
  const navData = await sanityClient.fetch(NAVIGATION_DATA_QUERY);
  return (
    <footer className="bg-primary text-primary-foreground pt-12 pb-8">
      <div className="container flex flex-col gap-10">
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:justify-items-center ">
          {/* Company Information */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">About Us</h3>
            <p className="text-muted-foreground">
              We offer premium quality clothing with the latest trends. Shop
              with us for the best in fashion.
            </p>
            <p className="text-muted-foreground text-sm">
              <span className="underline">
                We are not a real company, this is a portfolio project.
              </span>
              <Link
                href="https://iharman.dev/#projects"
                target="_blank"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-muted-foreground text-sm p-0 h-auto ml-2"
                )}
              >
                Read more
              </Link>
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Shop</h3>
            <ul className="text-muted-foreground flex flex-col gap-3">
              {navData.map((navCategory) => (
                <li key={navCategory._id}>
                  {navCategory.slug?.current && (
                    <Link
                      href={navCategory.slug?.current}
                      className={cn(
                        buttonVariants({ variant: "link" }),
                        "text-muted-foreground text-base p-0 h-auto"
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
            <h3 className="text-xl font-semibold mb-4">Customer Service</h3>
            <ul className="text-muted-foreground flex flex-col gap-3">
              {[
                { name: "Shipping Info", slug: "shipping" },
                { name: "Returns and Refunds", slug: "returns-and-refunds" },
                { name: "Contact us", slug: "contact-us" },
                { name: "FAQS", slug: "faqs" },
              ].map((info, index) => (
                <li key={index}>
                  <Link
                    href={`help/${info.slug}`}
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "text-muted-foreground text-base p-0 h-auto"
                    )}
                  >
                    {info.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                className="text-gray-400 hover:text-white"
              >
                <Instagram size={24} />
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
                <Instagram size={24} />
              </Link>
            </div>
          </div>
        </div>
        <Separator className="bg-muted-foreground" />
        {/* Footer Bottom */}
        <p className="text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} Lush. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;