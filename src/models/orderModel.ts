import mongoose, { Schema, Document, ObjectId, models, model } from "mongoose";

const sizeEnum = ["xs", "sm", "md", "lg", "xl"];

export interface IOrderItem {
  productTitle: string;
  productImage: string;
  unitPrice: number;
  offerPrice?: number;
  quantity: number;
  size: "xs" | "sm" | "md" | "lg" | "xl";
}

export interface IAddress {
  fullName: string;
  email: string;
  phone: string;
  governorate: string;
  city: string;
  addressDetails: string;
  zipCode?: string;
}

export interface IOrder extends Document {
  orderItems: IOrderItem[];
  totalAmount: number;
  shippingAddress: IAddress;
  notes?: string;
  userId?: string | ObjectId;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  productTitle: { type: String, required: true },
  productImage: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  offerPrice: { type: Number },
  size: { type: String, enum: sizeEnum, default: "md" },
});

const addressSchema = new Schema<IAddress>({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  governorate: { type: String, required: true },
  city: { type: String, required: true },
  addressDetails: { type: String, required: true },
  zipCode: { type: String },
});

const orderSchema = new Schema<IOrder>(
  {
    orderItems: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingAddress: { type: addressSchema, required: true },
    notes: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "user", required: false },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const orderModel = models.order || model<IOrder>("order", orderSchema);

export default orderModel;
