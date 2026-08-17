import { Document, Schema, model, models } from "mongoose";

export interface IShippingRate extends Document {
  governorate: string;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const shippingRateSchema = new Schema<IShippingRate>(
  {
    governorate: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const shippingRateModel =
  models.shippingRate ||
  model<IShippingRate>("shippingRate", shippingRateSchema);

export default shippingRateModel;
