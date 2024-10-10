import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <section className="relative grid grid-cols-2">
      {/* Background Image */}
      <Image
        src="/hero-men.jpg"
        alt="Hero Background"
        width={2000}
        height={2000}
        className="w-full h-full"
      />
      <Image
        src="/hero-women.jpg"
        alt="Hero Background"
        width={2000}
        height={2000}
        className="w-full h-full"
      />

      {/* Content */}
      <div className="absolute top-0 w-full h-full grid grid-rows-12 grid-cols-12 text-primary-foreground">
        <div className="flex flex-col gap-10 row-start-4 col-start-4 col-span-6 2xl:col-start-5 2xl:col-span-4 text-center">
          <h1 className="text-5xl xl:text-7xl font-medium">
            Elevate your style.
          </h1>
          <div className="flex justify-around">
            {[
              { title: "Men", slug: "men" },
              { title: "Women", slug: "women" },
            ].map((category, index) => (
              <Link
                key={index}
                href={`/${category.slug}`}
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "text-primary-foreground text-lg font-normal"
                )}
              >
                Shop {category.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
