import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cookieParser from "cookie-parser";

import { connectDB }from "./lib/db.js";
import dotenv from "dotenv";
import { app, server } from "./lib/socket.js";
import path from "path";
import cors from 'cors';
dotenv.config();

app.use(express.json({limit: "10mb"}));
app.use(cookieParser({limit: "10mb", extended: true}));


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const __dirname = path.resolve();

const PORT = process.env.PORT;
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  })
}

server.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
  connectDB();
});