import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Request from "@/models/Request"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { entrepreneurId } = await request.json()

    if (!entrepreneurId) {
      return NextResponse.json({ message: "Entrepreneur ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if request already exists
    const existingRequest = await Request.findOne({
      investorId: user.userId,
      entrepreneurId,
    })

    if (existingRequest) {
      return NextResponse.json({ message: "Request already sent" }, { status: 400 })
    }

    // Create new request
    const newRequest = await Request.create({
      investorId: user.userId,
      entrepreneurId,
      status: "pending",
    })

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    console.error("Send request error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
