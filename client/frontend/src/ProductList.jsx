import React, { useState, useEffect } from "react";
import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
const API_BASE = "https://dashboard-admin-backend-tqiy.onrender.com";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/products`);
        if (data.success) setProducts(data.data);
        else throw new Error(data.message || "Unknown error");
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading…</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <div key={p._id} className="border rounded shadow p-4">
          <img
            src={p.image} // ✅ use direct image URL from Cloudinary
            alt={p.name}
            className="w-full h-40 object-cover rounded"
            loading="lazy"
          />
          <h3 className="mt-2 font-semibold">{p.name}</h3>
          <p className="text-sm text-gray-600">₹{p.cost}</p>
          {p.description && (
            <p className="text-xs text-gray-500 mt-1">{p.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
