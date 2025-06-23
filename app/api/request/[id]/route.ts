import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Request from "@/models/Request"
import { verifyToken } from "@/lib/auth"
import { sendEmail, emailTemplates } from "@/lib/email"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 })
    }

    await connectToDatabase()

    // Find and update request
    const updatedRequest = await Request.findOneAndUpdate(
      { _id: params.id, entrepreneurId: user.userId },
      { status },
      { new: true },
    )
      .populate("investorId", "-password")
      .populate("entrepreneurId", "-password")

    if (!updatedRequest) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 })
    }

    // Send email notification if request was accepted
    if (status === "accepted") {
      try {
        await sendEmail({
          to: updatedRequest.investorId.email,
          subject: "Collaboration Request Accepted - Business Nexus",
          html: emailTemplates.requestAccepted(
            updatedRequest.entrepreneurId.name,
            updatedRequest.investorId.name,
            updatedRequest.entrepreneurId.profile?.startupName || "the startup",
          ),
        })
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError)
      }
    }

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error("Update request error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
