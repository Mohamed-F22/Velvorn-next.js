import { create } from "zustand";

interface Product {
  id: string;
  title: string;
  price: number;
  offerPrice?: number;
  img: string;
}

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

interface CartState {
  cartItems: CartItem[];
  addItemToCart: (id: string, size: string) => void;
  updateItemInCart: (id: string, currentSize: string, newQuantity: number, newSize?: string) => void;
  removeItemFromCart: (id: string, size: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

export const offerProducts: Product[] = [
  {
    id: "1",
    title: "Tank Top",
    price: 70.0,
    offerPrice: 30.0,
    img: "https://i.ibb.co/FLJgzthq/offer-1.jpg",
  },
  {
    id: "2",
    title: "Compression Top",
    price: 70.0,
    offerPrice: 30.0,
    img: "https://i.ibb.co/TDq6Gwsh/offer-2.jpg",
  },
  {
    id: "3",
    title: "Wind Breaker",
    price: 75.0,
    offerPrice: 32.0,
    img: "https://i.ibb.co/1tWv9Xpp/offer-3.png",
  },
];

export const latestDrop: Product[] = [
  {
    id: "4",
    title: "Zen Top",
    price: 40.0,
    img: "https://i.ibb.co/r9mmjRF/latest-Drop-1.png",
  },
  {
    id: "5",
    title: "Coro Top",
    price: 35.0,
    img: "https://i.ibb.co/9mgmpTfp/latest-Drop-2.png",
  },
  {
    id: "6",
    title: "Zen Top",
    price: 50.0,
    img: "https://i.ibb.co/W4Jsf4CL/latest-Drop-3.jpg",
  },
  {
    id: "7",
    title: "Hoodie",
    price: 45.0,
    img: "https://i.ibb.co/kggRzSnD/latest-Drop-4.jpg",
  },
];

const allProducts = [...offerProducts, ...latestDrop];

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],

  addItemToCart: (id: string, size: string) => {
    const { cartItems } = get();
    const existingItem = cartItems.find(
      (item) => item.id === id && item.selectedSize === size,
    );

    if (existingItem) {
      set({
        cartItems: cartItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      });
    } else {
      const product = allProducts.find((p) => p.id === id);
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

  updateItemInCart: (id: string, currentSize: string, newQuantity: number, newSize?: string) => {
  if (newQuantity <= 0) {
    return;
  }

  set((state) => {
    const targetSize = newSize || currentSize;

    const existingItemIndex = state.cartItems.findIndex(
      (item) => item.id === id && item.selectedSize === targetSize && currentSize !== targetSize
    );

    if (existingItemIndex !== -1) {
      const updatedCart = state.cartItems
        .map((item) => {
          if (item.id === id && item.selectedSize === targetSize) {
            return { ...item, quantity: item.quantity + newQuantity };
          }
          return item;
        })
        .filter((item) => !(item.id === id && item.selectedSize === currentSize));

      return { cartItems: updatedCart };
    }

    return {
      cartItems: state.cartItems.map((item) =>
        item.id === id && item.selectedSize === currentSize
          ? { ...item, quantity: newQuantity, selectedSize: targetSize }
          : item
      ),
    };
  });
},

  removeItemFromCart: (id: string, size: string) => {
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) => !(item.id === id && item.selectedSize === size),
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
