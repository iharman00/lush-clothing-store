import CategoriesCard from "@/components/CategoriesCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import { fetchRecentlyAddedProducts } from "@/sanity/staticQueries";
import { RECENTLY_ADDED_PRODUCTS_QUERYResult } from "@/sanity/types";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  let recentProducts: RECENTLY_ADDED_PRODUCTS_QUERYResult = [];

  try {
    recentProducts = await fetchRecentlyAddedProducts();
  } catch (error) {
    console.log(error);
  }

  return (
    <>
      <section className="relative">
        {/* Split Background Images */}
        <div className="grid grid-cols-2 md:grid-cols-4 h-full">
          <Image
            src="/hero-men.jpg"
            alt="Men Collection"
            width={2000}
            height={2000}
            className="object-cover w-full h-full"
          />
          <Image
            src="/hero-women.jpg"
            alt="Women Collection"
            width={2000}
            height={2000}
            className="object-cover w-full h-full"
          />
          <Image
            src="/hero3.jpg"
            alt="Men Collection"
            width={2000}
            height={2000}
            className="object-cover w-full h-full"
          />
          <Image
            src="/hero4.jpg"
            alt="Women Collection"
            width={2000}
            height={2000}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center text-primary-foreground px-6">
          <div className="text-center max-w-2xl space-y-6">
            <h1 className="text-5xl xl:text-7xl font-light tracking-wide uppercase">
              Modern Essentials
            </h1>
            <p className="text-lg font-light text-primary-foreground">
              Discover our latest collection for men and women.
            </p>
            <div className="mt-12 flex gap-6 justify-center">
              <Link
                href="/men"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "uppercase px-6 tracking-wider bg-transparent text-primary-foreground"
                )}
              >
                Shop Men
              </Link>
              <Link
                href="/women"
                className={cn(
                  buttonVariants({ variant: "link" }),
                  "uppercase px-6 tracking-wider bg-transparent text-primary-foreground"
                )}
              >
                Shop Women
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="my-16">
        <h1 className="text-3xl xl:text-5xl ml-4 font-normal tracking-wide uppercase">
          Recently Added
        </h1>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-8">
          {recentProducts.length > 0 &&
            recentProducts.map((product) => {
              if (
                product.name &&
                product.variants &&
                product.variants[0].images &&
                product.variants[0].images[0] &&
                product.variants[0].images[0].alt
              )
                return (
                  <Link
                    key={product._id}
                    href={
                      product.productType?.subCategory?.category?.slug
                        ?.current +
                      "/" +
                      product.productType?.slug?.current +
                      "/" +
                      product.slug?.current
                    }
                  >
                    <CategoriesCard
                      image={{
                        url: urlFor(product.variants[0].images[0]).toString(),
                        alt: product.variants[0].images[0].alt,
                      }}
                      title={product.name}
                      className="w-full lg:w-full h-full aspect-[3/4] rounded-none text-[0] md:text-base xl:text-lg"
                    />
                  </Link>
                );
            })}
        </div>
      </section>
    </>
  );
}
