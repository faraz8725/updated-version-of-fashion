require("dotenv").config();
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
