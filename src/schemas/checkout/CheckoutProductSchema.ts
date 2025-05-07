import { z } from "zod";

export const CheckoutProductSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  sizeId: z.string(),
  quantity: z.number(),
});

// TypeScript type from Zod schema (optional)
export type CheckoutProduct = z.infer<typeof CheckoutProductSchema>;
