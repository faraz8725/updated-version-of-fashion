require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

/* ✅ INIT APP FIRST */
const app = express();

/* ✅ CONNECT DB */
connectDB();

/* ✅ CORS CONFIG */
const allowedOrigins = [
  "http://localhost:5173",
  "https://updated-version-of-fashion.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("Origin:", origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked"));
    }
  },
  credentials: true
}));

/* ❌ REMOVE THIS (important) */
// app.options("*", cors());

/* ✅ MIDDLEWARE */
app.use(express.json());

/* ✅ ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

/* ✅ HEALTH */
app.get("/", (req, res) => {
  res.json({ message: "API running 🚀" });
});

/* ✅ ERROR HANDLER */
app.use(errorHandler);

/* ✅ PORT */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});