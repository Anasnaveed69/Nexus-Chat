import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Fetch all entrepreneurs
    const entrepreneurs = await User.find({ role: "entrepreneur" }).select("-password").populate("profile")

    return NextResponse.json(entrepreneurs)
  } catch (error) {
    console.error("Fetch entrepreneurs error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
