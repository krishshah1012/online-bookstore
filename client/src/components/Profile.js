import React, { useState, useEffect } from 'react';
import { getOrders } from '../api';

function Profile() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then((res) => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>Order History</h2>
      {orders.map((order) => (
        <div key={order.id}>
          <p>Order ID: {order.id}</p>
          <p>Total: ${order.total}</p>
          <p>Items: {JSON.stringify(order.items)}</p>
        </div>
      ))}
    </div>
  );
}

export default Profile;