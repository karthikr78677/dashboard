import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ───────────────────────────────────────────────────────────────
// If VITE_API_URL is defined at build time (e.g. on Render),
// axios will hit that.  In local dev you can leave it unset and
// let Vite’s proxy handle /api + /uploads.
// ───────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,        // "" in dev => relative paths
  withCredentials: true,    // keep if you rely on cookies/JWT
});

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/products');
        if (data.success) setProducts(data.data);
        else throw new Error(data.message || 'Unexpected response');
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading…</p>;
  if (error)   return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map(p => (
        <div key={p._id} className="border rounded shadow p-4">
          <img
            src={new URL(p.image, API_BASE || window.location.origin).href}
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
