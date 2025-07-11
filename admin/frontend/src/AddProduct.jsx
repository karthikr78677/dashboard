import React, { useState, useEffect } from 'react';
import axios from 'axios';

// • If VITE_API_URL is *not* set in prod, same‑origin fetch avoids CORS headaches.
const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || window.location.origin;

const AddProduct = () => {
  const [name,  setName]  = useState('');
  const [cost,  setCost]  = useState('');
  const [desc,  setDesc]  = useState('');
  const [img,   setImg]   = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [loading, setLoading] = useState(false);

  // Create & revoke the local preview URL so we don’t leak memory
  useEffect(() => {
    if (!img) { setPreviewURL(null); return; }
    const url = URL.createObjectURL(img);
    setPreviewURL(url);
    return () => URL.revokeObjectURL(url);
  }, [img]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image 📷');
      return;
    }
    setImg(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const fd = new FormData();
    fd.append('name', name.trim());
    fd.append('cost', Number(cost));          // send numeric type
    fd.append('description', desc.trim());
    if (img) fd.append('image', img);

    try {
      const { data } = await axios.post(`${API_BASE}/api/products`, fd, {
        withCredentials: true               // keeps you safe if you switch to cookie auth
      });

      console.log('→ server response', data);

      if (data?.success) {
        alert('✅ Product added!');
        setName(''); setCost(''); setDesc(''); setImg(null);
      } else {
        alert(data?.message || 'Upload failed');
      }
    } catch (err) {
      if (err.response) {
        // We reached the server but it replied with an error JSON/HTML
        console.error('[SERVER]', err.response.status, err.response.data);
        alert(err.response.data?.message || `Server error (${err.response.status})`);
      } else {
        console.error('[NETWORK]', err);
        alert('Network / CORS error – see console');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="Cost (₹)"
          className="border p-2 rounded"
          required
        />

        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          rows="3"
          className="border p-2 rounded resize-none"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="border p-2 rounded"
        />

        {previewURL && (
          <img
            src={previewURL}
            alt="Preview"
            className="w-32 h-32 object-cover rounded self-center"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Uploading…' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
