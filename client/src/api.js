import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);
export const registerUser = (user) => api.post('/users/register', user);
export const loginUser = (user) => api.post('/users/login', user);
export const addToCart = (cartItems) => api.post('/cart/add', { productId: cartItems.productId, quantity: cartItems.quantity }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const getCartItems = () => api.get('/cart', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const removeFromCart = (productId) => api.delete(`/cart/${productId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const placeOrder = (order) => api.post('/orders', order, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const getOrders = () => api.get('/orders', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
export const addProduct = (product) => api.post('/products', product);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);