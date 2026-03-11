import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb";
import userModel from "@/app/models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET = process.env.SECRET_JWT as string;

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    if (!SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const findUser = await userModel.findOne({ email });
    if (findUser) {
      return NextResponse.json(
        { message: "There is an account with this email!", status: 400 },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      email,
      fullName,
      password: hashedPassword,
    });

    const token = jwt.sign({ fullName, email }, SECRET, { expiresIn: "1d" });

    const response = NextResponse.json({
      message: "Welcome To Velvorn",
      status: 200,
      user: {
        fullName,
        email
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Register Error", err);
    return NextResponse.json(
      { message: "Something Went Wrong!", status: 500 },
      { status: 500 },
    );
  }
}
