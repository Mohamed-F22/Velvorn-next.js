import bcrypt from "bcrypt";
import { dbConnect } from "../src/lib/mongodb";
import adminModel from "../src/models/adminModel";

async function seed() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_FULL_NAME?.trim() || "Administrator";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set.");
  }

  await dbConnect();

  const existing = await adminModel.findOne({ email });
  if (!existing) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await adminModel.create({
      fullName,
      email,
      password: hashedPassword,
      role: "admin",
    });
    console.log(`Admin account created for ${email}.`);
  } else {
    console.log("Admin already exists, skipping.");
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
