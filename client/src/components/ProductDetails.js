import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart } from '../api';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    getProductById(id).then((res) => setProduct(res.data));
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ productId: product.id, quantity }).then(() => navigate('/cart'));
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h2>{product.title}</h2>
      <img src={product.image} alt={product.title} />
      <p>Author: {product.author}</p>
      <p>Genre: {product.genre}</p>
      <p>Price: ${product.price}</p>
      <p>Description: {product.description}</p>
      <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductDetails;