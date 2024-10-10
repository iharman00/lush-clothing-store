import { fetchCategoryPageData } from "@/sanity/queries";
import { Categories, ProductTypes, SubCategories } from "@/sanity/types";
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

type fetchCategoryPageDataType = {
  _id: Categories["_id"];
  name: Categories["name"];
  slug: Categories["slug"];
  image: Categories["image"];
  subCategories: {
    _id: SubCategories["_id"];
    name: SubCategories["name"];
    slug: SubCategories["slug"];
    productTypes: Pick<ProductTypes, "_id" | "name" | "slug" | "image">[];
  }[];
}[];

const Page = async ({ params }: { params: { category: string } }) => {
  const [category]: fetchCategoryPageDataType = await fetchCategoryPageData(
    params.category.toLowerCase()
  );

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
      <section className="container mt-10 mb-20">
        <h1 className="text-4xl font-bold">{category?.name}</h1>
        <div className="flex flex-col gap-16 mt-10">
          {category.subCategories.map((subCategory) => (
            <div key={subCategory._id}>
              <h2 className="text-2xl font-bold">{subCategory.name}</h2>
              <Carousel opts={{ dragFree: true }} className="relative mt-6">
                <CarouselContent>
                  {subCategory.productTypes.map((productType) => (
                    <CarouselItem
                      key={productType._id}
                      className="pl-4 basis-1/8"
                    >
                      <Link
                        href={`/${category.slug?.current}/${subCategory.slug?.current}/${productType.slug?.current}`}
                      >
                        <CategoriesCard
                          title={productType.name}
                          image={productType.image}
                        />
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute -top-10 right-14">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </Carousel>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Page;
