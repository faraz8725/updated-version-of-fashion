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

/* ✅ Allowed Origins */
const allowedOrigins = [
  "http://localhost:5173",
  "https://updated-version-of-fashion.vercel.app"
];

/* ✅ CORS CONFIG (FINAL FIX) */
const corsOptions = {
  origin: function (origin, callback) {
    console.log("Request Origin:", origin); // debug

    // allow requests with no origin (like mobile apps, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
};

/* ✅ Apply CORS */
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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