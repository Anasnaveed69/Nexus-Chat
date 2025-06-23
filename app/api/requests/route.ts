import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Request from "@/models/Request"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Fetch requests based on user role
    let requests
    if (user.role === "entrepreneur") {
      requests = await Request.find({ entrepreneurId: user.userId })
        .populate("investorId", "-password")
        .sort({ createdAt: -1 })
    } else {
      requests = await Request.find({ investorId: user.userId })
        .populate("entrepreneurId", "-password")
        .sort({ createdAt: -1 })
    }

    return NextResponse.json(requests)
  } catch (error) {
    console.error("Fetch requests error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
