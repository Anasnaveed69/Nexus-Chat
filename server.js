const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const { Server } = require("socket.io")

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error("Error occurred handling", req.url, err)
      res.statusCode = 500
      res.end("internal server error")
    }
  })

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  })

  // Socket.io connection handling
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    // Join a room for private messaging
    socket.on("join-room", (roomId) => {
      socket.join(roomId)
      console.log(`User ${socket.id} joined room ${roomId}`)
    })

    // Handle sending messages
    socket.on("send-message", (data) => {
      const { roomId, message, senderId, receiverId } = data

      // Broadcast message to the room
      socket.to(roomId).emit("receive-message", {
        message,
        senderId,
        receiverId,
        timestamp: new Date().toISOString(),
      })
    })

    // Handle user typing
    socket.on("typing", (data) => {
      socket.to(data.roomId).emit("user-typing", {
        userId: data.userId,
        isTyping: data.isTyping,
      })
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)
    })
  })

  server
    .once("error", (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
