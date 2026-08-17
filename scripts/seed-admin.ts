import bcrypt from "bcrypt";
import { dbConnect } from "../src/lib/mongodb";
import adminModel from "../src/models/adminModel";
import shippingRateModel from "../src/models/shippingRateModel";
import {
  DEFAULT_SHIPPING_PRICE,
  EGYPT_GOVERNORATES,
} from "../src/lib/constants";

async function seed() {
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
    console.log("Seeded admin: example@gmail.com / 123123");
  } else {
    console.log("Admin already exists, skipping.");
  }

  for (const governorate of EGYPT_GOVERNORATES) {
    await shippingRateModel.updateOne(
      { governorate },
      {
        $setOnInsert: {
          governorate,
          price: DEFAULT_SHIPPING_PRICE,
          isActive: true,
        },
      },
      { upsert: true },
    );
  }
  console.log("Shipping rates seeded.");

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
