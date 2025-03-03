import React, { useState, useEffect } from 'react';
import { getProducts } from '../api';
import ProductCard from './ProductCard';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2>Featured Books</h2>
      <div className="product-list">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Home;