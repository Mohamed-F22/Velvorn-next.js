import mongoose, { Schema, Document, ObjectId, models, model } from "mongoose";

export interface IOrderItem {
  productTitle: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
}

export interface IAddress {
  governorate: string;
  town: string;
  zipCode: string;
  details: string;
}

export interface IOrder extends Document {
  orderItems: IOrderItem[];
  totalAmount: number;
  address: IAddress;
  notes: string;
  userId: string | ObjectId;
}

const orderItemSchema = new Schema<IOrderItem>({
  productTitle: { type: String, required: true },
  productImage: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const addressSchema = new Schema<IAddress>({
  governorate: { type: String, required: true },
  town: { type: String, required: true },
  zipCode: { type: String, required: true },
  details: { type: String, required: true },
});

const orderSchema = new Schema<IOrder>({
  orderItems: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  address: addressSchema,
  notes: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
});

const orderModel =  models.orderModel || model<IOrder>("order", orderSchema);

export default orderModel;
