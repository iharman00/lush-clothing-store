import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

export type ProductCardProps = {
  _id: string;
  name: string;
  price: number;
  images: {
    _id: string;
    url: string;
    alt: string;
  }[];
  url: string;
};

const ProductCard = ({ name, price, images, url }: ProductCardProps) => {
  return (
    <div className="flex flex-col gap-3 aspect-[3/4]">
      <Carousel className="group h-full">
        <Link href={url}>
          <div className="h-full flex *:w-full">
            <CarouselContent className="h-full">
              {images.map((image) => (
                <CarouselItem key={image._id} className="h-full">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </Link>
        <div className="hidden md:group-hover:flex absolute w-full h-max top-[50%] justify-between items-center px-4">
          <CarouselPrevious className="static" />
          <CarouselNext className="static" />
        </div>
      </Carousel>
      <div className="flex flex-col gap-2 px-2 text-sm">
        <p>{name}</p>
        <p className="text-muted-foreground">{formatPrice(price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
