"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, MessageSquare, UserPlus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface EntrepreneurProfile {
  _id: string
  name: string
  email: string
  profile?: {
    bio: string
    startupName: string
    pitchSummary: string
    fundingNeeded: string
    industry: string
    location: string
    foundedYear: string
    teamSize: string
    website: string
  }
}

export default function EntrepreneurProfilePage() {
  const { id } = useParams()
  const [profile, setProfile] = useState<EntrepreneurProfile | null>(null)
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

        const response = await fetch(`/api/profile/entrepreneur/${id}`, {
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

  const handleSendRequest = async () => {
    if (!profile) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch("/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ entrepreneur: profile._id }),
      })

      if (!response.ok) {
        throw new Error("Failed to send request")
      }

      alert("Collaboration request sent successfully!")
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }
  }

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
                  <CardDescription className="text-lg">
                    {profile.profile?.startupName || "Entrepreneur"}
                  </CardDescription>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="outline">{profile.profile?.industry || "Technology"}</Badge>
                    <Badge variant="outline">{profile.profile?.location || "Location"}</Badge>
                    <Badge variant="outline">Founded {profile.profile?.foundedYear || "2024"}</Badge>
                  </div>
                </div>
                {!isSelf && (
                  <div className="flex gap-2">
                    <Button onClick={handleSendRequest}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Connect
                    </Button>
                    <Button variant="outline" asChild>
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
              <TabsTrigger value="startup">Startup Details</TabsTrigger>
              <TabsTrigger value="funding">Funding</TabsTrigger>
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
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="startup" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Startup Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">Company Name</h4>
                    <p className="text-sm text-muted-foreground">{profile.profile?.startupName || "Not specified"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Pitch Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      {profile.profile?.pitchSummary || "No pitch summary available."}
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium">Industry</h4>
                      <p className="text-sm text-muted-foreground">{profile.profile?.industry || "Not specified"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Team Size</h4>
                      <p className="text-sm text-muted-foreground">{profile.profile?.teamSize || "Not specified"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="funding" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Funding Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">Funding Needed</h4>
                    <p className="text-sm text-muted-foreground">{profile.profile?.fundingNeeded || "Not specified"}</p>
                  </div>
                  <div className="flex items-center gap-2 p-4 border rounded-lg">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Pitch Deck</p>
                      <p className="text-xs text-muted-foreground">Available upon request</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
