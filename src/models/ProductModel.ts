import { Document, model, models, Schema } from "mongoose";
import type { ProductStatus } from "@/lib/constants";

export interface IProduct extends Document {
  title: string;
  category: string;
  style: string[];
  imgs: string[];
  price: number;
  offerPrice: number | null;
  stock: { xs: number; sm: number; md: number; lg: number; xl: number };
  desc: string;
  status: ProductStatus;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    style: { type: [String] },
    imgs: { type: [String], required: true },
    price: { type: Number, required: true, min: 0 },
    offerPrice: { type: Number, default: null },
    stock: {
      xs: { type: Number, default: 0 },
      sm: { type: Number, default: 0 },
      md: { type: Number, default: 0 },
      lg: { type: Number, default: 0 },
      xl: { type: Number, default: 0 },
    },
    desc: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "unavailable", "coming_soon"],
      default: "available",
    },
  },
  {
    timestamps: true,
  },
);

const productModel =
  models.product || model<IProduct>("product", productSchema);

export default productModel;
