import React, { useState } from 'react';
import { addProduct, updateProduct, deleteProduct } from '../api';

function Admin() {
  const [product, setProduct] = useState({
    title: '',
    author: '',
    genre: '',
    price: 0,
    description: '',
    image: '',
  });
  const [productId, setProductId] = useState('');

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleAddProduct = () => {
    addProduct(product);
  };

  const handleUpdateProduct = () => {
    updateProduct(productId, product);
  };

  const handleDeleteProduct = () => {
    deleteProduct(productId);
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <input type="text" name="title" placeholder="Title" onChange={handleChange} />
      <input type="text" name="author" placeholder="Author" onChange={handleChange} />
      <input type="text" name="genre" placeholder="Genre" onChange={handleChange} />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} />
      <input type="text" name="description" placeholder="Description" onChange={handleChange} />
      <input type="text" name="image" placeholder="Image URL" onChange={handleChange} />
      <button onClick={handleAddProduct}>Add Product</button>

      <input type="text" placeholder="Product ID" onChange={(e) => setProductId(e.target.value)} />
      <button onClick={handleUpdateProduct}>Update Product</button>
      <button onClick={handleDeleteProduct}>Delete Product</button>
    </div>
  );
}

export default Admin;