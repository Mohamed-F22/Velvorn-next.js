import jwt from "jsonwebtoken";

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