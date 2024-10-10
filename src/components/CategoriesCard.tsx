import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity/types";
import { urlFor } from "@/sanity/lib/image";
type CategoriesCardType = {
  title?: string;
  image:
    | {
        asset: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
        };
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        alt?: string;
        _type: "image";
      }
    | undefined;
};

const CategoriesCard = ({ title, image }: CategoriesCardType) => {
  return (
    <Card className="relative w-52 h-72 lg:w-72 lg:h-96 flex flex-col justify-end items-start overflow-clip group">
      {image && image.alt && (
        <Image
          src={urlFor(image).url()}
          alt={image.alt}
          width={240}
          height={288}
          className="absolute w-full h-full object-cover object-top lg:group-hover:scale-110 transition-transform duration-300 ease-out"
        />
      )}
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
