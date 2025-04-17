// packages
import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import fileUpload from "express-fileupload";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";

// db
import connectDb from "./db/connectDb.js";

// middleware
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

// routers
import adminRouter from "./routes/adminRoutes.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import staffRouter from "./routes/staffRoutes.js";
import trainerRouter from "./routes/trainerRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import productRouter from "./routes/productRoutes.js";
import packageRouter from "./routes/packageRoute.js";
import paymentRouter from "./routes/paymentRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
//socket
import socketSetup from "./sockets/socketSetup.js";

// app
dotenv.config();
const app = express();
const __dirname = path.resolve();
const server = http.createServer(app); // wrap express app in HTTP server

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// middlewares
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload({ useTempFiles: true }));

app.use(
  cors({
    origin: [
      "https://mern-gym-managment-system.onrender.com", // Add your Render frontend URL
      "http://localhost:5173", // For local development
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// routes
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/trainer", trainerRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/package", packageRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// error handling
app.use(notFound);
app.use(errorHandler);

// socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "https://mern-gym-managment-system.onrender.com",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socketSetup(io, socket);
});

// init
const port = process.env.PORT || 4999;
const init = async () => {
  try {
    await connectDb();
    server.listen(port, () => {
      console.log(`App and Socket.IO server running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

init();
