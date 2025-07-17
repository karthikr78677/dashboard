require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URL = process.env.MONGODB_URL;

// ───────────────────────────────────── Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ───────────────────────────────────── MongoDB
mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ───────────────────────────────────── Mongoose Schema
const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    cost:        { type: Number, required: true },
    description: { type: String },
    image:       { type: String }, // now expects a URL
  },
  { timestamps: true }
);
const Product = mongoose.model("adminProductsList", productSchema);

// ───────────────────────────────────── Routes

// Create product with image URL
app.post("/api/products", async (req, res) => {
  const { name, cost, description, image } = req.body;

  if (!name || !cost || !image) {
    return res
      .status(400)
      .json({ success: false, message: "Name, cost, and image URL are required" });
  }

  try {
    const newProduct = new Product({ name, cost, description, image });
    const saved = await newProduct.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all products
app.get("/api/products", async (_, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ───────────────────────────────────── Start
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
