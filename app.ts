import express from 'express';
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from './src/routes/index.js';
import cookieParser from 'cookie-parser';
import cors from "cors"
config();
const app = express();
// Configure CORS with more detailed settings
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'https://merngpt-a3cde628995b.herokuapp.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Log CORS and environment configuration for debugging
console.log("Environment:", process.env.NODE_ENV);
console.log("Frontend URL:", process.env.FRONTEND_URL);
console.log("Domain:", process.env.DOMAIN);
console.log("CORS configuration:", corsOptions);
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