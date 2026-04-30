const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/signup
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });
  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password });
  res.status(201).json({
    token: signToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid email or password" });

  res.json({
    token: signToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// GET /api/auth/profile  (protected)
const getProfile = async (req, res) => {
  const { _id, name, email, role, createdAt } = req.user;
  res.json({ _id, name, email, role, createdAt });
};

module.exports = { signup, login, getProfile };
