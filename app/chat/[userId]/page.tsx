"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { io, type Socket } from "socket.io-client"

interface Message {
  _id: string
  senderId: string
  receiverId: string
  message: string
  timestamp: string
}

interface User {
  _id: string
  name: string
  email: string
  role: "investor" | "entrepreneur"
}

export default function ChatPage() {
  const { userId } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<Socket | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        if (!token || !userData) {
          throw new Error("Not authenticated")
        }

        const user = JSON.parse(userData)
        setCurrentUser(user)

        // Initialize Socket.io
        socketRef.current = io()
        const roomId = [user._id, userId].sort().join("-")
        socketRef.current.emit("join-room", roomId)

        // Listen for incoming messages
        socketRef.current.on("receive-message", (messageData) => {
          const newMsg: Message = {
            _id: Date.now().toString(),
            senderId: messageData.senderId,
            receiverId: messageData.receiverId,
            message: messageData.message,
            timestamp: messageData.timestamp,
          }
          setMessages((prev) => [...prev, newMsg])
        })

        // Listen for typing indicators
        socketRef.current.on("user-typing", (data) => {
          setOtherUserTyping(data.isTyping)
        })

        // Fetch other user's profile
        const userResponse = await fetch(`/api/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user profile")
        }

        const otherUserData = await userResponse.json()
        setOtherUser(otherUserData)

        // Fetch chat messages
        const messagesResponse = await fetch(`/api/chat/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!messagesResponse.ok) {
          throw new Error("Failed to fetch messages")
        }

        const messagesData = await messagesResponse.json()
        setMessages(messagesData)
      } catch (err: any) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    initializeChat()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [userId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !currentUser || !socketRef.current) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      // Send message via API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: userId,
          message: newMessage.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const sentMessage = await response.json()
      setMessages((prev) => [...prev, sentMessage])

      // Send message via Socket.io for real-time delivery
      const roomId = [currentUser._id, userId].sort().join("-")
      socketRef.current.emit("send-message", {
        roomId,
        message: newMessage.trim(),
        senderId: currentUser._id,
        receiverId: userId,
      })

      setNewMessage("")

      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false)
        socketRef.current.emit("typing", {
          roomId,
          userId: currentUser._id,
          isTyping: false,
        })
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }
  }

  const handleTyping = (value: string) => {
    setNewMessage(value)

    if (!socketRef.current || !currentUser) return

    const roomId = [currentUser._id, userId].sort().join("-")

    if (value.trim() && !isTyping) {
      setIsTyping(true)
      socketRef.current.emit("typing", {
        roomId,
        userId: currentUser._id,
        isTyping: true,
      })
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false)
        socketRef.current?.emit("typing", {
          roomId,
          userId: currentUser._id,
          isTyping: false,
        })
      }
    }, 1000)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="flex items-center justify-center h-96">
            <p>Loading chat...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!otherUser) {
    return (
      <DashboardLayout>
        <div className="container py-6">
          <div className="text-center py-10">
            <p className="text-destructive">User not found</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${otherUser.name}`} />
                <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{otherUser.name}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">
                  {otherUser.role}
                  {otherUserTyping && <span className="ml-2 text-primary">typing...</span>}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col h-full p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={cn("flex", message.senderId === currentUser?._id ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-xs lg:max-w-md px-3 py-2 rounded-lg",
                        message.senderId === currentUser?._id ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          message.senderId === currentUser?._id
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => handleTyping(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
