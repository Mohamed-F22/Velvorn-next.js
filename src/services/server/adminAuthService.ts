import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import adminModel, { AdminRole } from "@/models/adminModel";
import { AppError } from "@/Errors/AppError";

const SECRET = process.env.SECRET_JWT as string;

export type AdminTokenPayload = {
  id: string;
  fullName: string;
  email: string;
  role: AdminRole;
  type: "admin";
};

export function getAdminFromToken(token?: string): AdminTokenPayload | null {
  if (!token || !SECRET) return null;
  try {
    const decoded = jwt.verify(token, SECRET) as AdminTokenPayload;
    if (decoded.type !== "admin") return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function adminLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  if (!email || !password) {
    throw new AppError("Email and password are required!", 400);
  }
  if (!SECRET) {
    throw new AppError("JWT secret is not defined", 500);
  }

  const admin = await adminModel.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  if (!admin) {
    throw new AppError("Incorrect email or password!", 401);
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    throw new AppError("Incorrect email or password!", 401);
  }

  const payload: AdminTokenPayload = {
    id: admin._id.toString(),
    fullName: admin.fullName,
    email: admin.email,
    role: admin.role,
    type: "admin",
  };

  const token = jwt.sign(payload, SECRET, { expiresIn: "7d" });
  return { admin, token, payload };
}

export async function createAdminAccount({
  fullName,
  email,
  password,
  role,
}: {
  fullName: string;
  email: string;
  password: string;
  role: AdminRole;
}) {
  if (!fullName || !email || !password || !role) {
    throw new AppError("All fields are required!", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await adminModel.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });
    return admin;
  } catch (err: any) {
    if (err.code === 11000) {
      throw new AppError("Email already exists!", 409);
    }
    throw err;
  }
}
