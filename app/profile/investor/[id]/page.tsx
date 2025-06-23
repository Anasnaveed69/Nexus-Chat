"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface InvestorProfile {
  _id: string
  name: string
  email: string
  profile?: {
    bio: string
    investmentInterests: string[]
    portfolioCompanies: string[]
    location: string
    investmentRange: string
    experience: string
    website: string
  }
}

export default function InvestorProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState<InvestorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isSelf, setIsSelf] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        if (!token) {
          throw new Error("Not authenticated")
        }

        if (userData) {
          const user = JSON.parse(userData)
          setIsSelf(user._id === id)
        }

        const response = await fetch(`/api/profile/investor/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setProfile(data)
      } catch (err: any) {
        setError(err.message)
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !profile) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="text-center py-10">
            <p className="text-destructive">{error || "Profile not found"}</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="grid gap-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`https://avatar.vercel.sh/${profile.name}`} />
                  <AvatarFallback className="text-lg">{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{profile.name}</CardTitle>
                  <CardDescription className="text-lg">Investor</CardDescription>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {profile.profile?.investmentInterests?.slice(0, 3).map((interest, index) => (
                      <Badge key={index} variant="outline">
                        {interest}
                      </Badge>
                    )) || <Badge variant="outline">Investment Interests</Badge>}
                    <Badge variant="outline">{profile.profile?.location || "Location"}</Badge>
                  </div>
                </div>
                {!isSelf && (
                  <div className="flex gap-2">
                    <Button asChild>
                      <a href={`/chat/${profile._id}`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Profile Details */}
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="investments">Investment Focus</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{profile.profile?.bio || "No bio available."}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                    {profile.profile?.website && (
                      <div>
                        <p className="text-sm font-medium">Website</p>
                        <a
                          href={profile.profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {profile.profile.website}
                        </a>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm text-muted-foreground">{profile.profile?.experience || "Not specified"}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="investments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Focus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">Investment Range</h4>
                    <p className="text-sm text-muted-foreground">
                      {profile.profile?.investmentRange || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Investment Interests</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.profile?.investmentInterests?.map((interest, index) => (
                        <Badge key={index} variant="outline">
                          {interest}
                        </Badge>
                      )) || <p className="text-sm text-muted-foreground">No investment interests specified</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.profile?.portfolioCompanies && profile.profile.portfolioCompanies.length > 0 ? (
                    <div className="grid gap-2">
                      {profile.profile.portfolioCompanies.map((company, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <p className="font-medium">{company}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No portfolio companies listed</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
