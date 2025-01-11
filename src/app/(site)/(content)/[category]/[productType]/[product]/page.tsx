import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import fetchProductData, {
  fetchProductDataReturnType,
} from "@/sanity/dynamicQueries/fetchProductData";
import Link from "next/link";
import ProductDetails from "@/components/ProductDetails";

const page = async ({
  params,
}: {
  params: { category: string; product: string };
}) => {
  let products: fetchProductDataReturnType = [];
  try {
    products = await fetchProductData({
      categorySlug: params.category,
      productSlug: params.product,
    });
  } catch (error) {
    console.log(error);
  }

  const [product] = products;

  // Return early if category or productType doesn't exist
  if (!product)
    return (
      <section className="container text-center flex flex-col justify-center items-center gap-2 my-20">
        <h1 className="text-4xl md:text-5xl font-bold">Page not found.</h1>
        <p className="mt-2 text-sm md:text-base">
          Sorry, the product you are looking for does not exist.
        </p>
        <Link href="/" className={cn(buttonVariants(), "mt-4 w-fit")}>
          Go Back Home
        </Link>
      </section>
    );

  return (
    <div className="container lg:h-[70vh] flex flex-col lg:grid grid-cols-2 xl:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)] gap-16 lg:gap-4 mb-12 md:mt-20 md:mb-32 justify-items-center items-center px-0 md:px-4">
      <ProductDetails product={product} />
    </div>
  );
};

export default page;
