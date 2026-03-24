import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "@/models/userModel";
import { AppError } from "@/Errors/AppError";
import cartModel from "@/models/cartModel";

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

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AppError("Incorrect email or password !", 401);
  }

  const token = jwt.sign(
    { id: user._id, fullName: user.fullName, email: user.email },
    SECRET,
    { expiresIn: "7d" },
  );
  return { user, token };
};

interface registerData {
  fullName: string;
  email: string;
  password: string;
}
export const register = async ({ fullName, email, password }: registerData) => {
  if (!fullName || !email || !password) {
    throw new AppError("All fields are required!", 400);
  }

  if (!SECRET) {
    throw new AppError("JWT_SECRET is not defined", 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser;

  try {
    newUser = await userModel.create({
      email,
      fullName,
      password: hashedPassword,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      throw new AppError("Email already exists!", 409);
    }
    throw err;
  }

  await cartModel.create({
    userId: newUser._id,
    items: [],
    totalAmount: 0,
    status: "active",
  });

  const token = jwt.sign(
    { id: newUser._id, fullName , email },
    SECRET,
    { expiresIn: "7d" },
  );

  return token;
};
