import fetchProductData, {
  fetchProductDataReturnType,
} from "@/sanity/dynamicQueries/fetchProductData";
import ProductDetails from "@/components/ProductDetails";
import { notFound } from "next/navigation";

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

  if (!product) notFound();

  return (
    <div className="container lg:h-[70vh] flex flex-col lg:grid grid-cols-2 xl:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)] gap-16 lg:gap-4 mb-12 md:mt-20 md:mb-32 justify-items-center items-center px-0 md:px-4">
      <ProductDetails product={product} />
    </div>
  );
};

export default page;
