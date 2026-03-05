import { create } from "zustand";
import { getProductForCart } from "../lib/actions";

interface Product {
  _id: string;
  title: string;
  img: string;
  price: number;
  offerPrice: number | null;
  stock: { xs: number; sm: number; md: number; lg: number; xl: number };
  desc: string;
}

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

interface CartState {
  cartItems: CartItem[];
  addItemToCart: (id: string, size: string) => void;
  updateItemInCart: (
    id: string,
    currentSize: string,
    newQuantity: number,
    newSize?: string,
  ) => void;
  removeItemFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],

  addItemToCart: async (id, size) => {
    try {
      const { cartItems } = get();

      const existingItem = cartItems.find(
        (item) => item._id === id && item.selectedSize === size,
      );
      const product = await getProductForCart(id);

      if (!product) {
        console.log("Product not Found!");
        return;
      }

      if (existingItem) {
        const providedQuantity = product.stock[size];

        if (existingItem.quantity >= providedQuantity) {
          console.log("Reached maximum stock");
          return;
        }
        set({
          cartItems: cartItems.map((item) =>
            item._id === id && item.selectedSize === size
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        });
      } else {
        const providedQuantity = product.stock[size];

        if (providedQuantity < 1) {
          console.log("not Provided");
          return;
        }
        const finalPrice = product.offerPrice || product.price;
        set({
          cartItems: [
            ...cartItems,
            { ...product, price: finalPrice, quantity: 1, selectedSize: size },
          ],
        });
      }
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  },

  updateItemInCart: async (id, currentSize, newQuantity, newSize) => {
    try {
      const { cartItems } = get();
      const targetSize = newSize || currentSize;

      const product = await getProductForCart(id);
      if (!product) {
        console.log("Product not Found!");
        return;
      }

      if (newQuantity < 1) {
        console.log("Invalid quantity");
        return;
      }

      const availableStock = product.stock[targetSize];
      if (availableStock < newQuantity) {
        console.log("Requested quantity exceeds stock");
        return;
      }

      const existingItemInTargetSize = cartItems.find(
        (item) =>
          item._id === id &&
          item.selectedSize === targetSize &&
          targetSize !== currentSize,
      );

      if (existingItemInTargetSize) {
        const updatedCart = cartItems
          .map((item) => {
            if (item._id === id && item.selectedSize === targetSize) {
              const totalQuantity = item.quantity + newQuantity;
              if (totalQuantity > availableStock) {
                console.log(
                  "You have reached the maximam quantity of this size!",
                );

                return { ...item, quantity: availableStock };
              }
              return { ...item, quantity: totalQuantity };
            }
            return item;
          })
          .filter(
            (item) => !(item._id === id && item.selectedSize === currentSize),
          );

        set({ cartItems: updatedCart });
      } else {
        const updatedCart = cartItems.map((item) =>
          item._id === id && item.selectedSize === currentSize
            ? { ...item, quantity: newQuantity, selectedSize: targetSize }
            : item,
        );

        set({ cartItems: updatedCart });
      }
    } catch (err) {
      console.error("Update cart failed", err);
    }
  },

  removeItemFromCart: (id, size) => {
    try {
      if (!id || !size) return;

      set((state) => ({
        cartItems: state.cartItems.filter(
          (item) => !(item._id === id && item.selectedSize === size),
        ),
      }));
    } catch (err) {
      console.error("Remove Item failed", err);
    }
  },

  clearCart: () => {
    set({ cartItems: [] });
  },

  getTotalAmount: () => {
    const { cartItems } = get();

    return cartItems.reduce((total, item) => {
      const priceToUse = item.offerPrice || item.price;

      return total + priceToUse * item.quantity;
    }, 0);
  },

  getCartCount: () => {
    const { cartItems } = get();
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  },
}));
