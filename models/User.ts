import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["investor", "entrepreneur"],
      required: true,
    },
    profile: {
      bio: String,
      // Entrepreneur specific fields
      startupName: String,
      pitchSummary: String,
      fundingNeeded: String,
      industry: String,
      location: String,
      foundedYear: String,
      teamSize: String,
      website: String,
      // Investor specific fields
      investmentInterests: [String],
      portfolioCompanies: [String],
      investmentRange: String,
      experience: String,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.User || mongoose.model("User", userSchema)
