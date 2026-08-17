import { Document, Schema, model, models } from "mongoose";

export type CouponType = "percent" | "fixed";

export interface ICoupon extends Document {
  code: string;
  type: CouponType;
  value: number;
  isActive: boolean;
  expiresAt?: Date | null;
  usageLimit?: number | null;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const couponModel = models.coupon || model<ICoupon>("coupon", couponSchema);

export default couponModel;
