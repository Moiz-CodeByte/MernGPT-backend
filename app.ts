import express from 'express';
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from './src/routes/index.js';
import cookieParser from 'cookie-parser';
import cors from "cors"
config();
const app = express();
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? process.env.FRONTEND_URL 
    : "http://localhost:5173", 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log CORS configuration for debugging
console.log("CORS configuration:", {
  origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:5173",
  credentials: true
});
app.use(express.json()); // for parsing application/json

app.use(cookieParser(process.env.COOKIE_SECRET));
//remove it in the production
app.use(morgan("dev"));

app.use("/api/v1" , appRouter);

// Health check endpoint for Heroku
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

export default app;