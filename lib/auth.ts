import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

interface DecodedToken {
  userId: string
  role: "investor" | "entrepreneur"
  iat: number
  exp: number
}

export async function verifyToken(request: NextRequest): Promise<DecodedToken | null> {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as DecodedToken

    return decoded
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}
