const cors = require("cors");

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