import React, { useState, useRef } from "react";
import axios from "axios";

const API_BASE = "https://dashboard-admin-backend-tqiy.onrender.com";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);

    try {
      const newUrls = await Promise.all(
        files.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "cricketball");

          const res = await fetch(
            "https://api.cloudinary.com/v1_1/diuukkwgo/image/upload",
            {
              method: "POST",
              body: data,
            }
          );

          const uploaded = await res.json();
          console.log("Uploaded URL:", uploaded.secure_url);
          if (!uploaded.secure_url) throw new Error("Image upload failed");

          return uploaded.secure_url;
        })
      );

      setImageUrls((prev) => [...prev, ...newUrls]);
    } catch (err) {
      console.error("Image upload error:", err);
      alert("❌ One or more image uploads failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploading) {
      alert("Please wait for all images to finish uploading.");
      return;
    }

    if (!name || !cost || imageUrls.length === 0) {
      alert("Please fill all required fields and upload at least one image.");
      return;
    }

    const productData = {
      name,
      cost: Number(cost),
      description: desc,
      images: imageUrls,
    };

    try {
      const { data } = await axios.post(`${API_BASE}/api/products`, productData);

      if (data.success) {
        alert("✅ Product added successfully");

        // Reset form
        setName("");
        setCost("");
        setDesc("");
        setImageUrls([]);
      } else {
        alert("❌ Server rejected the request");
      }
    } catch (err) {
      console.error("POST /api/products failed:", err);
      alert("❌ Server error — see console for details.");
    }
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

        <select className="border p-2 rounded">
          <option value="bats">Bats</option>
          <option disabled>+ Add category (coming soon)</option>
        </select>

        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleAddImageClick}
          className="bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
        >
          + Add Image
        </button>

        {uploading && (
          <p className="text-blue-600 text-sm">Uploading image(s)...</p>
        )}

        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Uploaded ${index}`}
                className="w-24 h-24 object-cover rounded border"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className={`${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white p-2 rounded`}
        >
          {uploading ? "Uploading..." : "Upload Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
