"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import fetchProductData, {
  fetchProductDataReturnType,
} from "@/sanity/dynamicQueries/fetchProductData";
import { Heart } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import {
  Bullet,
  BulletListItem,
  H1,
  H2,
  H3,
  Normal,
  Number,
} from "@/components/FrontEndPortableTextComponents";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useShoppingCart } from "@/context/ShoppingCartContext";

// Custom components for Portable Text
export const customPortableTextComponents: Partial<PortableTextReactComponents> =
  {
    block: {
      h1: H1,
      h2: H2,
      h3: H3,
      normal: Normal,
    },
    list: {
      bullet: Bullet,
      number: Number,
    },
    listItem: {
      bullet: BulletListItem,
    },
  };

const page = async ({
  params,
}: {
  params: { category: string; product: string };
}) => {
  const { addItem } = useShoppingCart();

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
      {/* Product Images */}
      <Carousel className="md:mx-16">
        <CarouselContent>
          {product.variants.map((cv) => {
            if (cv.images)
              return cv.images.map((i) => {
                if (i.alt)
                  return (
                    <CarouselItem className="xl:basis-1/2">
                      <Image
                        src={urlFor(i).url()}
                        alt={i.alt}
                        width={3000}
                        height={3000}
                      />
                    </CarouselItem>
                  );
              });
          })}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
        {/* Mobile Buttons */}
        <div className="md:hidden flex absolute w-full h-full top-0 justify-between items-center p-4">
          <CarouselPrevious className="static" />
          <CarouselNext className="static" />
        </div>
      </Carousel>

      {/* Product Details */}
      <ScrollArea className="w-full h-full lg:max-w-lg px-4 md:px-12 lg:pl-0 lg:pr-10 ">
        <div className="flex flex-col h-full justify-center">
          <div className="flex flex-col gap-10">
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl">{product.name}</h1>
                {product.price && <p>{formatPrice(product.price)}</p>}
              </div>
              <Heart />
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <p className="text-base font-medium">Color</p>
                <div className="flex gap-4 flex-wrap">
                  {product.variants.map((cv) => (
                    <Button
                      key={cv.color._id}
                      variant={"outline"}
                      className="size-7 p-0 rounded-full"
                      style={{
                        backgroundColor: cv.color.color?.hex,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-base font-medium">Size</p>
                <div className="grid grid-cols-5 gap-4">
                  {product.variants.map((cv) =>
                    cv.sizeAndStock.map((ss) => {
                      return (
                        <Button
                          key={ss.size._id}
                          variant="outline"
                          // Disabled if stock is 0
                          disabled={!(ss.stock && ss.stock > 0)}
                          className="h-full py-4"
                          style={{ textDecoration: "" }}
                        >
                          {ss.size.name}
                        </Button>
                      );
                    })
                  )}
                </div>
              </div>
              <Button>Add to Cart</Button>
            </div>
            <Accordion type="single" collapsible>
              {product.description && (
                <AccordionItem value="description" className="border-b-0">
                  <AccordionTrigger className="text-base">
                    Description
                  </AccordionTrigger>
                  <AccordionContent className="ml-1">
                    <PortableText
                      value={product.description}
                      components={customPortableTextComponents}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}
              {product.materials && (
                <AccordionItem value="materials" className="border-b-0">
                  <AccordionTrigger className="text-base">
                    Materials
                  </AccordionTrigger>
                  <AccordionContent className="ml-1">
                    <PortableText
                      value={product.materials}
                      components={customPortableTextComponents}
                    />
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default page;
