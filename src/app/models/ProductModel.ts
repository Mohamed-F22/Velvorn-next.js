import mongoose, { model, models, Schema } from "mongoose";

export interface IProduct extends Document {
  title: string;
  img: string;
  price: number;
  offerPrice: number | null;
  stock: { xs: number; sm: number; md: number; lg: number; xl: number };
  desc: string;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    img: { type: String, required: true },
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
  },
  {
    timestamps: true,
  },
);

const productModel =
  models.product || model<IProduct>("product", productSchema);

export default productModel;
