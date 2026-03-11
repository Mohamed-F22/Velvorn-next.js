import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { dbConnect } from "@/app/lib/mongodb";
import userModel from "@/app/models/userModel";

const SECRET = process.env.SECRET_JWT as string;

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required !", status: 400 },
        { status: 400 },
      );
    }

    if (!SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const findUser = await userModel.findOne({ email });
    if (!findUser) {
      return NextResponse.json(
        { message: "Incorrect email or password !", status: 401 },
        { status: 401 },
      );
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Incorrect email or password !", status: 401 },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      {
        email: findUser.email,
        fullName: findUser.fullName,
      },
      SECRET,
      { expiresIn: "1d" },
    );

    const response = NextResponse.json({
      message: "Login success",
      status: 200,
      token,
      user: {
        fullName: findUser.fullName,
        email: findUser.email,
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
    console.error("Login Error:", err);
    return NextResponse.json(
      { message: "Something Went Wrong!" },
      { status: 500 },
    );
  }
}
