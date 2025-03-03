import React, { useState, useEffect } from 'react';
import { getCartItems, removeFromCart, placeOrder } from '../api';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCartItems().then((res) => setCartItems(res.data));
  }, []);

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId).then(() => getCartItems().then((res) => setCartItems(res.data)));
  };

  const handlePlaceOrder = () => {
    const items = cartItems.map((item) => ({ productId: item.productId, quantity: item.quantity }));
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    placeOrder({ items, total }).then(() => navigate('/profile'));
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.map((item) => (
        <div key={item.productId}>
          <img src={item.image} alt={item.title} />
          <p>{item.title}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ${item.price * item.quantity}</p>
          <button onClick={() => handleRemoveFromCart(item.productId)}>Remove</button>
        </div>
      ))}
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
}

export default Cart;