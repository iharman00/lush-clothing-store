import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function Home() {
  return (
    <section className="container p-10 flex flex-col justify-end gap-6">
      {/* Content */}
      <div>
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold ">Elevate Your Style with Lush</h1>
          <p className="text-lg">
            Discover our latest collection of premium apparel designed for
            everyday elegance.
          </p>
        </div>
        {/* Call-to-action Buttons */}
        <div className="flex gap-8">
          {[
            { title: "Shop Women", href: "/women" },
            { title: "Shop Men", href: "/men" },
          ].map((element, index) => (
            <Link
              key={index}
              className={cn(
                buttonVariants({
                  variant: "secondary",
                }),
                ""
              )}
              href={element.href}
            >
              {element.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Background Image
        <div className="absolute inset-0 z-0 w-screen h-full">
          <Image
            src="/hero.webp"
            alt="Hero Background"
            layout="fill"
            objectFit="cover"
            className="w-full h-full"
          />
        </div> */}
    </section>
  );
}
