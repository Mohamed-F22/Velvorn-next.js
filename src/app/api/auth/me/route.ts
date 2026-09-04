import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return Response.json({ user: null });
  }

  const secret = new TextEncoder().encode(process.env.SECRET_JWT);

  try {
    const { payload } = await jwtVerify(token, secret);

    return Response.json({
      user: {
        id: payload.id,
        fullName: payload.fullName,
        email: payload.email,
      },
    });
  } catch {
    return Response.json({ user: null });
  }
}