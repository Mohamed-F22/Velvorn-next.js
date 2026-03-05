import { Schema, Document, ObjectId, models, model } from "mongoose";
import { IProduct } from "./ProductModel";

const cartStatusEnum = ["active", "completed"];

export interface ICartItem {
  product: IProduct;
  unitPrice: number;
  quantity: number;
}

export interface Icart extends Document {
  userId: ObjectId | string;
  items: ICartItem[];
  totalAmount: number;
  status: "active" | "completed";
}

const cartItemSchema = new Schema<ICartItem>({
  product: { type: Schema.Types.ObjectId, ref: "product", required: true },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
});

const cartSchema = new Schema<Icart>({
  userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  items: [cartItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: cartStatusEnum, default: "active" },
});

const cartModel = models.cartModel || model<Icart>("cart", cartSchema);

export default cartModel;
