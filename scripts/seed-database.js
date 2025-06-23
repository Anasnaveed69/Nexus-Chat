const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/business-nexus"

// User schema (simplified for seeding)
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    profile: {
      bio: String,
      startupName: String,
      pitchSummary: String,
      fundingNeeded: String,
      industry: String,
      location: String,
      foundedYear: String,
      teamSize: String,
      website: String,
      investmentInterests: [String],
      portfolioCompanies: [String],
      investmentRange: String,
      experience: String,
    },
  },
  { timestamps: true },
)

const User = mongoose.models.User || mongoose.model("User", userSchema)

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    console.log("Cleared existing users")

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 12)

    // Sample entrepreneurs
    const entrepreneurs = [
      {
        name: "Alice Johnson",
        email: "alice@startup.com",
        password: hashedPassword,
        role: "entrepreneur",
        profile: {
          bio: "Passionate entrepreneur building the next generation of fintech solutions.",
          startupName: "FinTech Innovations",
          pitchSummary: "We are revolutionizing personal finance management with AI-powered insights.",
          fundingNeeded: "$500k - $1M",
          industry: "Financial Technology",
          location: "San Francisco, CA",
          foundedYear: "2023",
          teamSize: "5-10",
          website: "https://fintechinnovations.com",
        },
      },
      {
        name: "Bob Chen",
        email: "bob@healthtech.com",
        password: hashedPassword,
        role: "entrepreneur",
        profile: {
          bio: "Healthcare technology entrepreneur focused on improving patient outcomes.",
          startupName: "HealthTech Solutions",
          pitchSummary: "Developing AI-powered diagnostic tools for early disease detection.",
          fundingNeeded: "$1M - $2M",
          industry: "Healthcare Technology",
          location: "Boston, MA",
          foundedYear: "2022",
          teamSize: "10-20",
          website: "https://healthtechsolutions.com",
        },
      },
      {
        name: "Emma Rodriguez",
        email: "emma@greentech.com",
        password: hashedPassword,
        role: "entrepreneur",
        profile: {
          bio: "Environmental entrepreneur creating sustainable technology solutions.",
          startupName: "GreenTech Innovations",
          pitchSummary: "Building smart energy management systems for commercial buildings.",
          fundingNeeded: "$750k - $1.5M",
          industry: "Clean Technology",
          location: "Austin, TX",
          foundedYear: "2023",
          teamSize: "3-5",
          website: "https://greentech-innovations.com",
        },
      },
    ]

    // Sample investors
    const investors = [
      {
        name: "Carol Smith",
        email: "carol@venture.com",
        password: hashedPassword,
        role: "investor",
        profile: {
          bio: "Experienced venture capitalist with 15+ years in tech investments.",
          investmentInterests: ["Technology", "Healthcare", "Fintech"],
          portfolioCompanies: ["TechCorp", "HealthStart", "FinanceApp"],
          location: "New York, NY",
          investmentRange: "$100k - $5M",
          experience: "15+ years",
          website: "https://venturesmith.com",
        },
      },
      {
        name: "David Wilson",
        email: "david@angelinvest.com",
        password: hashedPassword,
        role: "investor",
        profile: {
          bio: "Angel investor and former tech executive passionate about early-stage startups.",
          investmentInterests: ["SaaS", "AI/ML", "E-commerce"],
          portfolioCompanies: ["CloudTech", "AIStart", "ShopSmart"],
          location: "Austin, TX",
          investmentRange: "$25k - $500k",
          experience: "10+ years",
          website: "https://angelinvest.com",
        },
      },
      {
        name: "Sarah Kim",
        email: "sarah@impactcapital.com",
        password: hashedPassword,
        role: "investor",
        profile: {
          bio: "Impact investor focused on sustainable and social impact startups.",
          investmentInterests: ["Clean Technology", "Social Impact", "Education"],
          portfolioCompanies: ["EcoSolutions", "EduTech", "SocialGood"],
          location: "Seattle, WA",
          investmentRange: "$50k - $1M",
          experience: "8+ years",
          website: "https://impactcapital.com",
        },
      },
    ]

    // Insert users
    const allUsers = [...entrepreneurs, ...investors]
    await User.insertMany(allUsers)

    console.log(`Seeded ${entrepreneurs.length} entrepreneurs and ${investors.length} investors`)
    console.log("Database seeding completed successfully!")

    // Display login credentials
    console.log("\n--- Sample Login Credentials ---")
    console.log("Entrepreneurs:")
    entrepreneurs.forEach((user) => {
      console.log(`Email: ${user.email} | Password: password123`)
    })
    console.log("\nInvestors:")
    investors.forEach((user) => {
      console.log(`Email: ${user.email} | Password: password123`)
    })
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await mongoose.disconnect()
    console.log("Disconnected from MongoDB")
  }
}

seedDatabase()
