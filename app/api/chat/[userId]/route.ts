import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Message from "@/models/Message"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Fetch messages between current user and specified user
    const messages = await Message.find({
      $or: [
        { senderId: user.userId, receiverId: params.userId },
        { senderId: params.userId, receiverId: user.userId },
      ],
    }).sort({ timestamp: 1 })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Fetch messages error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
