"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Users, MessageSquare, UserPlus, TrendingUp } from "lucide-react"

interface AdminStats {
  totalUsers: number
  totalEntrepreneurs: number
  totalInvestors: number
  totalRequests: number
  totalMessages: number
  recentSignups: number
}

interface User {
  _id: string
  name: string
  email: string
  role: string
  createdAt: string
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalEntrepreneurs: 0,
    totalInvestors: 0,
    totalRequests: 0,
    totalMessages: 0,
    recentSignups: 0,
  })
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for admin dashboard
    // In a real app, you'd fetch this from admin APIs
    const mockStats: AdminStats = {
      totalUsers: 156,
      totalEntrepreneurs: 89,
      totalInvestors: 67,
      totalRequests: 234,
      totalMessages: 1456,
      recentSignups: 12,
    }

    const mockRecentUsers: User[] = [
      {
        _id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "entrepreneur",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "investor",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: "3",
        name: "Mike Johnson",
        email: "mike@example.com",
        role: "entrepreneur",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ]

    setStats(mockStats)
    setRecentUsers(mockRecentUsers)
    setLoading(false)
  }, [])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="flex items-center justify-center h-96">
            <p>Loading admin dashboard...</p>
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
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor platform activity and user engagement</p>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+{stats.recentSignups} from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entrepreneurs</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEntrepreneurs}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.totalEntrepreneurs / stats.totalUsers) * 100)}% of total users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investors</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInvestors}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.totalInvestors / stats.totalUsers) * 100)}% of total users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRequests}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(stats.totalRequests / stats.totalUsers)} avg per user
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Recent Users</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Growth</CardTitle>
                    <CardDescription>User registration trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">This Week</span>
                        <span className="font-medium">+{stats.recentSignups} users</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Messages</span>
                        <span className="font-medium">{stats.totalMessages}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Connections</span>
                        <span className="font-medium">{Math.round(stats.totalRequests * 0.3)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Distribution</CardTitle>
                    <CardDescription>Breakdown by user type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Entrepreneurs</span>
                        </div>
                        <span className="font-medium">{stats.totalEntrepreneurs}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Investors</span>
                        </div>
                        <span className="font-medium">{stats.totalInvestors}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Registrations</CardTitle>
                  <CardDescription>Latest users who joined the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://avatar.vercel.sh/${user.name}`} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.role === "investor" ? "default" : "secondary"}>{user.role}</Badge>
                          <span className="text-sm text-muted-foreground">{formatTimeAgo(user.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Activity</CardTitle>
                  <CardDescription>Recent platform interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">New message sent</p>
                        <p className="text-xs text-muted-foreground">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <UserPlus className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Collaboration request accepted</p>
                        <p className="text-xs text-muted-foreground">15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Users className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-muted-foreground">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Metrics</CardTitle>
                    <CardDescription>User interaction statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Messages per User</span>
                        <span className="font-medium">{Math.round(stats.totalMessages / stats.totalUsers)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Connection Success Rate</span>
                        <span className="font-medium">73%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Daily Active Users</span>
                        <span className="font-medium">{Math.round(stats.totalUsers * 0.4)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Industries</CardTitle>
                    <CardDescription>Most common startup sectors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Technology</span>
                        <span className="font-medium">34%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Healthcare</span>
                        <span className="font-medium">22%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Fintech</span>
                        <span className="font-medium">18%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Clean Energy</span>
                        <span className="font-medium">12%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Other</span>
                        <span className="font-medium">14%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
