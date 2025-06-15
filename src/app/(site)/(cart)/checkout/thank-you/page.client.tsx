"use client";

import { useCart } from "@/hooks/use-cart";
import { Fragment, useEffect } from "react";

const ThankYouClient = () => {
  const clearCart = useCart((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return <Fragment></Fragment>;
};

export default ThankYouClient;
