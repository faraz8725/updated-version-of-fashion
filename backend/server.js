/*require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();

// app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://updated-version-of-fashion.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => res.json({ message: "Halal Fashions API running" }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();

/* ✅ FIXED CORS (production + dev both) *
const allowedOrigins = [
  "http://localhost:5173",
  "https://updated-version-of-fashion.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(null, false);
    }
  },
  credentials: true,
}));

/* ✅ IMPORTANT: handle preflight *
app.options("*", cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => res.json({ message: "Halal Fashions API running" }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); */


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

/* ✅ CORS (simple & stable) */
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

/* ✅ Preflight handling */
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));

/* ✅ Middleware */
app.use(express.json());

/* ✅ Routes */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

/* ✅ Test route */
app.get("/", (req, res) => {
  res.json({ message: "Halal Fashions API running 🚀" });
});

/* ✅ Error handler */
app.use(errorHandler);

/* ✅ PORT (Render compatible) */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});