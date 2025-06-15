import { describe, test, expect, beforeEach, vi } from "vitest";
import { CartItem, useCart } from "@/hooks/use-cart";

// Mock fetchProductVariant to return empty data because it runs in refreshCartItems on store setup
vi.mock("@/sanity/dynamicQueries/fetchProductVariant", () => ({
  default: vi.fn(() => Promise.resolve([])),
}));

describe("useCart store", () => {
  const newItem: Omit<CartItem, "quantity"> = {
    productId: "123",
    variantId: "345",
    variantSizeId: "567",
    name: "Product Name",
    color: "Red",
    size: "M",
    image: {
      _id: "img1",
      url: "http://example.com/img.jpg",
      alt: "Alt text",
    },
    url: "http://example.com/product",
    price: 100,
  };
  const itemKey = `${newItem.productId}-${newItem.variantId}-${newItem.variantSizeId}`;

  beforeEach(() => {
    useCart.getState().clearCart();
    localStorage.clear();
  });

  test("should add a new item to the cart", () => {
    const { addItem } = useCart.getState();

    addItem(newItem);

    const items = useCart.getState().items;

    expect(items[itemKey]).toEqual({ ...newItem, quantity: 1 });
  });

  test("should increase the quantity on adding multiple items to the cart", () => {
    const { addItem } = useCart.getState();

    addItem(newItem);
    addItem(newItem);

    const items = useCart.getState().items;

    expect(items[itemKey]).toEqual({ ...newItem, quantity: 2 });
  });

  test("should remove an item from the cart", () => {
    const { addItem, removeItem } = useCart.getState();

    addItem(newItem);
    removeItem({
      productId: newItem.productId,
      variantId: newItem.variantId,
      variantSizeId: newItem.variantSizeId,
    });

    const items = useCart.getState().items;

    expect(items[itemKey]).toBeUndefined();
  });

  test("should set item quantity", () => {
    const { addItem, setItemCount } = useCart.getState();

    addItem(newItem);
    setItemCount({
      productId: newItem.productId,
      variantId: newItem.variantId,
      variantSizeId: newItem.variantSizeId,
      quantity: 5,
    });

    const items = useCart.getState().items;

    expect(items[itemKey].quantity).toBe(5);
  });

  test("should remove item on setting non positive quantity", () => {
    const { addItem, setItemCount } = useCart.getState();

    addItem(newItem);
    setItemCount({
      productId: newItem.productId,
      variantId: newItem.variantId,
      variantSizeId: newItem.variantSizeId,
      quantity: 0,
    });

    const items = useCart.getState().items;

    expect(items[itemKey]).toBeUndefined();
  });

  test("should clear the cart", () => {
    const { addItem, clearCart } = useCart.getState();

    addItem(newItem);
    clearCart();

    const items = useCart.getState().items;

    expect(Object.keys(items).length).toBe(0);
  });
});
