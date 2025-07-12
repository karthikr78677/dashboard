// require('dotenv').config();
// const express  = require('express');
// const mongoose = require('mongoose');
// const cors     = require('cors');
// const multer   = require('multer');
// const path     = require('path');
// const fs       = require('fs');

// const app = express();
// app.use(cors());

// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// const uploadPath = path.join(__dirname, 'uploads');
// console.log(uploadPath)
// if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
// const MONGODB_URL = process.env.MONGODB_URL;
// const PORT = process.env.PORT || 3001;

// mongoose.connect(MONGODB_URL)
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch(err => {
//     console.error('❌ MongoDB connection failed:', err.message);
//     process.exit(1);
//   });
// const productSchema = new mongoose.Schema({
//   name:        { type: String, required: true },
//   cost:        { type: Number, required: true },
//   description: { type: String },
//   image:       { type: String },
// }, { timestamps: true });

// const Product = mongoose.model('adminProductsList', productSchema);
// const storage = multer.diskStorage({
//   destination: (_, __, cb) => cb(null, 'uploads'),
//   filename:    (_, file, cb) =>
//     cb(null, `${Date.now()}${path.extname(file.originalname)}`)
// });
// const upload = multer({ storage });

// app.post('/api/products', upload.single('image'), async (req, res) => {
//   const { name, cost, description } = req.body;
//   if (!name || !cost) {
//     return res.status(400).json({ success: false, message: 'Name and cost are required' });
//   }

//   try {
//     const newProduct = new Product({
//       name,
//       cost,
//       description,
//       image: req.file ? `/uploads/${req.file.filename}` : ''
//     });
//     const saved = await newProduct.save();
//     res.status(201).json({ success: true, data: saved });
//   } catch (err) {
//     console.error('Save error:', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });
// app.get('/api/products', async (_, res) => {
//   try {
//     const products = await Product.find().sort({ createdAt: -1 });
//     res.json({ success: true, data: products });
//   } catch (err) {
//     console.error('Fetch error:', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));











require("dotenv").config();
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const multer   = require("multer");
const path     = require("path");
const fs       = require("fs");

const app  = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URL = process.env.MONGODB_URL;

// ───────────────────────────────────── CORS & JSON
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ───────────────────────────────────── Static uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use("/uploads", express.static(uploadDir));

// ───────────────────────────────────── MongoDB
mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ───────────────────────────────────── Mongoose model
const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    cost:        { type: Number, required: true },
    description: { type: String },
    image:       { type: String },
  },
  { timestamps: true }
);
const Product = mongoose.model("adminProductsList", productSchema);

// ───────────────────────────────────── Multer
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename:    (_, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

// ───────────────────────────────────── Routes
app.post("/api/products", upload.single("image"), async (req, res) => {
  const { name, cost, description } = req.body;
  if (!name || !cost) {
    return res
      .status(400)
      .json({ success: false, message: "Name and cost are required" });
  }

  try {
    const newProduct = new Product({
      name,
      cost,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });
    const saved = await newProduct.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

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
