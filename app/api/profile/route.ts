import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const profileData = await request.json()

    await connectToDatabase()

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      {
        name: profileData.name,
        profile: {
          bio: profileData.bio,
          location: profileData.location,
          website: profileData.website,
          // Entrepreneur fields
          ...(user.role === "entrepreneur" && {
            startupName: profileData.startupName,
            pitchSummary: profileData.pitchSummary,
            fundingNeeded: profileData.fundingNeeded,
            industry: profileData.industry,
            foundedYear: profileData.foundedYear,
            teamSize: profileData.teamSize,
          }),
          // Investor fields
          ...(user.role === "investor" && {
            investmentInterests: profileData.investmentInterests,
            portfolioCompanies: profileData.portfolioCompanies,
            investmentRange: profileData.investmentRange,
            experience: profileData.experience,
          }),
        },
      },
      { new: true },
    ).select("-password")

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
