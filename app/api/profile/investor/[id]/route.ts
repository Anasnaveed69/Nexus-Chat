import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const profile = await User.findOne({
      _id: params.id,
      role: "investor",
    }).select("-password")

    if (!profile) {
      return NextResponse.json({ message: "Investor profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Fetch investor profile error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
