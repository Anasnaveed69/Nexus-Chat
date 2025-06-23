"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, UserPlus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Entrepreneur {
  _id: string
  name: string
  email: string
  profile?: {
    bio: string
    startupName: string
    pitchSummary: string
    fundingNeeded: string
    industry: string
  }
}

export default function InvestorDashboard() {
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Not authenticated")
        }

        const response = await fetch("/api/entrepreneurs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch entrepreneurs")
        }

        const data = await response.json()
        setEntrepreneurs(data)
      } catch (err: any) {
        setError(err.message)
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEntrepreneurs()
  }, [])

  const handleSendRequest = async (entrepreneurId: string) => {
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
        body: JSON.stringify({ entrepreneurId }),
      })

      if (!response.ok) {
        throw new Error("Failed to send request")
      }

      // Update UI to show request sent
      alert("Collaboration request sent successfully!")
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">Investor Dashboard</h1>
            <p className="text-muted-foreground">Find entrepreneurs and startups to invest in</p>
          </div>

          <div className="grid gap-6">
            <Tabs defaultValue="all">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Startups</TabsTrigger>
                  <TabsTrigger value="tech">Tech</TabsTrigger>
                  <TabsTrigger value="health">Health</TabsTrigger>
                  <TabsTrigger value="finance">Finance</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="all" className="mt-4">
                {loading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                        <CardFooter>
                          <Skeleton className="h-9 w-full" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-10">
                    <p className="text-destructive">{error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
                      Try Again
                    </Button>
                  </div>
                ) : entrepreneurs.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No entrepreneurs found</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {entrepreneurs.map((entrepreneur) => (
                      <Card key={entrepreneur._id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={`https://avatar.vercel.sh/${entrepreneur.name}`} />
                              <AvatarFallback>{entrepreneur.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{entrepreneur.name}</CardTitle>
                              <CardDescription>{entrepreneur.profile?.startupName || "Startup"}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="line-clamp-3 text-sm">
                            {entrepreneur.profile?.pitchSummary || "No pitch summary available."}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline">{entrepreneur.profile?.industry || "Technology"}</Badge>
                            <Badge variant="outline">{entrepreneur.profile?.fundingNeeded || "$100k - $500k"}</Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleSendRequest(entrepreneur._id)}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Connect
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <a href={`/chat/${entrepreneur._id}`}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Message
                            </a>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="tech" className="mt-4">
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Filter by Tech category coming soon</p>
                </div>
              </TabsContent>
              <TabsContent value="health" className="mt-4">
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Filter by Health category coming soon</p>
                </div>
              </TabsContent>
              <TabsContent value="finance" className="mt-4">
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Filter by Finance category coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
