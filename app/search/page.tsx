"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Search, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  _id: string
  name: string
  email: string
  role: "investor" | "entrepreneur"
  profile?: {
    bio: string
    startupName?: string
    pitchSummary?: string
    fundingNeeded?: string
    industry?: string
    location?: string
    investmentInterests?: string[]
    portfolioCompanies?: string[]
    investmentRange?: string
  }
}

export default function SearchPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        if (!token || !userData) {
          return
        }

        setCurrentUser(JSON.parse(userData))

        // Fetch both entrepreneurs and investors
        const [entrepreneursRes, investorsRes] = await Promise.all([
          fetch("/api/entrepreneurs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/investors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const entrepreneurs = entrepreneursRes.ok ? await entrepreneursRes.json() : []
        const investors = investorsRes.ok ? await investorsRes.json() : []

        const allUsers = [...entrepreneurs, ...investors]
        setUsers(allUsers)
        setFilteredUsers(allUsers)
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [toast])

  useEffect(() => {
    let filtered = users.filter((user) => user._id !== currentUser?._id)

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.profile?.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.profile?.startupName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.profile?.industry?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Industry filter
    if (industryFilter !== "all") {
      filtered = filtered.filter((user) => user.profile?.industry?.toLowerCase() === industryFilter.toLowerCase())
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter((user) => user.profile?.location?.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, industryFilter, locationFilter, roleFilter, currentUser])

  const handleSendRequest = async (userId: string) => {
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
        body: JSON.stringify({ entrepreneurId: userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to send request")
      }

      toast({
        title: "Success",
        description: "Collaboration request sent successfully!",
      })
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getUniqueValues = (field: string) => {
    const values = users
      .map((user) => {
        if (field === "industry") return user.profile?.industry
        if (field === "location") return user.profile?.location?.split(",")[0] // Get city only
        return null
      })
      .filter(Boolean)
    return [...new Set(values)]
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="flex items-center justify-center h-96">
            <p>Loading users...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">Search & Discover</h1>
            <p className="text-muted-foreground">Find entrepreneurs and investors to connect with</p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, bio, startup..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="entrepreneur">Entrepreneurs</SelectItem>
                    <SelectItem value="investor">Investors</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {getUniqueValues("industry").map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {getUniqueValues("location").map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No users found matching your criteria</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <Card key={user._id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`https://avatar.vercel.sh/${user.name}`} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <CardDescription>
                          {user.role === "entrepreneur" ? user.profile?.startupName || "Entrepreneur" : "Investor"}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-sm mb-2">{user.profile?.bio || "No bio available."}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{user.profile?.industry || "Industry"}</Badge>
                      <Badge variant="outline">{user.profile?.location || "Location"}</Badge>
                      {user.role === "entrepreneur" && (
                        <Badge variant="outline">{user.profile?.fundingNeeded || "Funding"}</Badge>
                      )}
                      {user.role === "investor" && (
                        <Badge variant="outline">{user.profile?.investmentRange || "Investment Range"}</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    {currentUser?.role === "investor" && user.role === "entrepreneur" && (
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSendRequest(user._id)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={`/chat/${user._id}`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
