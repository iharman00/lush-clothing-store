import {
  fetchCategories,
  fetchSubCategoriesAndProductTypes,
} from "@/sanity/queries";
import Link from "next/link";
import CategoriesCard from "@/components/CategoriesCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";

const Page = async ({ params }: { params: { category: string } }) => {
  const [category] = await fetchCategories({
    categorySlug: params.category.toLowerCase(),
  });
  const subCategories = await fetchSubCategoriesAndProductTypes({
    parentCategorySlug: params.category.toLowerCase(),
  });

  if (!category)
    return (
      <section className="container text-center flex flex-col justify-center items-center gap-2 my-20">
        <h1 className="text-4xl md:text-5xl font-bold">Page not found.</h1>
        <p className="mt-2 text-sm md:text-base">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className={cn(buttonVariants(), "mt-4 w-fit")}>
          Go Back Home
        </Link>
      </section>
    );

  return (
    <>
      <section className="container my-5 lg:my-20">
        <h1 className="text-4xl font-bold">{category.name}</h1>
        {subCategories.length > 0 ? (
          <div className="flex flex-col gap-16 mt-10">
            {subCategories.map((subCategory) => (
              <div key={subCategory._id}>
                <h2 className="text-2xl font-bold">{subCategory.name}</h2>
                {subCategory.productTypes.length > 0 ? (
                  <Carousel opts={{ dragFree: true }} className="relative mt-6">
                    <CarouselContent>
                      {subCategory.productTypes.map((productType) => (
                        <CarouselItem
                          key={productType._id}
                          className="pl-4 basis-1/8"
                        >
                          <Link
                            href={`/${category.slug?.current}/${productType.slug?.current}`}
                          >
                            {productType.name &&
                              productType.image &&
                              productType.image.alt && (
                                <CategoriesCard
                                  title={productType.name}
                                  image={{
                                    url: urlFor(productType.image).url(),
                                    alt: productType.image?.alt,
                                  }}
                                />
                              )}
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="absolute -top-10 right-14">
                      <CarouselPrevious />
                      <CarouselNext />
                    </div>
                  </Carousel>
                ) : (
                  <p className="mt-4">No products to show.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <p className="mt-2 text-sm md:text-base">
              Sorry, there is nothing to show here.
            </p>
            <Link href="/" className={cn(buttonVariants(), "mt-4")}>
              Go Back Home
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Page;
