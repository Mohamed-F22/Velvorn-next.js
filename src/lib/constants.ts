export const EGYPT_GOVERNORATES = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbia",
  "Ismailia",
  "Monufia",
  "Minya",
  "Qalyubia",
  "New Valley",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "South Sinai",
  "Kafr El Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "North Sinai",
  "Soag",
] as const;

export const PRODUCT_CATEGORIES = [
  "compression",
  "hoodie",
  "jacket",
  "T-shirt",
  "tank top",
] as const;

export const PRODUCT_STATUSES = [
  "available",
  "unavailable",
  "coming_soon",
] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const DEFAULT_SHIPPING_PRICE = 15;
