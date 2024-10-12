import ProductCard, { ProductCardProps } from "@/components/ProductCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import {
  fetchCategories,
  fetchProducts,
  fetchProductTypes,
} from "@/sanity/queries";
import Link from "next/link";

const page = async ({
  params,
}: {
  params: { category: string; productType: string };
}) => {
  const [category] = await fetchCategories({
    categorySlug: params.category,
  });
  const [productType] = await fetchProductTypes({
    productTypeSlug: params.productType,
  });
  const products = await fetchProducts({
    parentCategorySlug: params.category.toLowerCase(),
    parentProductTypeSlug: params.productType.toLowerCase(),
  });

  if (!category || !productType)
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
    <section className="container my-5 lg:my-20 px-0">
      <h1 className="text-4xl font-bold px-[1rem] md:px-[2rem]">{`${category.name}'s ${productType.name}`}</h1>
      <div className="mt-10">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-[repeat(auto-fill,1fr)] gap-x-2 gap-y-8 md:gap-y-16 mt-10">
            {products.length > 0 ? (
              products.map((product) => {
                if (
                  product.colorVariants[0].sizeAndStock[0].stock &&
                  product.colorVariants[0].sizeAndStock[0].stock > 0 &&
                  product.colorVariants[0].images &&
                  product.colorVariants[0].images[0].alt &&
                  product.name &&
                  product.price
                ) {
                  let productImages: ProductCardProps["images"] = [];
                  product.colorVariants.map((cv) => {
                    if (cv.images)
                      cv.images.map((image) => {
                        if (image.alt) {
                          productImages.push({
                            _id: image._key,
                            url: urlFor(image).url(),
                            alt: image.alt,
                          });
                        }
                      });
                  });
                  return (
                    <>
                      <ProductCard
                        key={product._id}
                        _id={product._id}
                        name={product.name}
                        price={product.price}
                        images={productImages}
                        url={`/${category.slug?.current}/${productType.slug?.current}/${product.slug?.current}`}
                      />
                      <ProductCard
                        key={product._id}
                        _id={product._id}
                        name={product.name}
                        price={product.price}
                        images={productImages}
                        url={`/${category.slug?.current}/${productType.slug?.current}/${product.slug?.current}`}
                      />
                      <ProductCard
                        key={product._id}
                        _id={product._id}
                        name={product.name}
                        price={product.price}
                        images={productImages}
                        url={`/${category.slug?.current}/${productType.slug?.current}/${product.slug?.current}`}
                      />
                      <ProductCard
                        key={product._id}
                        _id={product._id}
                        name={product.name}
                        price={product.price}
                        images={productImages}
                        url={`/${category.slug?.current}/${productType.slug?.current}/${product.slug?.current}`}
                      />
                      <ProductCard
                        key={product._id}
                        _id={product._id}
                        name={product.name}
                        price={product.price}
                        images={productImages}
                        url={`/${category.slug?.current}/${productType.slug?.current}/${product.slug?.current}`}
                      />
                      <ProductCard
                        key={product._id}
                        _id={product._id}
                        name={product.name}
                        price={product.price}
                        images={productImages}
                        url={`/${category.slug?.current}/${productType.slug?.current}/${product.slug?.current}`}
                      />
                      <ProductCard
                        key={product._id}
                        _id={product._id}
                        name={product.name}
                        price={product.price}
                        images={productImages}
                        url={`/${category.slug?.current}/${productType.slug?.current}/${product.slug?.current}`}
                      />
                    </>
                  );
                }
              })
            ) : (
              <p className="mt-4">No products to show.</p>
            )}
          </div>
        ) : (
          <div className="mt-8">
            <p className="mt-2 text-sm md:text-base">
              Sorry, there are no products to show here.
            </p>
            <Link href="/" className={cn(buttonVariants(), "mt-4")}>
              Go Back
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default page;
