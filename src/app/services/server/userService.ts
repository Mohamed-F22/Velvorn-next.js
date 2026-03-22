import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "@/app/models/userModel";
import { AppError } from "@/app/Errors/AppError";

const SECRET = process.env.SECRET_JWT as string;

export function getUserFromToken(token?: string): string | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, SECRET) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
}
interface loginData {
  email: string;
  password: string;
}
export const login = async ({ email, password }: loginData) => {
  if (!email || !password) {
    throw new AppError("Email and password are required !", 400);
  }

  if (!SECRET) {
    throw new Error("JWT_SECRET not defined");
  }

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Incorrect email or password !", 401);
  }

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1d" });
  return { user, token };
};
