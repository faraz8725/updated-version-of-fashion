require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

/* ✅ Connect DB */
connectDB();

/* ✅ CORS */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

/* ✅ Preflight */
app.options("*", cors());

/* ✅ Middleware */
app.use(express.json());

/* ✅ Routes */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

/* ✅ Health check */
app.get("/", (req, res) => {
  res.json({ message: "Halal Fashions API running 🚀" });
});

/* ✅ Error handler */
app.use(errorHandler);

/* ✅ Crash protection */
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

/* ✅ PORT */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});