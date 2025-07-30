import express from 'express';
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from './src/routes/index.js';
import cookieParser from 'cookie-parser';
import cors from "cors"
config();
const app = express();
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  console.log('Request Headers:', req.headers);
  next();
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