import { create } from "zustand";
import { getProduct } from "../lib/actions";
import { Alert } from "../Components/Alert";
import { persist, createJSONStorage } from "zustand/middleware";
import { useAuthStore } from "./AuthStore";
import CartItem from "../Components/CartItem";
import { cartService, mapCartItems } from "../services/client/cartService";

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
  totalAmount: number;
  isUserLoggedIn: () => boolean;
  syncCartWithServer: () => void;
  addItemToCart: (id: string, size: string, quantity: number) => void;
  updateItemInCart: (id: string, size: string, newQuantity: number) => void;
  updateLocalQuantity: (id: string, size: string, quantity: number) => void;
  removeItemFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  getCartCount: () => number;
  fetchUserCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      totalAmount: 0,
      isUserLoggedIn: () => !!useAuthStore.getState().user,

      fetchUserCart: async () => {
        try {
          const result = await cartService.getCart();
          set({ cartItems: mapCartItems(result.cart.items) });
          set({ totalAmount: result.cart.totalAmount });
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

          const result = await cartService.mergeCart(localItems);
          set({ cartItems: mapCartItems(result.cart.items) });
          set({ totalAmount: result.cart.totalAmount });
        } catch (err) {
          console.error("Sync Cart Failed", err);
        }
      },

      addItemToCart: async (id, size, quantity) => {
        const { cartItems, isUserLoggedIn } = get();
        const product = await getProduct(id);
        if (!product) return;

        const existingItem = cartItems.find(
          (item) => item._id === id && item.selectedSize === size,
        );

        const providedStock = product.stock[size.toLowerCase()];

        if (existingItem && existingItem.quantity + quantity > providedStock) {
          Alert.fire({ icon: "info", title: "Reached maximum stock!" });
        }
        if (providedStock < 1) {
          Alert.fire({ icon: "info", title: "Out of stock!" });
          return;
        }

        if (isUserLoggedIn()) {
          try {
            const result = await cartService.addItem({
              productId: id,
              quantity,
              unitPrice: product.offerPrice || product.price,
              size,
            });
            set({ cartItems: mapCartItems(result.cart.items) });
            set({ totalAmount: result.cart.totalAmount });
          } catch (err) {
            console.error("DB Add Failed", err);
          }
        } else {
          let updatedCart;

          if (existingItem) {
            const newQty = Math.min(
              existingItem.quantity + quantity,
              providedStock,
            );
            updatedCart = cartItems.map((item) =>
              item._id === id && item.selectedSize === size
                ? { ...item, quantity: newQty }
                : item,
            );
          } else {
            updatedCart = [
              ...cartItems,
              {
                ...product,
                quantity,
                selectedSize: size,
                finalPrice: product.offerPrice || product.price,
              },
            ];
          }

          const newTotal = updatedCart.reduce((acc, item) => {
            const price = item.offerPrice || item.price;
            return acc + price * item.quantity;
          }, 0);

          set({
            cartItems: updatedCart,
            totalAmount: newTotal,
          });
        }
      },

      updateLocalQuantity: (id, size, newQuantity) => {
        set((state) => {
          const updatedCart = state.cartItems.map((item) =>
            item._id === id && item.selectedSize === size
              ? { ...item, quantity: newQuantity }
              : item,
          );

          const newTotal = updatedCart.reduce((acc, item) => {
            const price = item.offerPrice || item.price;
            return acc + price * item.quantity;
          }, 0);

          return {
            cartItems: updatedCart,
            totalAmount: newTotal,
          };
        });
      },

      updateItemInCart: async (id, size, newQuantity) => {
        const { isUserLoggedIn } = get();

        if (!isUserLoggedIn()) return;
        try {
          const result = await cartService.updateItem({
            productId: id,
            size: size,
            quantity: newQuantity,
          });
          set({ cartItems: mapCartItems(result.cart.items) });
          set({ totalAmount: result.cart.totalAmount });
        } catch (err) {
          console.error("DB Update Failed", err);
        }
      },

      removeItemFromCart: async (id, size) => {
        const { isUserLoggedIn } = get();

        if (isUserLoggedIn()) {
          try {
            const result = await cartService.deleteItem({
              productId: id,
              size,
            });
            set({ cartItems: mapCartItems(result.cart.items) });
            set({ totalAmount: result.cart.totalAmount });
          } catch (err) {
            console.error("DB Remove Failed", err);
          }
        } else {
          set((state) => {
            const updatedCart = state.cartItems.filter(
              (item) => !(item._id === id && item.selectedSize === size),
            );

            const newTotal = updatedCart.reduce((acc, item) => {
              const price = item.offerPrice || item.price;
              return acc + price * item.quantity;
            }, 0);

            return {
              cartItems: updatedCart,
              totalAmount: newTotal,
            };
          });
        }
      },

      clearCart: async () => {
        const { isUserLoggedIn } = get();
        if (isUserLoggedIn()) {
          await fetch("/api/cart/clear", { method: "DELETE" });
        }
        set({ cartItems: [] });
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
