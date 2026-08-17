import bcrypt from "bcrypt";
import { dbConnect } from "@/lib/mongodb";
import adminModel from "@/models/adminModel";
import shippingRateModel from "@/models/shippingRateModel";
import {
  DEFAULT_SHIPPING_PRICE,
  EGYPT_GOVERNORATES,
} from "@/lib/constants";

export async function ensureAdminSeeded() {
  await dbConnect();

  const existing = await adminModel.findOne({ email: "example@gmail.com" });
  if (!existing) {
    const hashedPassword = await bcrypt.hash("123123", 10);
    await adminModel.create({
      fullName: "Mohamed Amr",
      email: "example@gmail.com",
      password: hashedPassword,
      role: "admin",
    });
  }

  const count = await shippingRateModel.countDocuments();
  if (count === 0) {
    await shippingRateModel.insertMany(
      EGYPT_GOVERNORATES.map((governorate) => ({
        governorate,
        price: DEFAULT_SHIPPING_PRICE,
        isActive: true,
      })),
    );
  }
}
