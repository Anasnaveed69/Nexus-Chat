"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

interface User {
  _id: string
  name: string
  email: string
  role: "investor" | "entrepreneur"
  profile?: {
    bio: string
    // Entrepreneur fields
    startupName?: string
    pitchSummary?: string
    fundingNeeded?: string
    industry?: string
    location?: string
    foundedYear?: string
    teamSize?: string
    website?: string
    // Investor fields
    investmentInterests?: string[]
    portfolioCompanies?: string[]
    investmentRange?: string
    experience?: string
  }
}

export default function EditProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [newInterest, setNewInterest] = useState("")
  const [newCompany, setNewCompany] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        if (!token || !userData) {
          router.push("/login")
          return
        }

        const currentUser = JSON.parse(userData)
        const response = await fetch(`/api/profile/${currentUser._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const profileData = await response.json()
        setUser(profileData)
        setFormData({
          name: profileData.name,
          bio: profileData.profile?.bio || "",
          // Entrepreneur fields
          startupName: profileData.profile?.startupName || "",
          pitchSummary: profileData.profile?.pitchSummary || "",
          fundingNeeded: profileData.profile?.fundingNeeded || "",
          industry: profileData.profile?.industry || "",
          location: profileData.profile?.location || "",
          foundedYear: profileData.profile?.foundedYear || "",
          teamSize: profileData.profile?.teamSize || "",
          website: profileData.profile?.website || "",
          // Investor fields
          investmentInterests: profileData.profile?.investmentInterests || [],
          portfolioCompanies: profileData.profile?.portfolioCompanies || [],
          investmentRange: profileData.profile?.investmentRange || "",
          experience: profileData.profile?.experience || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router, toast])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const addInterest = () => {
    if (newInterest.trim() && !formData.investmentInterests.includes(newInterest.trim())) {
      setFormData((prev: any) => ({
        ...prev,
        investmentInterests: [...prev.investmentInterests, newInterest.trim()],
      }))
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setFormData((prev: any) => ({
      ...prev,
      investmentInterests: prev.investmentInterests.filter((i: string) => i !== interest),
    }))
  }

  const addCompany = () => {
    if (newCompany.trim() && !formData.portfolioCompanies.includes(newCompany.trim())) {
      setFormData((prev: any) => ({
        ...prev,
        portfolioCompanies: [...prev.portfolioCompanies, newCompany.trim()],
      }))
      setNewCompany("")
    }
  }

  const removeCompany = (company: string) => {
    setFormData((prev: any) => ({
      ...prev,
      portfolioCompanies: prev.portfolioCompanies.filter((c: string) => c !== company),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      // Update localStorage with new user data
      const updatedUser = { ...user, name: formData.name, profile: formData }
      localStorage.setItem("user", JSON.stringify(updatedUser))

      router.push(`/profile/${user?.role}/${user?._id}`)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="flex items-center justify-center h-96">
            <p>Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="text-center py-10">
            <p className="text-destructive">Profile not found</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Edit Profile</h1>
              <p className="text-muted-foreground">Update your profile information</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              {user.role === "entrepreneur" ? (
                <>
                  <TabsTrigger value="startup">Startup Details</TabsTrigger>
                  <TabsTrigger value="funding">Funding</TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="investment">Investment Focus</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, State/Country"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {user.role === "entrepreneur" && (
              <>
                <TabsContent value="startup">
                  <Card>
                    <CardHeader>
                      <CardTitle>Startup Information</CardTitle>
                      <CardDescription>Details about your startup</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="startupName">Startup Name</Label>
                        <Input
                          id="startupName"
                          value={formData.startupName}
                          onChange={(e) => handleInputChange("startupName", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="pitchSummary">Pitch Summary</Label>
                        <Textarea
                          id="pitchSummary"
                          placeholder="Describe your startup in a few sentences..."
                          value={formData.pitchSummary}
                          onChange={(e) => handleInputChange("pitchSummary", e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Input
                            id="industry"
                            placeholder="e.g., Technology, Healthcare"
                            value={formData.industry}
                            onChange={(e) => handleInputChange("industry", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="foundedYear">Founded Year</Label>
                          <Input
                            id="foundedYear"
                            placeholder="2024"
                            value={formData.foundedYear}
                            onChange={(e) => handleInputChange("foundedYear", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="teamSize">Team Size</Label>
                        <Input
                          id="teamSize"
                          placeholder="e.g., 1-5, 5-10, 10+"
                          value={formData.teamSize}
                          onChange={(e) => handleInputChange("teamSize", e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="funding">
                  <Card>
                    <CardHeader>
                      <CardTitle>Funding Information</CardTitle>
                      <CardDescription>Details about your funding needs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fundingNeeded">Funding Needed</Label>
                        <Input
                          id="fundingNeeded"
                          placeholder="e.g., $100k - $500k"
                          value={formData.fundingNeeded}
                          onChange={(e) => handleInputChange("fundingNeeded", e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}

            {user.role === "investor" && (
              <>
                <TabsContent value="investment">
                  <Card>
                    <CardHeader>
                      <CardTitle>Investment Focus</CardTitle>
                      <CardDescription>Your investment preferences and experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="investmentRange">Investment Range</Label>
                        <Input
                          id="investmentRange"
                          placeholder="e.g., $25k - $500k"
                          value={formData.investmentRange}
                          onChange={(e) => handleInputChange("investmentRange", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="experience">Experience</Label>
                        <Input
                          id="experience"
                          placeholder="e.g., 10+ years"
                          value={formData.experience}
                          onChange={(e) => handleInputChange("experience", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Investment Interests</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add interest (e.g., Technology)"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addInterest()}
                          />
                          <Button type="button" onClick={addInterest}>
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.investmentInterests?.map((interest: string, index: number) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {interest}
                              <X className="h-3 w-3 cursor-pointer" onClick={() => removeInterest(interest)} />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="portfolio">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Companies</CardTitle>
                      <CardDescription>Companies you have invested in</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label>Portfolio Companies</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add company name"
                            value={newCompany}
                            onChange={(e) => setNewCompany(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addCompany()}
                          />
                          <Button type="button" onClick={addCompany}>
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.portfolioCompanies?.map((company: string, index: number) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {company}
                              <X className="h-3 w-3 cursor-pointer" onClick={() => removeCompany(company)} />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
