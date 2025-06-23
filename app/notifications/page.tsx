"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check, MessageSquare, UserPlus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  _id: string
  type: "collaboration_request" | "request_accepted" | "new_message"
  title: string
  message: string
  read: boolean
  createdAt: string
  relatedUser?: {
    _id: string
    name: string
    role: string
  }
  actionUrl?: string
}

export default function NotificationsPage() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock notifications for demo purposes
    // In a real app, you'd fetch these from an API
    const mockNotifications: Notification[] = [
      {
        _id: "1",
        type: "collaboration_request",
        title: "New Collaboration Request",
        message: "Sarah Johnson wants to connect with your startup",
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        relatedUser: {
          _id: "user1",
          name: "Sarah Johnson",
          role: "investor",
        },
        actionUrl: "/dashboard/entrepreneur",
      },
      {
        _id: "2",
        type: "request_accepted",
        title: "Request Accepted",
        message: "Mike Chen accepted your collaboration request",
        read: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        relatedUser: {
          _id: "user2",
          name: "Mike Chen",
          role: "entrepreneur",
        },
        actionUrl: "/chat/user2",
      },
      {
        _id: "3",
        type: "new_message",
        title: "New Message",
        message: "You have a new message from Alex Rivera",
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        relatedUser: {
          _id: "user3",
          name: "Alex Rivera",
          role: "investor",
        },
        actionUrl: "/chat/user3",
      },
    ]

    setNotifications(mockNotifications)
    setLoading(false)
  }, [])

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif._id === notificationId ? { ...notif, read: true } : notif)))
    toast({
      title: "Marked as read",
      description: "Notification has been marked as read",
    })
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read",
    })
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId))
    toast({
      title: "Notification deleted",
      description: "Notification has been removed",
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "collaboration_request":
        return <UserPlus className="h-5 w-5 text-blue-500" />
      case "request_accepted":
        return <Check className="h-5 w-5 text-green-500" />
      case "new_message":
        return <MessageSquare className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="flex items-center justify-center h-96">
            <p>Loading notifications...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">
                Stay updated with your latest activities
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} unread
                  </Badge>
                )}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                Mark all as read
              </Button>
            )}
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No notifications yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  notifications.map((notification) => (
                    <Card key={notification._id} className={notification.read ? "opacity-60" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{notification.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                {notification.relatedUser && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={`https://avatar.vercel.sh/${notification.relatedUser.name}`} />
                                      <AvatarFallback className="text-xs">
                                        {notification.relatedUser.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-muted-foreground">
                                      {notification.relatedUser.name}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      {notification.relatedUser.role}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                                {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              {notification.actionUrl && (
                                <Button size="sm" asChild>
                                  <a href={notification.actionUrl}>View</a>
                                </Button>
                              )}
                              {!notification.read && (
                                <Button size="sm" variant="outline" onClick={() => markAsRead(notification._id)}>
                                  Mark as read
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={() => deleteNotification(notification._id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="unread">
              <div className="space-y-4">
                {notifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <Card key={notification._id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{notification.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="requests">
              <div className="space-y-4">
                {notifications
                  .filter((n) => n.type.includes("request"))
                  .map((notification) => (
                    <Card key={notification._id} className={notification.read ? "opacity-60" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <div className="space-y-4">
                {notifications
                  .filter((n) => n.type === "new_message")
                  .map((notification) => (
                    <Card key={notification._id} className={notification.read ? "opacity-60" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
