require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URL = process.env.MONGODB_URL;

// ───────────────────────────────────── Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// ───────────────────────────────────── MongoDB Connection
mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ───────────────────────────────────── Schema
const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    cost:        { type: Number, required: true },
    description: { type: String },
    images:      { type: [String], required: true }, // array of URLs
  },
  { timestamps: true }
);

const Product = mongoose.model("adminProductsList", productSchema);

// ───────────────────────────────────── Routes

// Add Product
app.post("/api/products", async (req, res) => {
  try {
    const { name, cost, description, images } = req.body;

    // Validation
    if (!name || !cost || !images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name, cost, and at least one image URL are required",
      });
    }

    const newProduct = new Product({ name, cost, description, images });
    const savedProduct = await newProduct.save();

    res.status(201).json({ success: true, data: savedProduct });
  } catch (err) {
    console.error("❌ Error saving product:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get All Products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ───────────────────────────────────── Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
