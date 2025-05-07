import Image from "next/image";
import React from "react";
import { Separator } from "./ui/separator";
import { formatPrice } from "@/lib/utils";

interface ThankYouPageItemProps {
  item: {
    _id: string;
    name: string;
    color: string;
    size: { _id: string; name: string };
    price: number;
    quantity: number;
    image: {
      _id: string;
      url: string;
      alt: string;
    };
  };
}

const ThankYouPageItem = ({ item }: ThankYouPageItemProps) => {
  return (
    <div className="flex flex-col gap-6 p-4 border rounded-lg shadow-sm bg-white">
      {/* Image */}
      {item.image?.url && item.image?.alt && (
        <div className="w-full flex justify-center">
          <Image
            src={item.image.url}
            alt={item.image.alt}
            width={500}
            height={500}
            className="w-32 h-36 object-cover object-top rounded-lg"
          />
        </div>
      )}

      {/* Item Details */}
      <div className="flex flex-col gap-2">
        <p className="text-base font-medium text-gray-900">{item.name}</p>
        <div className="flex items-center gap-3 text-gray-600 text-sm">
          <p>{item.color}</p>
          <Separator orientation="vertical" className="h-4" />
          <p>{item.size.name}</p>
        </div>
        <div className="flex justify-between items-center text-gray-900 mt-2">
          <p>Qty: {item.quantity}</p>
          <p>{formatPrice(item.price * item.quantity)}</p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPageItem;
