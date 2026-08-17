import couponModel from "@/models/couponModel";
import shippingRateModel from "@/models/shippingRateModel";
import { DEFAULT_SHIPPING_PRICE } from "@/lib/constants";
import { AppError } from "@/Errors/AppError";

export async function getShippingFee(governorate: string) {
  const rate = await shippingRateModel.findOne({
    governorate,
    isActive: true,
  });
  return rate?.price ?? DEFAULT_SHIPPING_PRICE;
}

export async function applyCoupon(code: string | undefined, subtotal: number) {
  if (!code) {
    return { discountAmount: 0, couponCode: null as string | null, coupon: null };
  }

  const coupon = await couponModel.findOne({
    code: code.toUpperCase().trim(),
    isActive: true,
  });

  if (!coupon) {
    throw new AppError("Invalid coupon code", 400);
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    throw new AppError("Coupon has expired", 400);
  }

  if (
    coupon.usageLimit != null &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    throw new AppError("Coupon usage limit reached", 400);
  }

  let discountAmount = 0;
  if (coupon.type === "percent") {
    discountAmount = (subtotal * coupon.value) / 100;
  } else {
    discountAmount = coupon.value;
  }

  discountAmount = Math.min(discountAmount, subtotal);

  return {
    discountAmount,
    couponCode: coupon.code,
    coupon,
  };
}
