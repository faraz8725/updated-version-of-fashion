const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect, adminOnly } = require("../middleware/auth");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.post("/upload/image", protect, adminOnly, upload.single("image"), uploadImage);

module.exports = router;
