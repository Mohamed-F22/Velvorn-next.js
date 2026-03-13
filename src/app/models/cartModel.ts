import { Schema, Document, ObjectId, models, model, Types } from "mongoose";

const cartStatusEnum = ["active", "completed"];
const sizeEnum = ["xs", "sm", "md", "lg", "xl"];

export interface ICartItem {
  product: Types.ObjectId;
  unitPrice: number;
  offerPrice?: number;
  quantity: number;
  size: "xs" | "sm" | "md" | "lg" | "xl"
}

export interface Icart extends Document {
  userId: ObjectId | string;
  items: ICartItem[];
  totalAmount: number;
  status: "active" | "completed";
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "product", required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1"],
      default: 1,
    },
    unitPrice: { type: Number, required: true },
    offerPrice: { type: Number },
    size: {type: String, enum: sizeEnum, default: "md"}
  },
  { _id: false }
);

const cartSchema = new Schema<Icart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalAmount: { type: Number, required: true, default: 0 },
    status: { type: String, enum: cartStatusEnum, default: "active" },
  },
  { timestamps: true }
);

const cartModel = models.cart || model<Icart>("cart", cartSchema);

export default cartModel;
