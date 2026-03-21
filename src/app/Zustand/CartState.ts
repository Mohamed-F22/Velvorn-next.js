import { create } from "zustand";
import { getProduct } from "../lib/actions";
import { Alert } from "../Components/Alert";
import { persist, createJSONStorage } from "zustand/middleware";
import { useAuthStore } from "./AuthStore";
import CartItem from "../Components/CartItem";
import { v4 as uuidv4 } from "uuid";

interface Product {
  _id: string;
  title: string;
  imgs: string[];
  price: number;
  offerPrice: number | null;
  stock: { xs: number; sm: number; md: number; lg: number; xl: number };
}

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

interface CartState {
  cartItems: CartItem[];
  isUserLoggedIn: () => boolean;
  syncCartWithServer: () => void;
  addItemToCart: (id: string, size: string, quantity: number) => void;
  updateItemInCart: (id: string, size: string, newQuantity: number) => void;
  updateLocalQuantity: (id: string, size: string, quantity: number) => void;
  removeItemFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getCartCount: () => number;
  fetchUserCart: () => void;
}
const idempotencyKey = uuidv4();

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isUserLoggedIn: () => !!useAuthStore.getState().user,

      fetchUserCart: async () => {
        try {
          const res = await fetch("/api/cart/get", {
            headers: {
              "X-Idempotency-Key": idempotencyKey,
            },
          });
          if (res.ok) {
            const result = await res.json();

            if (result.cart && result.cart.items) {
              const mappedItems = result.cart.items.map((item: any) => {
                return {
                  ...item.product,
                  quantity: item.quantity,
                  selectedSize: item.size,
                  _id: item.product._id,
                };
              });

              set({ cartItems: mappedItems });
            }
          }
        } catch (err) {
          console.error("Fetch Cart Failed", err);
        }
      },

      syncCartWithServer: async () => {
        const { cartItems } = get();
        if (cartItems.length === 0) return;

        try {
          const localItems = cartItems.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            size: item.selectedSize,
            unitPrice: item.offerPrice || item.price,
          }));

          const res = await fetch("/api/cart/merge", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Idempotency-Key": idempotencyKey,
            },
            body: JSON.stringify({ localItems }),
          });

          if (res.ok) {
            const result = await res.json();

            if (result.cart && result.cart.items) {
              const mappedItems = result.cart.items.map((item: any) => {
                return {
                  ...item.product,
                  quantity: item.quantity,
                  selectedSize: item.size,
                  _id: item.product._id,
                };
              });

              set({ cartItems: mappedItems });
            }
          }
        } catch (err) {
          console.error("Sync Cart Failed", err);
        }
      },

      addItemToCart: async (id, size, quantity) => {
        const { cartItems, isUserLoggedIn } = get();
        const product = await getProduct(id);
        if (!product) return;

        if (isUserLoggedIn()) {
          try {
            const res = await fetch("/api/cart/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productId: id,
                quantity,
                unitPrice: product.offerPrice || product.price,
                size,
              }),
            });
            if (res.ok) {
              const result = await res.json();

              if (result.cart && result.cart.items) {
                const mappedItems = result.cart.items.map((item: any) => {
                  return {
                    ...item.product,
                    quantity: item.quantity,
                    selectedSize: item.size,
                    _id: item.product._id,
                  };
                });

                set({ cartItems: mappedItems });
              }
            }
          } catch (err) {
            console.error("DB Add Failed", err);
          }
        } else {
          const existingItem = cartItems.find(
            (item) => item._id === id && item.selectedSize === size,
          );
          const providedStock = product.stock[size.toLowerCase()];

          if (existingItem) {
            const newQty = Math.min(
              existingItem.quantity + quantity,
              providedStock,
            );
            if (existingItem.quantity + quantity > providedStock) {
              Alert.fire({ icon: "info", title: "Reached maximum stock!" });
            }
            set({
              cartItems: cartItems.map((item) =>
                item._id === id && item.selectedSize === size
                  ? { ...item, quantity: newQty }
                  : item,
              ),
            });
          } else {
            if (providedStock < 1) {
              Alert.fire({ icon: "info", title: "Out of stock!" });
              return;
            }
            set({
              cartItems: [
                ...cartItems,
                { ...product, quantity, selectedSize: size },
              ],
            });
          }
        }
      },

      updateLocalQuantity: (id: string, size: string, newQuantity: number) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item._id === id && item.selectedSize === size
              ? { ...item, quantity: newQuantity }
              : item,
          ),
        }));
      },

      updateItemInCart: async (id, size, newQuantity) => {
        const { isUserLoggedIn } = get();

        if (!isUserLoggedIn()) return;
        try {
          const res = await fetch("/api/cart/update", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: id,
              size: size,
              quantity: newQuantity,
            }),
          });
          if (res.ok) {
            const result = await res.json();

            if (result.cart && result.cart.items) {
              const mappedItems = result.cart.items.map((item: any) => {
                return {
                  ...item.product,
                  quantity: item.quantity,
                  selectedSize: item.size,
                  _id: item.product._id,
                };
              });

              set({ cartItems: mappedItems });
            }
          }
        } catch (err) {
          console.error("DB Update Failed", err);
        }
      },

      removeItemFromCart: async (id, size) => {
        const { isUserLoggedIn } = get();

        if (isUserLoggedIn()) {
          try {
            const res = await fetch("/api/cart/delete", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId: id, size }),
            });
            if (res.ok) {
              const result = await res.json();

              if (result.cart && result.cart.items) {
                const mappedItems = result.cart.items.map((item: any) => {
                  return {
                    ...item.product,
                    quantity: item.quantity,
                    selectedSize: item.size,
                    _id: item.product._id,
                  };
                });

                set({ cartItems: mappedItems });
              }
            }
          } catch (err) {
            console.error("DB Remove Failed", err);
          }
        } else {
          set((state) => ({
            cartItems: state.cartItems.filter(
              (item) => !(item._id === id && item.selectedSize === size),
            ),
          }));
        }
      },

      clearCart: async () => {
        const { isUserLoggedIn } = get();
        if (isUserLoggedIn()) {
          await fetch("/api/cart/clear", { method: "DELETE" });
        }
        set({ cartItems: [] });
      },

      getTotalAmount: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => {
          const price = item.offerPrice || item.price;
          return total + price * item.quantity;
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
