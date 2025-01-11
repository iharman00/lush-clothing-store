"use client";

import { cn, formatPrice } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { customPortableTextComponents } from "@/components/FrontEndPortableTextComponents";
import { PortableText } from "next-sanity";
import { fetchProductDataReturnType } from "@/sanity/dynamicQueries/fetchProductData";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";

interface ProductDetails {
  product: fetchProductDataReturnType[number];
}

type ColorVariant = ProductDetails["product"]["variants"][number];
type Size = ColorVariant["sizeAndStock"][number]["size"];

const ProductDetails = ({ product }: ProductDetails) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  // Set initial product to be the first color variant in the array
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant>(
    product.variants[0]
  );

  // Set initial size to be the first variant in the array
  const [selectedSize, setSelectedSize] = useState<Size>(
    selectedVariant.sizeAndStock[0].size
  );

  return (
    <>
      {/* Variant Images */}
      <Carousel className="md:mx-16">
        <CarouselContent>
          {selectedVariant.images &&
            selectedVariant.images.map((i) => {
              if (i.alt)
                return (
                  <CarouselItem
                    key={selectedVariant._id}
                    className="xl:basis-1/2"
                  >
                    <Image
                      src={urlFor(i).url()}
                      alt={i.alt}
                      width={3000}
                      height={3000}
                    />
                  </CarouselItem>
                );
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

      {/* Product Details  */}
      <ScrollArea className="w-full h-full lg:max-w-lg px-4 md:px-12 lg:pl-0 lg:pr-10 ">
        <div className="flex flex-col h-full justify-center">
          <div className="flex flex-col gap-10 px-1">
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl">{product.name}</h1>
                {product.price && <p>{formatPrice(product.price)}</p>}
              </div>
              <Heart />
            </div>
            <div className="flex flex-col gap-8">
              {/* Product Colors */}
              <div className="flex flex-col gap-4">
                <p className="text-base font-medium">Color</p>
                <div className="flex gap-4 flex-wrap">
                  {product.variants.map((variant) => (
                    <Button
                      key={variant.color._id}
                      size={"icon"}
                      className={cn(
                        "rounded-full",
                        variant === selectedVariant &&
                          "ring-ring ring-2 ring-offset-2 ring-offset-background "
                      )}
                      style={{
                        backgroundColor: variant.color.color?.hex,
                      }}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setSelectedSize(variant.sizeAndStock[0].size);
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Variant Sizes */}
              <div className="flex flex-col gap-4">
                <p className="text-base font-medium">Size</p>
                <div className="grid grid-cols-5 gap-4">
                  {selectedVariant.sizeAndStock.map((variant) => {
                    return (
                      <Button
                        key={variant.size._id}
                        // Disabled if stock is 0
                        disabled={!(variant.stock && variant.stock > 0)}
                        variant={"outline"}
                        size={"lg"}
                        className={
                          selectedSize._id === variant.size._id
                            ? "ring-ring ring-2 ring-offset-background"
                            : ""
                        }
                        onClick={() => setSelectedSize(variant.size)}
                      >
                        {variant.size.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                addItem({
                  variantId: selectedVariant._id,
                  variantSizeId: selectedSize._id,
                  quantity: 1,
                });
                toast({
                  description: `${product.name} has been added to the cart`,
                });
              }}
            >
              Add to Cart
            </Button>
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
    </>
  );
};

export default ProductDetails;
