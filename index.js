const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes");

// Load environment variables
dotenv.config();

// Connect to database
// connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// --- Routes ---
app.get("/api/hello", (req, res) => {
  res.json({
    success: true,
    message: "Hello! Welcome to my Node.js API",
    data: {
      status: "Active",
      version: "1.0.0",
    },
  });
});

app.use("/api/expense", expenseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  res.json({
    success: true,
    message: "Server is healthy",
    requested_at: fullUrl,
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const BASE_URL = process.env.BASE_URL || `http://127.0.0.1:${PORT}`;

// Connect to database then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`---------------------------------------`);
    console.log(`🚀 STATUS: Running in ${NODE_ENV} mode`);
    console.log(`📡 URL   : ${BASE_URL}`);
    console.log(`✅ MongoDB Connected Successfully`); // এখানেই লিখে দাও
    console.log(`---------------------------------------`);
  });
});
