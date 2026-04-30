const Product = require("../models/Product");
const ImageKit = require("imagekit");  // upgrade to @imagekit/nodejs when ready

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// GET /api/products
const getProducts = async (req, res) => {
  const { category, featured, q, sort } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (featured === "true") filter.featured = true;
  if (q) filter.$or = [
    { name: { $regex: q, $options: "i" } },
    { description: { $regex: q, $options: "i" } },
  ];

  let sortObj = { createdAt: -1 };
  if (sort === "price-asc") sortObj = { price: 1 };
  else if (sort === "price-desc") sortObj = { price: -1 };
  else if (sort === "rating") sortObj = { rating: -1 };
  else if (sort === "featured") sortObj = { featured: -1, createdAt: -1 };

  const products = await Product.find(filter).sort(sortObj);
  res.json(products);
};

// GET /api/products/:id  (supports both _id and slug)
const getProduct = async (req, res) => {
  const { id } = req.params;
  const product =
    id.match(/^[a-f\d]{24}$/i)
      ? await Product.findById(id)
      : await Product.findOne({ slug: id });

  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

// POST /api/products  (admin)
const createProduct = async (req, res) => {
  const { name, description, price, category, sizes, stock, images, featured } = req.body;

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const product = await Product.create({
    name,
    slug,
    description,
    price,
    category,
    sizes: Array.isArray(sizes) ? sizes : sizes?.split(",").map((s) => s.trim()).filter(Boolean) || [],
    stock,
    images: images || [],
    featured: featured || false,
  });

  res.status(201).json(product);
};

// PUT /api/products/:id  (admin)
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const { name, description, price, category, sizes, stock, images, featured } = req.body;

  if (name) {
    product.name = name;
    product.slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = price;
  if (category) product.category = category;
  if (sizes) product.sizes = Array.isArray(sizes) ? sizes : sizes.split(",").map((s) => s.trim()).filter(Boolean);
  if (stock !== undefined) product.stock = stock;
  if (images) product.images = images;
  if (featured !== undefined) product.featured = featured;

  const updated = await product.save();
  res.json(updated);
};

// DELETE /api/products/:id  (admin)
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
};

// POST /api/products/upload  (admin — ImageKit)
const uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file provided" });

  const result = await imagekit.upload({
    file: req.file.buffer.toString("base64"),
    fileName: `${Date.now()}-${req.file.originalname}`,
    folder: "/halal-fashions/products",
  });

  res.json({ url: result.url });
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, uploadImage };
