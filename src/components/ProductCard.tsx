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

const ProductCard = ({ _id, name, price, images, url }: ProductCardProps) => {
  return (
    <div className="flex flex-col gap-3 h-max">
      <div>
        <Carousel className="relative group">
          <Link key={_id} href={url}>
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image._id}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover object-top"
                  />
                </CarouselItem>
              ))}
              {images.map((image) => (
                <CarouselItem key={image._id}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover object-top"
                  />
                </CarouselItem>
              ))}
              {images.map((image) => (
                <CarouselItem key={image._id}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover object-top"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Link>
          <div className="hidden md:group-hover:flex absolute w-full h-full top-0 justify-between items-center p-4">
            <CarouselPrevious className="static" />
            <CarouselNext className="static" />
          </div>
        </Carousel>
      </div>
      <div className="flex flex-col gap-2 px-2 text-sm">
        <p>{name}</p>
        <p className="text-muted-foreground">{formatPrice(price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;
