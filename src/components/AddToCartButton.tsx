"use client";

import { Button } from "./ui/button";
import { useCart } from "@/hooks/useCart";

const AddToCartButton = () => {
  const { addItem } = useCart();
  return (
    <Button
      onClick={() =>
        addItem({
          productVariantId: "product.variants[0]._id",
          quantity: 1,
        })
      }
    >
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
