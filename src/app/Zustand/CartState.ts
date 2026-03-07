import { create } from "zustand";
import { getProduct } from "../lib/actions";
import { Alert } from "../services/Alert";
import { persist, createJSONStorage } from "zustand/middleware"; // أضف هذا السطر

interface Product {
  _id: string;
  title: string;
  imgs: string[];
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
  addItemToCart: (id: string, size: string, quantity: number) => void;
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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addItemToCart: async (id, size, quantity) => {
        try {
          const { cartItems } = get();

          if (quantity <= 0) {
            console.log("Invalid quantity");
            return;
          }

          const existingItem = cartItems.find(
            (item) => item._id === id && item.selectedSize === size,
          );
          const product = await getProduct(id);

          if (!product) {
            console.log("Product not Found!");
            return;
          }

          if (existingItem) {
            const providedQuantity = product.stock[size.toLowerCase()];

            if (existingItem.quantity + quantity > providedQuantity) {
              Alert.fire({
                icon: "info",
                title: "Reached maximum stock of this size!",
              });
              set({
                cartItems: cartItems.map((item) =>
                  item._id === id && item.selectedSize === size
                    ? { ...item, quantity: providedQuantity }
                    : item,
                ),
              });
              return;
            }

            set({
              cartItems: cartItems.map((item) =>
                item._id === id && item.selectedSize === size
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            });
          } else {
            const providedQuantity = product.stock[size.toLowerCase()];

            if (providedQuantity < 1) {
              Alert.fire({
                icon: "info",
                title: "Item is out of stock!",
              });
              return;
            }
            set({
              cartItems: [
                ...cartItems,
                {
                  ...product,
                  quantity: quantity,
                  selectedSize: size,
                },
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

          const product = await getProduct(id);
          if (!product) {
            console.log("Product not Found!");
            return;
          }

          if (newQuantity < 1) {
            console.log("Invalid quantity");
            return;
          }

          const availableStock = product.stock[targetSize.toLowerCase()];
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
                    console.log("Maximum quantity reached!");
                    return { ...item, quantity: availableStock };
                  }
                  return { ...item, quantity: totalQuantity };
                }
                return item;
              })
              .filter(
                (item) =>
                  !(item._id === id && item.selectedSize === currentSize),
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
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
