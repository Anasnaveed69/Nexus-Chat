import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Message from "@/models/Message"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { receiverId, message } = await request.json()

    if (!receiverId || !message) {
      return NextResponse.json({ message: "Receiver ID and message are required" }, { status: 400 })
    }

    await connectToDatabase()

    // Create new message
    const newMessage = await Message.create({
      senderId: user.userId,
      receiverId,
      message,
      timestamp: new Date(),
    })

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
