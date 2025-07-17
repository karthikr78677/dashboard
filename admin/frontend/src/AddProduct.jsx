import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3001";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "cricketball");
    data.append("cloud_name", "diuukkwgo");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/diuukkwgo/image/upload", {
        method: "POST",
        body: data,
      });

      const uploaded = await res.json();
      console.log("Uploaded URL:", uploaded.url);
      setImageUrl(uploaded.url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name,
      cost: Number(cost),
      description: desc,
      image: imageUrl,
    };

    try {
      const { data } = await axios.post(`${API_BASE}/api/products`, productData);

      if (data.success) {
        alert("✅ Product added");
      } else {
        alert("❌ Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error — check console");
    }

    // Reset form
    setName("");
    setCost("");
    setDesc("");
    setImageUrl(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">New Product</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Cost (₹)"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="border p-2 rounded"
        />

        {/* Placeholder for future category logic */}
        <select className="border p-2 rounded">
          <option value="bats">Bats</option>
          <option disabled>+ Add category (feature coming soon)</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded"
          />
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
