import PollPaymentStatus from "@/components/PaymentStatus";
import ThankYouPageItem from "@/components/ThankYouPageItem";
import { buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { getOrder } from "@/data_access/order";
import { cn, formatPrice } from "@/lib/utils";
import fetchProductVariant from "@/sanity/dynamicQueries/fetchProductVariant";
import { urlFor } from "@/sanity/lib/image";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ThankYouClient from "./page.client";

interface PageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  let sessionId = searchParams.session_id;
  if (!sessionId) notFound();
  sessionId = typeof sessionId === "string" ? sessionId : sessionId[0];

  let order;
  try {
    order = await getOrder(sessionId);
  } catch (error) {
    notFound();
  }

  if (!order) {
    return (
      <div className="container text-center mt-40 flex flex-col justify-center items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-lg font-medium text-foreground">
          Hang tight! We&apos;re processing your order now.
        </p>
        <PollPaymentStatus sessionId={sessionId} />
      </div>
    );
  }

  const orderItems = (
    await Promise.all(
      order.orderItems.map(async (item) => {
        try {
          const variant = await fetchProductVariant({
            productId: item.productId,
            variantId: item.productVariantId,
            sizeId: item.productSizeId,
          });

          return variant ? { ...variant, quantity: item.quantity } : null;
        } catch (err) {
          return null;
        }
      })
    )
  ).filter((item) => item !== null); // Remove null values

  return (
    <div className="container h-screen w-full grid grid-cols-1 xl:grid-cols-6 items-center gap-16">
      {/* Image Section */}
      <div className="relative hidden w-full h-full xl:col-span-3 xl:flex flex-col justify-center items-center p-2 rounded-xl">
        <Image
          src="/checkout-thank-you.jpg"
          alt="A greek statue making bubles with a chewing gum in its mouth"
          width={5000}
          height={5000}
          className="object-cover object-top w-full h-full"
        />
      </div>

      {/* Order Details Section */}
      <div className="col-span-3 mt-12 lg:mr-12 flex flex-col justify-start h-full">
        <p className="text-sm font-medium text-sky-500">Order successful</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Thanks for ordering
        </h1>
        <p className="mt-6 text-base text-muted-foreground">
          Your order was processed. We&apos;ve sent your receipt and order
          details to{" "}
          <span className="font-medium text-gray-900">{order.userEmail}.</span>
        </p>

        <div className="mt-8 text-sm font-medium flex flex-col gap-8">
          <div>
            <div className="text-muted-foreground">Order no:</div>
            <div className="mt-2 text-gray-900">{order.id}</div>
          </div>

          <Separator />

          {/* Display Order Items */}
          <div>
            <div className="text-muted-foreground">Items:</div>

            {orderItems.length > 0 ? (
              <Carousel opts={{ dragFree: true }} className="relative mt-8">
                <CarouselContent className="flex gap-4">
                  {orderItems.map((item) => {
                    const orderItemKey =
                      item._id +
                      item.variants[0]._key +
                      item.variants[0].sizeAndStock[0].size._id;
                    return (
                      <CarouselItem
                        key={orderItemKey}
                        className="pl-4 basis-1/8"
                      >
                        <ThankYouPageItem
                          key={`${item._id}-${item.variants[0].sizeAndStock[0].size._id}`}
                          item={{
                            _id: item._id,
                            name: item.name,
                            price: item.price,
                            color:
                              item.variants[0].color.name || "Unknown Color",
                            size: {
                              _id:
                                item.variants[0].sizeAndStock?.[0]?.size?._id ||
                                "N/A",
                              name:
                                item.variants[0].sizeAndStock?.[0]?.size
                                  ?.name || "Unknown Size",
                            },
                            quantity: item.quantity,
                            image: {
                              _id: item.variants[0].images?.[0]?._key || "N/A",
                              url: item.variants[0].images?.[0]
                                ? urlFor(item.variants[0].images[0]).url()
                                : "/placeholder.jpg",
                              alt:
                                item.variants[0].images?.[0]?.alt ||
                                "No image available",
                            },
                          }}
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <div className="absolute -top-10 right-14">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </Carousel>
            ) : (
              <p className="text-muted-foreground">
                We has some issues fetching the order items.
              </p>
            )}
          </div>

          <Separator />

          {/* Order Summary */}
          <div>
            <div className="space-y-1.5 text-sm">
              <div className="flex text-muted-foreground">
                <span className="flex-1">Sub Total</span>
                <span>{formatPrice(order.orderTotal)}</span>
              </div>
              <div className="flex text-muted-foreground">
                <span className="flex-1">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex text-lg pt-2">
                <span className="flex-1">Total</span>
                <span>{formatPrice(order.orderTotal)}</span>
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="flex justify-end">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-sm font-medium text-sky-500 hover:text-sky-400 p-0"
              )}
            >
              Continue shopping &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Client Side component for clearing cart */}
      <ThankYouClient />
    </div>
  );
}
