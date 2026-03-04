import { create } from "zustand";
import axios from "axios";
const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT!;

console.log(ENDPOINT);



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
  allProducts: Product[];
  fetchProducts: () => void;
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
}

export const useCartStore = create<CartState>((set, get) => ({
    allProducts: [],
  
    fetchProducts: async () => {
      
      try {
        const { data } = await axios.get(ENDPOINT);
        set({
          allProducts: [...data]
        });
        console.log(88888888888888888);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    },
  cartItems: [],

  addItemToCart: (id: string, size: string) => {
    const { cartItems } = get();
    const existingItem = cartItems.find(
      (item) => item._id === id && item.selectedSize === size,
    );

    if (existingItem) {
      set({
        cartItems: cartItems.map((item) =>
          item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      });
    } else {
      const { allProducts } = get();
      const product = allProducts.find((p) => p._id === id);

      console.log(allProducts);

      if (product) {
        set({
          cartItems: [
            ...cartItems,
            { ...product, quantity: 1, selectedSize: size },
          ],
        });
      }
    }
  },

  updateItemInCart: (
    id: string,
    currentSize: string,
    newQuantity: number,
    newSize?: string,
  ) => {
    if (newQuantity <= 0) {
      return;
    }

    set((state) => {
      const targetSize = newSize || currentSize;

      const existingItemIndex = state.cartItems.findIndex(
        (item) =>
          item._id === id &&
          item.selectedSize === targetSize &&
          currentSize !== targetSize,
      );

      if (existingItemIndex !== -1) {
        const updatedCart = state.cartItems
          .map((item) => {
            if (item._id === id && item.selectedSize === targetSize) {
              return { ...item, quantity: item.quantity + newQuantity };
            }
            return item;
          })
          .filter(
            (item) => !(item._id === id && item.selectedSize === currentSize),
          );

        return { cartItems: updatedCart };
      }

      return {
        cartItems: state.cartItems.map((item) =>
          item._id === id && item.selectedSize === currentSize
            ? { ...item, quantity: newQuantity, selectedSize: targetSize }
            : item,
        ),
      };
    });
  },

  removeItemFromCart: (id: string, size: string) => {
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) => !(item._id === id && item.selectedSize === size),
      ),
    }));
  },

  clearCart: () => set({ cartItems: [] }),

  getTotalAmount: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => {
      const priceToUse = item.offerPrice ?? item.price;
      return total + priceToUse * item.quantity;
    }, 0);
  },
}));
