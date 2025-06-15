"use client";

import { cn, formatPrice } from "@/lib/utils";
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
import { useForm } from "react-hook-form";
import { useWishlist } from "@/hooks/use-wishlist";
import { Heart } from "lucide-react";

interface ProductDetails {
  product: fetchProductDataReturnType[number];
}

const ProductDetails = ({ product }: ProductDetails) => {
  const addCartItem = useCart((state) => state.addItem);
  const addWishlistItem = useWishlist((state) => state.addItem);
  const removeWishlistItem = useWishlist((state) => state.removeItem);
  const wishlistItems = useWishlist((state) => state.items);
  const { toast } = useToast();

  // React Hook Form setup
  const { handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      variantId: product.variants[0]._key,
      variantSizeId: product.variants[0].sizeAndStock[0].size._id,
    },
  });

  // Watch for changes in selected variant and size
  const selectedVariantId = watch("variantId");
  const selectedVariantSizeId = watch("variantSizeId");

  const handleAddToCart = (data: {
    variantId: string;
    variantSizeId: string;
  }) => {
    const selectedVariant = product.variants.find(
      (variant) => variant._key === data.variantId
    );
    const selectedSize = selectedVariant?.sizeAndStock.find(
      (sizeStock) => sizeStock.size._id === data.variantSizeId
    );

    if (selectedSize && selectedSize.stock! > 0) {
      addCartItem({
        productId: product._id,
        variantId: data.variantId,
        variantSizeId: data.variantSizeId,
        name: product.name!,
        color: selectedVariant?.color.name!,
        image: {
          _id: selectedVariant?.images![0]._key!,
          url: urlFor(selectedVariant?.images![0]!).url(),
          alt: selectedVariant?.images![0].alt!,
        },
        price: product.price!,
        size: selectedSize?.size.name!,
        url: `/${product.productType.subCategory.category.slug.current}/${product.productType.slug.current}/${product.slug?.current}`,
      });
      toast({
        description: `${product.name} has been added to the cart`,
      });
    } else {
      toast({
        variant: "destructive",
        description: "This size is out of stock.",
      });
    }
  };

  return (
    <>
      {/* Variant Images */}
      <Carousel className="md:mx-16">
        <CarouselContent>
          {product.variants
            .find((variant) => variant._key === selectedVariantId)
            ?.images?.map((i) => {
              if (i.alt)
                return (
                  <CarouselItem
                    key={selectedVariantId}
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
            <div className="flex justify-between ">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl">{product.name}</h1>
                {product.price && <p>{formatPrice(product.price)}</p>}
              </div>
              <Button
                variant={"ghost"}
                size="icon"
                className={cn(
                  "rounded-full",
                  `${product._id}-${selectedVariantId}-${selectedVariantSizeId}` in
                    wishlistItems && "text-white bg-red-400"
                )}
                onClick={() => {
                  try {
                    const key = `${product._id}-${selectedVariantId}-${selectedVariantSizeId}`;
                    if (key in wishlistItems) {
                      removeWishlistItem({
                        productId: product._id,
                        variantId: selectedVariantId,
                        variantSizeId: selectedVariantSizeId,
                      });
                      toast({
                        description: `${product.name} has been removed from your wishlist`,
                      });
                      return;
                    }

                    const data = watch();
                    const selectedVariant = product.variants.find(
                      (variant) => variant._key === data.variantId
                    );
                    const selectedSize = selectedVariant?.sizeAndStock.find(
                      (sizeStock) => sizeStock.size._id === data.variantSizeId
                    );

                    addWishlistItem({
                      productId: product._id,
                      variantId: data.variantId,
                      variantSizeId: data.variantSizeId,
                      name: product.name!,
                      color: selectedVariant?.color.name!,
                      image: {
                        _id: selectedVariant?.images![0]._key!,
                        url: urlFor(selectedVariant?.images![0]!).url(),
                        alt: selectedVariant?.images![0].alt!,
                      },
                      price: product.price!,
                      size: selectedSize?.size.name!,
                      url: `/${product.productType.subCategory.category.slug.current}/${product.productType.slug.current}/${product.slug?.current}`,
                    });
                    toast({
                      description: `${product.name} has been added to your wishlist`,
                    });
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      description: "Failed to add to wishlist.",
                    });
                  }
                }}
              >
                <Heart />
              </Button>
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
                        "rounded-full focus-visible:ring-offset-4",
                        variant._key === selectedVariantId &&
                          "ring-ring ring-2 ring-offset-2"
                      )}
                      style={{
                        backgroundColor: variant.color.color?.hex,
                      }}
                      onClick={() => {
                        setValue("variantId", variant._key);
                        setValue(
                          "variantSizeId",
                          variant.sizeAndStock[0].size._id
                        );
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Variant Sizes */}
              <div className="flex flex-col gap-4">
                <p className="text-base font-medium">Size</p>
                <div className="grid grid-cols-5 gap-4">
                  {product.variants
                    .find((variant) => variant._key === selectedVariantId)
                    ?.sizeAndStock.map((variant) => (
                      <Button
                        key={variant.size._id}
                        disabled={!(variant.stock && variant.stock > 0)}
                        variant={"outline"}
                        size={"lg"}
                        className={cn(
                          selectedVariantSizeId === variant.size._id &&
                            "border-2 border-solid border-black",
                          !(variant.stock && variant.stock > 0) &&
                            "line-through"
                        )}
                        onClick={() =>
                          setValue("variantSizeId", variant.size._id)
                        } // Update form value
                      >
                        {variant.size.name}
                      </Button>
                    ))}
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button onClick={handleSubmit(handleAddToCart)}>Add to Cart</Button>

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
