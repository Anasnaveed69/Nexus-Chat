"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, MessageSquare, X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Request {
  _id: string
  investorId: {
    _id: string
    name: string
    email: string
    profile?: {
      bio: string
      investmentInterests: string[]
      portfolioCompanies: string[]
    }
  }
  status: "pending" | "accepted" | "rejected"
  createdAt: string
}

export default function EntrepreneurDashboard() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Not authenticated")
        }

        const response = await fetch("/api/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch requests")
        }

        const data = await response.json()
        setRequests(data)
      } catch (err: any) {
        setError(err.message)
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const handleUpdateRequestStatus = async (requestId: string, status: "accepted" | "rejected") => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(`/api/request/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update request")
      }

      // Update UI to reflect the change
      setRequests(requests.map((request) => (request._id === requestId ? { ...request, status } : request)))
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
            <h1 className="text-3xl font-bold">Entrepreneur Dashboard</h1>
            <p className="text-muted-foreground">Manage your startup and investor connections</p>
          </div>

          <div className="grid gap-6">
            <Tabs defaultValue="pending">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="pending">Pending Requests</TabsTrigger>
                  <TabsTrigger value="accepted">Accepted</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="pending" className="mt-4">
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
                ) : requests.filter((r) => r.status === "pending").length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No pending requests from investors</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {requests
                      .filter((request) => request.status === "pending")
                      .map((request) => (
                        <Card key={request._id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src={`https://avatar.vercel.sh/${request.investorId.name}`} />
                                <AvatarFallback>{request.investorId.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-lg">{request.investorId.name}</CardTitle>
                                <CardDescription>Investor</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="line-clamp-3 text-sm">
                              {request.investorId.profile?.bio || "No bio available."}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {request.investorId.profile?.investmentInterests?.map((interest, index) => (
                                <Badge key={index} variant="outline">
                                  {interest}
                                </Badge>
                              )) || <Badge variant="outline">Investment Interests</Badge>}
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                              Request received: {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </CardContent>
                          <CardFooter className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleUpdateRequestStatus(request._id, "accepted")}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleUpdateRequestStatus(request._id, "rejected")}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Decline
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="accepted" className="mt-4">
                {loading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2].map((i) => (
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
                ) : requests.filter((r) => r.status === "accepted").length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No accepted investor requests</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {requests
                      .filter((request) => request.status === "accepted")
                      .map((request) => (
                        <Card key={request._id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src={`https://avatar.vercel.sh/${request.investorId.name}`} />
                                <AvatarFallback>{request.investorId.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-lg">{request.investorId.name}</CardTitle>
                                <CardDescription>Investor</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="line-clamp-3 text-sm">
                              {request.investorId.profile?.bio || "No bio available."}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {request.investorId.profile?.investmentInterests?.map((interest, index) => (
                                <Badge key={index} variant="outline">
                                  {interest}
                                </Badge>
                              )) || <Badge variant="outline">Investment Interests</Badge>}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="default" size="sm" className="w-full" asChild>
                              <a href={`/chat/${request.investorId._id}`}>
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
              <TabsContent value="rejected" className="mt-4">
                {loading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
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
                    </Card>
                  </div>
                ) : requests.filter((r) => r.status === "rejected").length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No rejected investor requests</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {requests
                      .filter((request) => request.status === "rejected")
                      .map((request) => (
                        <Card key={request._id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage src={`https://avatar.vercel.sh/${request.investorId.name}`} />
                                <AvatarFallback>{request.investorId.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-lg">{request.investorId.name}</CardTitle>
                                <CardDescription>Investor</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="line-clamp-3 text-sm">
                              {request.investorId.profile?.bio || "No bio available."}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {request.investorId.profile?.investmentInterests?.map((interest, index) => (
                                <Badge key={index} variant="outline">
                                  {interest}
                                </Badge>
                              )) || <Badge variant="outline">Investment Interests</Badge>}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
