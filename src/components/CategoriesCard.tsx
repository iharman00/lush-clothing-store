import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoriesCardType extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  image: {
    url: string;
    alt: string;
  };
}

const CategoriesCard = ({
  title,
  image,
  className,
  ...props
}: CategoriesCardType) => {
  return (
    <Card
      className={cn(
        "relative aspect-[3/4] w-52 lg:w-72 h-full flex flex-col justify-end items-start overflow-clip group",
        className
      )}
      {...props}
    >
      <Image
        src={image.url}
        alt={image.alt}
        width={1000}
        height={1000}
        className="absolute w-full h-full object-cover object-top lg:group-hover:scale-110 transition-transform duration-300 ease-out"
      />
      <div className="absolute w-full h-full bg-primary/5"></div>
      <CardContent
        className={`z-10 w-full pt-4 bg-gradient-to-t from-primary/40 to-transparent text-primary-foreground`}
      >
        {title}
      </CardContent>
    </Card>
  );
};

export default CategoriesCard;
