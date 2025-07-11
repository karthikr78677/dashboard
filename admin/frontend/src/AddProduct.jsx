import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://dashboard-iw6y.onrender.com';
const AddProduct = () => {
  const [name,  setName]  = useState('');
  const [cost,  setCost]  = useState('');
  const [desc,  setDesc]  = useState('');
  const [img,   setImg]   = useState(null);

  const handleFile   = (e) => setImg(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('name',        name);
    fd.append('cost',        cost);
    fd.append('description', desc);
    if (img) fd.append('image', img);

    try {
      const { data } = await axios.post(`${API_BASE}/api/products`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        alert('✅ Product added');
        setName(''); setCost(''); setDesc(''); setImg(null);
      } else {
        alert('❌ Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error — check console');
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

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="border p-2 rounded"
        />

        {img && (
          <img
            src={URL.createObjectURL(img)}
            alt="Preview"
            className="w-32 h-32 object-cover rounded"
          />
        )}

        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Upload
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
